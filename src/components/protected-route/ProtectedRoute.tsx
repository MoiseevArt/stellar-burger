import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Login } from '@pages';
import { TProtectedRouteProps } from './type';

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: TProtectedRouteProps) => {
  const { isAuthChecked, user } = useSelector((state) => state.userData);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Login />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to='/' />;
  }

  return children || <Outlet />;
};
