import axios from "axios";

//------------Temperature----------------
export const predictTempWithLR = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/lr/temp", {
    dataTemp: data,
  });
  return response;
};

export const predictTempWithGB = async (data) => {
  const response = await axios.post(
    "https://air-quality-app-04a39fccf317.herokuapp.com//predict/gb/temp",
    {
      dataTemp: data,
    }
  );
  console.log(response);
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

export const predictTempWithProphet = async (data) => {
  // const response = await axios.post("http://localhost:5000/predict/prophet/temp", {
    const response = await axios.post("https://aiair-server.onrender.com/predict/test/temp", {
    dataTemp: data,
  });
  return response;
};

export const predictTempWithLSTM = async (data) => {
  const response = await axios.post("http://localhost:5000/predict/lstm/temp", {
    dataTemp: data,
  });
  return response;
};

//------------Humidity----------------
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
