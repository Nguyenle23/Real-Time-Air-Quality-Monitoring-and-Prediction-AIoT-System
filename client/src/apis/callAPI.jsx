import axios from "axios";

export const getNewestDataThingSpeak = async () => {
  const response = await axios.get(
    "https://api.thingspeak.com/channels/2115707/feeds.json?results=1"
  );
  return response.data;
};

//------------Temperature----------------
export const getDataOfTempThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/1.json?timezone=Asia%2Bangkok&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictTemp = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/temp", {
    dataTemp: data,
  });
  return response;
};

//------------Humidity----------------
export const getDataOfHumiThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/2.json?timezone=Asia%2Bangkok&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictHumi = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/humi", {
    dataHumi: data,
  });
  return response;
};

//------------CO2----------------
export const getDataOfCO2ThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/3.json?timezone=Asia%2Bangkok&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictCO2 = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/co2", {
    dataCO2: data,
  });
  return response;
};

//------------CO----------------
export const getDataOfCOThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/4.json?timezone=Asia%2Bangkok&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictCO = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/co", {
    dataCO: data,
  });
  return response;
};

//------------UV----------------
export const getDataOfUVThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/5.json?timezone=Asia%2Bangkok&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictUV = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/uv", {
    dataUV: data,
  });
  return response;
};

//------------PM2.5----------------
export const getDataOfPM25ThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/6.json?timezone=Asia%2Bangkok&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictPM25 = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/pm25", {
    dataPM25: data,
  });
  return response;
};

