import Sidebar from './Sidebar'
import React, { useState, useEffect } from 'react'
import { Link,useParams } from 'react-router-dom';
import axios from 'axios';
import { useGetLoggedUserQuery } from '../../services/userAuthApi'
import { getToken } from '../../services/LocalStorageService'

function RestaurantStore() {
    const [restaurant,setRestaurant]=useState([])
    const [dish,setDish]=useState([])
    const param=useParams()

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/restaurant/shop/${param.slug}/`).then((res)=>{
            setRestaurant(res.data)
            console.log(res.data)
        })
        axios.get(`http://127.0.0.1:8000/api/restaurant/dishes-store/${param.slug}/`).then((res)=>{
            console.log(res.data)
            setDish(res.data)
        })
      
    }, [])
    
  return (
    <main className="mt-5">
    <div className="container">
        <section className="text-center container">
            <div className="row py-lg-5">
                <div className="col-lg-6 col-md-8 mx-auto">
                    <img src={restaurant.image} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "50%" }} alt="" />
                    <h1 className="fw-light">{restaurant.name}</h1>
                    <p className="lead text-muted">{restaurant.description}</p>
                </div>
            </div>
        </section>
        <section className="text-center">
            <h4 className="mb-4">{dish.length} Dishes </h4>
            <div className="row">
            {dish.map((item) => (
        <div className="col-lg-4 col-md-12 mb-4" key={item.id}>
          <div className="card">
            <div className="bg-image hover-zoom ripple" data-mdb-ripple-color="light">
              <a>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-100"
                  style={{ width: "100px", height: "300px", objectFit: "cover" }}
                />
              </a>
              <a href="#!">
                <div className="mask">
                  <div className="d-flex justify-content-start align-items-end h-100">
                    <h5>
                      <span className="badge badge-primary ms-2">New</span>
                    </h5>
                  </div>
                </div>
                <div className="hover-overlay">
                  <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }} />
                </div>
              </a>
            </div>
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
            </div>
          </div>
        </div>
      ))}
                {/* .map() function end here */}
            </div>
        </section>
    </div>
</main>
  )
}

export default RestaurantStore