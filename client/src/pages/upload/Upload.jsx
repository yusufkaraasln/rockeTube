import React from "react";
import "./upload.scss";
import { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../utils/firebase";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToastMessage = (status, domain) => {
  if (status == "success") {
    toast.success(domain + " uploaded successfully!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
    });
  } else {
    toast.error("Something went wrong", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};

function Upload() {
  const [input, setInput] = useState({});
  const [video, setVideo] = useState(null);
  const [cover, setCover] = useState(null);
  const [videoPercent, setVideoPercent] = useState(0);
  const [coverPercent, setCoverPercent] = useState(0);
  const [actorList, setActorList] = useState([]);
  const [urlModal, setUrlModal] = useState(false);
  const [showActors, setShowActors] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);
  const [company, setCompany] = useState("");
  const [modals, setModals] = useState({
    video: false,
    cover: false,
    actor: false,
    company: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleActors = (e) => {
    setModals((prev) => {
      return {
        ...prev,
        actor: true,
      };
    });
    setUrlModal(true);
  };
  console.log(actorList);

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        if (urlType === "video_url") {
          setVideoPercent(progress);
        } else {
          setCoverPercent(progress);
        }

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setInput((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/video/create", {
        ...input,
      });

      showToastMessage("success", "Video");
      setInterval(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      showToastMessage("error");
      console.log(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setUrlModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (video) {
      uploadFile(video, "video_url");
    }
  }, [video]);

  useEffect(() => {
    if (cover) {
      uploadFile(cover, "cover_url");
    }
  }, [cover]);
  const [actorsData, setActorsData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/actor/get");
        setActorsData(data.actors);
      } catch (error) {
        console.log(error);
      }
    })();

    (async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/company/get"
        );
        setCompaniesData(data.companies);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const addToActorList = (id) => {
    if (actorList.includes(id)) {
      setActorList((prev) => [...prev.filter((item) => item !== id)]);
    } else {
      setActorList((prev) => [...prev, id]);
    }

    if (showActors.find((item) => item._id === id) && showActors.length > 0) {
      setShowActors((prev) => [...prev.filter((item) => item._id !== id)]);
    } else {
      setShowActors((prev) => [
        ...prev,
        actorsData.find((item) => item._id === id),
      ]);
    }
  };
  useEffect(() => {
    setInput((prev) => {
      return {
        ...prev,
        actors: actorList,
      };
    });
  }, [actorList]);

  const handleCompanies = (id) => {
    setModals((prev) => {
      return {
        actor: false,
        cover: false,
        video: false,

        company: true,
      };
    });
    setUrlModal(true);

    setCompany(id);
  };
  const [showCompanies, setShowCompanies] = useState({});

  const selectCompany = (id) => {
    setCompany(id);
    setShowCompanies(companiesData.find((item) => item._id === id));

    setInput((prev) => {
      return {
        ...prev,
        company: id,
      };
    });
  };
  console.log(input);

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="wrapper-directions">
            <div className="wrapper-directions-left">
              <span>Identifier</span>
              <div className="field">
                <label htmlFor="">Title</label>
                <input name="title" onChange={handleChange} type="text" />
              </div>
              <div className="field">
                <label htmlFor="">Description</label>
                <textarea onChange={handleChange} name="description" />
              </div>
              <div className="field">
                <label htmlFor="" onClick={handleActors}>
                  Actor
                  <i class="fa-solid fa-plus"></i>
                </label>

                <div className="actors" type="text">
                  {showActors.length > 0 &&
                    showActors.map((item, id) => (
                      <div key={id} className="selected_actors">
                        <img
                          className="selected_actors_img"
                          src={item?.photo}
                        />
                        <span className="selected_actors_span">
                          {item?.name}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="field">
                <label htmlFor="" onClick={handleCompanies}>
                  Company <i class="fa-solid fa-plus"></i>
                </label>
                <div className="actors" type="text">
                  {showCompanies && (
                    <div className="selected_actors">
                      <img
                        className="selected_actors_img"
                        src={showCompanies?.logo}
                      />
                      <span className="selected_actors_span">
                        {showCompanies?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="wrapper-directions-right">
              <span>Files</span>
              <div className="field">
                <label htmlFor="">
                  Cover Picture
                  {coverPercent == 100 && (
                    <i
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      class="fa-solid fa-arrow-up-right-from-square"
                      onClick={() => {
                        setUrlModal(true);
                        setModals({ video: false, cover: true });
                      }}
                    ></i>
                  )}
                </label>

                {coverPercent > 0 ? (
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        transition: "width 0.5s ease",
                        textAlign: "center",
                        width: `${coverPercent}%`,
                      }}
                      aria-valuenow={coverPercent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {Math.round(coverPercent)}%
                    </div>
                  </div>
                ) : (
                  <>
                    <label
                      style={{
                        backgroundColor: "#666666",
                        display: "inline-block",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      htmlFor="video_url"
                    >
                      Upload
                      <i
                        style={{ marginLeft: "10px" }}
                        class="fa-solid fa-cloud"
                      ></i>
                    </label>
                    <input
                      style={{ display: "none" }}
                      id="video_url"
                      type="file"
                      onChange={(e) => setCover(e.target.files[0])}
                      accept="image/*"
                    />
                  </>
                )}
              </div>
              <div className="field">
                <label htmlFor="">
                  Video
                  {videoPercent == 100 && (
                    <i
                      onClick={() => {
                        setUrlModal(true);
                        setModals({ video: true, cover: false });
                      }}
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      class="fa-solid fa-arrow-up-right-from-square"
                    ></i>
                  )}
                </label>
                {videoPercent > 0 ? (
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        transition: "width 0.5s ease",
                        textAlign: "center",
                        width: `${videoPercent}%`,
                      }}
                      aria-valuenow={videoPercent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {Math.round(videoPercent)} %
                    </div>
                  </div>
                ) : (
                  <>
                    <label
                      style={{
                        backgroundColor: "#666666",
                        display: "inline-block",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      htmlFor="cover_url"
                    >
                      Upload
                      <i
                        style={{ marginLeft: "10px" }}
                        class="fa-solid fa-cloud"
                      ></i>
                    </label>
                    <input
                      style={{ display: "none" }}
                      id="cover_url"
                      type="file"
                      onChange={(e) => setVideo(e.target.files[0])}
                      accept="video/*"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="upload">
            <button onClick={handleSubmit}>Upload</button>
          </div>
        </div>
        {urlModal && (
          <div className="preview">
            <i
              onClick={() => setUrlModal(false)}
              id="close_icon"
              class="fa-regular fa-circle-xmark"
            ></i>

            <div className="preview-video">
              {modals.video && (
                <video
                  src={input.video_url}
                  width="900"
                  height="450"
                  style={{
                    backgroundImage: "none !important",
                    objectFit: "cover",
                    borderRadius: "2rem",
                  }}
                  controls
                ></video>
              )}
              {modals.cover && (
                <img
                  src={input.cover_url}
                  height="450"
                  width="900"
                  style={{ objectFit: "cover" }}
                />
              )}
              {modals.actor && (
                <div className="actor_list">
                  {actorsData.map((actor, id) => (
                    <div
                      key={id}
                      className={
                        actorList.includes(actor._id)
                          ? "actor_list_item active"
                          : "actor_list_item"
                      }
                      onClick={() => addToActorList(actor._id)}
                    >
                      <img src={actor.photo} />
                      <span>{actor.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {modals.company && (
                <div className="actor_list">
                  {companiesData.map((company, id) => (
                    <div
                      key={id}
                      className={
                        showCompanies._id == company._id
                          ? "actor_list_item active"
                          : "actor_list_item"
                      }
                      onClick={() => selectCompany(company._id)}
                    >
                      <img src={company.logo} />
                      <span>{company.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default Upload;
export { showToastMessage };
