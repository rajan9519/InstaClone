import React, { useContext, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import { UserData } from "./presentation";

const AfterSign = (props) => {
  const { state } = useContext(AuthContext);
  const url = "/profile/" + state.user._id;
  return (
    <div style={{ display: "flex" }}>
      <button
        className="btn-icon"
        onClick={() => document.getElementById("myDialog").show()}
      >
        <i className="material-icons">search</i>
      </button>
      <div className="list">
        <Link className="link" to={url}>
          Profile
        </Link>
      </div>
      <div className="list">
        <Link className="link" to="/createpost">
          Create Post
        </Link>
      </div>
      <div className="list">
        <Link className="link" to="/signout">
          Sign Out
        </Link>
      </div>
      <div className="list">
        <Link className="link" to="/chat">
          Chat
        </Link>
      </div>
    </div>
  );
};
const BeforeSign = () => {
  return (
    <div style={{ display: "flex" }}>
      <div className="list">
        <Link className="link" to="/signin">
          SignIn
        </Link>
      </div>
      <div className="list">
        <Link className="link" to="/signup">
          SignUp
        </Link>
      </div>
    </div>
  );
};
const NavBar = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState("");
  const [follow, setFollow] = useState("");

  useEffect(() => {
    if (search) {
      fetch("/user/" + search, {
        method: "post",
        headers: { authorization: state.token },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.users);
          setFollow(data.data);
          console.log(data);
        })
        .catch((err) => console.log(err));
    } else {
      setUsers([]);
    }
  }, [search]);
  return (
    <nav>
      <div className="nav">
        <Link
          to={state.isAuthenticated ? "/" : "/signin"}
          className="brand-logo left"
        >
          MyGlueCode
        </Link>
        {!state.isAuthenticated ? <BeforeSign /> : <AfterSign />}
      </div>
      <dialog id="myDialog">
        <div className="search-bar">
          <input
            autoComplete="off"
            type="text"
            name="search"
            value={search}
            placeholder="userid"
            onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}
          ></input>
          <button
            className="btn-icon"
            onClick={() => document.getElementById("myDialog").close()}
          >
            <i className="material-icons">cancel</i>
          </button>
        </div>
        <div>
          {users.length ? (
            <div>
              {search && state.isAuthenticated
                ? users.map((user, i) => (
                    <UserData
                      key={user._id}
                      name={user.name}
                      _id={user._id}
                      dp={user.dp.secure_url}
                      ifollow={follow[i]}
                    />
                  ))
                : null}
            </div>
          ) : search ? (
            "No results"
          ) : null}
        </div>
      </dialog>
    </nav>
  );
};

export default NavBar;
