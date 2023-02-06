import React, { useState } from "react";
import "./sidebar.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
function Sidebar() {
  const [active, setActive] = useState("home");

  const handleClick = (e) => {
    setActive(e.target.innerText.toLowerCase());
  };

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
  };
  console.log(user);

  return (
    <div className="sidebar">
      <ul className="list">
        <li className="list-item logo">Logo Gelecek</li>

        <Link to="/">
          <li
            className={active === "home" ? "list-item active" : "list-item"}
            onClick={handleClick}
          >
            <i
              class={
                active === "home"
                  ? "fa-solid fa-home active"
                  : "fa-solid fa-home"
              }
            ></i>
            Home
          </li>
        </Link>

        <Link to="/videos">
          <li
            className={active === "videos" ? "list-item active" : "list-item"}
            onClick={handleClick}
          >
            <i
              class={
                active === "videos"
                  ? "fa-solid fa-video active"
                  : "fa-solid fa-video"
              }
            ></i>
            Videos
          </li>
        </Link>

        <Link to="/actors">
          <li
            className={active === "actors" ? "list-item active" : "list-item"}
            onClick={handleClick}
          >
            <i
              class={
                active === "actors"
                  ? "fa-solid fa-user-ninja active"
                  : "fa-solid fa-user-ninja"
              }
            ></i>
            Actors
          </li>
        </Link>

        <Link to="/companies">
          <li
            className={
              active === "companies" ? "list-item active" : "list-item"
            }
            onClick={handleClick}
          >
            <i
              class={
                active === "companies"
                  ? "fa-solid fa-building active"
                  : "fa-solid fa-building"
              }
            ></i>
            Companies
          </li>
        </Link>

        <Link to="/users">
          <li
            className={active === "users" ? "list-item active" : "list-item"}
            onClick={handleClick}
          >
            <i
              class={
                active === "users"
                  ? "fa-solid fa-users active"
                  : "fa-solid fa-users"
              }
            ></i>
            Users
          </li>
        </Link>
        <Link to="/comments">
          <li
            className={active === "comments" ? "list-item active" : "list-item"}
            onClick={handleClick}
          >
            <i
              class={
                active === "comments"
                  ? "fa-solid fa-comment active"
                  : "fa-solid fa-comment"
              }
            ></i>
            Comments
          </li>
        </Link>

        <li className={"list-item admin"}>
          <div className="container_admin">
            <div className="container_admin_item">
              <span>Admin</span>
              <i class="fa-solid fa-user-shield"></i>
            </div>

            <div className="container_admin_item">
              <span>{user?.name}</span>
              <i class="fa-solid fa-user"></i>
            </div>
            <div className="container_admin_item" onClick={handleLogout}>
              <span>Logout</span>
              <i class="fa-solid fa-sign-out-alt"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
