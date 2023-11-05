import axios from "axios";
const timezone = "Asia%2FBangkok";

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