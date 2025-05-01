import { NavLink,Link,useNavigate} from 'react-router-dom';
import { getToken,removeToken } from '../services/LocalStorageService';
import { useDispatch,useSelector } from 'react-redux';
import { unSetUserToken } from '../features/authSlice';
import { setUserInfo } from '../features/userSlice';
import { useGetLoggedUserQuery } from '../services/userAuthApi';
import { useState,useContext } from 'react';
import { cartContext } from '../pages/plugins/Context';
import Swal from 'sweetalert2';


const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const Navbar = () => {
  const navigate = useNavigate()
  const {access_token} = getToken()
  const dispatch=useDispatch()
  const {data,isSuccess} = useGetLoggedUserQuery(access_token)
  const { access_token1 } = useSelector(state => state.auth);
  const [search,setSearch]=useState("")
  const cartCount=useContext(cartContext)
  const handleLogout = () => {
    console.log("Logout Clicked");
    dispatch(unSetUserToken({access_token: null}))
    dispatch(setUserInfo({email:"",name:""}))
    removeToken()
    Toast.fire({
      icon: 'warning',
      title: 'Logged out successfully'
  });
    navigate('/login')
  }

  const handleSearchChange =(event)=>{
    setSearch(event.target.value)
    console.log(search);
    
  }

  const handleSearchSubmit =()=>{
    navigate(`/search?query=${search}`)
    
  }
  return (
    
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            BiteBox
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{color:'red'}}
          >Account
            <span className="navbar-toggler-icon" />
          </button>
          
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" style={{color:'red'}}  id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" >
                                    Account
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#">About Us</a></li>
                                    <li><a className="dropdown-item" href="#">Contact Us</a></li>
                                    <li><a className="dropdown-item" href="#">Blog </a></li>
                                    <li><a className="dropdown-item" href="#">Changelog</a></li>
                                    <li><a className="dropdown-item" href="#">Terms & Condition</a></li>
                                    <li><a className="dropdown-item" href="#">Cookie Policy</a></li>

                                </ul>
                            </li> */}

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link to={"/customer/account/"} className="dropdown-item">
                      <i className="fas fa-user"></i> Account
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/orders/`}>
                      <i className="fas fa-shopping-cart"></i> Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/wishlist/`}>
                      <i className="fas fa-heart"></i> Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/customer/notifications/`}
                    >
                      <i className="fas fa-bell fa-shake"></i> Notifications
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/settings/`}>
                      <i className="fas fa-gear fa-spin"></i> Settings
                    </Link>
                  </li>
                </ul>
              </li>
              { data?.id ? (

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Restaurant
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {data?.restaurant_id != null ? (
                    <>
                    <li>
                    <Link className="dropdown-item" to="/restaurant/dashboard/">
                      {" "}
                      <i className="fas fa-user"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/products/">
                      {" "}
                      <i className="bi bi-grid-fill"></i> Dishes
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/product/new/">
                      {" "}
                      <i className="fas fa-plus-circle"></i> Add Dishes
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/orders/">
                      {" "}
                      <i className="fas fa-shopping-cart"></i> Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/earning/">
                      {" "}
                      <i className="fas fa-dollar-sign"></i> Earning
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/reviews/">
                      {" "}
                      <i className="fas fa-star"></i> Reviews
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/coupon/">
                      {" "}
                      <i className="fas fa-tag"></i> Coupon
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/notifications/">
                      {" "}
                      <i className="fas fa-bell fa-shake"></i> Notifications
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/settings/">
                      {" "}
                      <i className="fas fa-gear fa-spin"></i> Settings
                    </Link>
                  </li>
                  </>
                  ):(
                    <li>
                    <Link className="dropdown-item" to="/restaurant-register">
                      {" "}
                      <i ></i> Register
                    </Link>
                  </li>
                  )}
                  
                </ul>
              </li>
              ):(
                <h1></h1>
              )}
            </ul>
            <div className="d-flex">
              <input
                onChange={handleSearchChange}
                name="search"
                className="form-control me-2"
                type="text"
                placeholder="Search"
                aria-label="Search"

              />
              <button
                onClick={handleSearchSubmit}
                className="btn btn-outline-success me-2"
                type="button"
              >
                Search
              </button>
            </div>
            {access_token ? (
  <button onClick={handleLogout} className="btn btn-danger me-2" >
    Logout
  </button>
) : (
  <>
    <Link className="btn btn-primary me-2" to="/login">Login</Link>
    <Link className="btn btn-primary me-2" to="/register">Register</Link>
  </>
)}

            <Link className="btn btn-danger" to="/cart/">
              {/* <i className="fas fa-shopping-cart"></i>{" "} */}
              <i className="fas fa-shopping-cart"></i>{" "}
              <span id="cart-total-items">{cartCount}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
