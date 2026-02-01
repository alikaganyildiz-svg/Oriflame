/**
 * Google Gemini ve Pollinations AI kullanarak blog içeriği üretir.
 */
export async function generateDailyBlogContent() {
    // 1. API Key Güvenliği
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("API Key missing");
        return { error: "API Key (GEMINI_API_KEY) environment variable is missing!" };
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
    
    AŞIRI ÖNEMLİ FORMAT KURALLARI (Harfiyen uyulmalı):
    1.  **JSON Response:** Yanıtın SADECE geçerli bir JSON objesi olmalı. Markdown kod bloğu kullanma.
    2.  **HTML Content:** 'content' alanı, tarayıcıda render edilecek **SAF HTML** kodu içermelidir.
    3.  **Gizlilik:** Yazının yapay zeka tarafından yazıldığını ASLA belli etme. "Editörlerimiz", "Yapay Zeka" gibi ifadeler kullanma. Sanki gerçek bir moda editörü yazmış gibi davran.
        -   Metni MUTLAKA paragraf <p> etiketleri içine al. (En az 4-5 paragraf)
        -   Bölümleri ayırmak için <h2> kullan.
        -   Alt başlıklar için <h3> kullan.
        -   İlham verici bir sözü <blockquote> içine al.
        -   Önerilerini <ul> ve <li> etiketleri ile listele.
        -   Asla düz metin kullanma, her şey HTML etiketi içinde olmalı.
    
    Beklenen JSON Yapısı:
    {
        "title": "Çarpıcı Dergi Başlığı Buraya",
        "content": "<p>Giriş paragrafı...</p><h2>Bölüm Başlığı</h2><p>...",
        "category": "Güzellik / Yaşam / Kariyer vb.",
        "image_prompt": "Yazının içeriğini, atmosferini ve estetiğini en iyi yansıtan, 'Midjourney' stili, çok detaylı, fotorealistik, sinematik ışıklandırmalı İNGİLİZCE görsel oluşturma komutu. (Örn: 'Close up shot of a woman with glowing skin applying serum, natural sunlight, bokeh background, high fashion editorial style')",
        "image_keyword": "SADECE şunlardan biri: 'skincare', 'makeup', 'business', 'nature', 'perfume', 'wellness', 'hair'"
    }

    Yazı Uzunluğu: Okuyucuyu sıkmayacak ama doyurucu olacak şekilde (ortalama 500-600 kelime).
  `;

    try {
        // 2. Call Google Gemini API
        // FIX: Using specific model version gemini-1.5-flash-001 to avoid 404
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", response.status, errorText);
            return { error: `Gemini API responded with ${response.status}: ${errorText}` };
        }

        const data = await response.json();
        let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) return { error: "Gemini returned empty content." };

        // Clean JSON formatting (Markdown fences)
        rawText = rawText
            .replace(/^```json\s*/, '') // Remove start fence
            .replace(/^```\s*/, '')      // Remove generic start fence
            .replace(/```$/, '')         // Remove end fence
            .trim(); // Remove whitespace

        const jsonMatch = rawText.match(/\{[\s\S]*\}/); // Try to find JSON object if mixed with text
        if (jsonMatch) rawText = jsonMatch[0];

        const aiPost = JSON.parse(rawText);

        // FALLBACK: If AI returned plain text (no HTML tags), force wrap in paragraphs
        if (aiPost.content && !aiPost.content.includes('<p>') && !aiPost.content.includes('<h2>')) {
            aiPost.content = aiPost.content
                .split('\n')
                .filter(line => line.trim() !== '')
                .map(line => `<p>${line.trim()}</p>`)
                .join('');
        }

        // 3. Generate Image using Pollinations AI
        // Use the specfic image_prompt from Gemini if available, otherwise fallback to title
        const visualDescription = aiPost.image_prompt || `${aiPost.title}, beauty magazine style, high fashion`;
        const imagePrompt = encodeURIComponent(`${visualDescription}, 4k, photorealistic, cinematic lighting, hd, 8k`);
        const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=1280&height=720&nologo=true&enhance=true&model=flux&seed=${Math.floor(Math.random() * 99999)}`;

        aiPost.generated_image_url = imageUrl;

        return aiPost;

    } catch (error) {
        console.error("AI Generation Exception:", error);
        return { error: `Internal Server Error: ${error.message}` };
    }
}
