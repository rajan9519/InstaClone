import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { show } from "./SnackBar";

const SignUp = () => {
  const [name, setName] = useState("");
  const [_id, set_id] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [show1, setShow1] = useState(false);

  useEffect(() => {
    if (message && color) {
      show(message, color);
    }
  }, [show1]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valid) {
      fetch("/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id,
          name,
          password,
          email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setMessage(data.error);
            setColor("red");
          } else {
            setMessage(data.message);
            setColor("green");
            setValid(false);
            set_id("");
            setName("");
            setPassword("");
            setEmail("");
          }
          setShow1(!show1);
        });
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    if (name === "email") {
      setEmail(value.trim().toLowerCase());
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "_id") {
      set_id(value.trim().toLowerCase());
    } else {
      setName(value);
    }
  };
  useEffect(() => {
    const element = document.getElementById("_idValidate");
    if (_id) {
      fetch("/user/find/" + _id, {
        method: "get",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            element.style.display = "block";
            element.style.color = "red";
            element.innerHTML = data.error;
            setValid(false);
          } else {
            element.style.display = "block";
            element.style.color = "green";
            element.innerHTML = data.message;
            setValid(true);
          }
        });
    } else {
      element.style.display = "none";
      setValid(false);
    }
  }, [_id]);
  return (
    <div className="signup">
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="auth-card">
          <h2>MyGlueCode</h2>
          <input
            autoComplete="off"
            type="text"
            placeholder="name"
            value={name}
            name="name"
            onChange={(e) => handleChange(e)}
            required
          />
          <input
            autoComplete="off"
            type="email"
            placeholder="email"
            value={email}
            name="email"
            onChange={(e) => handleChange(e)}
            required
          />
          <input
            autoComplete="off"
            type="text"
            placeholder="username"
            value={_id}
            name="_id"
            onChange={(e) => handleChange(e)}
            required
          />
          <p id="_idValidate" style={{ display: "none" }}></p>
          <input
            type="password"
            placeholder="password"
            value={password}
            name="password"
            onChange={(e) => handleChange(e)}
            required
          />
          <button className="btn" type="submit">
            SignUp
          </button>

          <Link to="/signin">Already have an account?</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
