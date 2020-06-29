import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { state } = useContext(AuthContext);
  const { userId } = useParams();
  console.log(userId);

  const [posts, setPosts] = useState("");
  const [user, setUser] = useState(null);
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [name, setName] = useState("");
  const [myProfile, setMyProfile] = useState(userId === state.user._id);
  const [ifollow, setIfollow] = useState("");
  const [dp, setDp] = useState("");
  const [image, setImage] = useState(undefined);

  useEffect(() => {
    console.log(userId);
    const url = "/user/" + userId;
    fetch(url, {
      method: "get",
      headers: {
        authorization: state.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          return;
        }
        setPosts(data.userPost);
        setUser(data.user);
        setDp(data.user.dp);
        setName(data.user.name);
        setFollower(data.user.follower);
        setFollowing(data.user.followee);
        setMyProfile(userId === state.user._id);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        console.log("error somewhere");
      });
  }, [userId]);
  useEffect(() => {
    if (!myProfile) {
      fetch("/user/ifollow", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: state.token,
        },
        body: JSON.stringify({
          followerId: state.user._id,
          followeeId: userId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setIfollow(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [myProfile]);

  useEffect(() => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      fetch("/user/uploaddp", {
        method: "put",
        headers: {
          authorization: localStorage.getItem("token"),
        },
        body: formData,
      })
        .then((res) => res.json)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log("image changed");
    }
  }, [image]);

  const follow = () => {
    if (!myProfile) {
      fetch("/user/follow", {
        method: "post",
        headers: {
          authorization: state.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: state.user._id,
          followeeId: userId,
          unfollow: ifollow,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setFollowing(data.followee);
          setFollower(data.follower);
          setIfollow(!ifollow);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("i dont know");
    }
  };
  return (
    <div>
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-around",
          borderBottom: "1px solid grey",
        }}
      >
        <div className="dp">
          <img
            src={"/post/image/" + dp}
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "75px",
              marginBottom: "10px",
            }}
          />
          <button
            onClick={() => {
              document.getElementById("mydp").click();
            }}
          >
            Change Pic
          </button>
          <input
            id="mydp"
            type="file"
            name="image"
            placeholder="Descrition"
            style={{ display: "none" }}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div style={{ marginLeft: "-33%", fontSize: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "110%",
            }}
          >
            <h6 style={{ margin: "0px 0px 0px 0px" }}>{name}</h6>
            <button style={{ fontSize: "25px" }} onClick={() => follow()}>
              {myProfile ? "Edit" : ifollow ? "Unfollow" : "Follow"}
            </button>
            <button style={{ fontSize: "25px" }}>setting </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
              margin: "-5px 0px -45px 0px",
            }}
          >
            <h6>{posts.length} posts</h6>
            <h6>{follower} follower</h6>
            <h6>{following} following</h6>
          </div>
          <div>
            <p style={{ marginBottom: "-20px", fontSize: "20px" }}>{name}</p>
            <p style={{ marginBottom: "-20px", fontSize: "20px" }}>VNITian</p>
            <p style={{ marginBottom: "-20px", fontSize: "20px" }}>Rajput</p>
            <p style={{ marginBottom: "-20px", fontSize: "20px" }}>
              Positivity King
            </p>
            <p style={{ marginBottom: "-20px", fontSize: "20px" }}>
              Optimistic
            </p>
            <p></p>
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button>POSTS</button>
          <button>IGTV</button>
          <button>SAVED</button>
          <button>TAGGED</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {posts
            ? posts.map((post) => (
                <img
                  key={post._id}
                  src={"/post/image/" + post.fileName}
                  style={{ width: "30%", margin: "10px 10px" }}
                />
              ))
            : "no image found"}
        </div>
      </div>
    </div>
  );
};

export default Profile;
