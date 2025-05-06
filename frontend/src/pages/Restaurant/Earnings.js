import React from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import { getToken } from "../../services/LocalStorageService";
import { useGetLoggedUserQuery } from "../../services/userAuthApi";

function Earnings() {
  const [earningStats, setEarningStats] = useState(null);
  const [earningStatsTracker, setEarningTracker] = useState([]);
  const [earningChartData, setEarningChartData] = useState(null);

  let { access_token } = getToken();
  const { data, isSuccess } = useGetLoggedUserQuery(access_token);

  useEffect(() => {
    const fetEarningStats = async () => {
      if (data?.restaurant_id) {
        axios
          .get(
            `http://127.0.0.1:8000/api/restaurant/earnings/${data?.restaurant_id}/`
          )
          .then((res) => {
            setEarningStats(res.data[0]);
            console.log(res.data);
          });

        axios
          .get(
            `http://127.0.0.1:8000/api/restaurant/monthly-earnings/${data?.restaurant_id}/`
          )
          .then((res) => {
            console.log(res.data);
            setEarningTracker(res.data);
            setEarningChartData(res.data);
          });
      }
    };
    fetEarningStats();
  }, [data?.restaurant_id]);

  const months = earningChartData?.map((item) => item.month);
  const revenue = earningChartData?.map((item) => item.total_earning);
  const sales_count = earningChartData?.map((item) => item.sales_count);

  const revenue_data = {
    labels: months,
    datasets: [
      {
        label: "Revenue Analytics",
        data: revenue,
        fill: true,
        backgroundColor: "#cdb9ed",
        borderColor: "#6203fc",
      },
    ],
  };
  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        {/* Add Sidebar Here */}
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="row mb-3">
            <div className="col-xl-6 col-lg-6 mb-2">
              <div className="card card-inverse card-success">
                <div className="card-block bg-success p-3">
                  <div className="rotate">
                    <i className="bi bi-currency-dollar fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Total Sales</h6>
                  <h1 className="display-1">Rs.{earningStats?.total_revenue}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 mb-2">
              <div className="card card-inverse card-danger">
                <div className="card-block bg-danger p-3">
                  <div className="rotate">
                    <i className="bi bi-currency-dollar fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Monthly Earning</h6>
                  <h1 className="display-1">Rs.{earningStats?.monthly_revenue}</h1>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row  container">
            <div className="col-lg-12">
              <h4 className="mt-3 mb-4">Revenue Tracker</h4>
              <table className="table">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">Orders</th>
                    <th scope="col">Revenue</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                    {earningStatsTracker?.map((e,index)=>(

                  <tr key={index}>
                        {e.month == 1 && <th scope="row">January </th>}
                          {e.month == 2 && <th scope="row">February </th>}
                          {e.month == 2 && <th scope="row">February </th>}
                          {e.month == 2 && <th scope="row">February </th>}
                          {e.month == 3 && <th scope="row">March </th>}
                          {e.month == 4 && <th scope="row">April </th>}
                          {e.month == 5 && <th scope="row">May </th>}
                          {e.month == 6 && <th scope="row">June </th>}
                          {e.month == 7 && <th scope="row">July </th>}
                          {e.month == 8 && <th scope="row">August </th>}
                          {e.month == 9 && <th scope="row">September </th>}
                          {e.month == 10 && <th scope="row">October </th>}
                          {e.month == 11 && <th scope="row">November </th>}
                          {e.month == 12 && <th scope="row">December </th>}
                          <td>{e.sales_count}</td>
                          <td>Rs.{e.total_earning.toFixed(2)}</td>
                    
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

export default Earnings;
