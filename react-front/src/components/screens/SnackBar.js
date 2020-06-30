import React from "react";

const SnackBar = (props) => {
  return <div id="snackbar"></div>;
};
const show = (message, color) => {
  var x = document.getElementById("snackbar");
  x.className = "show";
  x.style.backgroundColor = color;
  x.innerHTML = message;
  setTimeout(() => {
    x.className = x.className.replace("show", "");
  }, 3000);
};
export { SnackBar, show };
