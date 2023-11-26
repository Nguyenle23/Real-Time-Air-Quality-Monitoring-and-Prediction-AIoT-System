import React from "react";

import "./Navbar.css";
import AIoTLogo from "../../static/images/Asset paper.png";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <img src={AIoTLogo} alt="logo_aiot_lab_vn" className="navbar__logo" />
          <h4 className="navbar__title">
            AIAir - Hệ thống theo dõi và dự báo các chỉ số của chất lượng không
            khí
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
