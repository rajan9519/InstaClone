import React from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input type="text" placeholder="email" />
        <input type="text" placeholder="password" />
        <button className="btn waves-effect waves-light #2196f3 blue">
          SignIn
        </button>
        <Link to="/signup">Don't have an account?</Link>
      </div>
    </div>
  );
};

export default SignIn;
