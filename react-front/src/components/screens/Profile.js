import React from "react";

const Profile = () => {
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
        <div>
          <img
            src="https://instagram.fjai1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/79967735_514903752444934_1105358873562185728_n.jpg?_nc_ht=instagram.fjai1-2.fna.fbcdn.net&_nc_ohc=tJTC28-_B6YAX9IxN5y&oh=d89568e3f4ed5c6389ac9ec8beea0729&oe=5F12AFDB"
            style={{ width: "150px", height: "150px", borderRadius: "75px" }}
          />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "108%",
            }}
          >
            <h6>im.rajansingh</h6>
            <button>Edit Profile</button>
            <button>setting </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>11 posts</h6>
            <h6>237 followers</h6>
            <h6>214 following</h6>
          </div>
          <div>
            <h6>
              <b>Rajan Singh</b>
            </h6>
            <h6>VNITian</h6>
            <h6>Rajput</h6>
            <h6>Positivity King</h6>
            <h6>Optimistic</h6>
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
          <img
            src="https://instagram.fjai1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/79967735_514903752444934_1105358873562185728_n.jpg?_nc_ht=instagram.fjai1-2.fna.fbcdn.net&_nc_ohc=tJTC28-_B6YAX9IxN5y&oh=d89568e3f4ed5c6389ac9ec8beea0729&oe=5F12AFDB"
            style={{ width: "30%", margin: "10px 10px" }}
          />
          <img
            src="https://instagram.fjai1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/79967735_514903752444934_1105358873562185728_n.jpg?_nc_ht=instagram.fjai1-2.fna.fbcdn.net&_nc_ohc=tJTC28-_B6YAX9IxN5y&oh=d89568e3f4ed5c6389ac9ec8beea0729&oe=5F12AFDB"
            style={{ width: "30%", margin: "10px 10px" }}
          />
          <img
            src="https://instagram.fjai1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/79967735_514903752444934_1105358873562185728_n.jpg?_nc_ht=instagram.fjai1-2.fna.fbcdn.net&_nc_ohc=tJTC28-_B6YAX9IxN5y&oh=d89568e3f4ed5c6389ac9ec8beea0729&oe=5F12AFDB"
            style={{ width: "30%", margin: "10px 10px" }}
          />
          <img
            src="https://instagram.fjai1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/79967735_514903752444934_1105358873562185728_n.jpg?_nc_ht=instagram.fjai1-2.fna.fbcdn.net&_nc_ohc=tJTC28-_B6YAX9IxN5y&oh=d89568e3f4ed5c6389ac9ec8beea0729&oe=5F12AFDB"
            style={{ width: "30%", margin: "10px 10px" }}
          />
          <img
            src="https://instagram.fjai1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/79967735_514903752444934_1105358873562185728_n.jpg?_nc_ht=instagram.fjai1-2.fna.fbcdn.net&_nc_ohc=tJTC28-_B6YAX9IxN5y&oh=d89568e3f4ed5c6389ac9ec8beea0729&oe=5F12AFDB"
            style={{ width: "30%", margin: "10px 10px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
