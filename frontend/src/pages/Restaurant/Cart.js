import axios from "axios";
import { useState, useEffect,useContext } from "react";
import { Link,useNavigate } from "react-router-dom";
import CartID from "../plugins/CartID";
import { getToken } from "../../services/LocalStorageService";
import { useGetLoggedUserQuery } from "../../services/userAuthApi";
import { setUserToken } from "../../features/authSlice";
import { setUserInfo } from "../../features/userSlice";
import { useDispatch } from "react-redux";
import { cartContext } from "../plugins/Context";
import Swal from 'sweetalert2'

function Cart() {
  const [cart, setCart] = useState([]);
  const [dishQty, setDishQty] = useState([]);
  const [cartTotal, setCartTotal] = useState([]);
  const [c, setC] = useState({
    qty: 1,
  });
      const [cartCount,setCartCount] = useContext(cartContext)
  
  const dispatch = useDispatch();
  const CartId = CartID();
  let { access_token } = getToken();
  const { data, isSuccess } = useGetLoggedUserQuery(access_token);
  const [fullName, setFullName] = useState("")
  const [mobile, setMobile] = useState("")
      const [address, setAddress] = useState("")
      const [city, setCity] = useState("")

  const fetchCartData = (cart_id, user_id) => {
    const url = user_id ? `http://127.0.0.1:8000/api/store/cart-list/${cart_id}/${user_id}/` : `http://127.0.0.1:8000/api/store/cart-list/${cart_id}/`;
    axios.get(url)
      .then((res) => {
        console.log(res);
        setCart(res?.data);
        setCartCount(res?.data.length)
      })
      .catch((error) => console.error("Error fetching cart data:", error));
  };

  const fetchCartTotalData = (cart_id, user_id) => {
    const url = user_id ? `http://127.0.0.1:8000/api/store/cart-detail/${cart_id}/${user_id}/` : `http://127.0.0.1:8000/api/store/cart-detail/${cart_id}/`;
    axios.get(url)
      .then((res) => {
        console.log(res);
        setCartTotal(res?.data);
      })
      .catch((error) => console.error("Error fetching cart data:", error));
  };
  const navigate=useNavigate()
  useEffect(() => {
    if (CartId) {
      if (data) {
        fetchCartData(CartId, data?.id);
        fetchCartTotalData(CartId, data?.id);
      } else {
        fetchCartData(CartId, null);
        fetchCartTotalData(CartId, null);
      }
    }

    dispatch(setUserToken({ access_token: access_token }));
    if (data && isSuccess) {
      console.log("Data is this", data);
      dispatch(setUserInfo({ email: data.email, name: data.name }));
    }
    console.log("Access Token is this", data);
  }, []);
  
  const handleQtyChange=(e,dish_id)=>{
    const qty=e.target.value;
    console.log(qty);
    console.log(dish_id);
    setDishQty((prevqty)=>({
      ...prevqty,
      [dish_id]:qty
    }))
  }
 useEffect(()=>{
  const initialqty={}
  cart.forEach((c)=>{
    initialqty[c.dish?.id]=c.qty
  })
  setDishQty(initialqty)
 },[cart])

const updateCart= async(dish_id,price,portion,spice)=>{
  const qtyValue=dishQty[dish_id]
  console.log(qtyValue);
  const formdata=new FormData()
        formdata.append("dish_id",dish_id)
        formdata.append("user_id",data?.id)
        formdata.append("qty",qtyValue)
        formdata.append("price",price)
        // formdata.append("shipping_amount",shipping_amount)
        // formdata.append("country",currAddress.country)
        formdata.append("portionSize",portion)
        formdata.append("spiceLevel",spice)
        formdata.append("country","undefined")
        formdata.append("cart_id",CartId)

        const response= await axios.post(`http://127.0.0.1:8000/api/store/cart/`,formdata)
        console.log(response);
        fetchCartData(CartId, data?.id);
        fetchCartTotalData(CartId, data?.id);
        
  
}
const handleDeleteCartItem= async (itemId)=>{
  const url=data?.id 
  ? `http://127.0.0.1:8000/api/store/cart-delete/${CartId}/${data?.id}/${itemId}/`
  :`http://127.0.0.1:8000/api/store/cart-delete/${CartId}/${itemId}/`
  await axios.delete(url)
  // const url1 = data ? `http://127.0.0.1:8000/api/store/cart-list/${CartId}/${data.id}/` : `http://127.0.0.1:8000/api/store/cart-list/${CartId}/`;
  //         const res= await axios.get(url1)
  //         .then((res) => {
  //             console.log("response ======",res.data);
  //             setCartCount(res?.data.length);
  //           })
  //           .catch((error) => console.error("Error fetching cart data:", error));
  fetchCartData(CartId, data?.id);
  fetchCartTotalData(CartId, data?.id);
}

const handleChange = (e) => {
  const { name, value } = e.target;
  // Use computed property names to dynamically set the state based on input name
  switch (name) {
      case 'fullName':
          setFullName(value);
          break;
      
      case 'mobile':
          setMobile(value);
          break;
      case 'address':
          setAddress(value);
          break;
      case 'city':
          setCity(value);
          break;
      default:
          break;
  }
};
// const createCartOrder = async () => {

//         if (!fullName ||  !mobile || !address || !city ) {
//             // If any required field is missing, show an error message or take appropriate action
//             console.log("Please fill in all required fields");
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Missing Fields!',
//                 text: "All fields are required before creating order",
//             })
//             return;
//         }

//         try {

//             const formData = new FormData();
//             formData.append('full_name', fullName);
//             formData.append('mobile', mobile);
//             formData.append('address', address);
//             formData.append('city', city);
//             // formData.append('state', state);
//             // formData.append('country', country);
//             formData.append('cart_id', CartId);
//             formData.append('user_id', data? data.id : 0);

//             const response = await axios.post('http://127.0.0.1:8000/api/store/create-order/', formData)
//             console.log(response.data);
           
//             Swal.fire({
//               icon: 'success',
//               title: 'Order Cofirmed!',
//           })
//             // navigate(`/checkout/${response.data.Order_Id}`);
            
//             
//         } catch (error) {
//             console.log(error);
//         }
//     }
const createCartOrder = async () => {
  if (!fullName || !mobile || !address || !city) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Fields!',
      text: "All fields are required before creating order",
    });
    return;
  }

  try {
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('mobile', mobile);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('cart_id', CartId);
    formData.append('user_id', data ? data.id : 0);

    const response = await axios.post('http://127.0.0.1:8000/api/store/create-order/', formData);
    console.log(response.data);

    Swal.fire({
      icon: 'success',
      title: 'Order Confirmed!',
    });

    // ✅ CLEAR CART after order confirmation
    const clearUrl = data?.id 
      ? `http://127.0.0.1:8000/api/store/cart-clear/${CartId}/${data.id}/` 
      : `http://127.0.0.1:8000/api/store/cart-clear/${CartId}/`;

    await axios.delete(clearUrl);
    
    // ✅ Refresh cart state
    fetchCartData(CartId, data?.id);
    fetchCartTotalData(CartId, data?.id);
    setCartCount(0);  // Update cart count in context

  } catch (error) {
    console.log(error);
  }
};

  return (<div>
    <div>
  <main className="mt-5">
    <div className="container">
      <main className="mb-6">
        <div className="container">
          <section className="">
            <div className="row gx-lg-5 mb-5">
              <div className="col-lg-8 mb-4 mb-md-0">
                <section className="mb-5">
                {cart?.map((c,index)=>(

                  <div className="row border-bottom mb-4" key={index}>
                    <div className="col-md-2 mb-4 mb-md-0">
                      <div
                        className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                        data-ripple-color="light"
                      >
                        <a to=''>
                          <img
                            src={c.dish.image}
                            className="w-100"
                            alt=""
                            style={{ height: "100px", objectFit: "cover", borderRadius: "10px" }}
                          />
                        </a>
                        <a href="#!">
                          <div className="hover-overlay">
                            <div
                              className="mask"
                              style={{
                                backgroundColor: "hsla(0, 0%, 98.4%, 0.2)"
                              }}
                            />
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="col-md-8 mb-4 mb-md-0">
                      <a to={null} className="fw-bold text-dark mb-4">{c.dish.title}</a>
                      {c.portion_size!=="No portion size" &&
                      <p className="mb-0">
                        <span className="text-muted me-2">Portion Size:</span>
                        <span>{c.portion_size}</span>
                      </p>
                      }
                      { c.spice_level!=="No spice level" &&
                        <p className='mb-0'>
                        <span className="text-muted me-2">Spice Level:</span>
                        <span>{c.spice_level}</span>
                      </p>}
                      
                      <p className='mb-0'>
                        <span className="text-muted me-2">Price:</span>
                      
                        <span>
                        Rs.{c.price_by_portion_size !== null 
    ? ((parseFloat(c.dish.price) || 0) + (parseFloat(c.price_by_portion_size) || 0)
  ).toFixed(2) 
    : c.dish.price }
</span>

                        
                      </p>
                      {/* <p className='mb-0'>
                        <span className="text-muted me-2">Stock Qty:</span>
                        <span>3</span>
                      </p> */}
                      <p className='mb-0'>
                        <span className="text-muted me-2">Restaurant:</span>
                        <span>{c.dish?.restaurant.name}</span>
                      </p>
                      <p className="mt-3">
                        <button onClick={()=>handleDeleteCartItem(c.id)} className="btn btn-danger ">
                          <small><i className="fas fa-trash me-2" />Remove</small>
                        </button>
                      </p>
                    </div>
                    <div className="col-md-2 mb-4 mb-md-0">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="form-outline" >
                          <input
                            type="number"
                            className="form-control"
                            style={{ width: '80px' }}
                            value={dishQty[c.dish?.id] || c.qty}
                            min={1}
                            onChange={(e) => {
                              // Assuming you're updating quantity in state
                              const updatedQty = parseInt(e.target.value, 10);
                              setC((prev) => ({ ...prev, qty: updatedQty }));
                              handleQtyChange(e,c.dish.id)
                            }}

                          />
                        </div>
                        <button onClick={()=>updateCart(c.dish.id,c.dish.price,c.portion_size
,c.spice_level
)} className='ms-2 btn btn-primary'><i className='fas fa-rotate-right'></i></button>
                      </div>
                      {/* <h5 className="mb-2 mt-3 text-center"><span className="align-middle">${(c.price_by_portion_size !== null 
    ? ((parseFloat(c.dish.price) || 0) + (parseFloat(c.price_by_portion_size) || 0)
  ).toFixed(2) 
    : c.dish.price) * c.qty}</span></h5> */}
    <h5 className="mb-2 mt-3 text-center">Rs.{c.sub_total}<span></span></h5>
                    </div>
                  </div>
                ))}
                  {cart.length <1 &&
                  
                  <>
                    <h5>Your Cart Is Empty</h5>
                    <a to='/'> <i className='fas fa-shopping-cart'></i> Continue Shopping</a>
                  </>
                  }

                </section>
                {cart.length>0 &&
                
                <div>
                  <h5 className="mb-4 mt-4">Personal Information</h5>
                  {/* 2 column grid layout with text inputs for the first and last names */}
                  <div className="row mb-4">
                    <div className="col">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="full_name"> <i className='fas fa-user'></i> Full Name</label>
                        <input
                          type="text"
                          id=""
                          onChange={handleChange}
                          name='fullName'
                          value={fullName}
                          className="form-control"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="row mb-4">
                    
                    <div className="col">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="form6Example1"><i className='fas fa-phone'></i> Mobile</label>
                        <input
                          type="text"
                          id="form6Example1"
                          className="form-control"
                          onChange={handleChange}
                          value={mobile}
                          name='mobile'
                        />
                      </div>
                    </div>
                  </div>

                  <h5 className="mb-1 mt-4">Delivery address</h5>

                  <div className="row mb-4">
                    <div className="col-lg-6 mt-3">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="form6Example1"> Address</label>
                        <input
                          type="text"
                          id="form6Example1"
                          className="form-control"
                          onChange={handleChange}
                          value={address}
                          name='address'
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="form6Example1"> City</label>
                        <input
                          type="text"
                          id="form6Example1"
                          className="form-control"
                          onChange={handleChange}
                          value={city}
                          name='city'
                        />
                      </div>
                    </div>

                    
                  </div>
                </div>
                }
              </div>
              <div className="col-lg-4 mb-4 mb-md-0">
                {/* Section: Summary */}
                <section className="shadow-4 p-4 rounded-5 mb-4">
                  <h5 className="mb-3">Cart Summary</h5>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal </span>
                    <span>Rs.{cartTotal.subtotal}</span>
                  </div>
                  {/* <div className="d-flex justify-content-between">
                    <span>Shipping </span>
                    <span>${cartTotal.shipping}</span>
                  </div> */}
                  <div className="d-flex justify-content-between">
                    <span>Tax </span>
                    <span>Rs.{cartTotal.tax}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Servive Fee </span>
                    <span>Rs.{cartTotal.service_fee}</span>
                  </div>
                  <hr className="my-4" />
                  <div className="d-flex justify-content-between fw-bold mb-5">
                    <span>Total </span>
                    <span>Rs.{cartTotal.total}</span>
                  </div>
                  <button onClick={createCartOrder} className="btn btn-primary btn-rounded w-100" >
                    Confirm Order
                  </button>
                </section>
                <section className="shadow rounded-3 card p-4 rounded-5">
                              <h5 className="mb-4">Apply Coupon Code</h5>
                              <div className="d-flex align-items-center">
                                <input type="text" className="form-control rounded me-1" placeholder="Coupon Code" />
                                <button type="button" className="btn btn-success btn-rounded overflow-visible" >Apply</button>
                              </div>
                </section>
                
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </main>
</div>
  </div>);
}

export default Cart;

