import { useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import { useDispatch } from '../../services/store';
import { authCheck, checkUserAuth } from '../../services/slices/userSlice';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';
import {
  Feed,
  Login,
  ConstructorPage,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();

  const closeModal = useCallback(() => navigate(-1), [navigate]);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkUserAuth()).finally(() => dispatch(authCheck()));
  }, [dispatch]);

  const renderModalRoutes = () => (
    <Routes>
      <Route
        path='/feed/:number'
        element={
          <Modal title='' onClose={closeModal}>
            <OrderInfo />
          </Modal>
        }
      />
      <Route
        path='/ingredients/:id'
        element={
          <Modal title='Детали ингридиента' onClose={closeModal}>
            <IngredientDetails />
          </Modal>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <Modal title='' onClose={closeModal}>
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          </Modal>
        }
      />
    </Routes>
  );

  const renderMainRoutes = () => (
    <Routes location={backgroundLocation || location}>
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/ingredients/:id' element={<IngredientDetails />} />
      <Route path='/feed' element={<Feed />} />
      <Route path='/feed/:number' element={<OrderInfo />} />
      <Route
        path='/login'
        element={
          <ProtectedRoute onlyUnAuth>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path='/register'
        element={
          <ProtectedRoute onlyUnAuth>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <ProtectedRoute onlyUnAuth>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/reset-password'
        element={
          <ProtectedRoute onlyUnAuth>
            <ResetPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile/orders'
        element={
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <ProtectedRoute>
            <OrderInfo />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<NotFound404 />} />
    </Routes>
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      {renderMainRoutes()}
      {backgroundLocation && renderModalRoutes()}
    </div>
  );
};

export default App;
