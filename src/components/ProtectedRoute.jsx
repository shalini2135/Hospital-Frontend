import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, isAdmin, isDoctor, isNurse, isPatient } from '../Pages/Auth/api';

const ProtectedRoute = ({ roles, redirectPath = '/', children }) => {
  if(!isAuthenticated()) {
  return <Navigate to="/login" />;
}

  if (roles) {
    const hasRequiredRole = roles.some(role => {
      switch(role) {
        case 'ROLE_ADMIN': return isAdmin();
        case 'ROLE_DOCTOR': return isDoctor();
        case 'ROLE_NURSE': return isNurse();
        case 'ROLE_PATIENT': return isPatient();
        default: return false;
      }
    });
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;