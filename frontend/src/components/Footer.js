const Footer = () => {
    return (
      <div>
        <footer className="bg-light text-center text-lg-start">
          <div className="container p-4">
            <div className="row">
              {/* Social Media Row */}
              <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center justify-content-md-start align-items-center">
                <strong>Get connected with us on social networks</strong>
              </div>
              <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
                {/* Social Icons */}
                <a
                  className="btn btn-primary btn-sm btn-floating me-2"
                  style={{ backgroundColor: "#3b5998" }}
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-facebook-f" />
                </a>
                <a
                  className="btn text-white btn-sm btn-floating me-2"
                  style={{ backgroundColor: "#55acee" }}
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-twitter" />
                </a>
                <a
                  className="btn text-white btn-sm btn-floating me-2"
                  style={{ backgroundColor: "#c61118" }}
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-pinterest" />
                </a>
                <a
                  className="btn text-white btn-sm btn-floating me-2"
                  style={{ backgroundColor: "#ed302f" }}
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-youtube" />
                </a>
                <a
                  className="btn text-white btn-sm btn-floating me-2"
                  style={{ backgroundColor: "#ac2bac" }}
                  href="#!"
                  role="button"
                >
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>
  
            <hr className="my-3" />
  
            {/* About and Contact Row */}
            <div className="row d-flex justify-content-between">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <p>
                  <strong>About us</strong>
                </p>
                <p>
                  BITEBOX is a food ordering system project focused on helping local restaurants and small businesses offer online ordering and delivery. It lets users browse nearby restaurants, view their menus (called "dishes" in the system), and place orders.
                </p>
              </div>
  
              <div className="col-lg-4 mb-4 mb-lg-0 text-lg-end">
                <p>
                  <strong>Contact</strong>
                </p>
                <ul className="list-unstyled">
                  <li className="text-sm text-gray-400">Email: boxbite252@gmail.com</li>
                  <li className="text-sm text-gray-400">Phone: +92 3048155180</li>
                </ul>
              </div>
            </div>
          </div>
  
          {/* Copyright */}
          <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
            © 2025 Copyright:
            <a className="text-dark" href="#!"> Bitebox</a>
          </div>
        </footer>
      </div>
    );
  };
  
  export default Footer;
  