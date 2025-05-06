
// import React, { useState,useContext } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { getToken } from '../../services/LocalStorageService';
// import CartID from '../plugins/CartID'
// import Swal from 'sweetalert2';
// import axios from 'axios';
// import { useGetLoggedUserQuery } from '../../services/userAuthApi';
// import { cartContext } from '../plugins/Context'

// const Toast = Swal.mixin({
//     toast: true,
//     position: 'top',
//     showConfirmButton: false,
//     timer: 1500,
//     timerProgressBar: true,
// });
// const VoiceOrder = () => {
//   const [orderItems, setOrderItems] = useState([]);
//   const [orderConfirmed, setOrderConfirmed] = useState(false);
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const { transcript, listening, resetTranscript } = useSpeechRecognition();
//   const CartId= CartID()
//   const [cartCount,setCartCount] = useContext(cartContext)
//   const handleStart = () => {
//     resetTranscript();
//     SpeechRecognition.startListening({ continuous: false });

//     // Get user's geolocation when starting
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           alert("Please enable location services to use voice ordering.");
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };
//   const { access_token } = getToken();
//   const {data,isSuccess} = useGetLoggedUserQuery(access_token)
//   const handleStop = () => {
//     SpeechRecognition.stopListening();
//   };

//   const handleSend = async () => {
//     if (!transcript.trim()) return alert('No speech detected.');
    
//     if (!location.latitude || !location.longitude) {
//       return alert("Location not available. Please enable location services.");
//     }

//     try {
//       const res = await fetch('http://127.0.0.1:8000/api/restaurant/voice-order/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${access_token}`,
//         },
//         body: JSON.stringify({
//           command: transcript,
//           latitude: location.latitude,
//           longitude: location.longitude,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setOrderItems(data.order_items || []);
//         setOrderConfirmed(false);
//       } else {
//         alert(data.error || data.message || 'Something went wrong');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Failed to process voice input');
//     }
//   };

//   const handleConfirmOrder = () => {
//     setOrderConfirmed(true);
//     speak("Your order has been placed!");
//   };

//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     window.speechSynthesis.speak(utterance);
//   };

//   const carthandler = async () => {
//     try {
//       for (const item of orderItems) {
//         const formdata = new FormData();
//         formdata.append("dish_id", item.id);
//         formdata.append("user_id", data?.id);
//         formdata.append("qty", item.quantity);
//         formdata.append("price", item.final_price);
//         formdata.append("country", "undefined");
//         formdata.append("portionSize", item.portion_size ?? 'No portion size');
//         formdata.append("spiceLevel", item.spice_level ?? 'No spice level' );
//         formdata.append("cart_id", CartId);
  
//         const response = await axios.post(`http://127.0.0.1:8000/api/store/cart/`, formdata);
//         console.log("Item added:", response.data);
//       }
  
//       Toast.fire({
//         icon: "success",
//         title: "All items added to cart",
//       });
  
//       const url = data
//         ? `http://127.0.0.1:8000/api/store/cart-list/${CartId}/${data.id}/`
//         : `http://127.0.0.1:8000/api/store/cart-list/${CartId}/`;
  
//       const res = await axios.get(url);
//       setCartCount(res?.data.length);
//     } catch (error) {
//       console.log(error);
//     }
//   };
  


//   return (
//     <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
//       <h2>🎤 Voice Order</h2>
//       <div>
//         <button onClick={handleStart}>Start Listening</button>
//         <button onClick={handleStop}>Stop</button>
//         <button onClick={handleSend}>Send Order</button>
//         <button onClick={resetTranscript}>Clear</button>
//       </div>

//       <p><strong>Status:</strong> {listening ? '🎙️ Listening...' : '🛑 Stopped'}</p>
//       <p><strong>Transcript:</strong> {transcript}</p>

//       {orderItems.length > 0 && (
//         <div>
//           <h3>🧾 Order Preview</h3>
//           <ul>
//             {orderItems.map((item, index) => (
//               <li key={index}>
//                 {item.quantity} x {item.title} @ Rs.{item.final_price} {item.portion_size} {item.spice_level}{item.restaurant}
//               </li>
//             ))}
//           </ul>
//           <button onClick={carthandler}>✅ Confirm Order</button>
//         </div>
//       )}

