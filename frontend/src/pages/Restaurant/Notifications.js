import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { getToken } from "../../services/LocalStorageService";
import { useGetLoggedUserQuery } from "../../services/userAuthApi";

function Notifications() {
  let { access_token } = getToken();
  const { data, isSuccess } = useGetLoggedUserQuery(access_token);

  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState([]);
  const [notificationStats, setNotificationStats] = useState([]);
  const [seenNotification, setSeenNotifications] = useState([]);

  const fetchNoti = async () => {
    if (data?.restaurant_id) {
      
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/restaurant/notifications/${data?.restaurant_id}/`);
        setNotifications(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };
  const fetchNotiSummary = async () => {
    if (data?.restaurant_id) {
      
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/restaurant/notifications-summary/${data?.restaurant_id}/`);
        setStats(response.data[0]);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(()=>{
    fetchNoti()
    fetchNotiSummary()
  },[data?.restaurant_id])

  const handleNotificationSeenStatus = async (notiId) => {
    
      
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/restaurant/notifications-mark-as-seen/${data?.restaurant_id}/${notiId}/`);
        console.log(response.data);
        await fetchNoti()
        await fetchNotiSummary()
      } catch (error) {
        console.error('Error marking notification as seen:', error);
      }
    
  };
  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        {/* Add Sidebar Here */}
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="row mb-3">
            <div className="col-xl-4 col-lg-6 mb-2">
              <div className="card card-inverse card-success">
                <div className="card-block bg-danger p-3">
                  <div className="rotate">
                    <i className="bi bi-tag fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Un-read Notification</h6>
                  <h1 className="display-1">{stats?.unread_notifications
                  }</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-2">
              <div className="card card-inverse card-success">
                <div className="card-block bg-success p-3">
                  <div className="rotate">
                    <i className="bi bi-tag fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Read Notification</h6>
                  <h1 className="display-1">{stats?.read_notifications
                  }</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-2">
              <div className="card card-inverse card-success">
                <div className="card-block bg-primary p-3">
                  <div className="rotate">
                    <i className="bi bi-tag fa-5x" />
                  </div>
                  <h6 className="text-uppercase">All Notification</h6>
                  <h1 className="display-1">{stats?.all_notifications
                  }</h1>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row  container">
            <div className="col-lg-12">
              <h4 className="mt-3 mb-1">
                {" "}
                <i className="fas fa-bell" /> Notifications
              </h4>
              
              <table className="table">
                <thead className="table-dark">
                  <tr>
                    
                    <th scope="col">Type</th>
                    <th scope="col">Message</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((n,index)=>(

                  <tr>
                    
                    <td>New Order</td>
                    <td>
                      You've got a new order for <b>{n.order_item?.dish?.title}</b>
                    </td>
                    <td>
                      {n.seen===true && 
                      <>
                      Read <i className="fas fa-eye" />
                      </>
                      }
                      {n.seen !==true && 
                      <>
                      Unread <i className="fas fa-eye-slash" />
                      </>
                      }
                    </td>
                    <td>{n.date}</td>
                    <td>
                      <button onClick={()=>handleNotificationSeenStatus(n.id)} className="btn btn-secondary mb-1">
                        <i className="fas fa-eye" />
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
  );
}

export default Notifications;
