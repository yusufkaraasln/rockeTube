import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./videos.scss";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Upload from "../../../pages/upload/Upload";
import VideoUpdate from "../../updates/video/VideoUpdate";

function Videos() {
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("http://localhost:5000/api/video/get");

      setData(data.videos);
      setIsLoaded(false);
    })();
  }, []);
  const handleUpdate = (videoId) => {
    setUpdateModal({
      videoId,
      videoData: data.find((item) => item._id == videoId),
      modal: true,
    });
  };

  const [data, setData] = React.useState([]);
  const [updateModal, setUpdateModal] = useState({});
  console.log(data);

  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    {
      field: "title",
      headerName: "Video Title",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.cover_url} alt="" />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "company",
      headerName: "Company",
      width: 200,
      renderCell: (params) => {
        return <div className="userListUser">{params.row.company?.name}</div>;
      },
    },
    {
      field: "actors",
      headerName: "Actors",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        return params.row.actors?.map((actor) => {
          console.log(actor.name);
          return (
            <div
              style={{
                color: "white",
                textTransform: "capitalize",
                margin: "5px",
              }}
            >
              {actor.name} <br />
            </div>
          );
        });
      },
    },
    {
      field: "action",
      headerName: "Options",
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => {
                handleUpdate(params.row._id);
              }}
              className="userListEdit"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(params.row._id)}
              className="userListDelete"
            >
              Delete
            </button>
          </>
        );
      },
    },
  ];

  const handleDelete = async (id) => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      await axios.delete("http://localhost:5000/api/video/delete/" + id);

      setData(data.filter((item) => item._id !== id));
    }

    console.log(id + " id'li kullanıcı silindi");
  };
  const [videoModal, setVideoModal] = useState(false);
  const handleVideoModal = () => {
    setVideoModal(!videoModal);
  };

  return (
    <>
      <>
        <div className="videos_options">
          {updateModal.modal && (
            <button
              className="go-back"
              onClick={() =>
                setUpdateModal(
                  (prev) => (prev = { ...prev, modal: !prev.modal })
                )
              }
            >
              <i className="fas fa-arrow-left"></i>
            </button>
          )}

          {!updateModal.modal && (
            <>
              <div
                className="add_video"
                onClick={() => {
                  handleVideoModal();
                }}
              >
                <i class="fa-solid fa-plus"></i>
                <span>Add New Video</span>
              </div>
              <div className="upload_bulk">
                <i class="fa-solid fa-video"></i>
                <span>Upload Bulk</span>
              </div>
            </>
          )}
        </div>
        {videoModal ? (
          <Upload />
        ) : (
          <div className="videos_container">
            {updateModal.modal ? (
              <VideoUpdate editable={updateModal} />
            ) : (
              <>
                {isLoaded ? (
                  <i
                    style={{
                      fontSize: "2rem",
                      color: "white",
                      position: "absolute",
                      top: "40%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                    }}

                  class="fas fa-spinner fa-spin"></i>
                ) : (
                  <DataGrid
                    rows={data}
                    columns={columns}
                    style={{
                      height: "100%",
                      border: "none",
                      color: "white",
                    }}
                    sx={{
                      "& .MuiDataGrid-row.Mui-even:not(.Mui-selected):not(.Mui-selected):hover":
                        {
                          backgroundColor: "red",
                        },

                      "& .MuiDataGrid-row.Mui-selected": {
                        backgroundColor: "#3b3b3b",
                        borderRadius: "1rem",
                      },
                      "& .MuiDataGrid-row.Mui-selected:hover": {
                        backgroundColor: "#3b3b3b",
                      },
                      "& .css-s1v7zr-MuiDataGrid-virtualScrollerRenderZone": {
                        marginTop: "1rem !important",
                        gap: "1rem !important",
                      },

                      "& .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root.Mui-checked":
                        {
                          color: "#fff",
                        },
                      "& .css-1n3yg7h-MuiDataGrid-root .MuiDataGrid-iconSeparator":
                        {
                          display: "none !important",
                          color: "transparent !important",
                        },
                      "& .MuiDataGrid-cell:focus-within": {
                        outline: "none",
                      },
                      "& .css-i4bv87-MuiSvgIcon-root": {
                        color: "#fff",
                      },
                      "& .css-levciy-MuiTablePagination-displayedRows": {
                        color: "#fff",
                      },
                      "& .css-17jjc08-MuiDataGrid-footerContainer": {
                        border: "none !important",
                      },
                      "&>.MuiDataGrid-main": {
                        "&>.MuiDataGrid-columnHeaders": {
                          borderBottom: "none",
                        },

                        "& div div div div >.MuiDataGrid-cell": {
                          borderBottom: "none",
                        },
                      },
                    }}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    getRowId={(row) => row._id}
                    checkboxSelection
                    disableSelectionOnClick
                  />
                )}
              </>
            )}
          </div>
        )}
      </>
    </>
  );
}

export default Videos;
