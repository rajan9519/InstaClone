import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

const AfterSign = () => {
  return (
    <div>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
      <li>
        <Link to="/createpost">Create Post</Link>
      </li>
    </div>
  );
};
const BeforeSign = () => {
  return (
    <div>
      <li>
        <Link to="/signin">SignIn</Link>
      </li>
      <li>
        <Link to="/signup">SignUp</Link>
      </li>
    </div>
  );
};
const NavBar = () => {
  const { state, dispatch } = useContext(AuthContext);
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to="/" className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {!state.isAuthenticated ? <BeforeSign /> : <AfterSign />}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
