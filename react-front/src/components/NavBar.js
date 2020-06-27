import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

const AfterSign = () => {
  const { state } = useContext(AuthContext);
  const url = "/profile/" + state.user._id;
  return (
    <div style={{ display: "flex" }}>
      <li className="list">
        <Link className="link" to={url}>
          Profile
        </Link>
      </li>
      <li className="list">
        <Link className="link" to="/createpost">
          Create Post
        </Link>
      </li>
      <li className="list">
        <Link className="link" to="/signout">
          Sign Out
        </Link>
      </li>
    </div>
  );
};
const BeforeSign = () => {
  return (
    <div style={{ display: "flex" }}>
      <li className="list">
        <Link className="link" to="/signin">
          SignIn
        </Link>
      </li>
      <li className="list">
        <Link className="link" to="/signup">
          SignUp
        </Link>
      </li>
    </div>
  );
};
const NavBar = () => {
  const { state, dispatch } = useContext(AuthContext);
  return (
    <nav>
      <div className="nav">
        <Link
          to={state.isAuthenticated ? "/" : "/signin"}
          className="brand-logo left"
        >
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
