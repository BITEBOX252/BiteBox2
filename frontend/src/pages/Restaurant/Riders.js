import {useState,useEffect} from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2'
import { useGetLoggedUserQuery } from '../../services/userAuthApi'
import { getToken } from '../../services/LocalStorageService'

function Riders() {
    let { access_token } = getToken();
    const {data,isSuccess} = useGetLoggedUserQuery(access_token)

    const [riders,setRiders]=useState([]);
    useEffect(() => {
      const res=axios.get(`http://127.0.0.1:8000/api/restaurant/${data?.restaurant_id}/delivery-boys/`).then((res) => {
        setRiders(res.data)
        console.log(res.data);
        
      })
    }, [])
    const handleDeleteRider= async (riderid)=>{
            const result = await Swal.fire({
              icon: 'warning',
              title: 'Delete Rider?',
              text: 'Are you sure you want to permanently delete this rider?',
              confirmButtonText: 'Yes, delete it!',
              showCancelButton: true,
          });
    
          // Check if the user confirmed the deletion
          if (result.isConfirmed) {
              // Make an asynchronous request to delete the product using apiInstance
              await axios.delete(`http://127.0.0.1:8000/api/restaurant/${data?.restaurant_id}/delivery-boys/${riderid}/`)
              await axios.get(`http://127.0.0.1:8000/api/restaurant/${data?.restaurant_id}/delivery-boys/`).
                  then((res) => {
                    setRiders(res.data);
                    console.log(res.data);
                  })
              Swal.fire({
                  icon: 'success',
                  title: 'Rider Deleted!',
                  text: 'This Rider has now been deleted forever.',
              });
              // Resolve the promise if deletion is successful
              // In the context of a Promise, resolving means that the asynchronous operation or task has completed successfully.
              
            }else if (result.isDenied) {
              // Display an error notification using SweetAlert if the user denies the deletion
              Swal.fire({
                  icon: 'error',
                  title: 'An Error Occurred',
                  text: 'An error occurred while deleting the rider. Please try again later.',
              });
              
          }
            
          }
    
  return (
    <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">

        
        <Sidebar/>
        <div className="col-md-9 col-lg-10 main mt-4">
      <div className="container">
        <div className="main-body">
          <div className="tab-content" id="pills-tabContent">
          <div className="row rounded shadow p-3">
          <Link to={'/restaurant/add-riders/'} className="btn btn-success mt-2 mb-5 ms-auto d-block w-auto">
                  Add Rider <i className="fa fa-plus" />{" "}
                </Link>
                    <div className="col-lg-12 mb-4 mb-lg-0">
                      <table className="table align-middle mb-0 bg-white">
                        <thead className="table-dark">
                          <tr>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          
                        {riders?.map((r,index)=>(

                          <tr >
                            <td>
                              <div className="d-flex align-items-center">
                                
                                <p className="text-muted mb-0">
                                  {r.name}
                                </p>
                              </div>
                            </td>
                            <td>
                              <p className="fw-normal mb-1">{r.phone_number}</p>
                            </td>
                            <td>
                        
                                <select
                                    className="form-select"
                                    value={r.status}
                                    onChange={async (e) => {
                                      const newStatus = e.target.value;
                                      try {
                                        await axios.patch(`http://127.0.0.1:8000/api/restaurant/${data?.restaurant_id}/delivery-boys/${r.id}/`, {
                                          status: newStatus
                                        });
                                        setRiders((prevRiders) =>
                                            prevRiders.map((rider) =>
                                            rider.id === r.id ? { ...rider, status: newStatus } : rider
                                          )
                                        );
                                      } catch (error) {
                                        console.error("Error updating order status:", error);
                                      }
                                    }}
                                  >
                                    <option value="available">Available</option>
                                <option value="in delivery">In Delivery</option>
                                
                                  </select>
                              
                            </td>
                            <td>
                                
                                                             <button onClick={()=>handleDeleteRider(r.id)} className="btn btn-danger mb-1 me-2">
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
        </div>
        </div>
                  </div>
    </div>
  )
}

export default Riders