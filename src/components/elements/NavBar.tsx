'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-lg px-6 py-4 flex items-center z-50 sticky top-0">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <Link href="/" className="flex items-center no-underline text-slate-800">
            <img src="/logo.png" alt="Percentage Increase Calculator Logo" className="w-8 h-8" />
            <span className="text-2xl font-medium ml-2">Percentage Increase Calculator</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex list-none gap-8 m-0 p-0">
              <li><Link href="/" className="no-underline text-gray-600 font-medium hover:text-blue-500 transition-colors">Home</Link></li>
              <li><Link href="/contact" className="no-underline text-gray-600 font-medium hover:text-blue-500 transition-colors">Contact</Link></li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col justify-center items-center p-2 text-gray-800 z-50 relative" 
            aria-label="Toggle mobile menu"
          >
            <span className={`block w-6 h-0.5 bg-current my-1.5 transition-all duration-300 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current my-1.5 transition-all duration-300 rounded-sm ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current my-1.5 transition-all duration-300 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={toggleMobileMenu}></div>
          
      {/* Mobile Navigation Menu */}
      <nav className={`fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <Link href="/" className="flex items-center no-underline text-slate-800">
            <div className="w-8 h-8 mr-3 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">%</span>
            </div>
            <span className="text-xl font-bold">Percentage Calculator</span>
          </Link>
          <button 
            onClick={toggleMobileMenu}
            className="text-2xl text-gray-600 p-1 hover:text-gray-800" 
            aria-label="Close mobile menu"
          >
            ×
          </button>
        </div>
        <ul className="list-none p-0 m-0">
          <li className="mb-4">
            <Link 
              href="/" 
              className="block text-gray-800 no-underline font-medium py-3 border-b border-gray-100 hover:text-blue-500 transition-colors"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
          </li>
          <li className="mb-4">
            <Link 
              href="/contact" 
              className="block text-gray-800 no-underline font-medium py-3 border-b border-gray-100 hover:text-blue-500 transition-colors"
              onClick={toggleMobileMenu}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;