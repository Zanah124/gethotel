// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider} from './context/AuthProvider';
import { useAuth } from './context/useAuth';


// Navbars
import Navbar from './components/layout/Navbar';
import NavbarAdmin from './components/layout/NavbarAdmin.jsx';
import NavbarSuper from './components/layout/NavbarSuper.jsx';

// Pages public 
import Home from './pages/client/Home';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// pages admin
import Dashboard from './pages/admin/Dashboard.jsx';
import EditHotelProfile from './components/admin/EditHotelProfile.jsx';
import Hotels from './pages/admin/Hotels.jsx';

// pages superadmin
import { SuperAdminRoute } from './components/superadmin/ProtectedRoute.jsx';
import MenuSuper from './pages/superadmin/MenuSuper.jsx';

const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#7238D4]"></div>
      </div>
    );
  }

  const path = location.pathname;
  const isAuthPage = ['/login', '/register'].includes(path);
  const isSuperPath = path.startsWith('/super');
  const isAdminPath = path.startsWith('/admin');

  let ActiveNavbar = Navbar;

  if (isAuthPage) {
    ActiveNavbar = () => null;
  } else if (isSuperPath && (user?.role === 'super_admin' || user?.role === 'superadmin')) {
    ActiveNavbar = NavbarSuper;
  } else if (isAdminPath && ['admin', 'admin_hotel'].includes(user?.role)) {
    ActiveNavbar = NavbarAdmin;
  }

  return (
    <div>
      <ActiveNavbar />

      <div className="min-h-[70vh]">
        <Routes>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin hôtel */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/hotels" element={<Hotels />} />
          <Route path="/admin/hotel/edit" element={<EditHotelProfile />} />

          {/* Super Admin → tout sous /super */}
          <Route
            path="/super/*"
            element={
              <SuperAdminRoute>
                <MenuSuper />
              </SuperAdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;