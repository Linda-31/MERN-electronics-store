import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/admin/UserListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ContactScreen from './screens/ContactScreen';
import ShopScreen from './screens/ShopScreen';
import ProductAddScreen from './screens/admin/ProductAddScreen';
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminSummaryScreen from './screens/admin/AdminSummaryScreen';
import ContactListScreen from './screens/admin/ContactListScreen';
import BlogListScreen from './screens/admin/BlogListScreen';
import BlogEditScreen from './screens/admin/BlogEditScreen';
import SubscriberListScreen from './screens/admin/SubscriberListScreen';
import ProfileScreen from './screens/ProfileScreen';
import AboutScreen from './screens/AboutScreen';
import NotFoundScreen from './screens/NotFoundScreen';
import BlogScreen from './screens/BlogScreen';
import BlogDetailScreen from './screens/BlogDetailScreen';
import WishlistScreen from './screens/WishlistScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style/toastStyles.css';

const App = () => {
  return (
    <Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <MainLayout />
    </Router>
  );
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const isAdminPath = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Header />}
      <main>
        <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/product/:id' element={<ProductScreen />} />
          <Route path='/cart' element={<CartScreen />} />
          <Route path='/login' element={<Container><LoginScreen /></Container>} />
          <Route path='/register' element={<Container><RegisterScreen /></Container>} />
          <Route path='/shipping' element={<Container><ShippingScreen /></Container>} />
          <Route path='/payment' element={<Container><PaymentScreen /></Container>} />
          <Route path='/placeorder' element={<Container><PlaceOrderScreen /></Container>} />
          <Route path='/order/:id' element={<Container><OrderScreen /></Container>} />
          <Route path='/payment/success/:orderId' element={<PaymentSuccessScreen />} />

          {/* Admin Routes */}
          <Route path='/admin' element={<AdminDashboardScreen />}>
            <Route path='dashboard' element={<AdminSummaryScreen />} />
            <Route path='userlist' element={<UserListScreen />} />
            <Route path='productlist' element={<ProductListScreen />} />
            <Route path='product/:id/edit' element={<ProductEditScreen />} />
            <Route path='user/:id/edit' element={<UserEditScreen />} />
            <Route path='orderlist' element={<OrderListScreen />} />
            <Route path='product/add' element={<ProductAddScreen />} />
            <Route path='contactlist' element={<ContactListScreen />} />
            <Route path='subscriberlist' element={<SubscriberListScreen />} />
            <Route path='bloglist' element={<BlogListScreen />} />
            <Route path='blog/:id/edit' element={<BlogEditScreen />} />
          </Route>

          <Route path='/contact' element={<ContactScreen />} />
          <Route path='/shop' element={<ShopScreen />} />
          <Route path='/blog' element={<BlogScreen />} />
          <Route path='/blog/:id' element={<BlogDetailScreen />} />
          <Route path='/profile' element={<Container><ProfileScreen /></Container>} />
          <Route path='/about' element={<AboutScreen />} />
          <Route path='/wishlist' element={<WishlistScreen />} />
          <Route path='*' element={<NotFoundScreen />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </>
  );
};

export default App;
