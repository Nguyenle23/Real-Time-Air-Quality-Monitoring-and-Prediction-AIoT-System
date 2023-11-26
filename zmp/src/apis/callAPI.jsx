import axios from "axios";
const timezone = "Asia%2FBangkok";
const apiKey = "99d40475f251003865b51c383d6fda8d";

export const getNewestDataHCM = async () => {
  const response = await axios.get(
    "https://api.thingspeak.com/channels/2115707/feeds.json?results=1"
  );
  return response.data;
};

export const getNewestDataThuDuc = async () => {
  const response = await axios.get(
    "https://api.thingspeak.com/channels/2239030/feeds.json?results=1"
  );
  return response.data;
};

//------------Wind----------------
export const getWindHCM = async () => {
  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather?lat=10.7936588867&lon=106.6803109431&appid=" +
      apiKey
  );
  return response.data;
};

export const getWindThuDuc = async () => {
  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather?lat=10.8619784&lon=106.8034464&appid=" +
      apiKey
  );
  return response.data;
};
