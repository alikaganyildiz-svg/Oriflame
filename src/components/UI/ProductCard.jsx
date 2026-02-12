import React from 'react';
import { ShoppingBag, Eye, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="group cursor-pointer">
            <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-gray-100 rounded-sm">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors" title="Favorilere Ekle">
                        <Heart size={18} />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors" title="Hızlı Bakış">
                        <Eye size={18} />
                    </button>
                </div>

                {/* Add to Cart Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center border-t border-gray-100">
                    <button className="flex items-center space-x-2 text-primary hover:text-secondary font-semibold uppercase text-xs tracking-widest transition-colors">
                        <ShoppingBag size={16} />
                        <span>Sepete Ekle</span>
                    </button>
                </div>
            </div>

            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-lg font-medium text-gray-900 mb-1 font-serif">{product.name}</h3>
                <p className="text-xs text-secondary uppercase tracking-wider mb-2">{product.category}</p>
                <div className="flex items-center justify-center space-x-3">
                    {product.discountPrice ? (
                        <>
                            <span className="text-primary font-bold text-lg">{product.discountPrice} TL</span>
                            <span className="text-gray-400 line-through text-sm">{product.price} TL</span>
                        </>
                    ) : (
                        <span className="text-primary font-bold text-lg">{product.price} TL</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
