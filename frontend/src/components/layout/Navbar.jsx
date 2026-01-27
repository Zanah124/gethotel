import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Hotels', path: '/search' },
    { name: 'Expérience', path: '/' },
    { name: 'About', path: '/' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  // Détermine si la navbar doit être en mode "visible sur blanc"
  const isNavbarVisible = isLoggedIn || isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between 
      px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 
      ${isNavbarVisible 
        ? "bg-white/90 shadow-md text-gray-800 backdrop-blur-md py-3 md:py-4" 
        : "py-4 md:py-6 text-white"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.hotel}
          alt="logo"
          className={`h-9 transition-all duration-300 ${isNavbarVisible ? "opacity-100" : "invert"}`}
        />
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <a
            key={i}
            href={link.path}
            className="group flex flex-col gap-0.5"
          >
            <span className="font-medium">{link.name}</span>
            <div
              className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 
                ${isNavbarVisible ? "bg-gray-800" : "bg-white"}`}
            />
          </a>
        ))}

        {/* Dashboard - visible seulement si connecté */}
        {isLoggedIn && (
          <Link to="/client/dashboard">
            <button
              className="px-6 py-2 rounded-full font-medium bg-[#861D1D] text-white hover:bg-[#681515] transition-all"
            >
              Dashboard
            </button>
          </Link>
        )}
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-6">
        <img
          src={assets.searchBlanc}
          alt="search"
          className={`h-7 transition-all duration-300 ${isNavbarVisible ? "invert" : ""}`}
        />

        {/* Login / Déconnexion */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-8 py-2.5 rounded-full font-medium bg-[#861D1D] text-white hover:bg-[#681515] transition-all"
          >
            Déconnexion
          </button>
        ) : (
          <Link to="/login">
            <button
              className={`px-8 py-2.5 rounded-full font-medium transition-all
                ${isNavbarVisible 
                  ? "bg-black text-white hover:bg-gray-800" 
                  : "bg-white text-black hover:bg-gray-100"
                }`}
            >
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuBlanc}
          alt="menu"
          className={`h-8 transition-all duration-300 ${isNavbarVisible ? "invert" : ""}`}
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col 
        items-center justify-center gap-8 font-medium text-gray-800 transition-all duration-500 
        md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="absolute top-6 right-6"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.arrowleft} alt="close" className="h-8 invert" />
        </button>

        {navLinks.map((link, i) => (
          <a
            key={i}
            href={link.path}
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl hover:text-[#861D1D] transition-colors"
          >
            {link.name}
          </a>
        ))}

        {isLoggedIn && (
          <Link to="/client/dashboard" onClick={() => setIsMenuOpen(false)}>
            <button className="text-2xl text-[#861D1D] font-bold">
              Dashboard
            </button>
          </Link>
        )}

        {isLoggedIn ? (
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="bg-[#861D1D] text-white px-10 py-4 rounded-full text-xl hover:bg-[#681515]"
          >
            Déconnexion
          </button>
        ) : (
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>
            <button className="bg-black text-white px-10 py-4 rounded-full text-xl hover:bg-gray-800">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;