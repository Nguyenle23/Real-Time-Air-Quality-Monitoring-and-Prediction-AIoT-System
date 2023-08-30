import axios from "axios";
const timezone = "Asia%2FBangkok";

export const getNewestDataThingSpeak = async () => {
  const response = await axios.get(
    "https://api.thingspeak.com/channels/2115707/feeds.json?results=1"
  );
  return response.data;
};

//------------Temperature----------------
export const getDataOfTempThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/1.json?timezone=${timezone}&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const getDataOfTempThuDuc = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2239030/fields/1.json?timezone=${timezone}&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictTempWithLR = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/lr/temp", {
    dataTemp: data,
  });
  return response;
};

export const predictTempWithGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/gb/temp", {
    dataTemp: data,
  });
  return response;
};

export const predictTempWithXGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/xgb/temp", {
    dataTemp: data,
  });
  return response;
};

export const predictTempWithRF = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/rf/temp", {
    dataTemp: data,
  });
  return response;
};

export const predictTempWithKNN = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/knn/temp", {
    dataTemp: data,
  });
  return response;
};

export const predictTempTest = async (data, time) => {
  const response = await axios.post("http://localhost:5000/predict/test/temp", {
    dataTemp: data,
    timeTemp: time,
  });
  return response;
};

//------------Humidity----------------
export const getDataOfHumiThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/2.json?timezone=${timezone}&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictHumiWithLR = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/lr/humi", {
    dataHumi: data,
  });
  return response;
};

export const predictHumiWithGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/gb/humi", {
    dataHumi: data,
  });
  return response;
};

export const predictHumiWithXGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/xgb/humi", {
    dataHumi: data,
  });
  return response;
};

export const predictHumiWithRF = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/rf/humi", {
    dataHumi: data,
  });
  return response;
};

export const predictHumiWithKNN = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/knn/humi", {
    dataHumi: data,
  });
  return response;
};

//------------CO2----------------
export const getDataOfCO2ThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/3.json?timezone=${timezone}&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictCO2WithLR = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/lr/co2", {
    dataCO2: data,
  });
  return response;
};

export const predictCO2WithGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/gb/co2", {
    dataCO2: data,
  });
  return response;
};

export const predictCO2WithXGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/xgb/co2", {
    dataCO2: data,
  });
  return response;
};

export const predictCO2WithRF = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/rf/co2", {
    dataCO2: data,
  });
  return response;
};

export const predictCO2WithKNN = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/knn/co2", {
    dataCO2: data,
  });
  return response;
};

//------------CO----------------
export const getDataOfCOThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/4.json?timezone=${timezone}&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictCOWithLR = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/lr/co", {
    dataCO: data,
  });
  return response;
};

export const predictCOWithGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/gb/co", {
    dataCO: data,
  });
  return response;
};

export const predictCOWithXGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/xgb/co", {
    dataCO: data,
  });
  return response;
};

export const predictCOWithRF = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/rf/co", {
    dataCO: data,
  });
  return response;
};

export const predictCOWithKNN = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/knn/co", {
    dataCO: data,
  });
  return response;
};

//------------UV----------------
export const getDataOfUVThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/5.json?timezone=${timezone}&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictUVWithLR = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/lr/uv", {
    dataUV: data,
  });
  return response;
};

export const predictUVWithGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/gb/uv", {
    dataUV: data,
  });
  return response;
};

export const predictUVWithXGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/xgb/uv", {
    dataUV: data,
  });
  return response;
};

export const predictUVWithRF = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/rf/uv", {
    dataUV: data,
  });
  return response;
};

export const predictUVWithKNN = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/knn/uv", {
    dataUV: data,
  });
  return response;
};

//------------PM2.5----------------
export const getDataOfPM25ThingSpeak = async (start, end) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/2115707/fields/6.json?timezone=${timezone}&results=288&start=${start}&end=${end}`
  );
  return response;
};

export const predictPM25WithLR = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/lr/pm25", {
    dataPM25: data,
  });
  return response;
};

export const predictPM25WithGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/gb/pm25", {
    dataPM25: data,
  });
  return response;
};

export const predictPM25WithXGB = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/xgb/pm25", {
    dataPM25: data,
  });
  return response;
};

export const predictPM25WithRF = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/rf/pm25", {
    dataPM25: data,
  });
  return response;
};

export const predictPM25WithKNN = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/knn/pm25", {
    dataPM25: data,
  });
  return response;
};