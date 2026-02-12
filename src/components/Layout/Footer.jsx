import React from 'react';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1 */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 font-serif">Hakkımızda</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Oriflame Hakkında</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sürdürülebilirlik</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Yatırımcı İlişkileri</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Marka Ortaklığı</a></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 font-serif">Müşteri Hizmetleri</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sipariş Takibi</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">İade ve Değişim</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 font-serif">Kategoriler</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Cilt Bakımı</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Makyaj</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Parfüm</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Wellness</a></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 font-serif">Bizi Takip Edin</h3>
                        <p className="text-sm text-gray-400 mb-6">En yeni trendler ve tekliflerden haberdar olun.</p>
                        <div className="flex space-x-4 mb-8">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Youtube"><Youtube size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2026 Oriflame Kozmetik. Tüm hakları saklıdır.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Kullanım Koşulları</a>
                        <a href="#" className="hover:text-white">Gizlilik</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
