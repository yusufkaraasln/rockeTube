import React, { useMemo } from "react";
import "./video.scss";
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
function VideoUpdate({ editable }) {
  const [logo, setLogo] = React.useState(null);

  const [currentData, setCurrentData] = React.useState({
    ...editable.videoData,
  });

  React.useEffect(() => {
    if (logo) {
      uploadFile(logo);
    }
  }, [logo]);

  const uploadFile = (file) => {
    const storage = getStorage(app);

    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "video_cover/" + fileName);
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
          const decoded = decodeURI(currentData.cover_url);
          const deletedFile = decoded?.split("%2F")[1]?.split("?")[0];
          const desertRef = ref(storage, "/video_cover/" + deletedFile);

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

          setCurrentData((prev) => ({ ...prev, cover_url: downloadURL }));
          setResultData((prev) => ({ ...prev, cover_url: downloadURL }));
        });
      }
    );
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/video/update/${editable.videoId}`,
        currentData
      );
      showToastMessage("success", "Video");
      setInterval(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      showToastMessage("error");
      console.log(error);
    }
  };
  const [options, setOptions] = React.useState({
    status: false,
    actors: false,
    company: false,
  });
  const handleActors = (domain) => {
    if (domain === "actors") {
      setOptions((prev) => ({ actors: true, status: true }));
    } else if (domain === "company") {
      setOptions((prev) => ({ company: true, status: true }));
    }
  };

  const [allActors, setAllActors] = React.useState({
    actors: [],
    actorIds: [],
    activeActorIds: [currentData.actors.map((actor) => actor._id)],
  });

  const [allCompanies, setAllCompanies] = React.useState({
    companies: [],
    companyIds: [],
    activeCompanyIds: [currentData?.company?._id],
  });

  console.log(currentData);

  React.useEffect(() => {
    (async () => {
      const res = await axios.get(`http://localhost:5000/api/actor/get`);
      setAllActors((prev) => ({
        ...prev,
        actors: res.data.actors,
        actorIds: res.data.actors.map((actor) => actor._id),
      }));
    })();

    (async () => {
      const res = await axios.get(`http://localhost:5000/api/company/get`);
      setAllCompanies((prev) => ({
        ...prev,
        companies: res.data.companies,
        companyIds: res.data.companies.map((company) => company._id),
      }));
    })();
  }, []);

  console.log(allCompanies);

  const addToActorList = (id) => {
    if (allActors.activeActorIds[0].includes(id)) {
      // setActorList((prev) => [...prev.filter((item) => item !== id)]);
      setAllActors((prev) => ({
        ...prev,
        activeActorIds: [prev.activeActorIds[0].filter((item) => item !== id)],
      }));
    } else {
      // setActorList((prev) => [...prev, id]);
      setAllActors((prev) => ({
        ...prev,
        activeActorIds: [prev.activeActorIds[0].concat(id)],
      }));
    }

    if (
      // showActors.find((item) => item._id === id) && showActors.length > 0
      currentData.actors.find((item) => item._id === id) &&
      currentData.actors.length > 0
    ) {
      // setShowActors((prev) => [...prev.filter((item) => item._id !== id)]);
      setCurrentData((prev) => ({
        ...prev,
        actors: prev.actors.filter((item) => item._id !== id),
      }));
    } else {
      // setShowActors((prev) => [
      //   ...prev,
      //   actorsData.find((item) => item._id === id),
      // ]);

      setCurrentData((prev) => ({
        ...prev,
        actors: prev.actors.concat(
          allActors.actors.find((item) => item._id === id)
        ),
      }));
    }
  };

  const [resultData, setResultData] = React.useState(currentData);

  React.useEffect(() => {
    setResultData((prev) => ({
      ...prev,
      actors: allActors.activeActorIds[0],
    }));
  }, [allActors.activeActorIds[0]]);

  console.log("Active Actors", allActors.activeActorIds[0]);
  console.log("Current Data", currentData);
  console.log("Result Data", resultData);

  // React.useEffect(() => {
  //   setCurrentData((prev) => ({
  //     ...prev,
  //     actors: allActors.activeActorIds[0],
  //   }));
  // }, [allActors.activeActorIds[0]]);

  const selectCompany = (id) => {
    setAllCompanies((prev) => ({
      ...prev,
      activeCompanyIds: [id],
    }));

    setCurrentData((prev) => ({
      ...prev,
      company: allCompanies.companies.find((item) => item._id === id),
    }));

    setResultData((prev) => ({
      ...prev,
      company: id,
    }));
  };

  return (
    <>
      <div className="company_update">
        {options.status && (
          <div className="update_modal">
            <div className="close_update_modal">
              <i
                className="fas fa-times"
                onClick={() => setOptions((prev) => ({ status: false }))}
              ></i>
            </div>

            {options.actors && (
              <div className="actor_list">
                {allActors.actors.map((actor, id) => (
                  <div
                    key={id}
                    className={
                      allActors.activeActorIds[0].includes(actor._id)
                        ? "actor_list_item active"
                        : "actor_list_item"
                    }
                    onClick={() => addToActorList(actor._id)}
                  >
                    <img src={actor.photo ? actor.photo : NoPerson} />
                    <span>{actor.name}</span>
                  </div>
                ))}
              </div>
            )}
            {options.company && (
              <div className="actor_list">
                {allCompanies.companies.map((company, id) => (
                  <div
                    key={id}
                    className={
                      allCompanies.activeCompanyIds[0] == company._id
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
        )}

        <div className="company_update__logo">
          <div className="update_logo_wrapper">
            <img
              src={currentData.cover_url ? currentData.cover_url : NoPerson}
              alt=""
            />
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
          <div className="update_actors">
            <span className="update_actors__list">
              Actors
              <i
                onClick={() => handleActors("actors")}
                className="fas fa-pen"
              ></i>
            </span>

            <div className="update_actors__items">
              {currentData.actors.map((actor) => (
                <div className="actor_single">
                  <img src={actor.photo ? actor.photo : NoPerson} alt="" />
                  <span key={actor._id} className="">
                    {actor.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="update_actors">
            <span className="update_actors__list">
              Company
              <i
                className="fas fa-pen"
                onClick={() => handleActors("company")}
              ></i>
            </span>
            <div className="update_actors__items">
              <div className="actor_single">
                <img
                  src={
                    currentData.company?.logo
                      ? currentData.company?.logo
                      : NoPerson
                  }
                  alt=""
                />
                <span className="">{currentData.company?.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="company_update__info">
          <div className="company_field">
            <h3>Video Title</h3>
            <input
              name="title"
              onChange={(e) => {
                setCurrentData((prev) => ({ ...prev, title: e.target.value }));
                setResultData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
              placeholder={currentData.title}
              type="text"
            />
          </div>
          <div className="company_field">
            <h3>Video Description</h3>
            <textarea
              onChange={(e) => {
                setCurrentData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
                setResultData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
              placeholder={currentData.description}
              name="description"
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

export default VideoUpdate;
