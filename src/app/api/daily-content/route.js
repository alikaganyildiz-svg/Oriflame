
import { NextResponse } from 'next/server';

export async function GET(request) {
    // 1. API Key Güvenliği: Environment Variable'dan al
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    // Generate random topic from pool
    const topicsPool = [
        "Mevsimsel Cilt Bakımı ve Koruma Yöntemleri",
        "Girişimcilik, Ek Gelir ve Finansal Özgürlük",
        "Makyaj Trendleri ve Uygulama Teknikleri",
        "İsveçli Güzellik Sırları ve Doğal İçerikler",
        "Sağlıklı Yaşam, Beslenme ve Wellness",
        "Kişisel Gelişim, Özgüven ve Motivasyon",
        "Saç Bakımı ve Güçlü Saçlar İçin İpuçları",
        "Parfüm Dünyası ve Koku Seçimi Rehberi",
        "Network Marketing ve Ekip Yönetimi Başarısı",
        "Erkek Bakımı ve Günlük Rutinler",
        "Sürdürülebilirlik ve Doğa Dostu Yaşam",
        "Vücut Bakımı ve Spa Keyfi (Evde)",
        "Anne ve Bebek Bakımı Hassas Dokunuşlar",
        "Renkler, Moda ve Kişisel Stil Önerileri"
    ];
    const selectedTheme = topicsPool[Math.floor(Math.random() * topicsPool.length)];

    // Create Prompt
    const promptText = `
    Oriflame üyeleri için 'Life & Beauty' dergisi tadında Türkçe bir blog yazısı hazırla.
    GENEL TEMA: '${selectedTheme}'
    
    GÖREV:
    Bu genel temadan yola çıkarak, bugünün tarihine ve mevsime uygun, tamamen ÖZGÜN ve İLGİ ÇEKİCİ bir başlık bul ve o konuda yaz.
    
    İÇERİK VE TASARIM KURALLARI:
    1.  **Başlık:** Merak uyandırıcı ve modern olsun.
    2.  **Format (Çok Önemli):** 'content' alanı SADECE ve SADECE HTML formatında olmalıdır.
    3.  **Paragraflar:** Her paragrafı mutlaka <p>...</p> etiketleri içine al. Asla \\n karakteri kullanma.
    4.  **Başlıklar (H3):** Bölüm başlıklarını <h3>...</h3> etiketleri içine al.
    5.  **Vurgu:** Önemli noktaları <strong>...</strong> ile kalınlaştır.
    6.  **Liste:** Maddeleri <ul><li>...</li></ul> ile listele.
    7.  **JSON Yapısı:** Sadece saf JSON döndür: {'title': '...', 'content': '<p>Paragraf 1</p><h3>Başlık</h3><p>Paragraf 2</p>...', 'category': '...', 'image_keyword': '...'}.
    8.  **Uzunluk:** En az 450 kelime.
    9.  **Image Keyword:** SADECE şu kelimelerden birini seç: 'skincare', 'makeup', 'business', 'nature', 'perfume', 'wellness', 'hair'. Konuya en uygun olanı seç.
  `;

    try {
        // 2. Call Google Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();
        let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) return NextResponse.json({ error: 'No content generated' }, { status: 500 });

        // Clean JSON
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').replace(/html/g, '');
        const jsonMatch = rawText.match(/\{.*\}/s);
        if (jsonMatch) rawText = jsonMatch[0];

        const aiPost = JSON.parse(rawText);

        // 3. Generate Image using Pollinations AI
        const imagePrompt = encodeURIComponent(`${aiPost.title}, 4k, photorealistic, cinematic lighting, high quality, beauty magazine style`);
        const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=1280&height=720&nologo=true&enhance=true&model=flux&seed=${Math.floor(Math.random() * 99999)}`;

        aiPost.generated_image_url = imageUrl;

        return NextResponse.json(aiPost);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
