import axios from 'axios';
import React from 'react'
import { useEffect,useState } from 'react';
import { getToken } from "../../services/LocalStorageService";
import { useGetLoggedUserQuery } from "../../services/userAuthApi";
import { Link,useNavigate } from "react-router-dom";

function Sidebar() {
    let { access_token } = getToken();
  const { data, isSuccess } = useGetLoggedUserQuery(access_token);
    let [loading, setLoading] = useState(true);
    let [profile, setProfile] = useState({});

    useEffect(() => {
        // if (data) {
        //     setLoading(false)
        // }
        if (data?.id) {
            
            axios.get(`http://127.0.0.1:8000/api/user/account/${data?.id}/`).then((res)=>{
                console.log(res);
                setProfile(res.data)
            })
        }
    },[data?.id])

  return (
    <div className="col-lg-3">
          <div className="d-flex justify-content-center align-items-center flex-column mb-4 shadow rounded-3">
            <img
              src={profile.image}
              style={{ width: 120 }}
              alt=""
            />
            <div className="text-center">
              <h3 className="mb-0">{profile.full_name}</h3>
              <p className="mt-0">
                <a href="">Edit Account</a>
              </p>
            </div>
          </div>
          <ol className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">
                    <Link to={'/customer/account/'}>
                    
                    Account
                    </Link>
                    </div>
              </div>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">
                <Link to={`/customer/orders/`}>
                    
                    Orders
                    </Link>
                    </div>
              </div>
              <span className="badge bg-primary rounded-pill"></span>
            </li>
            
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <Link to={"/customer/notifications/"} className="fw-bold">Notification</Link>
              </div>
              <span className="badge bg-primary rounded-pill"></span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold"> <Link to={`/customer/settings/`}>
                    
                    Settings
                    </Link></div>
              </div>
              
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
                <Link to={'/changepassword'}  className="fw-bold">Change Password</Link>
              </div>
            </li>
          </ol>
        </div>
  )
}

export default Sidebar