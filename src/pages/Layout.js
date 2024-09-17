import { Outlet, Link } from "react-router-dom";
import "../css/layout.css"

const Layout = () => {
  return (
    <>
      <div className="header">
        <div className="flex-box">
          <nav className="flex-item">
            <Link to="/" className="header-link">Home</Link>
          </nav>
          <nav className="flex-item">
            <Link to="/Secret-Page" className="header-link">Home</Link>
          </nav>
        </div>
      </div>


      <Outlet />
    </>
  )
};

export default Layout;