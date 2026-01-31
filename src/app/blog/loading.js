
import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-serif font-bold text-gray-800">Günlük İçerik Hazırlanıyor...</h2>
            <p className="text-gray-500 text-sm mt-2">Editörlerimiz sizin için yazıyor.</p>
        </div>
    );
}
