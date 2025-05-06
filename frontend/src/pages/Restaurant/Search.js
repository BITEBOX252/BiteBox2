import React, { useEffect, useState } from 'react';
import { Link,useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../services/LocalStorageService';

function Search() {
  const [dishes, setDishes] = useState([]);  // State for storing dishes



  const [param]=useSearchParams()
  const query=param.get('query')

  // const fetchDishes= async()=>{
  //   axios.get(`http://127.0.0.1:8000/api/store/search?query=${query}`).
  //   then(response => {
  //     setDishes(response.data);  // Set the fetched dishes
  //     console.log(response.data);
      
  //   })
  //   .catch(error => {
  //     console.error("Error fetching dishes:", error);
  //   });
  // }
  const { access_token } = getToken();

  const fetchDishes = async () => {
    
    axios.get(`http://127.0.0.1:8000/api/store/search?query=${query}`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    .then(response => {
      setDishes(response.data);
    })
    .catch(error => {
      console.error("Error fetching dishes:", error);
    });
  }
  
  useEffect(() => {
    // Fetch dishes for the restaurant
    fetchDishes()
  }, [query]);
  return (
    <div className="row">
            {dishes.map((dish, index) => (
              <div key={index} className="col-lg-4 col-md-12 mb-4">
                <div className="card">
                  <div className="bg-image hover-zoom ripple" data-mdb-ripple-color="light">
                    <Link to={`/dishdetail/${dish.slug}`}><img src={dish.image} className="w-100" /></Link>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title mb-3">{dish.title}</h5>
                    <p className="card-text">{dish.description}</p>
                    <p className="card-text">Price: {dish.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
  )
}

export default Search