import React from 'react';
import { Award, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const InfoSection = () => {
    const features = [
        {
            icon: <Award className="w-8 h-8 text-secondary" />,
            title: "50 Yıllık Uzmanlık",
            desc: "İsveç kökenli, doğadan ilham alan ve bilimle güçlendirilmiş 50 yıllık güzellik deneyimi."
        },
        {
            icon: <Users className="w-8 h-8 text-secondary" />,
            title: "Pazar Lideri",
            desc: "60'tan fazla ülkede milyonlarca danışman ile dünyanın önde gelen doğrudan satış markalarından biri."
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-secondary" />,
            title: "Yüksek Kazanç",
            desc: "%30 anında satış kârı ve %24'e varan performans primleri ile gelirini kendin belirle."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-secondary" />,
            title: "%100 Güven",
            desc: "Memnuniyet garantisi, kolay iade ve güvenilir ödeme seçenekleri ile risksiz iş fırsatı."
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100 group">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                        {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
            ))}
        </div>
    );
};

export default InfoSection;
