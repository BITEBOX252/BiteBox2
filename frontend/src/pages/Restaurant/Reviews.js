import React,{useState,useEffect} from 'react'
import Sidebar from './Sidebar'
import { Link, useParams } from 'react-router-dom';

import axios from 'axios'
import { useGetLoggedUserQuery } from '../../services/userAuthApi'
import { getToken } from '../../services/LocalStorageService'
function Reviews() {

    const [reviews, setReviews] = useState([])
      const [updateReviews, setUpdateReviews] = useState({ reply: "" })
    let { access_token } = getToken();
        const {data,isSuccess} = useGetLoggedUserQuery(access_token)
    
      
    
      
    
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/restaurant/restaurant-reviews/${data?.restaurant_id}/`);
          setReviews(response.data);
          console.log(response.data);
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
    
      const handleReplyChange = (event) => {
        console.log(updateReviews.reply);
        setUpdateReviews({
          ...updateReviews,
          [event.target.name]: event.target.value
        })
      }
    
      const handleReplySubmit = async (reviewId) => {
        reviewId.preventDefault()
        const formdata = new FormData()
    
        formdata.append('reply', updateReviews.reply)
    
        await axios.patch(`http://127.0.0.1:8000/api/restaurant/reviews/${data?.restaurant_id}/${reviewId}/`, formdata).then((res) => {
          console.log(res.data);
        })
    
      }
  return (
    <div className="container-fluid" id="main">
  <div className="row row-offcanvas row-offcanvas-left h-100">
    <Sidebar/>
    
    {/*/col*/}
    <div className="col-md-9 col-lg-10 main mt-4">
      <h4>
        <i className="fas fa-star" /> Reviews and Rating
      </h4>

      <section
        className="p-4 p-md-5 text-center text-lg-start shadow-1-strong rounded"
        style={{
          backgroundImage:
            "url(https://mdbcdn.b-cdn.net/img/Photos/Others/background2.webp)"
        }}
      >
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-10">
            {reviews.map((r,index) => (

            <div className="card mt-3 mb-3">
              <div className="card-body m-3">
                <div className="row">
                  <div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
                    <img
                      src={r.profile?.image}
                      className="rounded-circle img-fluid shadow-1"
                      alt="woman avatar"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className="col-lg-8">
                    <p className="text-dark fw-bold mb-4">
                      Review:{" "}
                      <i>
                        {r.review}
                      </i>
                    </p>
                    <p className="text-dark mb-2 d-flex">
                                                    <b>Reply: {""} </b>
                                                    {r.reply === null
                                                        ? <span className='ms-2'> No Response</span>
                                                        : <span className='ms-2'> {r.reply}</span>
                                                    }
                                                </p>
                    <p className="fw-bold text-dark mb-2">
                      <strong>Name: {r.profile?.full_name}</strong>
                    </p>
                    <p className="fw-bold text-muted mb-0">
                      Dish: {r.dish?.title}
                    </p>
                    <p className="fw-bold text-muted mb-0">
                      Rating: {r.rating}
                      {r.rating == 1 &&
                              <>
                                <span className='me-2 ms-2'>1</span>
                                < i className="fas fa-star" />
                              </>
                            }

                            {r.rating == 2 &&
                              <>
                                <span className='me-2 ms-2'>2</span>
                                < i className="fas fa-star" />
                                < i className="fas fa-star" />
                              </>
                            }

                            {r.rating == 3 &&
                              <>
                                <span className='me-2 ms-2'>3</span>
                                < i className="fas fa-star" />
                                < i className="fas fa-star" />
                                < i className="fas fa-star" />
                              </>
                            }

                            {r.rating == 4 &&
                              <>
                                <span className='me-2 ms-2'>4</span>
                                < i className="fas fa-star" />
                                < i className="fas fa-star" />
                                < i className="fas fa-star" />
                                < i className="fas fa-star" />
                              </>
                            }

                            {r.rating == 5 &&
                              <>
                                <span className='me-2 ms-2'>5</span>
                                < i className="fas fa-star" />
                                < i className="fas fa-star" />
                                < i className="fas fa-star" />
                                < i className="fas fa-star" />
                                < i className="fas fa-star" />
                              </>
                            }
                    </p>
                    <div className="d-flex mt-3">
                      <p className="fw-bold text-muted mb-0">
                        <Link to={`/restaurant/reviews/${r.id}`} className="btn btn-primary">
                          Reply <i className="fas fa-pen" />
                        </Link>
                      </p>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))}
            
          </div>
        </div>
      </section>
    </div>
  </div>
</div>

  )
}

export default Reviews