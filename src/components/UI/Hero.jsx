import React from 'react';
import Image from 'next/image';
// import MembershipForm from './MembershipForm'; // Removed per user request
import FAQ from './FAQ';

const Hero = () => {
    return (
        <section className="relative w-full bg-gray-50 py-12 lg:py-24 overflow-hidden min-h-screen flex items-center">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2070&auto=format&fit=crop"
                    alt="Oriflame Background"
                    fill
                    fill
                    className="object-cover opacity-15 filter blur-sm"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-gray-50/90"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                <div className="space-y-8 animate-fade-in-up">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-bold text-sm uppercase tracking-widest rounded-full mb-2">
                        Güzellik & Kazanç Dünyası
                    </span>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight">
                        Kendi İşinin <br />
                        <span className="text-primary italic">Patronu Ol</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Sermayesiz, risksiz ve çalışma saatlerini senin belirlediğin bir iş fırsatı.
                        Oriflame dünyasına katıl, hem harika görün hem de kazanmaya başla.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8 border-b border-gray-200 pb-10 mb-10 w-full max-w-2xl mx-auto">
                        <div className="flex -space-x-4">
                            <Image width={56} height={56} className="rounded-full border-4 border-white shadow-md" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                            <Image width={56} height={56} className="rounded-full border-4 border-white shadow-md" src="https://randomuser.me/api/portraits/women/65.jpg" alt="User" />
                            <Image width={56} height={56} className="rounded-full border-4 border-white shadow-md" src="https://randomuser.me/api/portraits/women/32.jpg" alt="User" />
                            <div className="w-14 h-14 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shadow-md">+25k</div>
                        </div>
                        <p className="text-base text-gray-700 font-medium">
                            Bu ay <span className="text-primary font-bold text-lg">1.250+</span> kişi aramıza katıldı.
                        </p>
                    </div>

                    {/* FAQ */}
                    <div className="max-w-4xl mx-auto text-left bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">Merak Ettikleriniz</h2>
                        <FAQ />
                    </div>

                    {/* SEO Content Block */}
                    <div className="space-y-12 text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto pt-10 text-left">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-primary mb-4">Oriflame İle Hayallerinize Kapı Aralayın</h2>
                            <p>
                                Oriflame dünyasına adım atmak artık çok kolay. Güzellik ve kazanç dolu bir yolculuğa çıkın.
                                İster kendi ihtiyaçlarınızı indirimli almak için, ister <strong>sermayesiz iş</strong> kurarak ek gelir elde etmek için Oriflame avantajlarından faydalanabilirsiniz.
                                Binlerce kişi gibi siz de hayallerinize ulaşmak için ilk adımı atın.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Katalog ile Kazanç</h2>
                                <p>
                                    Her ay yenilenen <strong>Oriflame katalog</strong>, binlerce kozmetik, cilt bakımı ve wellness ürününü beğeninize sunar.
                                    Kataloğu çevrenizle paylaşarak sipariş toplayabilir, satışlarınızdan anında kâr elde edebilirsiniz.
                                    Kendi işinizin patronu olmak ve finansal özgürlüğe kavuşmak için eşsiz imkanlar tanır.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Üyelik Avantajları</h2>
                                <ul className="space-y-3 mt-2">
                                    <li className="flex items-start"><span className="text-primary mr-2">✓</span> <span><strong>Ücretsiz Başlangıç:</strong> Hiçbir ücret ödemeden sisteme dahil olun.</span></li>
                                    <li className="flex items-start"><span className="text-primary mr-2">✓</span> <span><strong>İndirimli Alışveriş:</strong> Tüm ürünlere özel indirimlerle sahip olun.</span></li>
                                    <li className="flex items-start"><span className="text-primary mr-2">✓</span> <span><strong>Hoşgeldin Hediyeleri:</strong> Başlangıç setleri kazanın.</span></li>
                                    <li className="flex items-start"><span className="text-primary mr-2">✓</span> <span><strong>Kariyer Fırsatı:</strong> Performans primleri ve seyahatler kazanın.</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center pt-8">
                            <p className="italic text-gray-500">
                                Hayallerinizi ertelemeyin, kazanmaya bugün başlayın!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
