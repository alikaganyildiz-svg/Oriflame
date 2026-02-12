import React from 'react';

const EarningsTable = () => {
    const earningsData = [
        { points: '500 - 999 BP', level: '%4', income: '75 TL - 150 TL' },
        { points: '1.000 - 1.999 BP', level: '%8', income: '300 TL - 590 TL' },
        { points: '2.000 - 3.999 BP', level: '%12', income: '885 TL - 1.770 TL' },
        { points: '4.000 - 6.599 BP', level: '%16', income: '2.360 TL - 3.890 TL' },
        { points: '6.600 - 9.999 BP', level: '%20', income: '4.860 TL - 7.360 TL' },
        { points: '10.000 BP ve Üzeri', level: '%24', income: '8.835 TL ve Üzeri' },
    ];

    return (
        <div className="overflow-x-auto">
            {/* <table className="min-w-full divide-y divide-gray-200 border border-gray-200 shadow-sm rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Başarı Puanı (BP)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Seviye
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Tahmini Aylık Kazanç
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {earningsData.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-green-50' : 'bg-gray-50 hover:bg-green-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {row.points}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {row.level}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                                {row.income}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="mt-2 text-xs text-gray-500">
                * Kazançlar performansınıza ve ekibinizin satış hacmine göre değişiklik gösterebilir. Güncel rakamlar için danışmanınıza başvurun.
            </p> */}
        </div>
    );
};

export default EarningsTable;
