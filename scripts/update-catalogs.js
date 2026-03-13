const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Vercel / GitHub Actions environment compatibility for Puppeteer
const getExecutablePath = async () => {
    try {
        const chromium = require('@sparticuz/chromium');
        return await chromium.executablePath();
    } catch (error) {
        // If not in a serverless environment with sparticuz, try to find local Chrome
        // This makes it easy to test locally as well
        const { execSync } = require('child_process');
        try {
            if (process.platform === 'win32') {
                const paths = [
                    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
                ];
                for (const p of paths) {
                    if (fs.existsSync(p)) return p;
                }
            } else if (process.platform === 'linux') {
                return execSync('which google-chrome').toString().trim() || execSync('which chromium-browser').toString().trim();
            } else if (process.platform === 'darwin') {
                return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
            }
        } catch (e) {
            console.warn('Could not automatically determine Chrome path for local testing.');
        }
        return null; // Let puppeteer try its default
    }
};

async function updateCatalogs() {
    console.log('Oriflame Katalog Güncelleyici Botu Başlatılıyor...');

    const executablePath = await getExecutablePath();
    console.log(`Tarayıcı yolu: ${executablePath || 'Varsayılan Puppeteer Chromium'}`);

    const browser = await puppeteer.launch({
        args: [
            ...require('@sparticuz/chromium').args,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ],
        defaultViewport: require('@sparticuz/chromium').defaultViewport,
        executablePath: executablePath || await require('@sparticuz/chromium').executablePath(),
        headless: true, // Her zaman arkaplanda görünmez çalışsın
    });

    const page = await browser.newPage();

    // Ağ isteklerini dinleyerek dinamik iPaper ve Image (Kapak) linklerini toplayacağız
    const extractedData = {
        currentCatalog: { baseUrl: '', signature: '', coverUrl: '' },
        nextCatalog: { baseUrl: '', signature: '', coverUrl: '' }
    };

    let requestCount = 0;

    // Ağa düşen istekleri (XHR/Fetch/Image) filtreliyoruz
    page.on('request', request => {
        const url = request.url();

        // 1. iPaper Zoom Bağlantılarını Yakala (Katalog Sayfaları İçin)
        if (url.includes('b-cdn.ipaper.io/iPaper/Papers/') && url.includes('Zoom.jpg')) {
            const urlObj = new URL(url);
            const baseUrl = urlObj.origin + urlObj.pathname.split('/Pages/')[0];
            const signature = urlObj.search; // ?Policy=...&Signature=...&Key-Pair-Id=...

            // Eğer ilk bulduğumuzsa "Mevcut Ay", ikincisiyse "Gelecek Ay" olarak atıyoruz
            if (!extractedData.currentCatalog.baseUrl) {
                extractedData.currentCatalog.baseUrl = baseUrl;
                extractedData.currentCatalog.signature = signature;
                console.log('✅ Mevcut Ay Kataloğu iPaper linki bulundu.');
            } else if (extractedData.currentCatalog.baseUrl !== baseUrl && !extractedData.nextCatalog.baseUrl) {
                extractedData.nextCatalog.baseUrl = baseUrl;
                extractedData.nextCatalog.signature = signature;
                console.log('✅ Gelecek Ay Kataloğu iPaper linki bulundu.');
            }
        }

        // 2. Katalog Kapak Görsellerinin Bağlantılarını Yakala (Image.ashx)
        if (url.includes('tr-catalogue.oriflame.com/') && url.includes('Image.ashx') && url.includes('PageNumber=1')) {
            if (!extractedData.currentCatalog.coverUrl) {
                extractedData.currentCatalog.coverUrl = url;
                console.log('✅ Mevcut Ay Kapak görseli bulundu.');
            } else if (extractedData.currentCatalog.coverUrl !== url && url.includes('2026') && !extractedData.nextCatalog.coverUrl) {
                // Not: 2026 vs dinamik değil ama genel bir farklı URL ayrımı için
                extractedData.nextCatalog.coverUrl = url;
                console.log('✅ Gelecek Ay Kapak görseli bulundu.');
            }
        }

        request.continue();
    });

    try {
        await page.setRequestInterception(true);
        console.log('Oriflame Mağaza sayfasına gidiliyor...');
        await page.goto('https://tr.oriflame.com/catalogues?store=TR-kagan2532287006', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        console.log('Sayfa yüklendi, çerez (cookie) onayı aranıyor...');
        // Çerez butonunu tıkla (Örn: "Tüm Çerezleri Kabul Et") - Opsiyonel ama iyi olur
        try {
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const cookieBtn = buttons.find(b => b.textContent.includes('Kabul Et') || b.textContent.includes('Accept'));
                if (cookieBtn) cookieBtn.click();
            });
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.log('Çerez butonu atlandı.');
        }

        console.log('Katalogların bulunduğu iframe veya dinamik elementler kontrol ediliyor...');
        // Sitede katalogları yükleyen elementleri tetiklemek için ana kapağa bir tık simüle edelim
        await page.evaluate(() => {
            const catalogImages = document.querySelectorAll('img[src*="Image.ashx"]');
            if (catalogImages.length > 0) catalogImages[0].click();
        });

        // Linklerin ağa düşmesi için biraz bekle
        console.log('Ağ isteklerinin yakalanması için 10 saniye bekleniyor...');
        await new Promise(r => setTimeout(r, 10000));

        // Eğer ikinci kapak varsa ona da tıklayalım ki onun linkleri de gelsin
        await page.evaluate(() => {
            const catalogImages = document.querySelectorAll('img[src*="Image.ashx"]');
            if (catalogImages.length > 1) catalogImages[1].click();
        });
        await new Promise(r => setTimeout(r, 5000));

    } catch (error) {
        console.error('Kazıma sırasında hata oluştu:', error);
    } finally {
        await browser.close();
        console.log('Tarayıcı kapatıldı.');
    }

    // Elde edilen verileri kontrol edelim
    console.log('--- ÇEKİLEN VERİLER ---');
    console.log(extractedData);

    if (!extractedData.currentCatalog.baseUrl || !extractedData.currentCatalog.coverUrl) {
        console.error('❌ Yeterli veri bulunamadı. Page.js güncellenmiyor.');
        process.exit(1); // Error code for GitHub Actions to report failure
    }

    // Şimdi page.js dosyasını güncelleyelim
    console.log('page.js dosyası güncelleniyor...');
    const pageJsPath = path.join(__dirname, '..', 'src', 'app', 'katalog', 'page.js');
    let pageJsContent = fs.readFileSync(pageJsPath, 'utf8');

    // Regex ile eski BaseUrl ve Signature ları değiştir (Sırasıyla ID 1 ve ID 2 için değişir)
    // ID 1 (Mevcut Ay)
    const regexId1BaseUrl = /id: 1,[\s\S]*?baseUrl: "([^"]+)"/;
    const regexId1Signature = /id: 1,[\s\S]*?signature: "([^"]+)"/;
    const regexId1CoverUrl = /id: 1,[\s\S]*?coverUrl: "([^"]+)"/;

    pageJsContent = pageJsContent.replace(regexId1BaseUrl, (match) => match.replace(/"[^"]+"$/, `"${extractedData.currentCatalog.baseUrl}"`));
    pageJsContent = pageJsContent.replace(regexId1Signature, (match) => match.replace(/"[^"]+"$/, `"${extractedData.currentCatalog.signature}"`));
    pageJsContent = pageJsContent.replace(regexId1CoverUrl, (match) => match.replace(/"[^"]+"$/, `"${extractedData.currentCatalog.coverUrl}"`));

    // ID 2 (Gelecek Ay) - Eğer bulunduysa
    if (extractedData.nextCatalog.baseUrl && extractedData.nextCatalog.coverUrl) {
        const regexId2BaseUrl = /id: 2,[\s\S]*?baseUrl: "([^"]+)"/;
        const regexId2Signature = /id: 2,[\s\S]*?signature: "([^"]+)"/;
        const regexId2CoverUrl = /id: 2,[\s\S]*?coverUrl: "([^"]+)"/;

        pageJsContent = pageJsContent.replace(regexId2BaseUrl, (match) => match.replace(/"[^"]+"$/, `"${extractedData.nextCatalog.baseUrl}"`));
        pageJsContent = pageJsContent.replace(regexId2Signature, (match) => match.replace(/"[^"]+"$/, `"${extractedData.nextCatalog.signature}"`));
        pageJsContent = pageJsContent.replace(regexId2CoverUrl, (match) => match.replace(/"[^"]+"$/, `"${extractedData.nextCatalog.coverUrl}"`));
    }

    fs.writeFileSync(pageJsPath, pageJsContent, 'utf8');
    console.log('✅ page.js başarıyla güncellendi!');
}

updateCatalogs();
