import React from "react";

import "./Navbar.css";
import AIoTLogo from "../../static/images/LogoAIoT.png";

const Navbar = () => {
  const items = [
    {
      id: 1,
      name: "",
    },
    {
      id: 2,
      name: "",

    },
    {
      id: 3,
      name: "",
    },
    {
      id: 4,
      name: "Copyright @ 2023 - AIoT Lab VN",
    },
  ];

  return (
    <div className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <img
            src={AIoTLogo}
            alt="logo_aiot_lab_vn"
            className="navbar__logo"
          />
          <span>Air Quality Monitoring System</span>
        </div>
        <div className="navbar__right">
          <ul className="navbar__items">
            {items.map((item) => (
              <li key={item.id} className="navbar__item activate">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