//       {orderConfirmed && <p style={{ color: 'green' }}>✔️ Order confirmed!</p>}
//     </div>
//   );
// };

// export default VoiceOrder;
// import React, { useState, useContext, useEffect } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { getToken } from '../../services/LocalStorageService';
// import CartID from '../plugins/CartID';
// import Swal from 'sweetalert2';
// import axios from 'axios';
// import { useGetLoggedUserQuery } from '../../services/userAuthApi';
// import { cartContext } from '../plugins/Context';

// const Toast = Swal.mixin({
//   toast: true,
//   position: 'top',
//   showConfirmButton: false,
//   timer: 1500,
//   timerProgressBar: true,
// });

// const VoiceOrder = () => {
//   const [orderItems, setOrderItems] = useState([]);
//   const [orderConfirmed, setOrderConfirmed] = useState(false);
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [stage, setStage] = useState('initial'); // 'initial', 'afterCart', 'address', 'done'
//   const [userAddress, setUserAddress] = useState({ name: '', phone: '', address: '', city: '' });
//   const [addressFieldIndex, setAddressFieldIndex] = useState(0);
//   const addressFields = ['name', 'phone', 'address', 'city'];

//   const { transcript, listening, resetTranscript } = useSpeechRecognition();
//   const CartId = CartID();
//   const [cartCount, setCartCount] = useContext(cartContext);
//   const { access_token } = getToken();
//   const { data: userData, isSuccess } = useGetLoggedUserQuery(access_token);

  

