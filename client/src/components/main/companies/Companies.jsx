import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../videos/videos.scss";
import { format } from "timeago.js";
import UploadCompany from "./UploadCompany";
import CompanyUpdate from "../../updates/company/CompanyUpdate";

function Companies() {
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("http://localhost:5000/api/company/get");
      setData(data.companies);
      setIsLoaded(false);
    })();
  }, []);
  const [data, setData] = React.useState([]);
  console.log(data);
  const [videoModal, setVideoModal] = useState(false);
  const [updateModal, setUpdateModal] = useState({});
  const handleVideoModal = () => {
    setVideoModal(!videoModal);
  };

  const handleUpdate = (compId) => {
    setUpdateModal({
      compId,
      compData: data.find((item) => item._id == compId),
      modal: true,
    });
  };

  console.log(updateModal);

  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    {
      field: "name",
      headerName: "Name",
      width: 325,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row?.logo} alt="" />
            {params.row.name}
          </div>
        );
      },
    },

    {
      field: "videos",
      headerName: "Videos",
      sortable: false,
      width: 400,
      renderCell: (params) => {
        return params.row.videos?.map((video) => {
          return (
            <div
              style={{
                color: "white",
                textTransform: "capitalize",
                margin: "5px",
              }}
            >
              {video.title} <br />
            </div>
          );
        });
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="userListUser">{format(params.row.createdAt)}</div>
        );
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
      await axios.delete("http://localhost:5000/api/company/delete/" + id);

      setData(data.filter((item) => item._id !== id));
    }

    console.log(id + " id'li kullanıcı silindi");
  };
  return (
    <>
      <div className="videos_options">
        {updateModal.modal && (
          <button
            className="go-back"
            onClick={() =>
              setUpdateModal((prev) => (prev = { ...prev, modal: !prev.modal }))
            }
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        )}
        {!updateModal.modal && (
          <div
            className="add_video"
            onClick={() => {
              handleVideoModal();
            }}
          >
            <i class="fa-solid fa-user"></i>
            <span>Add Company</span>
          </div>
        )}
      </div>
      {videoModal ? (
        <UploadCompany />
      ) : (
        <div className="videos_container">
          {updateModal.modal ? (
            <CompanyUpdate editable={updateModal} />
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
                  class="fas fa-spinner fa-spin"
                ></i>
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
                  getRowId={(row) => row?._id}
                  checkboxSelection
                  disableSelectionOnClick
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Companies;
