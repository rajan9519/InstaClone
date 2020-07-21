import React from "react";
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

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    maxHeight: 345,
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();
  const [image, setImgae] = React.useState("");
  const [text, setText] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [uploaded, setUplaoded] = React.useState(false);

  const handleTextChange = (e) => {
    const { target } = e;
    setText(target.value);
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };
  const handleImageChange = (e) => {
    const { target } = e;
    const reader = new FileReader();
    reader.readAsDataURL(target.files[0]);
    reader.onerror = () => {
      alert("failer to get the file Please try again");
    };
    reader.onload = (event) => {
      setImgae(event.target.result);
    };
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", image);
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
            name="rajan singh"
            dp={{
              secure_url:
                "https://scontent.fdel11-1.fna.fbcdn.net/v/t1.0-1/p320x320/79821923_2562806683964756_5081982137020710912_o.jpg?_nc_cat=108&_nc_sid=7206a8&_nc_ohc=GrSCPPZMQVEAX_u5BCk&_nc_ht=scontent.fdel11-1.fna&_nc_tp=6&oh=ada10084e8edad3df514f5cae1dd2e46&oe=5F3AC33C",
            }}
            _id="lsakfn"
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
}