//   const handleStart = () => {
//     resetTranscript();
//     SpeechRecognition.startListening({ continuous: false });

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           alert("Please enable location services to use voice ordering.");
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const handleStop = () => {
//     SpeechRecognition.stopListening();
//   };

//   const handleSend = async () => {
//     if (!transcript.trim()) return alert('No speech detected.');
//     if (!location.latitude || !location.longitude) {
//       return alert("Location not available. Please enable location services.");
//     }

//     try {
//       const res = await fetch('http://127.0.0.1:8000/api/restaurant/voice-order/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${access_token}`,
//         },
//         body: JSON.stringify({
//           command: transcript,
//           latitude: location.latitude,
//           longitude: location.longitude,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setOrderItems(data.order_items || []);
//         setOrderConfirmed(false);
//       } else {
//         alert(data.error || data.message || 'Something went wrong');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Failed to process voice input');
//     }
//   };

//   const carthandler = async () => {
//     try {
//       for (const item of orderItems) {
//         const formdata = new FormData();
//         formdata.append("dish_id", item.id);
//         formdata.append("user_id", userData?.id);
//         formdata.append("qty", item.quantity);
//         formdata.append("price", item.final_price);
//         formdata.append("country", "undefined");
//         formdata.append("portionSize", item.portion_size ?? 'No portion size');
//         formdata.append("spiceLevel", item.spice_level ?? 'No spice level');
//         formdata.append("cart_id", CartId);

//         await axios.post('http://127.0.0.1:8000/api/store/cart/', formdata);
//       }

//       Toast.fire({
//         icon: "success",
//         title: "All items added to cart",
//       });

//       const url = userData
//         ? `http://127.0.0.1:8000/api/store/cart-list/${CartId}/${userData.id}/`
//         : `http://127.0.0.1:8000/api/store/cart-list/${CartId}/`;

//       const res = await axios.get(url);
//       setCartCount(res?.data.length);

//       setStage('afterCart');
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleProceedToDelivery = () => {
//     speak("Please say your name");
//     setStage('address');
//     setAddressFieldIndex(0);
//     resetTranscript();
//     SpeechRecognition.startListening({ continuous: false });
//   };

//   // Address Collection Logic
//   useEffect(() => {
//     if (stage === 'address' && transcript.trim()) {
//       const currentField = addressFields[addressFieldIndex];
//       setUserAddress((prev) => ({ ...prev, [currentField]: transcript }));
//       resetTranscript();
  
//       if (addressFieldIndex < addressFields.length - 1) {
//         const nextIndex = addressFieldIndex + 1;
//         setTimeout(() => {
//           setAddressFieldIndex(nextIndex);
//           speak(`Please say your ${addressFields[nextIndex]}`);
//           SpeechRecognition.startListening({ continuous: false });
//         }, 1000);
//       } else {
//         handleFinalOrder();
//       }
//     }
//   }, [transcript]);
  
  

//   const handleFinalOrder = async () => {
//     try {
//       const finalData = new FormData();
//       finalData.append("cart_id", CartId);
//       finalData.append("user_id", userData?.id);
//       finalData.append("name", userAddress.name);
//       finalData.append("phone", userAddress.phone);
//       finalData.append("address", userAddress.address);
//       finalData.append("city", userAddress.city);
//       finalData.append("latitude", location.latitude);
//       finalData.append("longitude", location.longitude);

//       await axios.post("http://127.0.0.1:8000/api/restaurant/place-order/", finalData); // Dummy endpoint

//       setOrderConfirmed(true);
//       setStage('done');
//       speak("Your order has been confirmed. Thank you!");
//     } catch (error) {
//       console.error("Order submission failed:", error);
//       alert("Order could not be submitted.");
//     }
//   };
  
  
// const speak = (text, callback) => {
//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.onend = callback;
//   window.speechSynthesis.speak(utterance);
// };

// const listenForInput = () => {
//   resetTranscript(); // from react-speech-recognition
//   SpeechRecognition.startListening({ continuous: false });
// };

// useEffect(() => {
//   if (stage === 'address') {
//     const field = addressFields[addressFieldIndex];
//     speak(`Please say your ${field}`, () => {
//       listenForInput();
//     });
//   }
// }, [stage, addressFieldIndex]);

// useEffect(() => {
//   if (stage === 'address' && transcript) {
//     const field = addressFields[addressFieldIndex];
//     setUserAddress((prev) => ({ ...prev, [field]: transcript }));
//     SpeechRecognition.stopListening();
//   }
// }, [transcript]);

// const retryCurrentField = () => {
//   const field = addressFields[addressFieldIndex];
//   speak(`Please say your ${field}`, () => {
//     listenForInput();
//   });
// };

// const confirmCurrentField = () => {
//   if (addressFieldIndex + 1 < addressFields.length) {
//     setAddressFieldIndex(addressFieldIndex + 1);
//   } else {
//     setStage('done');
//   }
// };

  
//   return (
//     <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
//       <h2>🎤 Voice Order</h2>
//       <div>
//         <button onClick={handleStart}>Start Listening</button>
//         <button onClick={handleStop}>Stop</button>
//         <button onClick={handleSend}>Send Order</button>
//         <button onClick={resetTranscript}>Clear</button>
//       </div>

//       <p><strong>Status:</strong> {listening ? '🎙️ Listening...' : '🛑 Stopped'}</p>
//       <p><strong>Transcript:</strong> {transcript}</p>

//       {orderItems.length > 0 && (
//         <div>
//           <h3>🧾 Order Preview</h3>
//           <ul>
//             {orderItems.map((item, index) => (
//               <li key={index}>
//                 {item.quantity} x {item.title} @ Rs.{item.final_price} {item.portion_size} {item.spice_level} {item.restaurant}
//               </li>
//             ))}
//           </ul>
//           <button onClick={carthandler}>✅ Confirm Items to Cart</button>
//         </div>
//       )}

//       {stage === 'afterCart' && (
//         <div style={{ marginTop: '20px' }}>
//           <button onClick={() => {
//             setOrderItems([]);
//             resetTranscript();
//             setStage('initial');
//             handleStart();
//           }}>
//             ➕ Add More Items
//           </button>

//           <button onClick={handleProceedToDelivery}>
//             📦 Proceed to Delivery
//           </button>
//         </div>
//       )}

// {stage === 'address' && (
//   <div style={{ marginTop: '20px' }}>
//     <h4>🎯 Confirming Your Details</h4>
//     {addressFields.map((field, index) => (
//       <div key={field}>
//         <p>
//           <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {userAddress[field] || 'Waiting for input...'}
//         </p>
//         {index === addressFieldIndex && (
//           <>
//             <button onClick={retryCurrentField}>🔁 Say Again</button>
//             <button onClick={confirmCurrentField}>✅ Confirm</button>
//           </>
//         )}
//       </div>
//     ))}
//   </div>
// )}


// {stage === 'done' && (
//   <div style={{ marginTop: '20px' }}>
//     <h4>📍 Final Delivery Address</h4>
//     <p><strong>Name:</strong> {userAddress.name}</p>
//     <p><strong>Phone:</strong> {userAddress.phone}</p>
//     <p><strong>Address:</strong> {userAddress.address}</p>
//     <p><strong>City:</strong> {userAddress.city}</p>
//     <p style={{ color: 'green' }}>✔️ Order Confirmed!</p>
//   </div>
// )}


//     </div>
//   );
// };

// export default VoiceOrder;

// import React, { useState, useContext, useEffect } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { getToken } from '../../services/LocalStorageService';
// import CartID from '../plugins/CartID';
// import Swal from 'sweetalert2';
// import axios from 'axios';
// import { useGetLoggedUserQuery } from '../../services/userAuthApi';
// import { cartContext } from '../plugins/Context';

// const Toast = Swal.mixin({
//   toast: true,
//   position: 'top',
//   showConfirmButton: false,
//   timer: 1500,
//   timerProgressBar: true,
// });

// const VoiceOrder = () => {
//   const [orderItems, setOrderItems] = useState([]);
//   const [orderConfirmed, setOrderConfirmed] = useState(false);
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [stage, setStage] = useState('initial');
//   const [userAddress, setUserAddress] = useState({ name: '', phone: '', address: '', city: '' });
//   const [addressFieldIndex, setAddressFieldIndex] = useState(0);
//   const addressFields = ['name', 'phone', 'address', 'city'];
//   const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);

//   const { transcript, listening, resetTranscript } = useSpeechRecognition();
//   const CartId = CartID();
//   const [cartCount, setCartCount] = useContext(cartContext);
//   const { access_token } = getToken();
//   const { data: userData } = useGetLoggedUserQuery(access_token);

//   const speak = (text, callback) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.onend = callback;
//     window.speechSynthesis.speak(utterance);
//   };

//   const listenForInput = () => {
//     resetTranscript();
//     SpeechRecognition.startListening({ continuous: true });
//   };

//   const handleStart = () => {
//     resetTranscript();
//     SpeechRecognition.startListening({ continuous: true });

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           alert("Please enable location services to use voice ordering.");
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const handleStop = () => {
//     SpeechRecognition.stopListening();
//   };

//   const handleSend = async () => {
//     if (!transcript.trim()) return alert('No speech detected.');
//     if (!location.latitude || !location.longitude) {
//       return alert("Location not available. Please enable location services.");
//     }

//     try {
//       const res = await fetch('http://127.0.0.1:8000/api/restaurant/voice-order/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${access_token}`,
//         },
//         body: JSON.stringify({
//           command: transcript,
//           latitude: location.latitude,
//           longitude: location.longitude,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setOrderItems(data.order_items || []);
//         setOrderConfirmed(false);
//       } else {
//         alert(data.error || data.message || 'Something went wrong');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Failed to process voice input');
//     }
//   };

//   const carthandler = async () => {
//     try {
//       for (const item of orderItems) {
//         const formdata = new FormData();
//         formdata.append("dish_id", item.id);
//         formdata.append("user_id", userData?.id);
//         formdata.append("qty", item.quantity);
//         formdata.append("price", item.final_price);
//         formdata.append("country", "undefined");
//         formdata.append("portionSize", item.portion_size ?? 'No portion size');
//         formdata.append("spiceLevel", item.spice_level ?? 'No spice level');
//         formdata.append("cart_id", CartId);

//         await axios.post('http://127.0.0.1:8000/api/store/cart/', formdata);
//       }

//       Toast.fire({
//         icon: "success",
//         title: "All items added to cart",
//       });

//       const url = userData
//         ? `http://127.0.0.1:8000/api/store/cart-list/${CartId}/${userData.id}/`
//         : `http://127.0.0.1:8000/api/store/cart-list/${CartId}/`;

//       const res = await axios.get(url);
//       setCartCount(res?.data.length);

//       setStage('afterCart');
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleProceedToDelivery = () => {
//     setStage('address');
//     setAddressFieldIndex(0);
//     setIsAwaitingConfirmation(false);
//     resetTranscript();
//     speak(`Please say your ${addressFields[0]}`, listenForInput);
//   };

//   useEffect(() => {
//     if (stage === 'address' && transcript && !isAwaitingConfirmation) {
//       const field = addressFields[addressFieldIndex];
//       setUserAddress((prev) => ({ ...prev, [field]: transcript.trim() }));
//       setIsAwaitingConfirmation(true);
//       SpeechRecognition.stopListening();
//     }
//   }, [transcript]);

//   const confirmCurrentField = () => {
//     if (addressFieldIndex + 1 < addressFields.length) {
//       const nextIndex = addressFieldIndex + 1;
//       setAddressFieldIndex(nextIndex);
//       setIsAwaitingConfirmation(false);
//       resetTranscript();
//       speak(`Please say your ${addressFields[nextIndex]}`, listenForInput);
//     } else {
//       handleFinalOrder();
//     }
//   };

//   const retryCurrentField = () => {
//     setIsAwaitingConfirmation(false);
//     resetTranscript();
//     const field = addressFields[addressFieldIndex];
//     speak(`Please say your ${field}`, listenForInput);
//   };

//   const handleFinalOrder = async () => {
//     try {
//       const finalData = new FormData();
//       finalData.append("cart_id", CartId);
//       finalData.append("user_id", userData?.id);
//       finalData.append("name", userAddress.name);
//       finalData.append("phone", userAddress.phone);
//       finalData.append("address", userAddress.address);
//       finalData.append("city", userAddress.city);
//       finalData.append("latitude", location.latitude);
//       finalData.append("longitude", location.longitude);

//       await axios.post("http://127.0.0.1:8000/api/restaurant/place-order/", finalData);

//       setOrderConfirmed(true);
//       setStage('done');
//       speak("Your order has been confirmed. Thank you!");
//     } catch (error) {
//       console.error("Order submission failed:", error);
//       alert("Order could not be submitted.");
//     }
//   };

//   return (
//     <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
//       <h2>🎤 Voice Order</h2>
//       <div>
//         <button onClick={handleStart}>Start Listening</button>
//         <button onClick={handleStop}>Stop</button>
//         <button onClick={handleSend}>Send Order</button>
//         <button onClick={resetTranscript}>Clear</button>
//       </div>

//       <p><strong>Status:</strong> {listening ? '🎙️ Listening...' : '🛑 Stopped'}</p>
//       <p><strong>Transcript:</strong> {transcript}</p>

//       {orderItems.length > 0 && (
//         <div>
//           <h3>🧾 Order Preview</h3>
//           <ul>
//             {orderItems.map((item, index) => (
//               <li key={index}>
//                 {item.quantity} x {item.title} @ Rs.{item.final_price} {item.portion_size} {item.spice_level} {item.restaurant}
//               </li>
//             ))}
//           </ul>
//           <button onClick={carthandler}>✅ Confirm Items to Cart</button>
//         </div>
//       )}

//       {stage === 'afterCart' && (
//         <div style={{ marginTop: '20px' }}>
//           <button onClick={() => {
//             setOrderItems([]);
//             resetTranscript();
//             setStage('initial');
//             handleStart();
//           }}>
//             ➕ Add More Items
//           </button>
//           <button onClick={handleProceedToDelivery}>
//             📦 Proceed to Delivery
//           </button>
//         </div>
//       )}

//       {stage === 'address' && (
//         <div style={{ marginTop: '20px' }}>
//           <h4>🎯 Confirming Your Details</h4>
//           {addressFields.map((field, index) => (
//             <div key={field}>
//               <p>
//                 <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {userAddress[field] || 'Waiting for input...'}
//               </p>
//               {index === addressFieldIndex && isAwaitingConfirmation && (
//                 <>
//                   <button onClick={retryCurrentField}>🔁 Say Again</button>
//                   <button onClick={confirmCurrentField}>✅ Confirm</button>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {stage === 'done' && (
//         <div style={{ marginTop: '20px' }}>
//           <h4>📍 Final Delivery Address</h4>
//           <p><strong>Name:</strong> {userAddress.name}</p>
//           <p><strong>Phone:</strong> {userAddress.phone}</p>
//           <p><strong>Address:</strong> {userAddress.address}</p>
//           <p><strong>City:</strong> {userAddress.city}</p>
//           <p>✅ Your order has been placed!</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VoiceOrder;



// still not solving the problem like one problem is solved of only moving next if it confirms the current field but it does not taking proper input like in voice order i think you should separate the logic of voice order and add another thing like Start ListeningStopSend OrderClear
// Status: 🛑 Stopped

// Transcript: Raat for the address thing so that it properly take the input like the voice order please do this 

import React, { useState, useContext, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { getToken } from '../../services/LocalStorageService';
import CartID from '../plugins/CartID';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useGetLoggedUserQuery } from '../../services/userAuthApi';
import { cartContext } from '../plugins/Context';

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

const VoiceOrder = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [stage, setStage] = useState('initial');
  const [userAddress, setUserAddress] = useState({ name: '', phone: '', address: '', city: '' });
  const [addressFieldIndex, setAddressFieldIndex] = useState(0);
  const [fieldConfirmed, setFieldConfirmed] = useState(false);

  const addressFields = ['name', 'phone', 'address', 'city'];

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const CartId = CartID();
  const [cartCount, setCartCount] = useContext(cartContext);
  const { access_token } = getToken();
  const { data: userData } = useGetLoggedUserQuery(access_token);

  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (callback) utterance.onend = callback;
    window.speechSynthesis.speak(utterance);
  };

  const listenForInput = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStart = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          alert("Please enable location services to use voice ordering.");
        }
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
  };

  const handleSend = async () => {
    if (!transcript.trim()) return alert('No speech detected.');
    if (!location.latitude || !location.longitude) {
      return alert("Location not available.");
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/restaurant/voice-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          command: transcript,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrderItems(data.order_items || []);
        setOrderConfirmed(false);
      } else {
        alert(data.error || data.message || 'Something went wrong');
      }
    } catch (err) {
      alert('Failed to process voice input');
    }
  };

  const carthandler = async () => {
    try {
      for (const item of orderItems) {
        const formdata = new FormData();
        formdata.append("dish_id", item.id);
        formdata.append("user_id", userData?.id);
        formdata.append("qty", item.quantity);
        formdata.append("price", item.final_price);
        formdata.append("country", "undefined");
        formdata.append("portionSize", item.portion_size ?? 'No portion size');
        formdata.append("spiceLevel", item.spice_level ?? 'No spice level');
        formdata.append("cart_id", CartId);

        await axios.post('http://127.0.0.1:8000/api/store/cart/', formdata);
      }

      Toast.fire({ icon: "success", title: "All items added to cart" });

      const url = userData
        ? `http://127.0.0.1:8000/api/store/cart-list/${CartId}/${userData.id}/`
        : `http://127.0.0.1:8000/api/store/cart-list/${CartId}/`;

      const res = await axios.get(url);
      setCartCount(res?.data.length);
      setStage('afterCart');
    } catch (error) {
      console.log(error);
    }
  };

  // const handleProceedToDelivery = () => {
  //   speak("Please say your name", () => {
  //     resetTranscript();
  //     SpeechRecognition.startListening({ continuous: true });
  //   });
  //   setStage('address');
  //   setAddressFieldIndex(0);
  //   setFieldConfirmed(false);
  // };
  const handleProceedToDelivery = () => {
    speak("Please say your name", () => {
      resetTranscript();
  
      // 🔴 Delayed startListening after TTS ends
      setTimeout(() => {
        SpeechRecognition.startListening({ continuous: true });
      }, 700); // 700ms delay to ensure mic is ready
    });
  
    setStage('address');
    setAddressFieldIndex(0);
    setFieldConfirmed(false);
  };
  

  useEffect(() => {
    if (stage === 'address' && !fieldConfirmed && transcript.trim()) {
      const field = addressFields[addressFieldIndex];
      setUserAddress((prev) => ({ ...prev, [field]: transcript.trim() }));
    }
  }, [transcript]);

  const confirmCurrentField = () => {
    SpeechRecognition.stopListening();
    setFieldConfirmed(true);
    if (addressFieldIndex + 1 < addressFields.length) {
      const nextIndex = addressFieldIndex + 1;
      setTimeout(() => {
        setAddressFieldIndex(nextIndex);
        setFieldConfirmed(false);
        speak(`Please say your ${addressFields[nextIndex]}`, () => {
          listenForInput();
        });
      }, 800);
    } else {
      handleFinalOrder();
    }
  };

  // const retryCurrentField = () => {
  //   resetTranscript();
  //   speak(`Please say your ${addressFields[addressFieldIndex]}`, () => {
  //     listenForInput();
  //   });
  // };

  const retryCurrentField = () => {
    resetTranscript();
    speak(`Please say your ${addressFields[addressFieldIndex]}`, () => {
      setTimeout(() => {
        listenForInput();
      }, 500);
    });
  };
  

  const handleFinalOrder = async () => {
    try {
      const finalData = new FormData();
      finalData.append("cart_id", CartId);
      finalData.append("user_id", userData?.id);
      finalData.append("name", userAddress.name);
      finalData.append("phone", userAddress.phone);
      finalData.append("address", userAddress.address);
      finalData.append("city", userAddress.city);
      finalData.append("latitude", location.latitude);
      finalData.append("longitude", location.longitude);

      await axios.post("http://127.0.0.1:8000/api/restaurant/place-order/", finalData);

      setOrderConfirmed(true);
      setStage('done');
      speak("Your order has been confirmed. Thank you!");
    } catch (error) {
      alert("Order could not be submitted.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>🎤 Voice Order</h2>

      <div>
        <button onClick={handleStart}>Start Listening</button>
        <button onClick={handleStop}>Stop</button>
        <button onClick={handleSend}>Send Order</button>
        <button onClick={resetTranscript}>Clear</button>
      </div>

      <p><strong>Status:</strong> {listening ? '🎙️ Listening...' : '🛑 Stopped'}</p>
      <p><strong>Transcript:</strong> {transcript}</p>

      {orderItems.length > 0 && (
        <div>
          <h3>🧾 Order Preview</h3>
          <ul>
            {orderItems.map((item, index) => (
              <li key={index}>
                {item.quantity} x {item.title} @ Rs.{item.final_price} {item.portion_size} {item.spice_level} {item.restaurant}
              </li>
            ))}
          </ul>
          <button onClick={carthandler}>✅ Confirm Items to Cart</button>
        </div>
      )}

      {stage === 'afterCart' && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => {
            setOrderItems([]);
            resetTranscript();
            setStage('initial');
            handleStart();
          }}>
            ➕ Add More Items
          </button>

          <button onClick={handleProceedToDelivery}>
            📦 Proceed to Delivery
          </button>
        </div>
      )}

      {stage === 'address' && (
        <div style={{ marginTop: '20px' }}>
          <h4>🎯 Confirming Your Details</h4>
          {addressFields.map((field, index) => (
            <div key={field}>
              <p>
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
                {userAddress[field] || 'Waiting for input...'}
              </p>
              {index === addressFieldIndex && (
                <>
                  <button onClick={retryCurrentField}>🔁 Say Again</button>
                  <button onClick={confirmCurrentField}>✅ Confirm</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {stage === 'done' && (
        <div style={{ marginTop: '20px' }}>
          <h4>📍 Final Delivery Address</h4>
          <p><strong>Name:</strong> {userAddress.name}</p>
          <p><strong>Phone:</strong> {userAddress.phone}</p>
          <p><strong>Address:</strong> {userAddress.address}</p>
          <p><strong>City:</strong> {userAddress.city}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceOrder;
