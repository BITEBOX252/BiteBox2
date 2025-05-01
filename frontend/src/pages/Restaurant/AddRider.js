

import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useGetLoggedUserQuery } from '../../services/userAuthApi'
import { getToken } from '../../services/LocalStorageService'
function AddRider() {
    let { access_token } = getToken();
        const {data,isSuccess} = useGetLoggedUserQuery(access_token)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    restaurant: null
  });
useEffect(() => {
      if (data) {
          setFormData(prevState => ({
              ...prevState,
              restaurant: data.restaurant_id // ✅ Update restaurant ID once userdata is fetched
          }));
      }
  }, [data]); 
  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/restaurant/${data?.restaurant_id}/delivery-boys/`, formData);
      console.log('Rider added successfully:', res.data);
      alert('Rider added successfully');
      setFormData({ name: '', email: '', phone_number: '',restaurant: '' }); // reset form
    } catch (error) {
      console.error('Error adding rider:', error.response?.data || error.message);
      alert('Failed to add rider');
    }
  };

  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="container">
            <div className="main-body">
              <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-home">
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Rider Details</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                          <form onSubmit={handleSubmit} className="form-group">
                            <div className="row text-dark">
                              <div className="col-lg-6 mb-2">
                                <label className="mb-2">Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="col-lg-6 mb-2">
                                <label className="mb-2">Email</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                              <div className="col-lg-6 mb-2">
                                <label className="mb-2">Mobile</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="phone_number"
                                  value={formData.phone_number}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="d-flex justify-content-center mt-5 mb-5">
                              <button type="submit" className="btn btn-success w-50">
                                Add Rider <i className="fa fa-check-circle" />
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddRider;
