import React, { useState } from "react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", image);
    console.log(formData);

    fetch("/post/createPost", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err, "sfdsfdsfdsf");
      });

    console.log("uploading");
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          type="text"
          name="body"
          placeholder="Descrition"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
        />
        <input
          type="file"
          name="image"
          placeholder="Descrition"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
