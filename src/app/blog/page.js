'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

const Blog = () => {
    const [aiPost, setAiPost] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchAiContent = async () => {
            try {
                // Call Next.js API Route for AI Content
                const response = await fetch('/api/daily-content');
                if (response.ok) {
                    const data = await response.json();
                    setAiPost(data);
                }
            } catch (error) {
                console.error("AI Content fetch failed:", error);
                // Demo data fallback
                setAiPost({
                    title: "Oriflame ile Güzelliğinizi Keşfedin (Demo)",
                    content: "<p>Bu bir demo içeriğidir. API bağlantısı kurulduğunda gerçek içerik burada görünecektir.</p><h3>Doğal Güzellik</h3><p>İsveç'ten gelen doğal içeriklerle cildinizi şımartın.</p>",
                    category: "Güzellik",
                    image_keyword: "nature"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAiContent();
    }, []);

    const getImage = (keyword) => {
        if (aiPost && aiPost.generated_image_url) {
            return aiPost.generated_image_url;
        }

        if (!keyword) return topicImages['default'];
        const cleanKeyword = keyword.toLowerCase().trim();
        if (topicImages[cleanKeyword]) return topicImages[cleanKeyword];
        return topicImages['default'];
    };

    return (
        <div className="pt-10 min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest rounded-full mb-4">
                        Güzellik & Yaşam Bloğu
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">Günlük İlham Köşesi</h1>
                    <p className="text-gray-600 text-lg">Sizin için her gün yepyeni, özgün ve ilham verici içerikler hazırlıyoruz.</p>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : aiPost ? (
                    <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="relative h-64 sm:h-96 overflow-hidden group">
                            <img
                                src={getImage(aiPost.image_keyword)}
                                alt={aiPost.title}
                                onError={(e) => { e.target.src = topicImages['default']; }}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        <div className="p-8 sm:p-12">
                            <div className="mb-10 text-center border-b border-gray-100 pb-8">
                                <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-bold uppercase tracking-wide mb-4">
                                    {aiPost.category || 'Güzellik'}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                                    {aiPost.title}
                                </h1>
                                <div className="mt-4 text-gray-400 text-sm font-medium">
                                    {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>

                            <div className="blog-content prose prose-lg prose-green mx-auto text-gray-600">
                                <div dangerouslySetInnerHTML={{ __html: aiPost.content }} />
                            </div>

                            <div className="my-12 h-px bg-gray-100" />

                            <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-green-700 flex items-center justify-center text-white shadow-lg">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Oriflame Güzellik Editörü</div>
                                        <div className="text-xs">Güzellik ve Yaşam Uzmanı</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </article>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100">
                        <div className="inline-flex p-4 rounded-full bg-gray-100 text-gray-400 mb-4">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">İçerik Hazırlanıyor</h3>
                        <p className="text-gray-500 mt-2">Editörlerimiz bugünün yazısını oluşturuyor. Lütfen biraz sonra tekrar deneyin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
