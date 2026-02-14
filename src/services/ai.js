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
        // FIX: Using specific model version gemini-2.5-flash as requested by user
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

        // Clean JSON formatting (Markdown fences and potential noise)
        rawText = rawText.trim();

        // 1. Try to find the first '{' and the last '}' to isolate the JSON object
        const firstOpenBrace = rawText.indexOf('{');
        const lastCloseBrace = rawText.lastIndexOf('}');

        if (firstOpenBrace !== -1 && lastCloseBrace !== -1 && lastCloseBrace > firstOpenBrace) {
            rawText = rawText.substring(firstOpenBrace, lastCloseBrace + 1);
        } else {
            return { error: "Could not find valid JSON object in Gemini response." };
        }

        let aiPost;
        try {
            aiPost = JSON.parse(rawText);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw Text causing error:", rawText);
            // Attempt to sanitize common issues like trailing commas or newlines strings in JSON
            // This is a desperate attempt fallback
            try {
                // Remove trailing commas before closing braces/brackets
                const sanitizedText = rawText.replace(/,\s*([\]}])/g, '$1');
                aiPost = JSON.parse(sanitizedText);
            } catch (retryError) {
                return { error: `JSON Parse Failed: ${parseError.message}` };
            }
        }

        // FALLBACK: If AI returned plain text (no HTML tags), force wrap in paragraphs
        if (aiPost.content && !aiPost.content.includes('<p>') && !aiPost.content.includes('<h2>')) {
            aiPost.content = aiPost.content
                .split('\n')
                .filter(line => line.trim() !== '')
                .map(line => `<p>${line.trim()}</p>`)
                .join('');
        }

        // 3. Image Generation Strategy (Production Ready)
        // We use Unsplash for reliable, high-quality, and persistent images.
        // This avoids API key requirements, rate limits, and ephemeral file system issues.

        let imageUrl = '';
        const imageKeyword = aiPost.image_keyword || 'beauty';

        // Dynamic Unsplash Selection based on keyword
        const unsplashMap = {
            'skincare': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1280&q=80',
            'makeup': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1280&q=80',
            'business': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1280&q=80',
            'nature': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1280&q=80',
            'perfume': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1280&q=80',
            'wellness': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1280&q=80',
            'hair': 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1280&q=80'
        };

        if (unsplashMap[imageKeyword]) {
            imageUrl = unsplashMap[imageKeyword];
        } else {
            // Fallback for generic or unknown keywords
            imageUrl = `https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=1280&auto=format&fit=crop`;
        }

        console.log("Assigned Production Image URL:", imageUrl);
        aiPost.generated_image_url = imageUrl;

        return aiPost;

    } catch (error) {
        console.error("AI Generation Exception:", error);
        return { error: `Internal Server Error: ${error.message}` };
    }
}
