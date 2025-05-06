import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getToken, storeToken } from '../../services/LocalStorageService';
import { useDispatch } from 'react-redux';
import { setUserToken } from '../../features/authSlice';
import axios from 'axios';
import { useGetLoggedUserQuery } from '../../services/userAuthApi';
import Swal from 'sweetalert2'

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [serverError, setServerError] = useState({});
    const [serverSuccess, setServerSuccess] = useState("");
    const [formData, setFormData] = useState({
        image: null,
        name: '',
        email: '',
        mobile: '',
        description: '',
    });

    const { access_token } = getToken();
    const { data: userData } = useGetLoggedUserQuery(access_token);
    const [isFormVisible, setIsFormVisible] = useState(true);


    
    useEffect(() => {
        dispatch(setUserToken({ access_token }));
    }, [dispatch, access_token]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (event) => {
        setFormData({ ...formData, image: event.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get user's location
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            const data = new FormData();
            data.append('image', formData.image);
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('mobile', formData.mobile);
            data.append('description', formData.description);
            data.append('user_id', userData.id);
            data.append('latitude', latitude);
            data.append('longitude', longitude);

            try {
                const response = await axios.post('http://127.0.0.1:8000/api/restaurant/register/', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

                setServerSuccess("Restaurant Creation Request Sent Successfully!");
                setIsFormVisible(false); // Hide form
                Swal.fire({
                    icon: "success",
                    title: "Restaurant Creation Request Sent Successfully",
                    
                })
                

            } catch (error) {
                if (error.response) {
                    if (error.response.data.message) {
                        setServerError({ message: error.response.data.message });
                        setIsFormVisible(false); // Hide the form
                    } else {
                        setServerError(error.response.data.errors || {});
                    }
                }
            }
        }, (error) => {
            console.error("Error getting location:", error);
        });
    };

    return (
        <div>
            <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
                <div className="container">
                    <section>
                        <div className="row d-flex justify-content-center">
                            <div className="col-xl-5 col-md-8">
                                <div className="card rounded-5">
                                    <div className="card-body p-4">
                                        <h3 className="text-center">Register Restaurant Account</h3>
                                        <br />
                                        
                                        {serverSuccess && !isFormVisible && (
                                            <Alert severity="success">
                                                {serverSuccess}
                                            </Alert>
                                        )}

                                        {serverError.message && !isFormVisible && (
                                            <Alert severity="error">
                                                {serverError.message}
                                            </Alert>
                                        )}

                                        {/* Show Form Only If No Success Message */}
                                        {isFormVisible && (
                                            <form onSubmit={handleSubmit}>
                                                <Box mb={2}>
                                                    <label className="form-label">Restaurant Image</label>
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        name="image"
                                                        required
                                                        className="form-control"
                                                    />
                                                </Box>
                                                <TextField
                                                    label="Restaurant Name"
                                                    name="name"
                                                    onChange={handleInputChange}
                                                    required
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Restaurant Email Address"
                                                    name="email"
                                                    type="email"
                                                    onChange={handleInputChange}
                                                    required
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Restaurant Contact Number"
                                                    name="mobile"
                                                    onChange={handleInputChange}
                                                    required
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    label="Restaurant Description"
                                                    name="description"
                                                    onChange={handleInputChange}
                                                    multiline
                                                    rows={4}
                                                    required
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    fullWidth
                                                    style={{ marginTop: '16px' }}
                                                >
                                                    Create Restaurant
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Register;
