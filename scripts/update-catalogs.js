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
                console.log('✅ Mevcut Ay Kataloğu iPaper linki bulundu:', baseUrl);
            } else if (extractedData.currentCatalog.baseUrl !== baseUrl && !extractedData.nextCatalog.baseUrl) {
                extractedData.nextCatalog.baseUrl = baseUrl;
                extractedData.nextCatalog.signature = signature;
                console.log('✅ Gelecek Ay Kataloğu iPaper linki bulundu:', baseUrl);
            } else {
                console.log('ℹ️ iPaper linki zaten kayıtlı veya kopya:', baseUrl);
            }
        }

        // 2. Katalog Kapak Görsellerinin Bağlantılarını Yakala (Image.ashx)
        if (url.includes('tr-catalogue.oriflame.com/') && url.includes('Image.ashx') && url.includes('PageNumber=1')) {
            console.log('🔍 Image.ashx yakalandı:', url);
            if (!extractedData.currentCatalog.coverUrl) {
                extractedData.currentCatalog.coverUrl = url;
                console.log('✅ Mevcut Ay Kapak görseli bulundu.');
            } else if (extractedData.currentCatalog.coverUrl !== url && !extractedData.nextCatalog.coverUrl) {
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
                const elements = Array.from(document.querySelectorAll('div, button, a'))
                    .filter(el => {
                        const text = el.textContent.trim();
                        return text === 'Görüntüle' || text === 'VIEW';
                    });
                
                if (elements.length > idx) {
                    const rect = elements[idx].getBoundingClientRect();
                    return {
                        x: rect.x + (rect.width / 2),
                        y: rect.y + (rect.height / 2),
                        found: true,
                        count: elements.length
                    };
                }
                return { found: false, count: elements.length };
            }, index);

            if (elementInfo.found) {
                console.log(`Buton bulundu (Sıra: ${index + 1}/${elementInfo.count}), tıklanıyor...`);
                await page.mouse.move(elementInfo.x, elementInfo.y, { steps: 10 });
                await new Promise(r => setTimeout(r, 500));
                await page.mouse.down();
                await new Promise(r => setTimeout(r, 100));
                await page.mouse.up();
                return true;
            }
            return false;
        }

        // Katalogları toplamak için bir döngü kuruyoruz
        console.log('Katalogları toplamak için butonlar tek tek kontrol ediliyor...');
        
        const buttonIndicesToTry = [0, 1, 2, 3, 4, 5, 6]; 
        
        for (const idx of buttonIndicesToTry) {
            if (extractedData.currentCatalog.baseUrl && extractedData.nextCatalog.baseUrl) {
                console.log('✅ Her iki katalog da bulundu, döngü sonlandırılıyor.');
                break;
            }
            
            console.log(`\n--- Buton indeksi ${idx} deneniyor ---`);
            try {
                await page.goto('https://tr.oriflame.com/catalogues?store=TR-kagan2532287006', {
                    waitUntil: 'networkidle2',
                    timeout: 60000
                });
                await new Promise(r => setTimeout(r, 5000));
                
                const clicked = await clickElementByMouse(idx);
                if (clicked) {
                    console.log(`${idx} nolu butona tıklandı, sayfa bekleniyor...`);
                    await new Promise(r => setTimeout(r, 15000));
                    console.log('Mevcut sayfa URL:', page.url());
                } else {
                    console.log(`⚠️ ${idx} nolu buton bulunamadı.`);
                }
            } catch (e) {
                console.log(`⚠️ ${idx} indeksi sırasında hata:`, e.message);
            }
        }

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

    // ID 1 (Mevcut Ay)
    const regexId1BaseUrl = /id: 1,[\s\S]*?baseUrl: "([^"]+)"/;
    const regexId1Signature = /id: 1,[\s\S]*?signature: "([^"]+)"/;
    const regexId1CoverUrl = /id: 1,[\s\S]*?coverUrl: "([^"]+)"/;

    pageJsContent = pageJsContent.replace(regexId1BaseUrl, (match) => match.replace(/"[^"]+"$/, `"${extractedData.currentCatalog.baseUrl}"`));
    pageJsContent = pageJsContent.replace(regexId1Signature, (match) => match.replace(/"[^"]+"$/, `"${extractedData.currentCatalog.signature}"`));
    pageJsContent = pageJsContent.replace(regexId1CoverUrl, (match) => match.replace(/"[^"]+"$/, `"${extractedData.currentCatalog.coverUrl}"`));

    // ID 2 (Gelecek Ay) - Eğer bulunduysa
    if (extractedData.nextCatalog.baseUrl && (extractedData.nextCatalog.signature || extractedData.nextCatalog.coverUrl)) {
        console.log('ID 2 (Gelecek Ay) güncelleniyor...');
        const regexId2BaseUrl = /id: 2,[\s\S]*?baseUrl: "([^"]+)"/;
        const regexId2Signature = /id: 2,[\s\S]*?signature: "([^"]+)"/;
        const regexId2CoverUrl = /id: 2,[\s\S]*?coverUrl: "([^"]+)"/;

        if (extractedData.nextCatalog.baseUrl) {
            pageJsContent = pageJsContent.replace(regexId2BaseUrl, (match) => match.replace(/"[^"]+"$/, `"${extractedData.nextCatalog.baseUrl}"`));
        }
        if (extractedData.nextCatalog.signature) {
            pageJsContent = pageJsContent.replace(regexId2Signature, (match) => match.replace(/"[^"]+"$/, `"${extractedData.nextCatalog.signature}"`));
        }
        if (extractedData.nextCatalog.coverUrl) {
            pageJsContent = pageJsContent.replace(regexId2CoverUrl, (match) => match.replace(/"[^"]+"$/, `"${extractedData.nextCatalog.coverUrl}"`));
        }
    }

    fs.writeFileSync(pageJsPath, pageJsContent, 'utf8');
    console.log('✅ page.js başarıyla güncellendi!');
}

updateCatalogs();
