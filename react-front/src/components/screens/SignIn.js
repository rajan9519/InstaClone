import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../App";
import { show } from "./SnackBar";

const SignIn = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [show1, setShow1] = useState(false);

  useEffect(() => {
    if (message && color) {
      show(message, color);
    }
  }, [show1]);

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
          setMessage(data.error);
          setColor("red");
          setShow1(!show1);
        } else {
          // localStorage.setItem("token", data.token);
          // localStorage.setItem("user", JSON.stringify(data.user));

          // history.push("/");
          // console.log(data);
          // console.log(JSON.parse(localStorage.getItem("user")));
          setMessage(data.message);
          setColor("green");
          setShow1(!show1);
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
          <h2>MyGlueCode</h2>
          <input
            autoComplete="off"
            type="text"
            placeholder="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
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
