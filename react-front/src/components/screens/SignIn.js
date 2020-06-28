import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../App";

const SignIn = () => {
  const { dispatch } = useContext(AuthContext);
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
          // localStorage.setItem("token", data.token);
          // localStorage.setItem("user", JSON.stringify(data.user));

          // history.push("/");
          // console.log(data);
          // console.log(JSON.parse(localStorage.getItem("user")));
          dispatch({
            type: "SIGNIN",
            payload: data,
          });
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
        <div className="auth-card">
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
          <button className="btn" type="submit">
            SignIn
          </button>
          <Link to="/signup">Don't have an account?</Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
