import { React, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CartID from "../plugins/CartID";
import { getToken } from "../../services/LocalStorageService";
import { useGetLoggedUserQuery } from "../../services/userAuthApi";
import axios from "axios";

function Checkout() {
  const [order, setOrder] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
    let { access_token } = getToken();
      const { data, isSuccess } = useGetLoggedUserQuery(access_token);
  const param = useParams();
  let navigate = useNavigate();
  const CartId = CartID();


  useEffect(() => {
      axios.get(`http://127.0.0.1:8000/api/store/checkout/${param?.order_oid}/`).then((res) => {
        setOrder(res.data);
        console.log(res.data);
      })
    }, [loading])

  return (
    <div>
      <main>
        <main className="mb-4 mt-4">
          <div className="container">
            <section className="">
              <div className="row gx-lg-5">
                <div className="col-lg-8 mb-4 mb-md-0">
                  <section className="">
                    <div className="alert alert-warning">
                      <strong>Review Your Shipping &amp; Order Details </strong>
                    </div>
                    <form>
                      <h5 className="mb-4 mt-4">Shipping address</h5>
                      <div className="row mb-4">
                        <div className="col-lg-12">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Full Name
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.full_name}
                            />
                          </div>
                        </div>

                        

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Mobile
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.mobile}
                            />
                          </div>
                        </div>
                        
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.city}

                            />
                          </div>
                        </div>
                        <div className="col-lg-12 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.address}

                            />
                          </div>
                        </div>
                        
                      </div>

                      
                    </form>
                  </section>
                  {/* Section: Biling details */}
                </div>
                <div className="col-lg-4 mb-4 mb-md-0">
                  {/* Section: Summary */}
                  <section className="shadow-4 p-4 rounded-5 mb-4">
                    <h5 className="mb-3">Cart Summary</h5>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Subtotal </span>
                      <span>Rs.{order.sub_total}</span>
                    </div>
                    {/* <div className="d-flex justify-content-between">
                      <span>Shipping </span>
                      <span>${order.shipping_amount}</span>
                    </div> */}
                    <div className="d-flex justify-content-between">
                      <span>Tax </span>
                      <span>Rs.{order.tax_fee}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Servive Fee </span>
                      <span>Rs.{order.service_fee}</span>
                    </div>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between fw-bold mb-5">
                      <span>Total </span>
                      <span>Rs.{order.total}</span>
                    </div>

                    

                    <form
                      action={`http://127.0.0.1:8000/stripe-checkout/ORDER_ID/`}
                      method="POST"
                    >
                      <button
                        type="submit"
                        className="btn btn-primary btn-rounded w-100 mt-2"
                        style={{ backgroundColor: "#635BFF" }}
                      >
                        Confirm Now
                      </button>
                    </form>

                    {/* <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Flutterwave)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paystack)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paypal)</button> */}
                  </section>
                </div>
              </div>
            </section>
          </div>
        </main>
      </main>
    </div>
  );
}

export default Checkout;
