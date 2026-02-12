'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Ana Sayfa', href: '/' },
        { name: 'Katalog', href: '/katalog' },
        { name: 'Blog', href: '/blog' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            {/* Top Bar removed for cleaner look or kept minimal */}
            <div className="bg-primary text-white text-xs py-2 text-center font-medium tracking-wide">
                ORIFLAME İLE HAYALLERİNE KAPI ARALA - ÜCRETSİZ KAYIT
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex flex-col items-center group">
                            <span className="text-2xl md:text-3xl font-sans font-medium tracking-[0.15em] text-gray-800 group-hover:text-primary transition-colors">ORIFLAME</span>
                            <div className="flex items-center w-full mt-1">
                                <span className="h-[1px] bg-gray-400 flex-grow"></span>
                                <span className="px-3 text-[9px] tracking-[0.3em] text-gray-600 font-medium uppercase">Sweden</span>
                                <span className="h-[1px] bg-gray-400 flex-grow"></span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            link.href.startsWith('/') ? (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-gray-600 hover:text-primary transition-colors uppercase tracking-wide"
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-gray-600 hover:text-primary transition-colors uppercase tracking-wide"
                                >
                                    {link.name}
                                </a>
                            )
                        ))}
                    </nav>

                    {/* CTA Button removed per user request */}

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-900 hover:text-primary p-2"
                            aria-label={isMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg z-50">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            link.href.startsWith('/') ? (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block py-3 border-b border-gray-50 text-base font-medium text-gray-700 hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block py-3 border-b border-gray-50 text-base font-medium text-gray-700 hover:text-primary"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            )
                        ))}

                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
