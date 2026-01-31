
/**
 * Google Gemini ve Pollinations AI kullanarak blog içeriği üretir.
 */
export async function generateDailyBlogContent() {
    // 1. API Key Güvenliği
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("API Key missing");
        return null;
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
        "Oriflame ile Seyahat ve Yaşam Tarzı",
        "Erkek Bakımı ve Günlük Rutinler",
        "Sürdürülebilirlik ve Doğa Dostu Yaşam",
        "Vücut Bakımı ve Spa Keyfi (Evde)",
        "Anne ve Bebek Bakımı Hassas Dokunuşlar",
        "Renkler, Moda ve Kişisel Stil Önerileri"
    ];
    const selectedTheme = topicsPool[Math.floor(Math.random() * topicsPool.length)];

    // Create Prompt
    const promptText = `
    Oriflame üyeleri için yüksek kaliteli, 'Vogue' veya 'Elle' dergisi tadında Türkçe bir blog yazısı hazırla.
    GENEL TEMA: '${selectedTheme}'
    
    GÖREV:
    Bu genel temadan yola çıkarak, bugünün tarihine ve mevsime uygun, okuyucuyu içine çeken, duygusal ve ilham verici bir makale yaz.
    
    ÇOK ÖNEMLİ KURALLAR (Hepsini uygula):
    1.  **JSON Formatı:** Yanıtın SADECE ve SADECE geçerli bir JSON objesi olmalı.
    2.  **Başlık:** Çok çarpıcı, merak uyandırıcı, 'clickworthy' bir dergi başlığı olsun.
    3.  **İçerik (HTML):** 'content' alanı ZENGİN HTML formatında olmalıdır. Düz yazı ASLA kabul edilmez.
        -   Ana bölümler için <h2> kullan. (En az 2 tane)
        -   Alt bölümler için <h3> kullan.
        -   İlham verici sözler veya önemli vurgular için <blockquote> kullan. (Mutlaka 1 tane olsun)
        -   Listeler için <ul> ve <li> kullan. (Mutlaka 1 tane olsun)
        -   Her paragraf <p> etiketi içinde olsun.
        -   Önemli kelimeleri <strong> ile vurgula.
        -   Metin içine uygun yerlere EMOJİLER (✨, 🌿, 💄 vb.) ekleyerek görsel zenginlik kat.
    
    Beklenen JSON Yapısı:
    {
      "title": "Çarpıcı Dergi Başlığı Buraya",
      "content": "<p>Giriş paragrafı...</p><h2>Bölüm Başlığı</h2><p>...</p><blockquote>Alıntı sözü</blockquote>...",
      "category": "Güzellik / Yaşam / Kariyer vb.",
      "image_keyword": "SADECE şunlardan biri: 'skincare', 'makeup', 'business', 'nature', 'perfume', 'wellness', 'hair'"
    }

    Yazı Uzunluğu: Okuyucuyu sıkmayacak ama doyurucu olacak şekilde (ortalama 500-600 kelime).
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

        if (!rawText) return null;

        // Clean JSON formatting (Markdown fences)
        rawText = rawText
            .replace(/^```json\s*/, '') // Remove start fence
            .replace(/^```\s*/, '')      // Remove generic start fence
            .replace(/```$/, '')         // Remove end fence
            .trim(); // Remove whitespace

        const jsonMatch = rawText.match(/\{[\s\S]*\}/); // Try to find JSON object if mixed with text
        if (jsonMatch) rawText = jsonMatch[0];

        const aiPost = JSON.parse(rawText);

        // 3. Generate Image using Pollinations AI
        const imagePrompt = encodeURIComponent(`${aiPost.title}, 4k, photorealistic, cinematic lighting, high quality, beauty magazine style`);
        const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=1280&height=720&nologo=true&enhance=true&model=flux&seed=${Math.floor(Math.random() * 99999)}`;

        aiPost.generated_image_url = imageUrl;

        return aiPost;

    } catch (error) {
        console.error("AI Generation Error:", error);
        return null;
    }
}
