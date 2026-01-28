import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider} from './context/AuthProvider';
import { useAuth } from './context/useAuth';


// Navbars
import Navbar from './components/layout/Navbar';
import NavbarAdmin from './components/layout/NavbarAdmin.jsx';
import NavbarSuper from './components/layout/NavbarSuper.jsx';
import NavbarEmployeeHorizontal from './components/layout/NavbarEmployeeHorizontal.jsx';

// Pages public
import Home from './pages/client/Home';
import SearchHotels from './pages/client/SearchHotels';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Pages client
import ClientDashboard from './pages/client/ClientDashboard.jsx';
import MyReservations from './pages/client/MyReservations.jsx';

//Pages employee
import Stock from './pages/employee/stock.jsx';
import EmployeeReservations from './pages/employee/EmployeeReservations.jsx';
import AddProduitModal from './components/stock/AddProduitModal.jsx';
import MouvementModal from './components/stock/MouvementModal.jsx';
import CategorieModal from './components/stock/CategorieModal.jsx';
import EmployeeChambresDashboard from './components/employees/EmployeeChambresDashboard.jsx';

// pages admin
import Dashboard from './pages/admin/Dashboard.jsx';
import EditHotelProfile from './components/admin/EditHotelProfile.jsx';
import Hotels from './pages/admin/Hotels.jsx';
import Employee from './pages/admin/Employee.jsx';
import AddEmployeeForm from './components/admin/AddEmployeeForm.jsx';
import EditEmployeeForm from './components/admin/EditEmployeeForm.jsx';
import TypeChambreManager from './components/chambres/TypeChambreManager.jsx';
import ChambresDashboard from './components/admin/ChambresDashboard.jsx';
import AddChambreForm from './components/admin/AddChambreForm.jsx';
import EditChambreForm from './components/admin/EditChambreForm.jsx';
import StockDashboard from './pages/admin/StockDashboard.jsx';


// pages superadmin
import { SuperAdminRoute } from './components/superadmin/ProtectedRoute.jsx';
import MenuSuper from './pages/superadmin/MenuSuper.jsx';
import HotelsG from './pages/superadmin/HotelsG.jsx';
import CreateHotel from './components/superadmin/CreateHotel.jsx';
import UsersSuper from './pages/superadmin/UsersSuper.jsx';


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
  const isEmployeePath = path.startsWith('/employee');

  let ActiveNavbar = Navbar;

  if (isAuthPage) {
    ActiveNavbar = () => null;
  } else if (isSuperPath && (user?.role === 'super_admin' || user?.role === 'superadmin')) {
    ActiveNavbar = NavbarSuper;
  } else if (isAdminPath && ['admin', 'admin_hotel'].includes(user?.role)) {
    ActiveNavbar = NavbarAdmin;
  } else if (isEmployeePath && ['employee'].includes(user?.role)) {
    ActiveNavbar = NavbarEmployeeHorizontal;
  }

  return (
    <div>
      <ActiveNavbar />

      <div className="min-h-[70vh]">
        <Routes>
          {/* public */}
          <Route path="/" element={<Home />} />
          {<Route path="/search" element={<SearchHotels />} />}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Client */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/my-reservations" element={<MyReservations />} />

          {/* Employee hôtel */}
          <Route path="/employee/stock" element={<Stock />} />
          <Route path="/employee/reservations" element={<EmployeeReservations />} />
          <Route path="/employee/stock/create" element={<AddProduitModal />} />
          <Route path="/employee/stock/mouvements" element={<MouvementModal />} />
          <Route path="/employee/stock/categories" element={<CategorieModal />} />
          <Route path="/employee/chambres" element={<EmployeeChambresDashboard />} />

          {/* Admin hôtel */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/hotels" element={<Hotels />} />
          <Route path="/admin/hotel/edit" element={<EditHotelProfile />} />
          <Route path="/admin/employees" element={<Employee />} />
          <Route path="/admin/employees/add" element={<AddEmployeeForm />} />
          <Route path="/admin/employees/edit/:id" element={<EditEmployeeForm />} />
          <Route path="/admin/types-chambre" element={<TypeChambreManager />} />
          <Route path="/admin/chambres" element={<ChambresDashboard />} />
          <Route path="/admin/chambres/add" element={<AddChambreForm />} />
          <Route path="/admin/chambres/edit/:id" element={<EditChambreForm />} />
          <Route path="/admin/stock" element={<StockDashboard />} />

          {/* Super Admin → tout sous /super */}
          <Route
            path="/super/*"
            element={
              <SuperAdminRoute>
                <div className="max-w-7xl mx-auto px-4 py-8">
                <Routes>
                    <Route index element={<MenuSuper />} />
                    <Route path="dashboard" element={<MenuSuper />} />
                    <Route path="hotels" element={<HotelsG />} />
                    <Route path="hotels/create" element={<CreateHotel />} />
                    <Route path="users" element={<UsersSuper />} />
                </Routes>
                </div>
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