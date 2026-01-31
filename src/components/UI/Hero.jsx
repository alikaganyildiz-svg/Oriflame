import React from 'react';
import Image from 'next/image';
import MembershipForm from './MembershipForm';
import FAQ from './FAQ';

const Hero = () => {
    return (
        <section className="relative w-full bg-gray-50 py-12 lg:py-20 overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2070&auto=format&fit=crop"
                    alt="Oriflame Background"
                    fill
                    priority
                    className="object-cover opacity-20 filter blur-sm"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-white/80 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-10">
                    {/* Left Content */}
                    <div className="space-y-6 text-center lg:text-left animate-fade-in-up lg:sticky lg:top-24">
                        <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest rounded-full">
                            Kariyer Fırsatı
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight">
                            Kendi İşinin <br />
                            <span className="text-primary italic">Patronu Ol</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                            Sermayesiz, risksiz ve çalışma saatlerini senin belirlediğin bir iş fırsatı.
                            Formu doldur, ücretsiz Oriflame dünyasına katıl ve kazanmaya hemen başla.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-b border-gray-200 pb-8 mb-8">
                            <div className="flex -space-x-2">
                                <Image width={40} height={40} className="rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                                <Image width={40} height={40} className="rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/65.jpg" alt="User" />
                                <Image width={40} height={40} className="rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/32.jpg" alt="User" />
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+25k</div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">
                                Bu ay <span className="text-primary font-bold">1.250+</span> kişi aramıza katıldı.
                            </p>
                        </div>

                        {/* FAQ */}
                        <div className="pt-2 border-b border-gray-200 pb-8 mb-8">
                            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 text-center lg:text-left">Merak Ettikleriniz</h2>
                            <FAQ />
                        </div>

                        {/* SEO Content Block */}
                        <div className="space-y-8 text-gray-700 leading-relaxed text-sm md:text-base animate-fade-in-up delay-200">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-primary mb-3">Oriflame Kayıt Ol ile Hayallerinize Kapı Aralayın</h2>
                                <p>
                                    Oriflame dünyasına adım atmak artık çok kolay. <strong>Oriflame kayıt ol</strong> işlemini tamamlayarak, güzellik ve kazanç dolu bir yolculuğa çıkın.
                                    İster kendi ihtiyaçlarınızı indirimli almak için, ister <strong>sermayesiz iş</strong> kurarak ek gelir elde etmek için <strong>Oriflame üyelik</strong> avantajlarından faydalanabilirsiniz.
                                    Binlerce kişi gibi siz de hayallerinize ulaşmak için ilk adımı atın.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Oriflame Katalog ile Kazanç Fırsatları</h2>
                                <p>
                                    Her ay yenilenen <strong>Oriflame katalog</strong>, binlerce kozmetik, cilt bakımı ve wellness ürününü beğeninize sunar.
                                    <strong>Ücretsiz kayıt</strong> sonrasında kataloğu çevrenizle paylaşarak sipariş toplayabilir, satışlarınızdan anında kâr elde edebilirsiniz.
                                    Kendi işinizin patronu olmak, çalışma saatlerinizi özgürce belirlemek ve finansal özgürlüğe kavuşmak için <strong>Oriflame</strong> size eşsiz imkanlar tanır.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Oriflame Üyelik Avantajları Nelerdir?</h2>
                                <ul className="list-disc list-inside space-y-2 mt-2 marker:text-primary">
                                    <li><strong>Ücretsiz Üyelik Başvurusu:</strong> Hiçbir kayıt ücreti veya aidat ödemeden sisteme dahil olun.</li>
                                    <li><strong>İndirimli Alışveriş:</strong> Tüm <strong>Oriflame</strong> ürünlerine katalog fiyatı üzerinden özel indirimlerle sahip olun.</li>
                                    <li><strong>Hoşgeldin Hediyeleri:</strong> Yeni kayıt olan girişimcilere özel sürpriz ürünler ve başlangıç setleri kazanın.</li>
                                    <li><strong>Kariyer Fırsatı:</strong> Kendi ekibinizi kurarak performans primleri, nakit ödüller ve seyahatler kazanın.</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Hemen Oriflame'e Katılın</h2>
                                <p>
                                    Yan taraftaki formu hemen doldurarak <strong>Oriflame</strong> ailesinin mutlu bir üyesi olun.
                                    T.C. kimlik numaranız ve iletişim bilgilerinizle güvenle kaydınızı oluşturun.
                                    İşleminiz tamamlandığında danışmanlarımız sizi arayarak <strong>Oriflame katalog</strong> gönderimi ve süreç hakkında detaylı bilgilendirme yapacaktır.
                                    Hayallerinizi ertelemeyin, <strong>ücretsiz kayıt</strong> fırsatıyla kazanmaya bugün başlayın!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="w-full max-w-md mx-auto lg:ml-auto">
                        <MembershipForm />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
