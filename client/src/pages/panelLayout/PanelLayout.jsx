import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import "./panelLayout.scss";
function PanelLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout_container">
        <Outlet />
      </div>
    </div>
  );
}

export default PanelLayout;
