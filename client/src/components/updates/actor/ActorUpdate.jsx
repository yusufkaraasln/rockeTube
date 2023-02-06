import React, { useMemo } from "react";
import "./actor.scss";
import NoPerson from "../../../assets/noperson.png";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../../../utils/firebase";
import axios from "axios";
import { showToastMessage } from "../../../pages/upload/Upload";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ActorUpdate({ editable }) {
  const [logo, setLogo] = React.useState(null);
  const [currentData, setCurrentData] = React.useState({
    ...editable.actorData,
  });

  React.useEffect(() => {
    if (logo) {
      uploadFile(logo);
    }
  }, [logo]);
  console.log(currentData);

  const uploadFile = (file) => {
    const storage = getStorage(app);

    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "actor/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
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
        if (currentData.photo) {
          const decoded = decodeURI(currentData.photo);
          const deletedFile = decoded?.split("%2F")[1]?.split("?")[0];
          const desertRef = ref(storage, "/actor/" + deletedFile);

          deleteObject(desertRef)
            .then(() => {
              console.log("File deleted successfully!");
            })
            .catch((err) => {
              console.log(err);
            });
        }

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);

          setCurrentData((prev) => ({ ...prev, photo: downloadURL }));
        });
      }
    );
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/actor/update/${editable.actorId}`,
        currentData
      );
      showToastMessage("success", "Actor");
      setInterval(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      showToastMessage("error");
      console.log(error);
    }
  };

  return (
    <>
      <div className="company_update">
        <div className="company_update__logo">
          <div className="update_logo_wrapper">
            <img src={currentData.photo ? currentData.photo : NoPerson} alt="" />
            <div className="update_file">
              <label htmlFor="logo">
                <input
                  id="logo"
                  type="file"
                  onChange={(e) => {
                    setLogo(e.target.files[0]);
                  }}
                />
                <i className="fas fa-camera"></i>
              </label>
            </div>
          </div>
        </div>

        <div className="company_update__info">
          <div className="company_field">
            <h3>Actor Name</h3>
            <input
              name="name"
              onChange={(e) => {
                setCurrentData((prev) => ({ ...prev, name: e.target.value }));
              }}
              placeholder={currentData.name}
              type="text"
            />
          </div>
          <div className="company_field">
            <h3>Actor Age</h3>
            <input
              onChange={(e) => {
                setCurrentData((prev) => ({
                  ...prev,
                  age: e.target.value,
                }));
              }}
              placeholder={currentData.age}
              name="website"
              type="number"
            />
          </div>
          <button onClick={handleUpdate} className="update_this">
            Update
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default ActorUpdate;
