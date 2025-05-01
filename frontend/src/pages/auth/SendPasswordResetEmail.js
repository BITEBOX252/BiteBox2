import { Grid, TextField, Button, Box, Alert,Typography } from "@mui/material";
import { useState } from 'react';
import { useSendPasswordResetEmailMutation } from '../../services/userAuthApi';
import { getToken } from '../../services/LocalStorageService';
const SendPasswordResetEmail = () => {
  const [serverError,setServerError]=useState({})
  const [serverMsg, setServerMsg] = useState({})
  const [sendPasswordResetEmail,{isLoading}] = useSendPasswordResetEmailMutation()
  const { access_token } = getToken()
  const handleSubmit = async  (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
    }
   const res=await sendPasswordResetEmail(actualData)
   if (res.error) {
    setServerMsg({})
    setServerError(res.error.data.errors)
  }
  else if (res.data) {
    console.log(res.data)
    setServerError({})
    setServerMsg(res.data)
    document.getElementById("password-reset-email-form").reset();
  }
}
  return <>
    <Grid container justifyContent='center'>
      <Grid item sm={6} xs={12}>
        <h1>Reset Password</h1>
        <Box component='form' noValidate sx={{ mt: 1 }} id='password-reset-email-form' onSubmit={handleSubmit}>
          <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' />
      {serverError.email ? <Typography style={{ color: 'red' ,fontSize: '12px',paddingLeft:10}}>{serverError.email[0]}</Typography> : "" }
          
          <Box textAlign='center'>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Send</Button>
          
          </Box>
          {serverError.non_field_errors ? <Alert severity="error">{serverError.non_field_errors[0]}</Alert> : "" }
          {serverMsg.msg ? <Alert severity='success'>{serverMsg.msg}</Alert> : ''}
        </Box>
      </Grid>
    </Grid>
  </>;
};

export default SendPasswordResetEmail;
