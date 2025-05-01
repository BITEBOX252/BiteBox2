import {useState,useEffect} from 'react'
import Sidebar from './Sidebar'
import { getToken } from "../../services/LocalStorageService";
import { useGetLoggedUserQuery } from "../../services/userAuthApi";
import axios from 'axios';
import Swal from 'sweetalert2'

function Settings() {
    
    const [profileData, setProfileData] = useState({
        'full_name': '',
        'mobile': '',
        'email': '',
        'about': '',
        'country': '',
        'city': '',
        'state': '',
        'address': '',
        'image': '',
    });
    let { access_token } = getToken();
    const { data, isSuccess } = useGetLoggedUserQuery(access_token);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Fetch existing profile data
        
        const fetchProfileData = async () => {
            if (data?.id) {
            
                try {
                    axios.get(`http://127.0.0.1:8000/api/user/account/${data?.id}/`).then((res) => {
                        console.log(res.data);
                        setProfileData(res.data)
                        // setProfileData({
                        //     'full_name': res.data?.full_name,
                        //     'email': res.data.user.email,
                        //     'phone': res.data.user.phone,
                        //     'about': res.data.about,
                        //     'country': res.data.country,
                        //     'city': res.data.city,
                        //     'state': res.data.state,
                        //     'address': res.data.address,
                        //     'p_image': res.data.image,
                        // })
                    })
                } catch (error) {
                    console.error('Error fetching profile data: ', error);
                }
            }
        };

        fetchProfileData();
    }, [data?.id]);


    const handleInputChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value
        })
    };

    const handleFileChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.files[0]
        })
    }


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const res = await axios.get(`http://127.0.0.1:8000/api/user/account/${data?.id}/`);

        const formData = new FormData();
        if (profileData.image && profileData.image !== res.data.image) {
            formData.append('image', profileData.image);
        }
        formData.append('full_name', profileData.full_name);
        formData.append('city', profileData.city);
        formData.append('address', profileData.address);

        try {
            await axios.patch(`http://127.0.0.1:8000/api/user/account/${data?.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            Swal.fire({
              icon: 'success',
              title: "Profile updated successfully",
          })
            setLoading(false)

        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };
  return (
    <main className="mt-5">
  <div className="container">
    <section className="">
      <div className="row">
        {/* <Sidebar /> */}
        <Sidebar/>
        <div className="col-lg-9 mt-1">
          <section className="">
            <main className="mb-5" style={{}}>
              <div className="container px-4">
                <section className="">
                  <h3 className="mb-3">
                    {" "}
                    <i className="fas fa-gear fa-spin" /> Settings{" "}
                  </h3>
                  <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                    <div className="row">
                    <div className="col-lg-12 mb-4">
                                                            <label
                                                                htmlFor="exampleInputEmail1"
                                                                className="form-label"
                                                            >
                                                                Profile Image
                                                            </label>
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                aria-describedby="emailHelp"
                                                                onChange={handleFileChange}
                                                                name='image'
                                                            />
                                                        </div>
                      <div className="col-lg-12">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          aria-describedby="emailHelp"
                          value={profileData.full_name}
                          onChange={handleInputChange}
                          name='full_name'
                        />
                      </div>
                      <div className="col-lg-6 mt-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Email address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          aria-describedby="emailHelp"
                          value={profileData?.user?.email}
                            readOnly
                            onChange={handleInputChange}
                          name='email'
                        />
                      </div>
                      <div className="col-lg-6 mt-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Mobile
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          aria-describedby="emailHelp"
                          value={profileData?.user?.phone}
                            readOnly
                            onChange={handleInputChange}
                          name='mobile'
                        />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-lg-6">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          aria-describedby="emailHelp"
                          value={profileData?.address}
                          onChange={handleInputChange}
                          name='address'

                        />
                      </div>
                      <div className="col-lg-6 mt-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          aria-describedby="emailHelp"
                          value={profileData?.city}
                            onChange={handleInputChange}
                          name='city'
                        />
                      </div>
                      
                    </div>
                    <button type="submit" className="btn btn-primary mt-5">
                      Save Changes
                    </button>
                  </form>
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

export default Settings