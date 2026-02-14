'use client';

import React, { useState } from 'react';
import { BookOpen, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
// import { Metadata } from 'next'; // Can't use Metadata in Client Component. We need separate layout or wrapper. 
// For simplicity in this migration, we will omit metadata or use a Server Component wrapper if critical.
// But for now, let's keep it simple.

const Catalog = () => {
    const [selectedCatalog, setSelectedCatalog] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);

    const catalogs = [
        {
            id: 1,
            title: "Mevcut Ay Kataloğu",
            description: "En yeni ürünler, harika indirimler ve sezona özel fırsatları keşfedin.",
            baseUrl: "https://b-cdn.ipaper.io/iPaper/Papers/a1cbc8ea-c986-4ff5-bc02-8e456f48f383",
            signature: "?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9jZG4uaXBhcGVyLmlvL2lQYXBlci9QYXBlcnMvYTFjYmM4ZWEtYzk4Ni00ZmY1LWJjMDItOGU0NTZmNDhmMzgzL1BhZ2VzLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3NzExNjE1NDh9fX1dfQ__&Signature=eD5g5B8uJxXMAZzOXqSbBKX~x3Ntppg8p9Jqv8-j6GZP2z7Uf6c4W-EG4CakmKYwKV7AVJr7iWoyOiZx2qnuwJQNxIduALj8zRGWuyLH1gFIvuFxjECrH1b6zXfhPQ4eo4Zmz30n3tfNLAKhIlox9K0dUiyQ6kJvkY2aPehwUik_&Key-Pair-Id=APKAIPGQN6BDBMBZ2LCA",
            badge: "Yayında"
        },
        {
            id: 2,
            title: "Gelecek Ay Kataloğu",
            description: "Önümüzdeki ayın fırsatlarını şimdiden inceleyin ve siparişlerinizi planlayın.",
            baseUrl: "https://b-cdn.ipaper.io/iPaper/Papers/6713ece0-d8a6-4c02-867a-1c6837849460",
            signature: "?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9jZG4uaXBhcGVyLmlvL2lQYXBlci9QYXBlcnMvNjcxM2VjZTAtZDhhNi00YzAyLTg2N2EtMWM2ODM3ODQ5NDYwL1BhZ2VzLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3NzExNjIzMDl9fX1dfQ__&Signature=dTkxX0PN6jAzkYL5qQjCcjE7jxNw4DWAityB~u-0BrYuXdwFY5imETguwdaRO76ee~5TODDmU3uiW3EnXN1eTuy03sVZJy0hItY5LM9CTfrMG2a5~u6a1-nnioEHf4yJNj-inaLq-g8iWCRKzT4rLrI9fuU9gAtM5GN2~yL8SFQ_&Key-Pair-Id=APKAIPGQN6BDBMBZ2LCA",
            badge: "Yakında"
        }
    ];

    const openCatalog = (catalog) => {
        setSelectedCatalog(catalog);
        setCurrentPage(1);
        setModalOpen(true);
    };

    const closeCatalog = () => {
        setModalOpen(false);
        setSelectedCatalog(null);
        setCurrentPage(1);
    };

    // Responsive Validation
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkMobile();

        // Listener
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const nextPage = () => {
        setLoadingImage(true);
        if (isMobile) {
            // Mobile: Increment by 1
            setCurrentPage(prev => prev + 1);
        } else {
            // Desktop: Cover(1) -> 2(2-3) -> 4(4-5) ...
            setCurrentPage(prev => (prev === 1 ? prev + 1 : prev + 2));
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setLoadingImage(true);
            if (isMobile) {
                // Mobile: Decrement by 1
                setCurrentPage(prev => prev - 1);
            } else {
                // Desktop: 2->1, 4->2, 6->4 ...
                setCurrentPage(prev => (prev === 2 ? prev - 1 : prev - 2));
            }
        }
    };

    const handleImageLoad = () => {
        setLoadingImage(false);
    };

    const handleImageError = () => {
        setLoadingImage(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest rounded-full mb-4">
                        Online Kataloglar
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Oriflame Dünyasını Keşfet</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        İsterseniz mevcut ayın fırsatlarını yakalayın, isterseniz gelecek ayın sürprizlerine şimdiden göz atın.
                        Dijital kataloglarımızla alışveriş keyfini her an yanınızda taşıyın.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {catalogs.map((catalog) => (
                        <div key={catalog.id} className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => openCatalog(catalog)}>
                            <div className="relative h-[500px] overflow-hidden">
                                <div className="absolute top-4 right-4 z-10">
                                    <span className={`${catalog.badge === 'Yayında' ? 'bg-green-500' : 'bg-secondary'} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}>
                                        {catalog.badge}
                                    </span>
                                </div>
                                <img
                                    src={`${catalog.baseUrl}/Pages/1/Zoom.jpg${catalog.signature}`}
                                    alt={catalog.title}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-6 left-6 text-white pointer-events-none">
                                    <BookOpen className="w-8 h-8 mb-3 opacity-90" />
                                    <h2 className="text-2xl font-serif font-bold">{catalog.title}</h2>
                                </div>
                            </div>

                            <div className="p-8 text-center bg-gray-50 group-hover:bg-white transition-colors">
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {catalog.description}
                                </p>
                                <button className="inline-flex items-center text-primary font-bold uppercase tracking-widest text-sm hover:text-green-800 transition-colors">
                                    Hemen İncele <ArrowRight className="ml-2 w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-white rounded-2xl p-10 shadow-lg text-center max-w-4xl mx-auto border border-gray-100">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Ürünleri İndirimli Almak İster misiniz?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Katalogdaki fiyatlar üzerinden ekstra %30 indirim kazanmak ve sürpriz hediyelere sahip olmak için hemen ücretsiz üye olun.
                    </p>
                    <a href="/#basvuru" className="inline-flex items-center space-x-2 text-primary font-bold border-b-2 border-primary pb-1 hover:text-green-800 transition-colors">
                        <span>Ücretsiz Üyelik Formuna Git</span>
                        <ArrowRight size={18} />
                    </a>
                </div>
            </div>

            {/* Catalog Viewer Modal */}
            {modalOpen && selectedCatalog && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-0 md:p-8">
                    <button
                        onClick={closeCatalog}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-[70] bg-black/50 rounded-full p-2"
                    >
                        <X size={32} />
                    </button>

                    <div className="relative w-full h-full flex flex-col items-center justify-center max-w-[100vw] md:max-w-[95vw]">
                        <div className="relative w-full h-[80vh] md:h-full flex items-center justify-center gap-0 md:gap-2 overflow-hidden px-2 md:px-0">
                            {loadingImage && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                                </div>
                            )}

                            {/* Responsive Image Logic */}
                            {isMobile ? (
                                // MOBILE VIEW: Single Page
                                <img
                                    src={`${selectedCatalog.baseUrl}/Pages/${currentPage}/Zoom.jpg${selectedCatalog.signature}`}
                                    alt={`Sayfa ${currentPage}`}
                                    className="max-w-full max-h-full object-contain shadow-2xl bg-white"
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />
                            ) : (
                                // DESKTOP VIEW: Double Page (Spread)
                                currentPage === 1 ? (
                                    <img
                                        src={`${selectedCatalog.baseUrl}/Pages/1/Zoom.jpg${selectedCatalog.signature}`}
                                        alt="Kapak"
                                        className="max-w-full h-full object-contain shadow-2xl rounded-sm bg-white"
                                        onLoad={handleImageLoad}
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <>
                                        <img
                                            src={`${selectedCatalog.baseUrl}/Pages/${currentPage}/Zoom.jpg${selectedCatalog.signature}`}
                                            alt={`Sayfa ${currentPage}`}
                                            className="w-1/2 h-full object-contain shadow-2xl rounded-l-sm bg-white"
                                            onLoad={handleImageLoad}
                                            onError={handleImageError}
                                        />
                                        <img
                                            src={`${selectedCatalog.baseUrl}/Pages/${currentPage + 1}/Zoom.jpg${selectedCatalog.signature}`}
                                            alt={`Sayfa ${currentPage + 1}`}
                                            className="w-1/2 h-full object-contain shadow-2xl rounded-r-sm bg-white"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </>
                                )
                            )}
                        </div>

                        {/* Controls */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:px-0 pointer-events-none">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`pointer-events-auto p-2 md:p-3 bg-black/50 text-white rounded-full hover:bg-black/80 transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                            >
                                <ChevronLeft size={isMobile ? 32 : 40} />
                            </button>
                            <button
                                onClick={nextPage}
                                className="pointer-events-auto p-2 md:p-3 bg-black/50 text-white rounded-full hover:bg-black/80 transition-all"
                            >
                                <ChevronRight size={isMobile ? 32 : 40} />
                            </button>
                        </div>

                        {/* Page Indicator */}
                        <div className="absolute bottom-4 bottom-safe bg-black/60 text-white px-6 py-2 rounded-full text-base font-medium backdrop-blur-md">
                            {isMobile
                                ? `Sayfa ${currentPage}`
                                : (currentPage === 1 ? 'Kapak' : `Sayfa ${currentPage} - ${currentPage + 1}`)
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalog;
