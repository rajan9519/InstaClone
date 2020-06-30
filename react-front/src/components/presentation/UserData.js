import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";

const UserData = (props) => {
  const { state, dispatch } = useContext(AuthContext);

  const handleClick = () => {
    fetch("/user/follow", {
      method: "post",
      headers: {
        authorization: state.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId: state.user._id,
        followeeId: props._id,
        unfollow: props.ifollow,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="user-card">
      <div className="user-data">
        <div>
          <img className="profile-pic" src={props.dp}></img>
        </div>
        <div className="user-info">
          <Link to={"/profile/" + props._id} className="user-id">
            {props._id}
          </Link>
          <div className="user-name">{props.name}</div>
        </div>
      </div>
      <button onClick={() => console.log("clicked")} className="user-btn">
        {props.ifollow ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default UserData;
