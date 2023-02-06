import React from "react";
import "./uploadActor.scss";
import { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../../utils/firebase"
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function UploadActor() {
  const [input, setInput] = useState({});
  const [actorPhoto, setActorPhoto] = useState(null);
  const [actorPercent, setActorPercent] = useState(0);
  const [urlModal, setUrlModal] = useState(false);
  const [modals, setModals] = useState({
    photo: false,
     
  });

  const showToastMessage = (status) => {
    console.log(status);
    if (status == "success") {
      toast.success("Actor Photo uploaded successfully!", {
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "actors/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        if (urlType === "photo") {
          setActorPercent(progress);
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
      const res = await axios.post("http://localhost:5000/api/actor/create", {
        ...input,
      });

      console.log(res.data);
      showToastMessage("success");
      setInterval(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      showToastMessage("error");
      console.log(error);
    }
  };

  useEffect(() => {
    if (actorPhoto) {
      uploadFile(actorPhoto, "photo");
    }
  }, [actorPhoto]);

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="wrapper-directions">
            <div className="wrapper-directions-left">
              <span>Identifier</span>
              <div className="field">
                <label htmlFor="">Name</label>
                <input name="name" onChange={handleChange} type="text" />
              </div>
              <div className="field">
                <label htmlFor="">Age</label>
                <input type="number" onChange={handleChange} name="age" />
              </div>
            </div>
            <div className="wrapper-directions-right">
              <span>Photo</span>
              <div className="field">
                <label htmlFor="">
                  Actor Photo
                  {actorPercent == 100 && (
                    <i
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      class="fa-solid fa-arrow-up-right-from-square"
                      onClick={() => {
                        setUrlModal(true);
                        setModals({ photo: true  });
                      }}
                    ></i>
                  )}
                </label>

                {actorPercent > 0 ? (
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        transition: "width 0.5s ease",
                        textAlign: "center",
                        width: `${actorPercent}%`,
                      }}
                      aria-valuenow={actorPercent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {Math.round(actorPercent)}%
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
                      htmlFor="photo"
                    >
                      Upload
                      <i
                        style={{ marginLeft: "10px" }}
                        class="fa-solid fa-cloud"
                      ></i>
                    </label>
                    <input
                      style={{ display: "none" }}
                      id="photo"
                      type="file"
                      onChange={(e) => setActorPhoto(e.target.files[0])}
                      accept="image/*"
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
              {modals.photo && (
                <img
                  src={input.photo}
                  height="450"
                  width="900"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default UploadActor;
