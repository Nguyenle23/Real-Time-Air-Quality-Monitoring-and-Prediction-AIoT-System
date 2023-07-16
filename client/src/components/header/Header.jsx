import React, { useEffect, useState } from "react";
import "./Header.css";
import tempIcon from "../../assets/temp-icon.png";
import humiIcon from "../../assets/humi-icon.png";
import co2Icon from "../../assets/co2-icon.png";
import coIcon from "../../assets/co-icon.png";
import dustIcon from "../../assets/dust-icon.png";
import uvIcon from "../../assets/uv-icon.png";
import mapIcon from "../../assets/map-icon.png";
import { getDataThingSpeak } from "../../apis/callAPI";

const Header = () => {
  const [thingspeak, setThingspeak] = useState([]);
  const keyData = [
    {
      index: "1",
      icon: tempIcon,
      title: "Temperature",
      field: "field1",
      level: "level",
      width: "4rem",
      height: "4rem",
    },
    {
      index: "2",
      icon: humiIcon,
      title: "Humidity",
      field: "field2",
      level: "level",
      width: "4rem",
      height: "4rem",
    },
    {
      index: "3",
      icon: co2Icon,
      title: "MQ135",
      field: "field3",
      level: "level",
      width: "5rem",
      height: "5.5rem",
    },
    {
      index: "4",
      icon: coIcon,
      title: "MQ7",
      field: "field4",
      level: "level",
      width: "4rem",
      height: "4rem",
    },
    {
      index: "5",
      icon: dustIcon,
      title: "PM2.5",
      field: "field5",
      level: "level",
      width: "4.5rem",
      height: "4.5rem",
    },
    {
      index: "6",
      icon: uvIcon,
      title: "UV Index",
      field: "field6",
      level: "level",
      width: "4.5rem",
      height: "4.5rem",
    },
  ];

  useEffect(() => {
    const getData = async () => {
      const data = await getDataThingSpeak();
      var getFeeds = data.feeds;
      setThingspeak(getFeeds);
    };

    getData();

    // const interval = setInterval(() => {
    //   getData();
    //   console.log("Refresh");
    // }, 30000);

    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="header">
      <div className="nav-links-left">
        <div className="nav-item-left">
          <div className="image-left">
            <img
              style={{ width: "6rem", height: "5rem" }}
              src={mapIcon}
              alt="icon"
            />
          </div>
          <div className="info-right">
            <h4>District</h4>
            <span>Phu Nhuan</span>
            <h4>Ho Chi Minh City</h4>
          </div>
        </div>
      </div>
      <ul className="nav-links-right">
        {keyData.map((data) => (
          <li key={data.index} className="nav-item-right">
            <img
              src={data.icon}
              style={{ width: data.width, height: data.height }}
              alt="icon"
            />
            <div className="column-right">
              <h5>{data.title}</h5>
              <span>
                {thingspeak[19] ? thingspeak[19][data.field] : "Loading..."}
              </span>
              <h4>{data.level}</h4>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Header;
