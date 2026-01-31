
import React from 'react';
import { BookOpen } from 'lucide-react';
import { generateDailyBlogContent } from '@/services/ai';

// 24 saniye değil, 24 SAAT (86400 saniye) boyunca cache'le.
// Bu sayede siteye günde 1 kez giren ilk kişi içeriği oluşturur, sonrakiler aynısını görür.
export const revalidate = 86400;

const topicImages = {
    'skincare': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=2000',
    'makeup': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=2000',
    'business': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2000',
    'nature': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=2000',
    'perfume': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=2000',
    'wellness': 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=2000',
    'hair': 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=2000',
    'haircare': 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=2000',
    'default': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2000'
};

const getImage = (keyword, aiUrl) => {
    if (aiUrl) return aiUrl;
    if (!keyword) return topicImages['default'];
    const cleanKeyword = keyword.toLowerCase().trim();
    if (topicImages[cleanKeyword]) return topicImages[cleanKeyword];
    return topicImages['default'];
};

export default async function BlogPage() {
    // Sunucu tarafında çalışır ve sonucu cache'ler
    const aiPost = await generateDailyBlogContent();

    // Eğer AI hata verirse veya API key yoksa fallback göster
    if (!aiPost) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 text-center px-4">
                <h1 className="text-3xl font-bold text-gray-800">Şu an içerik yüklenemedi</h1>
                <p className="text-gray-600 mt-2">Lütfen daha sonra tekrar deneyiniz.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section with Gradient */}
            <div className="relative bg-gradient-to-r from-green-800 to-primary py-24 sm:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://www.transparenttextures.com/patterns/cubes.png" alt="Pattern" className="w-full h-full object-cover" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold text-xs uppercase tracking-widest rounded-full mb-6">
                        Güzellik & Yaşam Bloğu
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 tracking-tight shadow-sm">Günlük İlham Köşesi</h1>
                    <p className="text-green-100 text-xl font-light max-w-2xl mx-auto">Sizin için her gün yepyeni, özgün ve ilham verici içerikler hazırlıyoruz.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="relative h-72 sm:h-[500px] overflow-hidden group">
                        <img
                            src={getImage(aiPost.image_keyword, aiPost.generated_image_url)}
                            alt={aiPost.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white">
                            <span className="inline-block px-3 py-1 bg-primary text-white rounded-md text-sm font-bold uppercase tracking-wide mb-3 shadow-md">
                                {aiPost.category || 'Güzellik'}
                            </span>
                        </div>
                    </div>

                    <div className="p-8 sm:p-16">
                        <div className="mb-12 text-center border-b border-gray-100 pb-10">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-green-800">
                                {aiPost.title}
                            </h1>
                            <div className="flex items-center justify-center space-x-2 text-gray-500 font-medium">
                                <span>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span>•</span>
                                <span className="text-primary flex items-center gap-1"><BookOpen size={16} /> 3 Dk Okuma</span>
                            </div>
                        </div>

                        {/* Enhanced Typography & Colors */}
                        <div className="blog-content prose prose-lg md:prose-xl prose-stone mx-auto text-gray-700
                            prose-headings:font-serif prose-headings:font-bold prose-headings:text-green-900
                            prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:leading-tight
                            prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:text-primary prose-h3:mt-10 prose-h3:mb-4
                            
                            prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed prose-p:text-gray-600 prose-p:mb-6
                            
                            prose-strong:text-green-800 prose-strong:font-black prose-strong:bg-green-50 prose-strong:px-1 prose-strong:rounded
                            
                            prose-ul:my-8 prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-4
                            [&>ul>li]:relative [&>ul>li]:pl-7 [&>ul>li]:text-lg md:[&>ul>li]:text-xl before:[&>ul>li]:content-['✓'] before:[&>ul>li]:absolute before:[&>ul>li]:left-0 before:[&>ul>li]:text-primary before:[&>ul>li]:font-bold
                            
                            prose-ol:my-8 prose-ol:space-y-4 prose-ol:pl-6
                            [&>ol>li]:text-lg md:[&>ol>li]:text-xl marker:[&>ol>li]:text-primary marker:[&>ol>li]:font-bold
                            
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gradient-to-r prose-blockquote:from-green-50 prose-blockquote:to-transparent prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-green-900 prose-blockquote:shadow-sm
                            
                            selection:bg-primary/20 selection:text-green-900">
                            <div dangerouslySetInnerHTML={{ __html: aiPost.content }} />
                        </div>

                        <div className="my-16 flex items-center justify-center">
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full"></div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 flex items-center gap-6 shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shrink-0">
                                <span className="font-serif text-2xl font-bold">O</span>
                            </div>
                            <div>
                                <div className="font-bold text-xl text-gray-900 mb-1">Oriflame Editör Masası</div>
                                <p className="text-gray-600">Güzellik, sağlık ve iyi yaşam üzerine uzman ekibimizle hazırladığımız günlük içerikler.</p>
                            </div>
                        </div>

                    </div>
                </article>
            </div>
        </div>
    );
};
