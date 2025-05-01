// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const PrivateRoute = ({ element }) => {
//     const { access_token } = useSelector(state => state.auth);

//     return access_token ? element : <Navigate to="/login" />;
// };

// export default PrivateRoute;

// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const PrivateRoute = ({ element }) => {
//   const access_token = useSelector(state => state.auth.access_token) || localStorage.getItem("access_token");

//   return access_token ? element : <Navigate to="/login" />;
// };

// export default PrivateRoute;


// src/components/CustomerPrivateRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetLoggedUserQuery } from '../services/userAuthApi';

const CustomerPrivateRoute = ({ element }) => {
  const access_token = useSelector(state => state.auth.access_token) || localStorage.getItem("access_token");
  const { data, isLoading, isSuccess } = useGetLoggedUserQuery(access_token);

  if (!access_token) return <Navigate to="/login" />;
  if (isLoading) return <div>Loading...</div>;

  // If user is a restaurant owner, redirect them away
  if (isSuccess && data?.restaurant_id !== null) {
    return <Navigate to="/restaurant/dashboard" />;
  }

  return element;
};

export default CustomerPrivateRoute;


