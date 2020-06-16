import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input type="text" placeholder="name" />
        <input type="text" placeholder="email" />
        <input type="text" placeholder="password" />
        <button className="btn waves-effect waves-light #2196f3 blue">
          SignUp
        </button>

        <Link to="/signin">Already have an account?</Link>
      </div>
    </div>
  );
};

export default SignUp;
