import axios from "axios";

const API_KEY = "UMVXZ6J6YC9JPAVT";
export const getDataThingSpeak = async () => {
  const response = await axios.get(
    "https://api.thingspeak.com/channels/2044945/feeds.json?api_key=" + API_KEY + "&results=93"
  );
  return response.data;
};
