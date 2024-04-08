import './App.css'
import { Link } from 'react-router-dom';


export const NavBar = () => {
    return (
      <nav className="dashboard-navbar">
        <ul>
          {/* Assuming you want to link to the homepage ('/') */}
          <li><Link to="/">🏠 Dashboard</Link></li>
          <li><Link to="/">🔍 Search</Link></li>
          <li><Link to="/">💭 About</Link></li>
        </ul>
      </nav>
    );
  };
  
  export default NavBar;
  
  