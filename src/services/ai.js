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

    // --- TEST MODU: Metin Üretimi Atlanıyor (Token Tasarrufu) ---
    console.log("Skipping Text Generation for Image Test...");

    let aiPost = {
        title: "Imagen 4.0 Test Yayını",
        content: "<p>Bu içerik, <strong>imagen-4.0-fast-generate-001</strong> modelini test etmek için oluşturulmuştur. Metin üretimi devre dışıdır.</p><h2>Görsel Testi</h2><p>Aşağıdaki görsel Google'ın yeni modeli ile oluşturulmayı denenmiştir.</p>",
        category: "Teknoloji Testi",
        image_prompt: "High fashion beauty photography, close up of a woman with perfect skin using oriflame products, cinematic lighting, 8k, photorealistic"
    };

    try {
        // 2. Call Google Imagen 4.0 API (User Requested Endpoint)
        console.log("Attempting to call Imagen 4.0...");

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                instances: [
                    { prompt: aiPost.image_prompt }
                ],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "16:9" // Imagen support might vary
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Imagen API Error:", response.status, errorText);
            // Fallback to Pollinations if Imagen fails
            aiPost.content += `<p style="color:red"><strong>HATA:</strong> Imagen API başarısız oldu (${response.status}). Hata detayı: ${errorText}</p>`;
            return aiPost;
        }

        const data = await response.json();

        // Imagen usually returns predictions[0].bytesBase64Encoded or similar
        // Let's check structure. Usually: { predictions: [ { bytesBase64Encoded: "..." } ] }
        if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
            const base64Image = data.predictions[0].bytesBase64Encoded;
            aiPost.generated_image_url = `data:image/png;base64,${base64Image}`;
            aiPost.content += `<p style="color:green"><strong>BAŞARILI:</strong> Imagen 4.0 görseli başarıyla üretildi.</p>`;
        } else if (data.predictions && data.predictions[0] && data.predictions[0].mimeType && data.predictions[0].bytesBase64Encoded) {
            // Some versions return mimeType
            const mimeType = data.predictions[0].mimeType;
            const base64Image = data.predictions[0].bytesBase64Encoded;
            aiPost.generated_image_url = `data:${mimeType};base64,${base64Image}`;
            aiPost.content += `<p style="color:green"><strong>BAŞARILI:</strong> Imagen 4.0 görseli başarıyla üretildi.</p>`;
        } else {
            console.error("Unexpected Imagen Response:", JSON.stringify(data));
            aiPost.content += `<p style="color:orange"><strong>UYARI:</strong> API yanıt verdi ama görsel formatı ayrıştırılamadı. JSON konsola basıldı.</p>`;
        }

        return aiPost;

    } catch (error) {
        console.error("Imagen Generation Exception:", error);
        return { error: `Imagen Integration Error: ${error.message}` };
    }
}
