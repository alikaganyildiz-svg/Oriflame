const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function updateCatalogs() {
    console.log('Oriflame Katalog Güncelleyici Botu Başlatılıyor...');

    // Puppeteer'ın standart Chromium sürümünü kullanarak başlat
    const browser = await puppeteer.launch({
        headless: "new", // Yeni ve optimize edilmiş arka plan modu
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--disable-popup-blocking' // Pop-up engelliyicisi kapalı olsun!
        ]
    });

    const page = await browser.newPage();

    // Ağ isteklerini dinleyerek dinamik iPaper ve Image (Kapak) linklerini toplayacağız
    const extractedData = {
        currentCatalog: { baseUrl: '', signature: '', coverUrl: '' },
        nextCatalog: { baseUrl: '', signature: '', coverUrl: '' }
    };

    // İstekleri dinleyen genel fonksiyon (Hem ana sayfa, hem açılan yeni sekmeler için)
    const interceptRequest = (request) => {
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
                extractedData.nextCatalog.coverUrl = url;
                console.log('✅ Gelecek Ay Kapak görseli bulundu.');
            }
        }
    };

    // Ana sayfa ağ istekleri
    page.on('request', interceptRequest);

    // Açılan yeni sekmeler (Pop-ups / iFrames / Target) istekleri
    browser.on('targetcreated', async (target) => {
        if (target.type() === 'page') {
            const newPage = await target.page();
            if (newPage) {
                newPage.on('request', interceptRequest);
            }
        }
    });

    try {
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

        // Yardımcı Fonksiyon: 'Görüntüle' butonu ortasına gerçek fare ile tıkla
        async function clickElementByMouse(index) {
            const elementInfo = await page.evaluate((idx) => {
                const buttons = Array.from(document.querySelectorAll('div')).filter(el => el.textContent.trim() === 'Görüntüle');
                if (buttons.length > idx) {
                    const rect = buttons[idx].getBoundingClientRect();
                    return {
                        x: rect.x + (rect.width / 2),
                        y: rect.y + (rect.height / 2),
                        found: true
                    };
                }
                return { found: false };
            }, index);

            if (elementInfo.found) {
                // Fareyi o noktaya götür ve tıkla (İnsan simülasyonu)
                await page.mouse.move(elementInfo.x, elementInfo.y, { steps: 10 });
                await new Promise(r => setTimeout(r, 500)); // Üzerinde yarım saniye bekle
                await page.mouse.down();
                await new Promise(r => setTimeout(r, 100));
                await page.mouse.up();
                return true;
            }
            return false;
        }

        // 1. Mevcut ay kataloğuna tıkla
        console.log('1. Kataloğa (Mevcut Ay) tıklanıyor...');
        await clickElementByMouse(0);

        // Linklerin ağa düşmesi için biraz bekle
        console.log('Ağ isteklerinin yakalanması için 15 saniye bekleniyor...');
        await new Promise(r => setTimeout(r, 15000));

        // Açık sekmeleri (Mevcut ay okuyucu sekmesi) kapat (Tarayıcıyı yormamak ve odak kaybetmemek için)
        let pages = await browser.pages();
        for (let i = pages.length - 1; i > 0; i--) {
            if (pages[i] !== page) await pages[i].close();
        }

        // Ana sayfayı tekrar öne al
        await page.bringToFront();
        await new Promise(r => setTimeout(r, 2000));

        // 2. Gelecek ay kataloğuna tıkla
        console.log('2. Kataloğa (Gelecek Ay) tıklanıyor...');
        await clickElementByMouse(1);

        await new Promise(r => setTimeout(r, 15000));

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
        process.exit(1);
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
