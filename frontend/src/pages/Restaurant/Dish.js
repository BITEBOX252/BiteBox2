import React from 'react'
import Sidebar from './Sidebar'
import { useEffect,useState } from 'react';

import axios from 'axios';
import { useGetLoggedUserQuery } from '../../services/userAuthApi'
import { getToken } from '../../services/LocalStorageService'
import { Link } from 'react-router-dom'

import Swal from 'sweetalert2'





function Dish() {
    const [dishes,setDishes]=useState([])
    let { access_token } = getToken();
    const {data,isSuccess} = useGetLoggedUserQuery(access_token)
    useEffect(() => {
        if (data?.restaurant_id) {  // ✅ Ensure restaurant_id exists before making API call
          
            axios.get(`http://127.0.0.1:8000/api/restaurant/dishes/${data.restaurant_id}/`).
            then((res) => {
              setDishes(res.data);
              console.log(res.data);
            })
            .catch((err) => {
              console.error("Error fetching stats:", err);
            });
        }
      }, [data]); // ✅ useEffect will re-run when `data` changes

      const handleDeleteDish= async (dishdid)=>{
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Delete Dish?',
          text: 'Are you sure you want to permanently delete this dish?',
          confirmButtonText: 'Yes, delete it!',
          showCancelButton: true,
      });

      // Check if the user confirmed the deletion
      if (result.isConfirmed) {
          // Make an asynchronous request to delete the product using apiInstance
          await axios.delete(`http://127.0.0.1:8000/api/restaurant/delete-dish/${data.restaurant_id}/${dishdid}/`)
          await axios.get(`http://127.0.0.1:8000/api/restaurant/dishes/${data.restaurant_id}/`).
              then((res) => {
                setDishes(res.data);
                console.log(res.data);
              })
          Swal.fire({
              icon: 'success',
              title: 'Dish Deleted!',
              text: 'This dish has now been deleted forever.',
          });
          // Resolve the promise if deletion is successful
          // In the context of a Promise, resolving means that the asynchronous operation or task has completed successfully.
          
        }else if (result.isDenied) {
          // Display an error notification using SweetAlert if the user denies the deletion
          Swal.fire({
              icon: 'error',
              title: 'An Error Occurred',
              text: 'An error occurred while deleting the dish. Please try again later.',
          });
          
      }
        
      }
  return (
    <div className="container-fluid" id="main">
  <div className="row row-offcanvas row-offcanvas-left h-100">
    <Sidebar/>
    <div className="col-md-9 col-lg-10 main mt-4">
      <div className="row mb-3 container">
        <h4>
          <i className="bi bi-grid" /> All Dishes
        </h4>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter <i className="fas fa-sliders" />
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <a className="dropdown-item" href="#">
                Status: Live
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Status: In-active
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Status: In-review
              </a>
            </li>
            <hr />
            <li>
              <a className="dropdown-item" href="#">
                Date: Latest
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Date: Oldest
              </a>
            </li>
          </ul>
        </div>
     <table className="table">
                       <thead className="table-dark">
                         <tr>
                           <th scope="col">Image</th>
                           <th scope="col">Name</th>
                           <th scope="col">Price</th>
                           <th scope="col">Quantity</th>
                           <th scope="col">Orders</th>
                           <th scope="col">Status</th>
                           <th scope="col">Action</th>
                         </tr>
                       </thead>
                       <tbody>
                         {dishes?.map((d,index)=>(
     
                         <tr key={index}>
                           <th scope="row">
                             <img src=
                             {d.image} style={{width:"100px",height:"60px",objectFit:"cover",borderRadius:"10px"}} /></th>
                           <td>{d.title}</td>
                           <td>Rs.{d.price}</td>
                           <td>{d.stock_qty}</td>
                           <td>{d.orders}</td>
                           <td>{d.status}</td>
                           <td>
                             <Link to="" className="btn btn-primary mb-1 me-2">
                               <i className="fas fa-eye" />
                             </Link>
                             <Link to={`/restaurant/dish/update/${d.did}/`} className="btn btn-success mb-1 me-2">
                               <i className="fas fa-edit" />
                             </Link>
                             <button onClick={()=>handleDeleteDish(d.did)} className="btn btn-danger mb-1 me-2">
                               <i className="fas fa-trash" />
                             </button>
                           </td>
                         </tr>
                         ))}
                         
                       </tbody>
                     </table>
      </div>
    </div>
  </div>
</div>

  )
}

export default Dish