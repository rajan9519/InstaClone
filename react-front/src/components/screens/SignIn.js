import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const SignIn = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log("error signing in");
        } else {
          localStorage.setItem("token", data.token);
          history.push("/");
          console.log("succesfull");
          console.log(localStorage.getItem("token"));
        }
      });
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSignIn(e);
        }}
      >
        <div className="card auth-card">
          <h2>Instagram</h2>
          <input
            type="text"
            placeholder="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light #2196f3 blue"
            type="submit"
          >
            SignIn
          </button>
          <Link to="/signup">Don't have an account?</Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
