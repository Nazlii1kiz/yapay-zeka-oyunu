// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverModal = document.getElementById('game-over-modal');
const learnModal = document.getElementById('learn-modal');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const livesEl = document.getElementById('lives');
const multiplierEl = document.getElementById('multiplier');
const gameArea = document.getElementById('game-area');
const boxesContainer = document.getElementById('boxes-container');

// State Variables
let score = 0;
let level = 1;
let lives = 3;
let speed = 1.5;
let streak = 0;
let multiplier = 1;
let isPaused = false;
let animationId;
let activeBlock = null;
let currentTask = null;

const BLOCKS_PER_LEVEL = 4; // Num correct answers to level up
let correctMatchesInLevel = 0;

// Init Event Listeners
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);
document.getElementById('resume-btn').addEventListener('click', resumeGame);

function startGame() {
    score = 0;
    level = 1;
    lives = 3;
    speed = 1.2;
    streak = 0;
    multiplier = 1;
    correctMatchesInLevel = 0;
    isPaused = false;
    
    updateHUD();
    renderBoxes();
    
    startScreen.classList.remove('active');
    gameOverModal.classList.remove('active');
    learnModal.classList.remove('active');
    gameScreen.classList.add('active');
    
    if (activeBlock) {
        activeBlock.remove();
        activeBlock = null;
    }
    
    spawnBlock();
    if(animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(gameLoop);
}

// Render AI Boxes dynamically based on current game level
function renderBoxes() {
    boxesContainer.innerHTML = '';
    
    // Only fetch tools that are unlocked up to the current level
    const toolsToShow = Object.values(AI_TOOLS).filter(tool => tool.level <= level);
    
    toolsToShow.forEach(tool => {
        const box = document.createElement('div');
        box.className = 'ai-box';
        box.dataset.id = tool.id;
        box.style.borderColor = tool.color;
        box.style.boxShadow = `0 0 10px ${tool.color}40, inset 0 0 10px ${tool.color}20`; // Hex alpha
        
        box.innerHTML = `
            <span class="box-name" style="color: ${tool.color}">${tool.name}</span>
            <span class="box-hp" id="hp-${tool.id}">HP: ${tool.hp}</span>
        `;
        
        box.addEventListener('click', () => handleBoxClick(tool.id, box));
        boxesContainer.appendChild(box);
    });
}

// Spawns a new task block from the top
function spawnBlock() {
    if (isPaused) return;
    
    // Filter tasks up to current level
    const availableTasks = TASKS.filter(t => t.level <= level);
    
    // Pick random
    currentTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
    
    activeBlock = document.createElement('div');
    activeBlock.className = 'task-block';
    activeBlock.innerText = currentTask.text;
    
    activeBlock.style.top = '-150px'; // Start slightly above
    
    // Calculate random horizontal position avoiding boundaries
    const blockWidth = 250;
    const padding = 20;
    const maxLeft = gameArea.clientWidth - blockWidth - padding;
    activeBlock.style.left = Math.max(padding, Math.random() * maxLeft) + 'px';
    
    // Glow effect if flow state
    if (multiplier > 1) {
        activeBlock.style.boxShadow = '0 10px 30px rgba(0, 255, 204, 0.5)';
        activeBlock.style.borderColor = '#00ffcc';
    }
    
    gameArea.appendChild(activeBlock);
}

// Main physics loop for falling logic
function gameLoop() {
    if (!isPaused && activeBlock) {
        let currentTop = parseFloat(activeBlock.style.top);
        currentTop += speed;
        activeBlock.style.top = currentTop + 'px';
        
        // Boundaries hit
        const bottomLimit = gameArea.clientHeight;
        if (currentTop > bottomLimit) {
            handleMiss();
        }
    }
    
    if (!isPaused) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Handling player clicking a box to direct the active block
function handleBoxClick(boxId, boxElement) {
    if (isPaused || !activeBlock) return;
    
    if (currentTask.correct === boxId) {
        handleCorrect(boxElement);
    } else {
        handleWrong(boxId, boxElement);
    }
}

function handleCorrect(boxElement) {
    // Score & Flow State logic
    score += (100 * multiplier);
    streak++;
    correctMatchesInLevel++;
    
    // "Yutma" effect on box
    boxElement.style.transform = 'scale(1.1)';
    setTimeout(() => { boxElement.style.transform = ''; }, 150);
    
    if (streak >= 5) {
        multiplier = 3;
        multiplierEl.innerText = 'x3';
        multiplierEl.classList.remove('hidden');
    } else if (streak >= 3) {
        multiplier = 2;
        multiplierEl.innerText = 'x2';
        multiplierEl.classList.remove('hidden');
    }
    
    // Animation on block
    activeBlock.classList.add('correct-anim');
    isPaused = true; // Briefly pause for presentation
    
    setTimeout(() => {
        if(activeBlock) activeBlock.remove();
        activeBlock = null;
        
        if (correctMatchesInLevel >= BLOCKS_PER_LEVEL) {
            levelUp();
        }
        
        speed += 0.05; // Speed ramps up slightly per success
        updateHUD();
        isPaused = false;
        spawnBlock();
        gameLoop();
    }, 300);
}

function handleMiss() {
    // When block drops out of bounds
    streak = 0;
    multiplier = 1;
    multiplierEl.classList.add('hidden');
    speed = Math.max(1.2, speed - 0.2); // Reset speed slightly
    
    loseLife();
    
    if (activeBlock) {
        activeBlock.remove();
        activeBlock = null;
    }
    
    if (lives > 0) {
        spawnBlock();
    }
}

function handleWrong(selectedToolId, boxElement) {
    // Pause Game & Reset streaks
    isPaused = true;
    streak = 0;
    multiplier = 1;
    multiplierEl.classList.add('hidden');
    
    activeBlock.classList.add('wrong-anim');
    
    // Kutu Canı Azalır
    let toolObj = AI_TOOLS[selectedToolId];
    toolObj.hp -= 1;
    document.getElementById(`hp-${selectedToolId}`).innerText = `HP: ${toolObj.hp}`;
    
    // "Hasar" efekti
    boxElement.style.borderColor = '#ff003c';
    boxElement.style.boxShadow = '0 0 20px rgba(255, 0, 60, 0.8)';
    setTimeout(() => {
        boxElement.style.borderColor = toolObj.color;
        boxElement.style.boxShadow = `0 0 10px ${toolObj.color}40, inset 0 0 10px ${toolObj.color}20`;
    }, 400);

    const expectedTool = AI_TOOLS[currentTask.correct];
    const selectedTool = AI_TOOLS[selectedToolId];
    
    // Setup The Learn UI
    document.getElementById('expected-tool').innerText = expectedTool.name;
    document.getElementById('expected-desc').innerText = expectedTool.desc;
    document.getElementById('expected-tool').style.color = expectedTool.color;
    
    document.getElementById('selected-tool').innerText = selectedTool.name;
    document.getElementById('selected-desc').innerText = selectedTool.desc;
    document.getElementById('selected-tool').style.color = selectedTool.color;
    
    document.getElementById('learn-message').innerHTML = `
        Aman dikkat! <strong>"${currentTask.text}"</strong> görevi için <br>
        <span style="color:${expectedTool.color}">${expectedTool.name}</span> kullanmalıydın!
    `;
    
    setTimeout(() => {
        if(activeBlock) activeBlock.remove();
        activeBlock = null;
        learnModal.classList.add('active');
    }, 500);
}

function resumeGame() {
    learnModal.classList.remove('active');
    
    loseLife();
    
    if (lives > 0) {
        isPaused = false;
        speed = 1.2 + (level * 0.1); // Slightly reset gravity curve
        spawnBlock();
        gameLoop();
    }
}

function loseLife() {
    lives--;
    updateHUD();
    if (lives <= 0) {
        endGame();
    }
}

function levelUp() {
    level++;
    correctMatchesInLevel = 0;
    // Add new UI boxes if level unlocked them
    renderBoxes();
    updateHUD();
    
    // Simple visual level up text prompt could go here if needed.
}

function updateHUD() {
    scoreEl.innerText = score;
    levelEl.innerText = level;
    
    let htmlStr = '';
    for(let i=0; i<lives; i++) htmlStr += '❤️';
    livesEl.innerHTML = htmlStr;
}

function endGame() {
    isPaused = true;
    cancelAnimationFrame(animationId);
    
    document.getElementById('final-score').innerText = score;
    document.getElementById('final-level').innerText = level;
    gameScreen.classList.remove('active');
    gameOverModal.classList.add('active');
    
    // Reset AI tool HPs
    Object.keys(AI_TOOLS).forEach(k => AI_TOOLS[k].hp = 3);
}
