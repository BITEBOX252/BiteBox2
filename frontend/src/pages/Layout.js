import { CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
const Layout = () => {
  return <>
    <CssBaseline />
    {/* <Navbar /> */}
    <Outlet />
    {/* <Footer/> */}
  </>;
};

export default Layout;
