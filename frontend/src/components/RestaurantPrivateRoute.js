import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetLoggedUserQuery } from '../services/userAuthApi';

const RestaurantPrivateRoute = ({ element }) => {
  const access_token = useSelector(state => state.auth.access_token) || localStorage.getItem("access_token");
  const { data, isLoading, isSuccess } = useGetLoggedUserQuery(access_token);

  // If there's no access_token, immediately redirect to login
  if (!access_token) {
    return <Navigate to="/login" />;
  }

  // Always call the hook unconditionally

  // If data is still loading, show a loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user data is fetched successfully, check if restaurant_id is null
  if (isSuccess && data?.restaurant_id === null) {
    return <Navigate to="/" />;
  }

  // Render the element passed as prop if everything is fine
  return element;
};

export default RestaurantPrivateRoute;
