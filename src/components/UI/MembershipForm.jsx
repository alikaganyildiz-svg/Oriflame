'use client';

import React, { useState } from 'react';
import { UserPlus, ChevronRight, Loader2 } from 'lucide-react';

const MembershipForm = () => {
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = () => {
        setIsLoading(true);
        setShowForm(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 h-full">
            <div className="bg-primary text-white text-center py-4">
                <h2 className="text-xl font-serif font-bold">Hemen Ücretsiz Üye Ol</h2>
                <p className="text-xs opacity-90 mt-1">Oriflame Dünyasına Katılın</p>
            </div>

            <div className="w-full relative bg-gray-50 min-h-[400px]">
                {!showForm ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white space-y-6">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2 animate-pulse-slow">
                            <UserPlus size={40} className="text-primary" />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Başvuru Formunu Aç</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Güvenli kayıt formunu görüntülemek için aşağıdaki butona tıklayın.
                            </p>

                            <button
                                onClick={handleStart}
                                className="group flex items-center justify-center gap-2 w-full bg-primary hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Yükleniyor...
                                    </>
                                ) : (
                                    <>
                                        Formu Başlat
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-xs text-gray-400 mt-4">
                            Form, güvenli bağlantı (SSL) üzerinden Oriflame sunucularından yüklenecektir.
                        </div>
                    </div>
                ) : (
                    <iframe
                        src="https://tr.oriflame.com/business-opportunity/become-consultant?sc_device=Blog&potentialSponsor=4170097"
                        scrolling="yes"
                        loading="eager"
                        onLoad={() => setIsLoading(false)}
                        frameBorder="0"
                        className="w-full mx-auto animate-fade-in"
                        style={{ height: '1825px', minHeight: '100%' }}
                        title="Oriflame Üyelik"
                    ></iframe>
                )}
            </div>
        </div>
    );
};

export default MembershipForm;
