import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
  LayerGroup,
  Circle,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import "./Map.css";

import {
  getNewestDataHCM,
  getNewestDataThuDuc,
  getWindHCM,
  getWindThuDuc,
} from "../../apis/callAPI";

const Map = () => {
  //get newest data
  const [dataHCM, setDataHCM] = useState([]);
  const [windHCM, setWindHCM] = useState([]);
  const [dataThuDuc, setDataThuDuc] = useState([]);
  const [windThuDuc, setWindThuDuc] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await getNewestDataHCM();
      const dataWindHCM = await getWindHCM();
      setDataHCM(response.feeds[0]);
      setWindHCM(dataWindHCM.wind);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const response = await getNewestDataThuDuc();
      const dataWindTD = await getWindThuDuc();
      setDataThuDuc(response.feeds[0]);
      setWindThuDuc(dataWindTD.wind);
    };
    getData();
  }, []);


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    const formattedDate = `${formattedDay}.${formattedMonth}.${year}`;
    const formattedTime = `${formattedHour}:${formattedMinutes}:${formattedSeconds}`;

    return `${formattedDate} - ${formattedTime}`;
  };

  //map data
  const firtsPosition = [10.762622, 106.660172];
  const stationMarkers = [
    {
      key: "marker1",
      position: [10.7936588867, 106.6803109431],
      children: "Station 1 - Ho Chi Minh City",
      temp: Math.round(dataHCM["field1"] * 1000) / 1000,
      humi: Math.round(dataHCM["field2"] * 1000) / 1000,
      co2: Math.round(dataHCM["field3"] * 1000) / 1000,
      co: Math.round(dataHCM["field4"] * 1000) / 1000,
      dust: Math.round(dataHCM["field5"] * 1000) / 1000,
      uv: Math.round(dataHCM["field6"] * 1000) / 1000,
      windDirection: windHCM.deg,
      windSpeed: windHCM.speed,
      time: formatTimestamp(dataHCM["created_at"]),
    },
    {
      key: "marker2",
      position: [10.8619784, 106.8034464],
      children: "Station 2 - Thu Duc City",
      temp: Math.round(dataHCM["field1"] * 1000) / 1000,
      humi: Math.round(dataHCM["field2"] * 1000) / 1000,
      co2: Math.round(dataHCM["field3"] * 1000) / 1000,
      co: Math.round(dataHCM["field4"] * 1000) / 1000,
      dust: Math.round(dataHCM["field5"] * 1000) / 1000,
      uv: Math.round(dataHCM["field6"] * 1000) / 1000,
      windDirection: windThuDuc.deg,
      windSpeed: windThuDuc.speed,
      time: formatTimestamp(dataThuDuc["created_at"]),
    },
  ];

  const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            You are here
          </span>
        </Popup>
      </Marker>
    );
  };

  const MyPopupMarker = ({
    children,
    position,
    temp,
    humi,
    co2,
    co,
    dust,
    uv,
    time,
    windDirection,
    windSpeed,
  }) => (
    <Marker position={position}>
      <Popup>
        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {children}
        </span>
        <br />
        <span
          style={{
            fontSize: "1.2rem",
          }}
        >
          Time: {time}
        </span>
        <br />
        <span
          style={{
            fontSize: "1.2rem",
          }}
        >
          Temperature: {temp} °C
        </span>
        <br />
        <span
          style={{
            fontSize: "1.2rem",
          }}
        >
          Humidity: {humi} %
        </span>
        <br />
        <span
          style={{
            fontSize: "1.2rem",
          }}
        >
          CO2: {co2} PPM
        </span>
        <br />
        <span
          style={{
            fontSize: "1.2rem",
          }}
        >
          CO: {co} PPM
        </span>
        <br />
        <span
          style={{
            fontSize: "1.2rem",
          }}
        >
          Dust: {dust} PPM
        </span>
        <br />
        <span
          style={{
            fontSize: "1.2rem",
          }}
        >
          UV Index: {uv}
        </span>
        <br />
        <span
          style={{
            fontSize: "1.2rem",
          }}
        >
          Wind Direction: {windDirection}
        </span>
        <br />
        <span
          style={{
            fontSize: "1.2rem",
          }}
        >
          Wind Speed: {windSpeed}
        </span>
        <br />
      </Popup>
    </Marker>
  );

  const MyMarkersList = ({ markers }) => {
    const items = markers.map(({ key, ...props }) => (
      <MyPopupMarker key={key} {...props} />
    ));
    return <div style={{ display: "none" }}>{items}</div>;
  };
  MyMarkersList.propTypes = {
    markers: PropTypes.array.isRequired,
  };

  const CircleMarkers = ({ markers }) => {
    return markers.map((marker) => (
      <Circle
        key={marker.key}
        center={marker.position}
        pathOptions={{ fillColor: "blue" }}
        radius={200}
      />
    ));
  };

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/6938/6938996.png",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
  });

  const TooltipMarker = ({ markers }) => {
    return markers.map((marker) => (
      <Marker key={marker.key} position={marker.position} icon={customIcon}>
        <Popup>
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {marker.children}
          </span>
          <br />
          <span style={{ fontSize: "1.2rem" }}>Time: {marker.time}</span>
          <br />
          <span style={{ fontSize: "1.2rem" }}>
            Temperature: {marker.temp} °C
          </span>
          <br />
          <span style={{ fontSize: "1.2rem" }}>Humidity: {marker.humi} %</span>
          <br />
          <span style={{ fontSize: "1.2rem" }}>CO2: {marker.co2} PPM</span>
          <br />
          <span style={{ fontSize: "1.2rem" }}>CO: {marker.co} PPM</span>
          <br />
          <span style={{ fontSize: "1.2rem" }}>Dust: {marker.dust} PPM</span>
          <br />
          <span style={{ fontSize: "1.2rem" }}>UV Index: {marker.uv}</span>
          <br />
          <span style={{ fontSize: "1.2rem" }}>
            Wind Direction: {marker.windDirection} ° (N: 0°, E: 90°, S: 180°, W:
            270°)
          </span>
          <br />
          <span style={{ fontSize: "1.2rem" }}>
            Wind Speed: {marker.windSpeed} m/s
          </span>
          <br />
        </Popup>
        <Tooltip direction="right" opacity={1}>
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {marker.children}
          </span>
        </Tooltip>
      </Marker>
    ));
  };

  return (
    <div className="content-map">
      <MapContainer center={firtsPosition} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
        />

        <LocationMarker />
        <TooltipMarker markers={stationMarkers} />

        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Layer group with circles">
            <LayerGroup>
              <CircleMarkers markers={stationMarkers} />
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default Map;
