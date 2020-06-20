import React from "react";
import icons from "../../assets";

const Post = (props) => {
  const url = "/post/image/" + props.filename;
  const url2 =
    "https://instagram.fjai1-2.fna.fbcdn.net/v/t51.2885-19/s320x320/79967735_514903752444934_1105358873562185728_n.jpg?_nc_ht=instagram.fjai1-2.fna.fbcdn.net&_nc_ohc=tJTC28-_B6YAX9IxN5y&oh=d89568e3f4ed5c6389ac9ec8beea0729&oe=5F12AFDB";
  return (
    <div
      style={{
        width: "80%",
        maxWidth: "600px",
        margin: "26px auto",
        border: "1px solid grey",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
          }}
        >
          <img
            src={url}
            style={{ width: "35px", height: "35px", borderRadius: "17px" }}
          />
          <h6>im.rajansingh</h6>
        </div>
        <img
          src={url}
          style={{ width: "35px", height: "35px", borderRadius: "17px" }}
        />
      </div>
      <img src={url} style={{ width: "100%" }} />
      <div>
        <section style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex" }}>
            <span>
              <button>
                <img src={icons.images.heartIcon}></img>
              </button>
            </span>
            <span>
              <button>
                <img src={icons.images.chatIcon}></img>
              </button>
            </span>
            <span>
              <button>
                <img src={icons.images.arrowIcon}></img>
              </button>
            </span>
          </div>
        </section>
        <section>
          <div>
            <span>
              <span>267</span>" views"
            </span>
          </div>
        </section>
        <div>
          <div>
            <a>
              "View all "<span>26</span>" comments"
            </a>
          </div>
        </div>
        <div>
          <a>1 hours ago</a>
        </div>
        <section>
          <div>
            <form>
              <textarea></textarea>
              <button>sumbit</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Post;
