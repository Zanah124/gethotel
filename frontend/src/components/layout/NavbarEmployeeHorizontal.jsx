import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  LogOut, 
  Calendar, 
  Bed, 
  CheckCircle, 
  XCircle,
  Package // Icône pour le stock
} from 'lucide-react';

const NavbarEmployeeHorizontal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupération du nom depuis le localStorage (ou JWT décodé)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
 
  // Déconnexion propre
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optionnel : sessionStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Réservations', icon: Calendar, path: '/employee/reservations' },
    { name: 'Check-in', icon: CheckCircle, path: '/employee/checkin' },
    { name: 'Check-out', icon: XCircle, path: '/employee/checkout' },
    { name: 'Chambres', icon: Bed, path: '/employee/chambres' },
    { name: 'Stock', icon: Package, path: '/employee/stock' },
    { name: 'Planning', icon: Calendar, path: '/employee/planning' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="bg-[#081F5C] text-white shadow-2xl fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* Logo + Menu principal */}
          <div className="flex items-center space-x-8">
            <Link to="/employee/dashboard" className="flex items-center space-x-3">
              <div className="text-3xl font-black tracking-tight">
                <span className="text-[#861D1D]">G</span>et
                <span className="text-white">Hotel</span>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium transition-all duration-300
                      ${isActive(item.path)
                        ? 'bg-[#861D1D] text-white shadow-lg scale-105'
                        : 'hover:bg-white/10 text-gray-200 hover:text-white'
                      }`}
                  >
                    <Icon size={19} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Droite : Notifications + Profil + Déconnexion */}
          <div className="flex items-center space-x-5">

            {/* Notifications */}
            <button className="relative p-2.5 rounded-lg hover:bg-white/10 transition">
              <Bell size={23} />
              <span className="absolute -top-1 -right-1 bg-[#861D1D] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                5
              </span>
            </button>

            {/* Profil */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-bold">{user?.nom || user?.prenom || 'Employé'}</p>
                <p className="text-xs text-gray-300">Hôtel {user?.hotel_nom || ''}</p>
              </div>
              <div className="w-11 h-11 bg-[#861D1D] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {(user?.prenom || user?.nom || 'E').charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-lg hover:bg-red-900/40 transition group"
              title="Déconnexion"
            >
              <LogOut size={22} className="group-hover:scale-110 transition" />
            </button>
          </div>
        </div>

        {/* Menu Mobile (horizontal scrollable) */}
        <nav className="md:hidden flex overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide border-t border-white/10 mt-1 pt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center min-w-fit px-5 py-2 rounded-lg mx-1 transition-all
                  ${isActive(item.path) 
                    ? 'text-[#861D1D] bg-white/10' 
                    : 'text-gray-300 hover:text-white'
                  }`}
              >
                <Icon size={22} />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default NavbarEmployeeHorizontal;