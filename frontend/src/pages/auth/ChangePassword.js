import { Box, TextField, Button, Alert, Typography } from "@mui/material";
import { useState } from "react";
import { useChangeUserPasswordMutation } from "../../services/userAuthApi";
import { getToken } from "../../services/LocalStorageService";
import { useNavigate, Link } from 'react-router-dom';

const ChangePassword = () => {
  const [serverError, setServerError] = useState({});
  const [serverMsg, setServerMsg] = useState({});
  const [changeUserPassword] = useChangeUserPasswordMutation();
  const { access_token } = getToken();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const actualData = {
      current_password: data.get("current_password"),
      password: data.get("password"),
      password2: data.get("password2"),
    };

    const res = await changeUserPassword({ actualData, access_token });

    if (res.error) {
      setServerMsg({});
      setServerError(res.error.data.errors);
    }
    if (res.data) {
      setServerError({});
      setServerMsg(res.data);
      document.getElementById("password-change-form").reset();
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", maxWidth: 600, mx: 4 }}
    >
      <h1>Change Password</h1>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1 }}
        id="password-change-form"
      >
        <TextField
          margin="normal"
          required
          fullWidth
          name="current_password"
          label="Current Password"
          type="password"
          id="current_password"
        />
        {serverError.current_password && (
          <Typography sx={{ color: "red", fontSize: "12px", pl: 1 }}>
            {serverError.current_password[0]}
          </Typography>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="New Password"
          type="password"
          id="password"
        />
        {serverError.password && (
          <Typography sx={{ color: "red", fontSize: "12px", pl: 1 }}>
            {serverError.password[0]}
          </Typography>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          name="password2"
          label="Confirm New Password"
          type="password"
          id="password2"
        />
        {serverError.password2 && (
          <Typography sx={{ color: "red", fontSize: "12px", pl: 1 }}>
            {serverError.password2[0]}
          </Typography>
        )}

        <Box textAlign="center">
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, px: 5 }}
          >
            Update
          </Button>
        </Box>
      </Box>

      {serverError.non_field_errors && (
        <Alert severity="error">{serverError.non_field_errors[0]}</Alert>
      )}
      {serverMsg.msg && <Alert severity="success">{serverMsg.msg}</Alert>}
      <p className="mt-0">
        <Link to="/sendpasswordresetemail" className="text-danger">
          Forgot Password?
        </Link>
      </p>
    </Box>
  );
};

export default ChangePassword;
