import React from 'react';

const MembershipForm = () => {


    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-primary text-white text-center py-4">
                <h2 className="text-xl font-serif font-bold">Hemen Ücretsiz Üye Ol</h2>
                <p className="text-xs opacity-90 mt-1">Aşağıdaki formu doldurarak aramıza katılın</p>
            </div>

            <div className="w-full relative bg-white">
                <iframe
                    src="https://tr.oriflame.com/business-opportunity/become-consultant?sc_device=Blog&potentialSponsor=4170097"
                    scrolling="yes"
                    loading="lazy"
                    frameBorder="0"
                    className="w-full mx-auto"
                    style={{ height: '1825px', minHeight: '100%' }}
                    title="Oriflame Üyelik"
                ></iframe>
            </div>
        </div>
    );
};

export default MembershipForm;
