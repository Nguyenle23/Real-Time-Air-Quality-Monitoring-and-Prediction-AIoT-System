import React, { useState, useEffect } from "react";
import { getNewestDataHCM } from "../../apis/callAPI";
import { convertToBangkokTime } from "../../utils/utilsDay";

import "./InfoHighlight.css";

const InfoHighlight = () => {
  const locationMark =
    "https://res.cloudinary.com/nguyenle23/image/upload/v1705157485/icon-zalo-mini-app/location_s8onon.png";
  const [dataHCM, setDataHCM] = useState([]);
  const [timeHCM, setTimeHCM] = useState("");
  const keyData = [
    {
      index: "1",
      icon: "https://res.cloudinary.com/nguyenle23/image/upload/v1705157468/icon-zalo-mini-app/temp-icon_el4h7a.webp",
      title: "Temperature",
      field: "field1",
      level: "°C",
      width: "1rem",
      height: "1rem",
    },
    {
      index: "2",
      icon: "https://res.cloudinary.com/nguyenle23/image/upload/v1705157451/icon-zalo-mini-app/humi-icon_ip7vot.webp",
      title: "Humidity",
      field: "field2",
      level: "%",
      width: "1rem",
      height: "1rem",
    },
    {
      index: "3",
      icon: "https://res.cloudinary.com/nguyenle23/image/upload/v1705157449/icon-zalo-mini-app/co2-icon_qwq83i.webp",
      title: "MQ135",
      field: "field3",
      level: "PPM",
      width: "5rem",
      height: "5.5rem",
    },
    {
      index: "4",
      icon: "https://res.cloudinary.com/nguyenle23/image/upload/v1705157450/icon-zalo-mini-app/co-icon_t2cszq.png",
      title: "MQ7",
      field: "field4",
      level: "PPM",
      width: "1rem",
      height: "1rem",
    },
    {
      index: "5",
      icon: "https://res.cloudinary.com/nguyenle23/image/upload/v1705157453/icon-zalo-mini-app/uv-icon_a8e1wr.png",
      title: "UV Index",
      field: "field6",
      level: "",
      width: "4.5rem",
      height: "4.5rem",
    },
    {
      index: "6",
      icon: "https://res.cloudinary.com/nguyenle23/image/upload/v1705157452/icon-zalo-mini-app/dust-icon_cu4dt7.png",
      title: "PM2.5",
      field: "field5",
      level: "µg m3",
      width: "4.5rem",
      height: "4.5rem",
    },
  ];

  useEffect(() => {
    const getData = async () => {
      const data = await getNewestDataHCM();
      var getFeeds = data.feeds;
      setDataHCM(getFeeds);
      setTimeHCM(getFeeds[0].created_at);
    };
    getData();
  }, []);

  return (
    <div className="header">
      <div className="location">
        <img className="location-icon" src={locationMark} alt="icon" />
        <h3 className="location-text">
          {timeHCM
            ? convertToBangkokTime(timeHCM).hour +
              ":" +
              convertToBangkokTime(timeHCM).minute +
              " " +
              convertToBangkokTime(timeHCM).amPm +
              " | "
            : "Loading..."}
          Phu Nhuan District, Ho Chi Minh City
        </h3>
      </div>
      <div className="header-container">
        <ul className="figure-list">
          {keyData.map((data) => (
            <li key={data.index} className="list-item">
              <img className="icon" src={data.icon} alt="icon" />
              <div className="list-item-detail">
                <h4 className="list-item-title">{data.title}</h4>
                <span className="list-item-number">
                  <span>
                    {dataHCM[0]
                      ? Math.round(dataHCM[0][data.field] * 1000) / 1000
                      : "Loading..."}
                  </span>
                  <span className="list-item-level">{data.level}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoHighlight;
