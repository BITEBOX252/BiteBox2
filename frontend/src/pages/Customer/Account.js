import axios from 'axios';
import React from 'react'
import { useEffect,useState } from 'react';
import { getToken } from "../../services/LocalStorageService";
import { useGetLoggedUserQuery } from "../../services/userAuthApi";
import Sidebar from './Sidebar'

function Account() {
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
    
<main className="mt-5">
  <div className="container">
    <section className="">
      <div className="row">
        <Sidebar/>
        <div className="col-lg-9 mt-1">
          <main className="mb-5" style={{}}>
            <div className="container px-4">
              <section className=""></section>
              <section className="">
                <div className="row rounded shadow p-3">
                  <h2>Hi {profile.full_name}, </h2>
                  <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                    From your account dashboard. you can easily check &amp;
                    view your <a href="">orders</a>, manage your{" "}
                    
                    <a href="">Account</a>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</main>

  )
}

export default Account