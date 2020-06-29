import React from "react";
import { Link } from "react-router-dom";

const UserData = (props) => {
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
      <button className="user-btn">Follow</button>
    </div>
  );
};

export default UserData;
