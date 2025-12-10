import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets.js';

const NavbarAdmin = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Hôtels', path: '/admin/hotels' },
    { name: 'Employés', path: '/admin/employees' },
    { name: 'Réservations', path: '/admin/reservations' },
    { name: 'Stock', path: '/admin/stock' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 shadow-lg backdrop-blur-md'
          : 'bg-gradient-to-r from-[#49B9FF] to-[#99f6e4]'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-20 h-20 md:h-24">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center">
          <img
            src={assets.hotel}
            alt="logo"
            className="h-10 md:h-12 transition-all"
          />
          <span className="ml-3 text-xl md:text-2xl font-bold text-white drop-shadow-md">
            Admin
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative font-medium transition-all pb-1 ${
                isActive(link.path)
                  ? 'text-white'
                  : isScrolled
                  ? 'text-gray-700 hover:text-gray-900'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Bouton Déconnexion */}
        <div className="hidden lg:block">
          <Link to="/login">
            <button className="px-6 py-3 bg-white text-[#49B9FF] font-bold rounded-full hover:bg-gray-100 transition shadow-md">
              Déconnexion
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-xl">
          <div className="px-6 py-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-lg font-medium ${isActive(link.path) ? 'text-[#49B9FF]' : 'text-gray-700'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full py-4 bg-[#49B9FF] text-white font-bold rounded-xl">
                Déconnexion
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarAdmin;