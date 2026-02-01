
import Hero from '@/components/UI/Hero';
import InfoSection from '@/components/UI/InfoSection';
import EarningsTable from '@/components/UI/EarningsTable';

import Image from 'next/image';

export const metadata = {
  title: 'Oriflame Üyelik ve Kayıt | Oriflame Katalog & Sermayesiz İş',
  description: 'Oriflame kayıt ol işlemi ile ücretsiz üyelik fırsatını yakalayın. Sermayesiz iş kurarak Oriflame katalog ürünlerine indirimli sahip olun. Hemen Oriflame dünyasına katılın.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">

      {/* HERO SECTION (Includes Form) */}
      <div id="basvuru">
        <Hero />
      </div>

      {/* INFO / FEATURES SECTION */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Neden Oriflame?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Hayallerinize ulaşmak için size sunduğumuz eşsiz fırsatları keşfedin.</p>
          </div>
          <InfoSection />
        </div>
      </section>

      {/* EARNINGS SECTION */}
      {/* <section id="kazanc" className="py-16 bg-green-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Kazanç Planı</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Ne Kadar Kazanabilirsin?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Oriflame'de kazancın limiti yoktur. Satışlarınızdan anında %30 kâr elde ederken, ekibinizi büyüterek performans iskontoları ile aylık düzenli gelir sahibi olabilirsiniz.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <EarningsTable />
          </div>
        </div>
      </section> */}

      {/* WELCOME PROGRAM / GIFTS (Placeholder for now, can be image based) */}
      <section id="hediyeler" className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1887&auto=format&fit=crop"
                alt="Hoşgeldin Hediyeleri"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl transform md:-rotate-2 hover:rotate-0 transition-transform duration-500 w-full h-auto"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Hoşgeldin Programı</h2>
              <p className="text-lg text-gray-600">
                İlk 3 ayınızda vereceğiniz siparişlerle birbirinden değerli parfüm ve cilt bakım setlerine sembolik fiyatlarla sahip olun.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</span>
                  <span className="text-gray-700">1. Ay: Göz Alıcı Parfüm</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</span>
                  <span className="text-gray-700">2. Ay: Lüks Cilt Bakım Seti</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</span>
                  <span className="text-gray-700">3. Ay: Profesyonel Makyaj Koleksiyonu</span>
                </li>
              </ul>
              <a href="#basvuru" className="inline-block mt-4 text-primary font-bold border-b-2 border-primary pb-1 hover:text-green-800 transition-colors">
                Hemen Başvur ve Kazan &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Hayallerine Bir Adım At</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Binlerce kadın Oriflame ile kendi ayakları üzerinde duruyor. Sen de onlardan biri ol.</p>
          <a href="#basvuru" className="inline-block bg-white text-primary px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-colors shadow-xl">
            Ücretsiz Üye Ol
          </a>
        </div>
      </section>

    </div>
  );
}
