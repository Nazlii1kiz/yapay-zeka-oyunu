const AI_TOOLS = {
    chatgpt: { id: 'chatgpt', name: 'ChatGPT', color: '#10a37f', desc: 'Genel mantık, yaratıcı yazarlık ve günlük işler.', level: 1, hp: 3 },
    midjourney: { id: 'midjourney', name: 'Midjourney', color: '#ffffff', desc: 'Fotogerçekçi yüksek prodüksiyonlu görsel üretimi.', level: 1, hp: 3 },
    copilot: { id: 'copilot', name: 'GitHub Copilot', color: '#8b949e', desc: 'IDE içinde anlık kod / satır otomatik tamamlama.', level: 2, hp: 3 },
    perplexity: { id: 'perplexity', name: 'Perplexity', color: '#25b5ce', desc: 'Akademik düzeyde, link ve kaynakça destekli araştırma.', level: 2, hp: 3 },
    chatpdf: { id: 'chatpdf', name: 'ChatPDF', color: '#e53935', desc: 'Yalnızca uzun PDF belgelerini okuyup analiz etme.', level: 3, hp: 3 },
    gemini: { id: 'gemini', name: 'Gemini', color: '#4285f4', desc: 'Google entegrasyonu ve multimodal (ses/video) analiz.', level: 3, hp: 3 },
    suno: { id: 'suno', name: 'Suno', color: '#f3a830', desc: 'Yüksek kaliteli sözlü veya enstrümantal şarkı üretimi.', level: 4, hp: 3 },
    elevenlabs: { id: 'elevenlabs', name: 'ElevenLabs', color: '#9dff00', desc: 'İnsansı doğallıkta seslendirme ve klonlama.', level: 4, hp: 3 },
    gamma: { id: 'gamma', name: 'Gamma', color: '#a855f7', desc: 'Saniyeler içinde profesyonel sunum ve slayt tasarımı.', level: 5, hp: 3 },
    runway: { id: 'runway', name: 'Runway', color: '#fffb00', desc: 'Metinden/Görselden video (B-roll/sinematik) üretme.', level: 5, hp: 3 }
};

const TASKS = [
    // Level 1: ChatGPT vs Midjourney
    { text: "Yarınki yönetim kurulu için resmi bir davet e-postası taslağı yaz.", correct: "chatgpt", level: 1 },
    { text: "Kar fırtınasında neon ışıklı bir Tokyo Sokağı fotogerçekçi görseli üret.", correct: "midjourney", level: 1 },
    { text: "Yeni doğan kedim için 10 tane yaratıcı isim önerisi listele.", correct: "chatgpt", level: 1 },
    { text: "Bir parfüm şişesi için reklam kampanyasında kullanılacak render konsepti çiz.", correct: "midjourney", level: 1 },

    // Level 2: + Copilot vs Perplexity
    { text: "Python'da liste ters çevirme fonksiyonunu VS Code içinde otomatik tamamla.", correct: "copilot", level: 2 },
    { text: "Son 5 yılda yayınlanmış akademik makalelerden referanslı bir küresel ısınma raporu çıkar.", correct: "perplexity", level: 2 },
    { text: "Javascript projemde 'for' döngüsü yazarken bir sonraki satırı tahmin et.", correct: "copilot", level: 2 },
    { text: "Kuantum bilgisayarların güncel durumu hakkında kaynakçalı bir özet oluştur.", correct: "perplexity", level: 2 },

    // Level 3: + ChatPDF vs Gemini
    { text: "Bu 80 sayfalık iş hukuku sözleşmesi PDF'ini yükleyeceğim, özetini çıkar.", correct: "chatpdf", level: 3 },
    { text: "Google Drive'ımdaki tablolara bakarak bu verileri analiz et ve özetle.", correct: "gemini", level: 3 },
    { text: "Geçen ay yayınlanan 300 sayfalık PDF kullanım kılavuzunda 'Hata 404' çözümünü bul.", correct: "chatpdf", level: 3 },
    { text: "Bana hem bir resim hem bir ses dosyası yüklettirip, bunları kombine edip ne olduğunu söyle.", correct: "gemini", level: 3 },

    // Level 4: + Suno vs ElevenLabs
    { text: "Bağımsız piksel oyunumun ana menüsü için 8-bit chiptune bir şarkı bestele.", correct: "suno", level: 4 },
    { text: "YouTube belgeselim için yazdığım metni, hüzünlü ve yaşlı bir İngiliz dedesi gibi seslendir.", correct: "elevenlabs", level: 4 },
    { text: "Reklam filmimiz için tamamen sözlü, elektronik tarzda 2 dakikalık bir pop şarkısı yap.", correct: "suno", level: 4 },
    { text: "Sesimi klonlayarak yazdığım metni benim kendi sesimmiş gibi dublaja dönüştür.", correct: "elevenlabs", level: 4 },

    // Level 5: + Gamma vs Runway
    { text: "CEO'ya sunacağım finansal özet raporunu alıp estetik bir Yatırımcı Slaytına dönüştür.", correct: "gamma", level: 5 },
    { text: "Bu statik araba fotoğrafını al, tekerleklerini döndür ve 5 saniyelik bir video yap.", correct: "runway", level: 5 },
    { text: 'Saniyeler içinde "Yapay Zekanın Geleceği" adlı 10 sayfalık bir web sunumu hazırla.', correct: "gamma", level: 5 },
    { text: '"Cyberpunk şehir üstünde uçan drone" metnini yazacağım, bana sinematik video üret.', correct: "runway", level: 5 }
];
