import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../services/LocalStorageService";
import { useGetLoggedUserQuery } from "../../services/userAuthApi";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";

function COrders() {
  const [orders, setOrders] = useState([]);
  const { trackingToken } = useParams(); // from URL
  let { access_token } = getToken();
  const { data, isSuccess } = useGetLoggedUserQuery(access_token);
  useEffect(async () => {
    if (data?.id) {
      await axios
        .get(`http://127.0.0.1:8000/api/customer/orders/${data?.id}`)
        .then((res) => {
          console.log(res);
          setOrders(res.data);
        });
    }
  }, [data?.id]);

  const statsCount = orders.reduce((counts, order) => {
    const status = order.order_status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {}); // ← this empty object is required!

  return (
    <main className="mt-5">
      <div className="container">
        <section className="">
          <div className="row">
            {/* <Sidebar /> */}
            <Sidebar />
            <div className="col-lg-9 mt-1">
              <main className="mb-5" style={{}}>
                <div className="container px-4">
                  <section className="mb-5">
                    <h3 className="mb-3">
                      <i className="fas fa-shopping-cart text-primary" /> Orders{" "}
                    </h3>
                    <div className="row gx-xl-5">
                      <div className="col-lg-4 mb-4 mb-lg-0">
                        <div
                          className="rounded shadow"
                          style={{ backgroundColor: "#B2DFDB" }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center">
                              <div className="">
                                <p className="mb-1">Orders</p>
                                <h2 className="mb-0">
                                  {orders.length}
                                  <span
                                    className=""
                                    style={{ fontSize: "0.875rem" }}
                                  ></span>
                                </h2>
                              </div>
                              <div className="flex-grow-1 ms-5">
                                <div className="p-3 badge-primary rounded-4">
                                  <i
                                    className="fas fa-shopping-cart fs-4"
                                    style={{ color: "#004D40" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 mb-4 mb-lg-0">
                        <div
                          className="rounded shadow"
                          style={{ backgroundColor: "#D1C4E9" }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center">
                              <div className="">
                                <p className="mb-1">Pending Delivery</p>
                                <h2 className="mb-0">
                                  {statsCount.pending}
                                  <span
                                    className=""
                                    style={{ fontSize: "0.875rem" }}
                                  ></span>
                                </h2>
                              </div>
                              <div className="flex-grow-1 ms-5">
                                <div className="p-3 badge-primary rounded-4">
                                  <i
                                    className="fas fa-clock fs-4"
                                    style={{ color: "#6200EA" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 mb-4 mb-lg-0">
                        <div
                          className="rounded shadow"
                          style={{ backgroundColor: "#BBDEFB" }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center">
                              <div className="">
                                <p className="mb-1">Fulfilled Orders</p>
                                <h2 className="mb-0">
                                  {statsCount.fulfilled}
                                  <span
                                    className=""
                                    style={{ fontSize: "0.875rem" }}
                                  ></span>
                                </h2>
                              </div>
                              <div className="flex-grow-1 ms-5">
                                <div className="p-3 badge-primary rounded-4">
                                  <i
                                    className="fas fa-check-circle fs-4"
                                    style={{ color: "#01579B" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  {/* Section: Summary */}
                  {/* Section: MSC */}
                  <section className="">
                    <div className="row rounded shadow p-3">
                      <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                        <table className="table align-middle mb-0 bg-white">
                          <thead className="bg-light">
                            <tr>
                              <th>Order ID</th>
                              <th>Payment Status</th>
                              <th>Order Status</th>
                              <th>Total</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((o, index) => (
                              <tr key={index}>
                                <td>
                                  <p className="fw-bold mb-1">#{o.oid}</p>
                                  <p className="text-muted mb-0">{o.date}</p>
                                </td>
                                <td>
                                  <p className="fw-normal mb-1">
                                    {o.payment_status}
                                  </p>
                                </td>
                                <td>
                                  <p className="fw-normal mb-1">
                                    {o.order_status}
                                  </p>
                                </td>
                                <td>
                                  <span className="fw-normal mb-1">
                                  Rs.{o.total}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/customer/orders/${o.oid}/`}
                                    className="btn btn-link btn-sm btn-rounded"
                                  >
                                    View <i className="fas fa-eye" />
                                  </Link>
                                </td>
                                {o.order_status === "fulfilled" && (
                                  <Link
                                    to={`/customer/tracking/${o.oid}/${o.tracking_token}/`}
                                    className="btn btn-primary btn-sm btn-rounded ms-2"
                                  >
                                    Track Location{" "}
                                    <i className="fas fa-map-marker-alt" />
                                  </Link>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <canvas id="myChart" style={{ width: "100%" }} />
                    </div>
                  </section>
                </div>
              </main>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default COrders;
