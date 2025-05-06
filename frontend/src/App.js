import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";  // Import the PrivateRoute component
import RestaurantPrivateRoute from "./components/RestaurantPrivateRoute";  // Import the PrivateRoute component
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Registration from "./pages/auth/Registration";
import UserLogin from "./pages/auth/UserLogin";
import Logout from "./pages/auth/Logout";
import ResetPassword from "./pages/auth/ResetPassword";
import SendPasswordResetEmail from "./pages/auth/SendPasswordResetEmail";
import Dashboard from "./pages/Dashboard";
import RestaurantDetail from "./pages/Restaurant/RestaurantDetail";
import DishDetail from "./pages/Restaurant/DishDetail";
import Cart from "./pages/Restaurant/Cart";
import RestaurantDashboard from "./pages/Restaurant/RestaurantDashboard";
import Dish from "./pages/Restaurant/Dish";
import Orders from "./pages/Restaurant/Orders";
import AddDish from "./pages/Restaurant/AddDish";
import UpdateDish from "./pages/Restaurant/UpdateDish";
import Register from "./pages/Restaurant/Register";
import RestaurantSettings from "./pages/Restaurant/RestaurantSettings";
import RestaurantStore from "./pages/Restaurant/RestaurantStore";
import Checkout from "./pages/Restaurant/Checkout";
import Search from "./pages/Restaurant/Search";
import { cartContext } from "./pages/plugins/Context";
import { useState,useEffect } from "react";
import CartID from "./pages/plugins/CartID"
import { getToken } from "./services/LocalStorageService";
import { useGetLoggedUserQuery } from "./services/userAuthApi";
import axios from "axios";
import Account from "./pages/Customer/Account";
import COrders from "./pages/Customer/COrders";
import COrderDetail from "./pages/Customer/COrderDetail";
import CNotifications from "./pages/Customer/CNotifications";
import Settings from "./pages/Customer/Settings";
import Notifications from "./pages/Restaurant/Notifications";
import Earnings from "./pages/Restaurant/Earnings";
import OrderDetail from "./pages/Restaurant/OrderDetail";
import CustomerLocationViewer from "./pages/Customer/CustomerLocationViewer";
import DeliveryLocationSender from "./pages/Restaurant/DeliveryLocationSender";
import ChangePassword from "./pages/auth/ChangePassword";
import ActivateAccount from "./pages/auth/ActivateAccount";
import AddRider from "./pages/Restaurant/AddRider";
import Riders from "./pages/Restaurant/Riders";
import GoogleMapPage from "./pages/GoogleMapPage";
import Reviews from "./pages/Restaurant/Reviews";
import ReviewDetail from "./pages/Restaurant/ReviewDetail";
import VoiceOrder from "./pages/Restaurant/VoiceOrder";

function App() {
  const { access_token } = useSelector(state => state.auth);
  const CartId = CartID();
    
    const { data, isSuccess } = useGetLoggedUserQuery(access_token);

const [count,setCount]=useState(0)
const [cartCount,setCartCount]=useState()

useEffect(()=>{
  console.log(data);
  
  const url = data ? `http://127.0.0.1:8000/api/store/cart-list/${CartId}/${data.id}/` : `http://127.0.0.1:8000/api/store/cart-list/${CartId}/`;
    axios.get(url)
      .then((res) => {
        console.log(res);
        setCartCount(res?.data.length);
      })
      .catch((error) => console.error("Error fetching cart data:", error));
      
})
  
  return (
    <>
    <cartContext.Provider value={[cartCount,setCartCount]}>

      <BrowserRouter>
        <Navbar/>
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<PrivateRoute element={<Home />} />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/changepassword" element={<PrivateRoute element={<ChangePassword />} />} />
          <Route path="/sendpasswordresetemail" element={<SendPasswordResetEmail />} />
          <Route path="/api/user/reset/:id/:token" element={<ResetPassword />} />
          <Route path="/restaurant-register" element={<Register />} />
          <Route path="/activate/:uid/:token" element={<ActivateAccount />} />

          <Route path="/search/" element={<Search />} />

          {/* Protected Routes */}

          <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
          <Route path="/checkout/:order_oid/" element={<PrivateRoute element={<Checkout />} />} />
         {/* <Route path="/dashboard" element={access_token ? <Dashboard /> : <Navigate to="/login" />} /> */}
         <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
         <Route path="/rider/tracking/:orderId/:trackingToken/" element={<PrivateRoute element={<DeliveryLocationSender />} />} />
        <Route path="/customer/tracking/:orderId/:trackingToken/" element={<PrivateRoute element={<CustomerLocationViewer />} />} />
        <Route path="/voice-order/" element={<PrivateRoute element={<VoiceOrder />} />} />


          {/* Vendor Protected Routes */}

          <Route path="/restaurant/dashboard" element={<RestaurantPrivateRoute element={<RestaurantDashboard />} />} />
          <Route path="/restaurant/dishes" element={<RestaurantPrivateRoute element={<Dish />} />} />
          <Route path="/restaurant/earnings" element={<RestaurantPrivateRoute element={<Earnings />} />} />
          <Route path="/restaurant/orders" element={<RestaurantPrivateRoute element={<Orders />} />} />
          <Route path="/restaurant/orders/:order_id" element={<RestaurantPrivateRoute element={<OrderDetail />} />} />
          <Route path="/restaurant/dishes" element={<RestaurantPrivateRoute element={<Dish />} />} />
          <Route path="/restaurant/notifications/" element={<RestaurantPrivateRoute element={<Notifications />} />} />
          <Route path="/restaurant/add-dish" element={<RestaurantPrivateRoute element={<AddDish />} />} />
          <Route path="/restaurant/settings" element={<RestaurantPrivateRoute element={<RestaurantSettings />} />} />
          <Route path="/restaurant/store/:slug/" element={<RestaurantPrivateRoute element={<RestaurantStore />} />} />
          <Route path="/restaurant/dish/update/:did" element={<RestaurantPrivateRoute element={<UpdateDish />} />} />
          <Route path="/restaurant/reviews" element={<RestaurantPrivateRoute element={<Reviews />} />} />
          <Route path="/restaurant/reviews/:review_id" element={<RestaurantPrivateRoute element={<ReviewDetail />} />} />
          <Route path="/restaurant/riders" element={<RestaurantPrivateRoute element={<Riders />} />} />
          <Route path="/restaurant/add-riders" element={<RestaurantPrivateRoute element={<AddRider />} />} />
          <Route path="/detail/:id" element={<PrivateRoute element={<RestaurantDetail />} />} />
          <Route path="/dishdetail/:slug" element={<PrivateRoute element={<DishDetail />} />} />

          <Route path="/customer/account/" element={<PrivateRoute element={<Account />} />} />
          <Route path="/customer/settings/" element={<PrivateRoute element={<Settings />} />} />
          <Route path="/customer/orders/" element={<PrivateRoute element={<COrders />} />} />
          <Route path="/customer/notifications/" element={<PrivateRoute element={<CNotifications />} />} />
          <Route path="/customer/orders/:order_oid/" element={<PrivateRoute element={<COrderDetail />} />} />




          {/* 404 Error Page */}
          <Route path="*" element={<h1>Error 404 - Page Not Found!</h1>} />
          <Route path="/map" element={<GoogleMapPage/>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </cartContext.Provider>
    </>
  );
}

export default App;
