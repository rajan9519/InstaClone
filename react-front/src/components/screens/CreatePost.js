import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { PhotoCamera } from "@material-ui/icons";
import {
  Divider,
  Button,
  Container,
  IconButton,
  Card,
} from "@material-ui/core";
import { UserData } from "../presentation";
import { AuthContext } from "../../App";

const CreatePost = () => {
  const [image, setImage] = useState("");
  const [image2, setImage2] = useState("");
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUplaoded] = useState(false);
  const { state, dispatch } = useContext(AuthContext);

  const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
      maxHeight: 345,
    },
  }));

  const classes = useStyles();

  const handleTextChange = (e) => {
    const { target } = e;
    setText(target.value);
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };
  const handleImageChange = (e) => {
    const { target } = e;
    const reader = new FileReader();
    setImage2(target.files[0]);
    reader.readAsDataURL(target.files[0]);
    reader.onerror = () => {
      alert("failer to get the file Please try again");
    };
    reader.onload = (event) => {
      setImage(event.target.result);
    };
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", image2);
    formData.append("text", text.trim());
    setUploading(true);
    fetch("/post/createPost", {
      method: "post",
      body: formData,
      headers: {
        authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUploading(false);
        setUplaoded(true);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("uploading");
  };
  return (
    <Container maxWidth="sm">
      <Card>
        <div
          className="create-post"
          style={{
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            padding: "5px",
          }}
        >
          Create Post
        </div>
        <Divider />
        <div>
          <UserData
            name={state.user.name}
            dp={state.user.dp.secure_url}
            _id={state.user._id}
          />
        </div>
        <Divider />
        <div
          className="create-post-body"
          style={{
            width: "100%",
            height: "300px",
            overflow: "scroll",
            overflowX: "hidden",
          }}
        >
          <textarea
            className="create-post-text"
            style={{
              resize: "none",
              overflow: "hidden",
              width: "100%",
              border: "none",
              outline: "none",
              height: "50px",
              fontSize: "18px",
              fontFamily: "roboto",
            }}
            onChange={(e) => handleTextChange(e)}
            placeholder="rajan whats in your mind"
            value={text}
          />
          {image && (
            <img
              src={image}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
              alt="selected image"
            />
          )}
        </div>
        <Divider />
        <div>
          <input
            accept="image/jpg,image/jpeg,image/png"
            className={classes.input}
            id="icon-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleImageChange(e)}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              disabled={uploading}
            >
              <PhotoCamera />
            </IconButton>
          </label>
          <Button
            disabled={uploading}
            variant="contained"
            color="primary"
            component="span"
            onClick={(e) => handleSubmit(e)}
          >
            Upload
          </Button>
        </div>
      </Card>
    </Container>
  );
};
export default CreatePost;
