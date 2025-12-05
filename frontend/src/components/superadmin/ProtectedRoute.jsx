import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export const SuperAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#7238D4]"></div>
      </div>
    );
  }

  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'superadmin';
  
  if (!user || !isSuperAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default SuperAdminRoute;