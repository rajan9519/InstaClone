import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [_id, set_id] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);

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
          console.log(data);
          setValid(false);
          set_id("");
          setName("");
          setPassword("");
          setEmail("");
        });
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "_id") {
      set_id(value);
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
          <h2>Instagram</h2>
          <input
            type="text"
            placeholder="name"
            value={name}
            name="name"
            onChange={(e) => handleChange(e)}
            required
          />
          <input
            type="email"
            placeholder="email"
            value={email}
            name="email"
            onChange={(e) => handleChange(e)}
            required
          />
          <input
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
