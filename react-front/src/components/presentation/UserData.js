import React from "react";

const UserData = (props) => {
  return (
    <div className="user-card">
      <div className="user-data">
        <div>
          <img className="profile-pic" src={props.dp}></img>
        </div>
        <div className="user-info">
          <div className="user-id">{props._id}</div>
          <div className="user-name">{props.name}</div>
        </div>
      </div>
      <button className="user-btn">Follow</button>
    </div>
  );
};

export default UserData;
