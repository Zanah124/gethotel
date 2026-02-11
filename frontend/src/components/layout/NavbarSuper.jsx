import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Hotel,
  FileText,
  BarChart3,
  CalendarCheck
} from 'lucide-react';

const NavbarSuper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/super/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/super/hotels', label: 'Hôtels', icon: Hotel },
    { path: '/super/users', label: 'Utilisateurs', icon: Users },
    { path: '/super/subscriptions', label: 'Planning Abonnements', icon: CalendarCheck },
    { path: '/super/analytics', label: 'Statistiques', icon: BarChart3 },
    { path: '/super/settings', label: 'Paramètres', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Navbar fixe */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-r from-[#0000FF] to-[#000080]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Nom */}
            <div className="flex items-center">
              <Link to="/super/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <Building2 className="w-7 h-7 text-[#7238D4]" />
                </div>
                <span className={`font-bold text-2xl ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                  GetHotel Admin
                </span>
              </Link>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      active
                        ? 'bg-white text-[#7238D4] shadow-md font-semibold'
                        : isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/90 hover:bg-white/20'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Bouton Déconnexion + Menu Mobile */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className={`hidden lg:flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all ${
                  isScrolled
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <LogOut size={18} />
                Déconnexion
              </button>

              {/* Bouton Menu Mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2"
              >
                {isMenuOpen ? (
                  <X className={isScrolled ? 'text-gray-900' : 'text-white'} size={28} />
                ) : (
                  <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} size={28} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      active ? 'bg-[#7238D4] text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Espace pour éviter que le contenu soit caché sous la navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default NavbarSuper;