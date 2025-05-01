
import { TextField, Button, Box, Alert, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginUserMutation } from '../../services/userAuthApi';
import { getToken, storeToken } from '../../services/LocalStorageService';
import { useDispatch } from 'react-redux';
import { setUserToken } from '../../features/authSlice';
import Swal from 'sweetalert2';


const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
});
const inputTest = (data) => {
    data = data.trim();
    data = data.replace(/\\/g, '');
    data = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    return data;
};

const regEmailTest = (data) => {
    const email = inputTest(data);
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const regPasswordTest = (data) => {
    return data.length >= 6;
};

const UserLogin = () => {

    const [showPasswords, setShowPasswords] = useState(false);
    const [serverError, setServerError] = useState({});
    const [formError, setFormError] = useState({});
    const navigate = useNavigate();
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const dispatch = useDispatch();

    const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
    const togglePasswordVisibility = () => {
        setShowPasswords(!showPasswords);
      };
    useEffect(() => {
        let isMounted = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (isMounted) {
                    setCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
            }
        );

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormError({});
        setServerError({});

        const data = new FormData(e.currentTarget);
        const sanitizedEmail = inputTest(data.get('email'));
        const password = data.get('password');

        let errors = {};

        // Email validation
        if (!sanitizedEmail) {
            errors.email = 'Email is required';
        } else if (!regEmailTest(sanitizedEmail)) {
            errors.email = 'Invalid email format';
        }

        // Password validation
        if (!password) {
            errors.password = 'Password is required';
        } else if (!regPasswordTest(password)) {
            errors.password = 'Password must be at least 6 characters long';
        }

        if (Object.keys(errors).length > 0) {
            setFormError(errors);
            return;
        }

        const actualData = {
            email: sanitizedEmail,
            password,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
        };

        const res = await loginUser(actualData);
        if (res.error) {
            setServerError(res.error.data.errors || {});
        }
        if (res.data) {
            storeToken(res.data.token);
            const { access_token } = getToken();
            dispatch(setUserToken({ access_token }));
            Toast.fire({
                icon: 'success',
                title: 'Signed in successfully'
            });
            navigate('/');
        }
    };

    const { access_token } = getToken();
    useEffect(() => {
        dispatch(setUserToken({ access_token }));
    }, [dispatch, access_token]);

    return (
        <section>
            <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
                <div className="container">
                    <section>
                        <div className="row d-flex justify-content-center">
                            <div className="col-xl-5 col-md-8">
                                <div className="card rounded-5">
                                    <div className="card-body p-4">
                                        <h3 className="text-center">Login</h3>
                                        <br />
                                        <form onSubmit={handleSubmit}>
                                            {/* Email input */}
                                            <div className="form-outline mb-4">
                                                <label className="form-label" htmlFor="email">
                                                    Email Address
                                                </label>
                                                <TextField
                                                    margin='normal'
                                                    required
                                                    fullWidth
                                                    id='email'
                                                    name='email'
                                                    label='Email Address'
                                                    error={!!formError.email}
                                                    helperText={formError.email}
                                                />
                                                {serverError.email && (
                                                    <Typography style={{ color: 'red', fontSize: '12px', paddingLeft: 10 }}>
                                                        {serverError.email[0]}
                                                    </Typography>
                                                )}
                                            </div>

                                            {/* Password input */}
                                            <div className="form-outline mb-4">
                                                <label className="form-label" htmlFor="password">
                                                    Password
                                                </label>
                                                <TextField
                                                    margin='normal'
                                                    required
                                                    fullWidth
                                                    id='password'
                                                    name='password'
                                                    label='Password'
                                                    type={showPasswords ? 'text' : 'password'}
                                                    error={!!formError.password}
                                                    helperText={formError.password}
                                                />
                                                {serverError.password && (
                                                    <Typography style={{ color: 'red', fontSize: '12px', paddingLeft: 10 }}>
                                                        {serverError.password[0]}
                                                    </Typography>
                                                )}
                                            </div>
                                            <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={togglePasswordVisibility}
          />{' '}
          Show Password
        </label>
      </div>
                                            <button className='btn btn-primary w-100' type="submit" disabled={isLoading}>
                                                <span className="mr-2">Sign In </span>
                                                <i className="fas fa-sign-in-alt" />
                                            </button>

                                            <div className="text-center">
                                                <p className='mt-4'>
                                                    Don't have an account? <Link to="/register">Register</Link>
                                                </p>
                                                <p className='mt-0'>
                                                    <Link to="/sendpasswordresetemail" className='text-danger'>Forgot Password?</Link>
                                                </p>
                                            </div>
                                        </form>

                                        {serverError.non_field_errors && (
                                            <Alert severity="error">{serverError.non_field_errors[0]}</Alert>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </section>
    );
};

export default UserLogin;
