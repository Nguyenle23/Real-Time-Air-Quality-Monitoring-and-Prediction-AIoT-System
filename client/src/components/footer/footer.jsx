import React from "react";
import { FaFacebook, FaGithub, FaGooglePlay, FaLinkedin } from "react-icons/fa";
import qrGooglePlay from "../../assets/qr_aiair_google_play.png";
import "./footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <ul className="social-icons">
        <li>
          <a
            href="https://github.com/https://github.com/Nguyenle23"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/aiotlab.vn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/company/aiot-lab-vn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </li>
        <li>
          <a
            href="https://play.google.com/store/apps/details?id=com.aiotlabvn.iu_air_quality"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGooglePlay />
          </a>
        </li>
      </ul>
      <ul className="qr-codes">
        <li className="qr-code">
          <img
            src="https://res.cloudinary.com/nguyenle23/image/upload/v1703403332/qr_rmbg_jw4jix.png"
            alt="Google Play Store QR Code"
          />
        </li>
        <li className="qr-code">
          <img
            src="https://res.cloudinary.com/nguyenle23/image/upload/v1703403428/aiair_femkrw.png"
            alt="Logo AIAir"
          />
        </li>
        <li className="qr-code">
          <img
            src="https://res.cloudinary.com/nguyenle23/image/upload/v1703403534/AIoT-Logo-white_sgefbb.png"
            alt="Logo AIoT Lab"
          />
        </li>
      </ul>
    </div>
  );
};

export default Footer;
