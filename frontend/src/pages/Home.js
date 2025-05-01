import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { getToken } from "../services/LocalStorageService";
import { setUserToken } from "../features/authSlice";
import { useUpdateUserLocationMutation } from "../services/userAuthApi";
import { useGetLoggedUserQuery } from '../services/userAuthApi';
import { setUserInfo } from '../features/userSlice';
import axios from 'axios';
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const [restaurants, setRestaurants] = useState([]);  // State for storing nearby restaurants
  let { access_token } = getToken();
  const {data,isSuccess} = useGetLoggedUserQuery(access_token)
  const [updateUserLocation] = useUpdateUserLocationMutation();  // Mutation hook
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/store/categories/')
      .then(response => {
        setCategories(response.data);
        console.log(response.data);
          // Update categories state
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, []); 
  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }));
    if (data && isSuccess) {
      dispatch(setUserInfo({email:data.email,name:data.name}))
    }
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Send the location to the backend
        await updateUserLocation({ latitude, longitude, access_token });

        // Fetch nearby restaurants from the API
        axios.get('http://127.0.0.1:8000/api/restaurant/nearby-restaurants/', {
          headers: {
            'Authorization': `Bearer ${access_token}`
          },
          params: {
            latitude: latitude,
            longitude: longitude
          }
        })
        .then(response => {
          setRestaurants(response.data);
          console.log(response.data)  // Set the nearby restaurants
        })
        .catch(error => {
          console.error("Error fetching nearby restaurants:", error);
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    
  }, [dispatch, access_token, updateUserLocation, data, isSuccess]);
  
  return (
   
    <div>
    <main className="mt-5">
 <div className="container">
   <section className="text-center">
     <div className="row">
       {restaurants.map((r,index)=>(
         
       <div key={index} className="col-lg-4 col-md-12 mb-4">
         <div className="card">
           <div
             className="bg-image hover-zoom ripple"
             data-mdb-ripple-color="light"
           >
            <Link to={`/detail/${r.id}`}>
             <img
               src={`http://127.0.0.1:8000${r.image}`}
               className="w-100"
             />
             </Link>
             <a href="#!">
               <div className="mask">
                 <div className="d-flex justify-content-start align-items-end h-100">
                   <h5>
                     <span className="badge badge-primary ms-2">New</span>
                   </h5>
                 </div>
               </div>
               <div className="hover-overlay">
                 <div
                   className="mask"
                   style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                 />
               </div>
             </a>
           </div>
           <div className="card-body">
            <Link to={`/detail/${r.id}`} className="text-reset">

               <h5 className="card-title mb-3">{r.name}</h5>
               </Link>
             <a href="" className="text-reset">
               {/* <p>Category</p> */}
             </a>
             {/* <h6 className="mb-3">$61.99</h6> */}
             {/* <div className="btn-group">
               <button
                 className="btn btn-primary dropdown-toggle"
                 type="button"
                 id="dropdownMenuClickable"
                 data-bs-toggle="dropdown"
                 data-bs-auto-close="false"
                 aria-expanded="false"
               >
                 Variation
               </button>
               <ul
                 className="dropdown-menu"
                 aria-labelledby="dropdownMenuClickable"
               >
                 <div className="d-flex flex-column">
                   <li className="p-1">
                     <b>Size</b>: XL
                   </li>
                   <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                     <li>
                       <button className="btn btn-secondary btn-sm me-2 mb-1">
                         XXL
                       </button>
                     </li>
                     <li>
                       <button className="btn btn-secondary btn-sm me-2 mb-1">
                         XXL
                       </button>
                     </li>
                     <li>
                       <button className="btn btn-secondary btn-sm me-2 mb-1">
                         XXL
                       </button>
                     </li>
                   </div>
                 </div>
                 <div className="d-flex flex-column mt-3">
                   <li className="p-1">
                     <b>COlor</b>: Red
                   </li>
                   <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                     <li>
                       <button
                         className="btn btn-sm me-2 mb-1 p-3"
                         style={{ backgroundColor: "red" }}
                       />
                     </li>
                     <li>
                       <button
                         className="btn btn-sm me-2 mb-1 p-3"
                         style={{ backgroundColor: "green" }}
                       />
                     </li>
                     <li>
                       <button
                         className="btn btn-sm me-2 mb-1 p-3"
                         style={{ backgroundColor: "yellow" }}
                       />
                     </li>
                   </div>
                 </div>
                 <div className="d-flex mt-3 p-1">
                   <button
                     type="button"
                     className="btn btn-primary me-1 mb-1"
                   >
                     <i className="fas fa-shopping-cart" />
                   </button>
                   <button
                     type="button"
                     className="btn btn-danger px-3 me-1 mb-1 ms-2"
                   >
                     <i className="fas fa-heart" />
                   </button>
                 </div>
               </ul>
               <button
                 type="button"
                 className="btn btn-danger px-3 me-1 ms-2"
               >
                 <i className="fas fa-heart" />
               </button>
             </div> */}
           </div>
         </div>
       </div>
       ))}
       

       <div className='row'>
        {categories.map((c,index)=>(
          
         <div className="col-lg-2">
           <img src={c.image} style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} alt="" />
           <h6>{c.title}</h6>
         </div>
        ))}
         
       </div>

     </div>
   </section>
   {/*Section: Wishlist*/}
 </div>
</main>
 </div>
  );
};

export default Home;
