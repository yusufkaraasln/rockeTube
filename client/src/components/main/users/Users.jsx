import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../videos/videos.scss";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import NoPerson from "../../../assets/noperson.png";
import { format } from "timeago.js";
function Videos() {
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("http://localhost:5000/api/user/all");

      setData(data.users);
      console.log(data);

      setIsLoaded(false);
    })();
  }, []);


  const [data, setData] = React.useState([]);

  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    {
      field: "name",
      headerName: "Name",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img
              className="userListImg"
              src={params.row.profilePic ? params.row.profilePic : NoPerson}
              alt=""
            />
            {params.row.name}
          </div>
        );
      },
    },
    { field: "email", headerName: "E-Mail", width: 300 },
    {
      field: "role",
      headerName: "Role",
      width: 200,
      style: { color: "red" },
      renderCell: (params) => {
        return <div>{params.row.role === "admin" ? "Admin" : "User"}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      sortable: false,
      width: 200,
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
      await axios.delete("http://localhost:5000/api/user/delete/" + id);

      setData(data.filter((item) => item._id !== id));
    }

    console.log(id + " id'li kullanıcı silindi");
  };

  return (
    <>
      {isLoaded ? (
        <i
          style={{
            fontSize: "2rem",
            color: "white",
            position: "absolute",
            top: "45%",
            left: "55%",
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

            "& .css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root.Mui-checked": {
              color: "#fff",
            },
            "& .css-1n3yg7h-MuiDataGrid-root .MuiDataGrid-iconSeparator": {
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
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row._id}
          checkboxSelection
          disableSelectionOnClick
        />
      )}
    </>
  );
}

export default Videos;
