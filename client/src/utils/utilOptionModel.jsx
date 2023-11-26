import { fetchDataTempHCM } from "../data/dataTemp";

export const options = [
  { value: "SVR", label: "SVR" },
  { value: "SARIMA", label: "SARIMA" },
  { value: "RF", label: "RF" },
  { value: "GB", label: "GB" },
  { value: "XGB", label: "XGB" },
  { value: "LR", label: "LR" },
  { value: "KNN", label: "KNN" },
  { value: "TEST", label: "TEST" },
];

export const selectOption = (option) => {
  switch (option.value) {
    case "SVR":
      alert("SVR is not available now");
      break;
    case "SARIMA":
      alert("SARIMA is not available now");
      break;
    case "RF":
      predictRFFunction();
      break;
    case "GB":
      predictGBFunction();
      break;
    case "XGB":
      predictXGBFunction();
      break;
    case "LR":
      predictLRFunction();
      break;
    case "KNN":
      predictKNNFunction();
      break;
    case "TEST":
      predictTESTFunction();
      break;
    default:
      break;
  }
};

const predictLRFunction = async () => {
  fetchDataTempHCM().then(async (result) => {
    const data = result.data.feeds.map((item) => parseFloat(item.field1));

    const time = [
      ...result.data.feeds.map((item) => {
        return item.created_at;
      }),
    ];

    const dataTemp = await predictTempWithLR(time);
    const resultPredict = dataTemp.data;

    const formatTime = result.data.feeds.map((item) => {
      const date = new Date(item.created_at);

      // Convert UTC time to Asia/Bangkok time zone
      const options = {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formatter = new Intl.DateTimeFormat("en-US", options);
      const bangkokTime = formatter.format(date);
      const hour = parseInt(bangkokTime.split(":")[0], 10);

      const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = getAmPm(hour);

      return `${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`;
    });

    //next hour based on time of last data point
    const lastDataPointTime = new Date(
      result.data.feeds[result.data.feeds.length - 1].created_at
    );

    const options = {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const bangkokTime = formatter.format(lastDataPointTime);

    const hour = parseInt(bangkokTime.split(":")[0], 10);
    const nextHour = new Date(lastDataPointTime);
    nextHour.setHours(hour + 1);

    const adjustedHour = nextHour % 12 === 0 ? 12 : nextHour % 12;
    const amPm = getAmPm(adjustedHour);

    formatTime.push(`${hour + 1}:${bangkokTime.slice(3)} ${amPm}`);

    setCheckPredict(true);
    setPredictData({
      timeData: formatTime,
      seriesData: data.concat(resultPredict),
    });
  });
};

const predictGBFunction = async () => {
  fetchDataTempHCM().then(async (result) => {
    const data = result.data.feeds.map((item) => parseFloat(item.field1));

    const time = [
      ...result.data.feeds.map((item) => {
        return item.created_at;
      }),
    ];

    const dataTemp = await predictTempWithGB(time);
    const resultPredict = dataTemp.data;

    const formatTime = result.data.feeds.map((item) => {
      const date = new Date(item.created_at);

      // Convert UTC time to Asia/Bangkok time zone
      const options = {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formatter = new Intl.DateTimeFormat("en-US", options);
      const bangkokTime = formatter.format(date);
      const hour = parseInt(bangkokTime.split(":")[0], 10);

      const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = getAmPm(hour);

      return `${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`;
    });

    //next hour based on time of last data point
    const lastDataPointTime = new Date(
      result.data.feeds[result.data.feeds.length - 1].created_at
    );

    const options = {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const bangkokTime = formatter.format(lastDataPointTime);

    const hour = parseInt(bangkokTime.split(":")[0], 10);
    const nextHour = new Date(lastDataPointTime);
    nextHour.setHours(hour + 1);

    // Convert to 12-hour format with AM/PM notation
    let adjustedHour = nextHour.getHours() % 12;
    adjustedHour = adjustedHour === 0 ? 12 : adjustedHour; // Handle 12 AM

    const amPm = nextHour.getHours() < 12 ? "AM" : "PM"; // Determine AM or PM

    formatTime.push(`${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`);

    setCheckPredict(true);
    setPredictData({
      timeData: formatTime,
      seriesData: data.concat(resultPredict),
    });
  });
};

const predictRFFunction = async () => {
  fetchDataTempHCM().then(async (result) => {
    const data = result.data.feeds.map((item) => parseFloat(item.field1));

    const time = [
      ...result.data.feeds.map((item) => {
        return item.created_at;
      }),
    ];

    const dataTemp = await predictTempWithRF(time);
    const resultPredict = dataTemp.data;

    const formatTime = result.data.feeds.map((item) => {
      const date = new Date(item.created_at);

      // Convert UTC time to Asia/Bangkok time zone
      const options = {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formatter = new Intl.DateTimeFormat("en-US", options);
      const bangkokTime = formatter.format(date);
      const hour = parseInt(bangkokTime.split(":")[0], 10);

      const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = getAmPm(hour);

      return `${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`;
    });

    //next hour based on time of last data point
    const lastDataPointTime = new Date(
      result.data.feeds[result.data.feeds.length - 1].created_at
    );

    const options = {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const bangkokTime = formatter.format(lastDataPointTime);

    const hour = parseInt(bangkokTime.split(":")[0], 10);
    const nextHour = new Date(lastDataPointTime);
    nextHour.setHours(hour + 1);

    // Convert to 12-hour format with AM/PM notation
    let adjustedHour = nextHour.getHours() % 12;
    adjustedHour = adjustedHour === 0 ? 12 : adjustedHour; // Handle 12 AM

    const amPm = nextHour.getHours() < 12 ? "AM" : "PM"; // Determine AM or PM

    formatTime.push(`${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`);

    setCheckPredict(true);
    setPredictData({
      timeData: formatTime,
      seriesData: data.concat(resultPredict),
    });
  });
};

const predictXGBFunction = async () => {
  fetchDataTempHCM().then(async (result) => {
    const data = result.data.feeds.map((item) => parseFloat(item.field1));

    const time = [
      ...result.data.feeds.map((item) => {
        return item.created_at;
      }),
    ];

    const dataTemp = await predictTempWithXGB(time);
    const resultPredict = dataTemp.data;

    const formatTime = result.data.feeds.map((item) => {
      const date = new Date(item.created_at);

      // Convert UTC time to Asia/Bangkok time zone
      const options = {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formatter = new Intl.DateTimeFormat("en-US", options);
      const bangkokTime = formatter.format(date);
      const hour = parseInt(bangkokTime.split(":")[0], 10);

      const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = getAmPm(hour);

      return `${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`;
    });

    //next hour based on time of last data point
    const lastDataPointTime = new Date(
      result.data.feeds[result.data.feeds.length - 1].created_at
    );

    const options = {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const bangkokTime = formatter.format(lastDataPointTime);

    const hour = parseInt(bangkokTime.split(":")[0], 10);
    const nextHour = new Date(lastDataPointTime);
    nextHour.setHours(hour + 1);

    // Convert to 12-hour format with AM/PM notation
    let adjustedHour = nextHour.getHours() % 12;
    adjustedHour = adjustedHour === 0 ? 12 : adjustedHour; // Handle 12 AM

    const amPm = nextHour.getHours() < 12 ? "AM" : "PM"; // Determine AM or PM

    formatTime.push(`${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`);

    setCheckPredict(true);
    setPredictData({
      timeData: formatTime,
      seriesData: data.concat(resultPredict),
    });
  });
};

const predictKNNFunction = async () => {
  fetchDataTempHCM().then(async (result) => {
    const data = result.data.feeds.map((item) => parseFloat(item.field1));

    const time = [
      ...result.data.feeds.map((item) => {
        return item.created_at;
      }),
    ];

    const dataTemp = await predictTempWithKNN(time);
    const resultPredict = dataTemp.data;

    const formatTime = result.data.feeds.map((item) => {
      const date = new Date(item.created_at);

      // Convert UTC time to Asia/Bangkok time zone
      const options = {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formatter = new Intl.DateTimeFormat("en-US", options);
      const bangkokTime = formatter.format(date);
      const hour = parseInt(bangkokTime.split(":")[0], 10);

      const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = getAmPm(hour);

      return `${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`;
    });

    //next hour based on time of last data point
    const lastDataPointTime = new Date(
      result.data.feeds[result.data.feeds.length - 1].created_at
    );

    const options = {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const bangkokTime = formatter.format(lastDataPointTime);

    const hour = parseInt(bangkokTime.split(":")[0], 10);
    const nextHour = new Date(lastDataPointTime);
    nextHour.setHours(hour + 1);

    // Convert to 12-hour format with AM/PM notation
    let adjustedHour = nextHour.getHours() % 12;
    adjustedHour = adjustedHour === 0 ? 12 : adjustedHour; // Handle 12 AM

    const amPm = nextHour.getHours() < 12 ? "AM" : "PM"; // Determine AM or PM

    formatTime.push(`${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`);

    setCheckPredict(true);
    setPredictData({
      timeData: formatTime,
      seriesData: data.concat(resultPredict),
    });
  });
};

const predictTESTFunction = async () => {
  fetchDataTempHCM().then(async (result) => {
    const data = result.data.feeds.map((item) => parseFloat(item.field1));

    const time = [
      ...result.data.feeds.map((item) => {
        return item.created_at;
      }),
    ];

    const objPredict = {
      time: time,
      data: data,
    };

    const dataTemp = await predictTempTest(objPredict.data, objPredict.time);
    const resultPredict = dataTemp.data;

    const formatTime = result.data.feeds.map((item) => {
      const date = new Date(item.created_at);

      // Convert UTC time to Asia/Bangkok time zone
      const options = {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formatter = new Intl.DateTimeFormat("en-US", options);
      const bangkokTime = formatter.format(date);
      const hour = parseInt(bangkokTime.split(":")[0], 10);

      const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = getAmPm(hour);

      return `${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`;
    });

    //next hour based on time of last data point
    const lastDataPointTime = new Date(
      result.data.feeds[result.data.feeds.length - 1].created_at
    );

    const options = {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const bangkokTime = formatter.format(lastDataPointTime);

    const hour = parseInt(bangkokTime.split(":")[0], 10);
    const next_hour = parseInt(bangkokTime.split(":")[0], 10) + 1;

    const nextHour = new Date(lastDataPointTime);
    nextHour.setHours(hour + 1);

    // Convert to 12-hour format with AM/PM notation
    let adjustedHour = nextHour.getHours() % 12;
    adjustedHour = adjustedHour === 0 ? 12 : adjustedHour; // Handle 12 AM

    const amPm = nextHour.getHours() < 12 ? "AM" : "PM"; // Determine AM or PM

    formatTime.push(`${adjustedHour}:${bangkokTime.slice(3)} ${amPm}`);

    setCheckPredict(true);
    setPredictData({
      timeData: formatTime,
      seriesData: data.concat(resultPredict),
    });
  });
};