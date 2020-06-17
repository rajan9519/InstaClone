import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "email") {
      if (!validateEmail(value)) {
        console.log("incorrect email address");
      } else {
        console.log("correct email");
      }
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else {
      setName(value);
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          name="name"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          name="email"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          name="password"
          onChange={(e) => handleChange(e)}
        />
        <button
          className="btn waves-effect waves-light #2196f3 blue"
          onClick={() => handleSubmit()}
        >
          SignUp
        </button>

        <Link to="/signin">Already have an account?</Link>
      </div>
    </div>
  );
};

export default SignUp;
