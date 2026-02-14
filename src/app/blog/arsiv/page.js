
import React from 'react';
import Link from 'next/link';
import { getAllPosts } from '@/services/blog-service';
import { ArrowLeft, Calendar, BookOpen } from 'lucide-react';

export const revalidate = 3600;

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

export default async function ArchivePage() {
    const posts = await getAllPosts();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <div className="bg-green-900 py-16 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img src="https://www.transparenttextures.com/patterns/cubes.png" alt="Pattern" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 container mx-auto px-4">
                    <Link href="/blog" className="inline-flex items-center text-green-900 bg-white/90 hover:bg-white px-4 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mb-6">
                        <ArrowLeft size={20} className="mr-2" />
                        Bloğa Dön
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Blog Arşivi</h1>
                    <p className="text-green-100 max-w-2xl mx-auto">Geçmişten günümüze tüm ilham verici içeriklerimize buradan ulaşabilirsiniz.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {posts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">Henüz arşivlenmiş yazı bulunmamaktadır.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={getImage(post.image_keyword, post.generated_image_url)}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                                {post.category || 'Güzellik'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center text-gray-400 text-sm mb-3 space-x-3">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.date).toLocaleDateString('tr-TR')}</span>
                                            <span className="flex items-center gap-1"><BookOpen size={14} /> 3 Dk</span>
                                        </div>
                                        <h2 className="text-xl font-serif font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
                                            <span className="text-green-600 font-medium group-hover:underline">Devamını Oku</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
