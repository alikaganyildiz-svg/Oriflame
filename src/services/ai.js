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

    // ... (Arrays and Pools) ...

    const selectedTheme = topicsPool[Math.floor(Math.random() * topicsPool.length)];

    // ... (Prompt Text) ...

    try {
        // 2. Call Google Gemini API
        // FIX: Changed model from 2.5-flash (invalid) to 1.5-flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
        // ... (Cleaning Logic) ...

    } catch (error) {
        console.error("AI Generation Exception:", error);
        return { error: `Internal Server Error: ${error.message}` };
    }
}
