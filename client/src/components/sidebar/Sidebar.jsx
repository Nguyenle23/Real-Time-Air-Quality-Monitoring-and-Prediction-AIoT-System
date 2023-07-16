import React from "react";
import "./Sidebar.css";
import {
  FaTenge,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item">
          <a href="#" className="sidebar-menu-link">
            <FaTenge className="icon-sidebar" />
          </a>
          <a href="#" className="sidebar-menu-link">
            <FaTenge className="icon-sidebar" />
          </a>
          <a href="#" className="sidebar-menu-link">
            <FaTenge className="icon-sidebar" />
          </a>
          <a href="#" className="sidebar-menu-link">
            <FaTenge className="icon-sidebar" />
          </a>
          <a href="#" className="sidebar-menu-link">
            <FaTenge className="icon-sidebar" />
          </a> 
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
