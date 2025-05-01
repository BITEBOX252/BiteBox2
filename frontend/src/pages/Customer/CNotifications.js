import {useState,useEffect} from 'react'
import Sidebar from './Sidebar'
import { getToken } from "../../services/LocalStorageService";
import { useGetLoggedUserQuery } from "../../services/userAuthApi";
import axios from 'axios';
function CNotifications() {

    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
let { access_token } = getToken();
      const { data, isSuccess } = useGetLoggedUserQuery(access_token);
    

    useEffect(() => {
        if(data?.id){

        }
        axios.get(`http://127.0.0.1:8000/api/customer/notifications/${data?.id}/`).then((res) => {
            setNotifications(res.data);
            
        })
    }, [data?.id])
  return (
    <main className="mt-5">
  <div className="container">
    <section className="">
      <div className="row">
        {/* Sidebar Here */}
        <Sidebar/>
        <div className="col-lg-9 mt-1">
          <section className="">
            <main className="mb-5" style={{}}>
              <div className="container px-4">
                <section className="">
                  <h3 className="mb-3">
                    <i className="fas fa-bell" /> Notifications{" "}
                  </h3>
                  <div className="list-group">
                    {notifications.map((n,index)=>(

                    <a
                      href="#"
                      className="list-group-item list-group-item-action active"
                      aria-current="true"
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">Order Confirmed</h5>
                        <small>{n.date}</small>
                      </div>
                      <p className="mb-1">
                        Your order has been confirmed.
                      </p>
                    </a>
                    ))}
                    {notifications.length < 1 &&
                                                        <h3>No notifications yet</h3>
                                                    }
                  </div>
                </section>
              </div>
            </main>
          </section>
        </div>
      </div>
    </section>
  </div>
</main>

  )
}

export default CNotifications