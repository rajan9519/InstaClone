import React from "react";

const SnackBar = (props) => {
  return (
    <div id="snackbar" style={{ backgroundColor: props.color }}>
      {props.message}
    </div>
  );
};

export default SnackBar;
