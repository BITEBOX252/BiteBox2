import React from 'react'
import { NavLink,Link,useLocation } from 'react-router-dom';
function Sidebar() {
    const location=useLocation()
    // console.log(location.pathname

    const isActiveLink=(currentPath,LinkPath)=>{
        return currentPath.includes(LinkPath)
    }
    
  return (
          
<div className="col-md-3 col-lg-2 sidebar-offcanvas bg-dark navbar-dark" id="sidebar" role="navigation" >
    <ul className="nav nav-pills flex-column mb-auto nav flex-column pl-1 pt-2">
        <li className="mb-3">
            <Link to="/restaurant/dashboard/" className={isActiveLink(location.pathname, '/restaurant/dashboard/')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-speedometer" /> Dashboard{" "}
            </Link>
        </li>
        <li className="mb-3">
            <Link to="/restaurant/dishes/" className={isActiveLink(location.pathname, '/restaurant/dishes/')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-grid" /> Dishes{" "}
            </Link>
        </li>
        <li className="mb-3">
            <Link to="/restaurant/orders/" className={isActiveLink(location.pathname, '/restaurant/orders/')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-cart-check" /> Orders{" "}
            </Link>
        </li>
        <li className="mb-3">
            <Link to="/restaurant/earnings/" className={isActiveLink(location.pathname, '/restaurant/earnings/')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-currency-dollar" /> Earning{" "}
            </Link>
        </li>
        <li className="mb-3">
            <Link to="/restaurant/reviews" className={isActiveLink(location.pathname, '/restaurant//')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-star" /> Reviews{" "}
            </Link>
        </li>
        <li className="mb-3">
            <Link to="/restaurant/add-dish/" className={isActiveLink(location.pathname, '/restaurant/add-dish/')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-plus-circle" /> Add Dish{" "}
            </Link>
        </li>

        <li className="mb-3">
            <Link to={`/vendor/coupon/`} className={isActiveLink(location.pathname, '/restaurant//')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-tag" /> Coupon &amp; Discount{" "}
            </Link>
        </li>

        <li className="mb-3">
            <Link to={`/restaurant/notifications/`} className={isActiveLink(location.pathname, '/restaurant/notifications/')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-bell" /> Notifications{" "}
            </Link>
        </li>
        <li className="mb-3">
            <Link to={`/restaurant/riders/`} className={isActiveLink(location.pathname, '/restaurant/riders/')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-bell" /> Riders{" "}
            </Link>
        </li>

        <li className="mb-3">
            <Link to="/restaurant/settings/" className={isActiveLink(location.pathname, '/restaurant/settings/')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-gear-fill" /> Settings{" "}
            </Link>
        </li>

        <li className="mb-3">
            <Link to="/logout" className={isActiveLink(location.pathname, '/restaurant//')?"nav-link text-white active":"nav-link text-white"}>
                <i className="bi bi-box-arrow-left" /> Logout{" "}
            </Link>
        </li>
    </ul>
    <hr />
</div>
  )
}

export default Sidebar