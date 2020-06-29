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
  const [searchRes, setSearchRes] = useState("");

  useEffect(() => {
    if (search) {
      fetch("/user/" + search, {
        method: "post",
        headers: { authorization: state.token },
      })
        .then((res) => res.json())
        .then((data) => setSearchRes(data))
        .catch((err) => console.log(err));
    } else {
      setSearchRes([]);
    }
  }, [search]);
  return (
    <nav>
      <div className="nav">
        <Link
          to={state.isAuthenticated ? "/" : "/signin"}
          className="brand-logo left"
        >
          Instagram
        </Link>
        {!state.isAuthenticated ? <BeforeSign /> : <AfterSign />}
      </div>
      <dialog id="myDialog">
        this is dialog window
        <button
          className="btn-icon"
          onClick={() => document.getElementById("myDialog").close()}
        >
          <i className="material-icons">cancel</i>
        </button>
        <input
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLocaleLowerCase())}
        ></input>
        <div>
          {searchRes.length ? (
            <div>
              {search
                ? searchRes.map((user) => {
                    return (
                      <UserData
                        key={user._id}
                        name={user.name}
                        _id={user._id}
                        dp={user.dp}
                      />
                    );
                  })
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
