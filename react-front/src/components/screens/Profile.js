import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { useParams, Link } from "react-router-dom";
import { UserData } from "../presentation";
import {
  CssBaseline,
  Container,
  Grid,
  Hidden,
  Typography,
  Button,
  IconButton,
  Icon,
  Divider,
  Box,
} from "@material-ui/core";

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
  const [users, setUsers] = useState("");
  const [ifollow2, setIfollow2] = useState("");

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
        .then((res) => res.json())
        .then((data) => {
          setDp(data.dp);
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
          setFollowing(data.result.followee);
          setFollower(data.result.follower);
          setIfollow(data.ifollow);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const followData = (type) => {
    document.getElementById("followData").show();
    fetch("/user/" + userId + "/" + type, {
      method: "get",
      headers: { authorization: state.token },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setIfollow2(data.ifollow);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Info = () => {
    return (
      <Grid
        container
        spacing={3}
        direction="row"
        justify="center"
        alignItems="baseline"
      >
        <Grid item xs={4}>
          <Typography>{posts.length} Post</Typography>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={() => followData("followers")}>
            {follower} Follower
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={() => followData("followings")}>
            {following} Following
          </Button>
        </Grid>
        <dialog id="followData">
          <button
            className="btn-icon"
            onClick={() => document.getElementById("followData").close()}
          >
            <i className="material-icons">cancel</i>
          </button>
          <div>
            {users ? (
              <div>
                {users.map((user, i) => {
                  if (user._id !== state.user._id) {
                    return (
                      <UserData
                        key={user._id}
                        name={user.name}
                        _id={user._id}
                        dp={user.dp}
                        ifollow={ifollow2[i]}
                      />
                    );
                  }
                })}
              </div>
            ) : (
              "No results"
            )}
          </div>
        </dialog>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <div className="dp">
              <img
                src={dp.secure_url}
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "150px",
                  maxHeight: "150px",
                  borderRadius: "100%",
                  marginBottom: "10px",
                }}
              />
              {state.user._id === userId ? (
                <div>
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
              ) : null}
            </div>
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <Grid
                  container
                  spacing={3}
                  direction="row"
                  justify="space-evenly"
                  alignItems="baseline"
                >
                  <Grid item>
                    <Typography>{userId}</Typography>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" onClick={() => follow()}>
                      <Typography variant="subtitile2">
                        {myProfile
                          ? "Edit Profile"
                          : ifollow
                          ? "Unfollow"
                          : "Follow"}
                      </Typography>
                    </Button>
                  </Grid>
                  {myProfile && (
                    <Grid item>
                      <IconButton>
                        <Icon>settings</Icon>
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
                <Hidden smDown>
                  <Info />
                </Hidden>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="button">{name}</Typography>
                    <Typography>VNITian</Typography>
                    <Typography>Rajput</Typography>
                    <Typography>Positivity king</Typography>
                    <Typography>Optimistic</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Hidden smUp>
          <Box pt={3} pb={3}>
            <Divider variant="fullWidth" />
            <Info />
          </Box>
        </Hidden>
        <Box pt={3} pb={3}>
          <Divider variant="fullWidth" />
        </Box>
        <div>
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
                      src={post.picture.secure_url}
                      style={{ width: "30%", margin: "10px 10px" }}
                    />
                  ))
                : "no image found"}
            </div>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Profile;
