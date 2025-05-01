import { TextField, FormControlLabel, Checkbox, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterUserMutation } from '../../services/userAuthApi';
import { storeToken } from '../../services/LocalStorageService';
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

const nameValidator = (data) => {
  const sanitizedData = inputTest(data);
  return /^[a-zA-Z-' ]*$/.test(sanitizedData);
};

const characterLengthValidator = (data, minLength, maxLength) => {
  return data.length >= minLength && data.length <= maxLength;
};

const Registration = () => {

  const [showPasswords, setShowPasswords] = useState(false);
  const [serverError, setServerError] = useState({});
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();


  const togglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const errors = {};
    const sanitizedName = inputTest(data.get('name'));
    const sanitizedEmail = inputTest(data.get('email'));
    const password = data.get('password');
    const password2 = data.get('password2');
    const tc = data.get('tc');

    // Validate Name
    if (!nameValidator(sanitizedName)) {
      errors.name = ['Name can only contain letters, spaces, and hyphens'];
    } else if (!characterLengthValidator(sanitizedName, 3, 50)) {
      errors.name = ['Name must be between 3 and 50 characters long'];
    }

    // Validate Email
    if (!regEmailTest(sanitizedEmail)) {
      errors.email = ['Invalid email format'];
    } else if (!characterLengthValidator(sanitizedEmail, 5, 50)) {
      errors.email = ['Email must be between 5 and 50 characters long'];
    }

    // Validate Password
    if (!regPasswordTest(password)) {
      errors.password = ['Password must be at least 6 characters long'];
    } else if (!characterLengthValidator(password, 6, 50)) {
      errors.password = ['Password must be between 6 and 50 characters long'];
    }

    // Validate Password Match
    if (password !== password2) {
      errors.password2 = ['Passwords do not match'];
    }

    // Validate Terms and Conditions
    // if (!tc) {
    //   errors.tc = ['You must agree to the terms and conditions'];
    // }

    // If there are validation errors, set them and return early
    if (Object.keys(errors).length > 0) {
      setServerError(errors);
      return;
    }

    // Proceed with API request
    const actualData = {
      name: sanitizedName,
      email: sanitizedEmail,
      password,
      password2,
      tc,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        actualData.latitude = position.coords.latitude;
        actualData.longitude = position.coords.longitude;

        const res = await registerUser(actualData);
        if (res.error) {
          setServerError(res.error.data.errors);
        }
        if (res.data) {
          storeToken(res.data.token);
          Toast.fire({
            icon: 'success',
            title: 'Registered successfully'
        });
          navigate('/dashboard');
        }
      },
      (error) => {
        console.error('Error retrieving location:', error);
        setServerError({ location: ['Unable to retrieve your location. Please try again.'] });
      }
    );
  };

  return (
    <main style={{ marginBottom: 100, marginTop: 50 }}>
      <div className="container">
        <section>
          <div className="row d-flex justify-content-center">
            <div className="col-xl-5 col-md-8">
              <div className="card rounded-5">
                <div className="card-body p-4">
                  <h3 className="text-center">Register Account</h3>
                  <br />

                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="pills-login" role="tabpanel">
                      <form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="name">Full Name</label>
                          <TextField
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Full Name"
                            required
                            className="form-control"
                            error={!!serverError.name}
                            helperText={serverError.name ? serverError.name[0] : ""}
                          />
                        </div>

                        {/* Email */}
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="email">Email</label>
                          <TextField
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email Address"
                            required
                            className="form-control"
                            error={!!serverError.email}
                            helperText={serverError.email ? serverError.email[0] : ""}
                          />
                        </div>

                        {/* Password */}
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="password">Password</label>
                          <TextField
                            type={showPasswords ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="form-control"
                            error={!!serverError.password}
                            helperText={serverError.password ? serverError.password[0] : ""}
                          />
                        </div>

                        {/* Confirm Password */}
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="password2">Confirm Password</label>
                          <TextField
                            type={showPasswords ? 'text' : 'password'}
                            id="password2"
                            name="password2"
                            placeholder="Confirm Password"
                            required
                            className="form-control"
                            error={!!serverError.password2}
                            helperText={serverError.password2 ? serverError.password2[0] : ""}
                          />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={togglePasswordVisibility}
          />{' '}
          Show Passwords
        </label>
      </div>
                        {/* Terms and Conditions */}
                        {/* <div className="form-outline mb-4">
                          <FormControlLabel
                            control={<Checkbox value={true} color="primary" name="tc" id="tc" />}
                            label="I agree to terms and conditions."
                          />
                          {serverError.tc ? <Typography style={{ color: 'red', fontSize: '12px', paddingLeft: 10 }}>{serverError.tc[0]}</Typography> : ""}
                        </div> */}

                        {/* Submit Button */}
                        {isLoading
                          ? <button disabled className='btn btn-primary w-100' type="submit">
                              <span className="mr-2">Processing</span>
                              <i className="fas fa-spinner fa-spin" />
                            </button>
                          : <button className='btn btn-primary w-100' type="submit">
                              <span className="mr-2">Sign Up</span>
                              <i className="fas fa-user-plus" />
                            </button>
                        }

                        {/* Existing Account Link */}
                        <div className="text-center">
                          <p className='mt-4'>
                            Already have an account? <Link to="/login">Login</Link>
                          </p>
                        </div>

                        {/* Error Alerts */}
                        {serverError.non_field_errors && <Alert severity="error">{serverError.non_field_errors[0]}</Alert>}
                        {serverError.location && <Alert severity="error">{serverError.location[0]}</Alert>}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Registration;
