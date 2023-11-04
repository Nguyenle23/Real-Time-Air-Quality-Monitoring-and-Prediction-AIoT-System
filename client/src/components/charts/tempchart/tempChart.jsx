import React, { useEffect, useState } from "react";
import "./tempChart.css";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  getDataOfTempThingSpeak,
  getDataOfTempThuDuc,
  predictTempWithLR,
  predictTempWithGB,
  predictTempWithXGB,
  predictTempWithRF,
  predictTempWithKNN,
  predictTempTest,
} from "../../../apis/callAPI";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const TempChart = () => {
  const [chartData, setChartData] = useState({ seriesData: [], timeData: [] });
  const [chartDataThuDuc, setChartDataThuDuc] = useState({
    seriesData: [],
    timeData: [],
  });

  console.log(chartDataThuDuc)
  const [predictData, setPredictData] = useState({
    seriesData: [],
    timeData: [],
  });
  const [checkPredict, setCheckPredict] = useState(false);

  const [active, setActive] = useState("realtime");

  const currentDate = new Date();
  const formatDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    //get the date of the week
    let dayOfWeek = date.getDay();
    let dayOfWeekName = "";
    switch (dayOfWeek) {
      case 0:
        dayOfWeekName = "Sunday";
        break;
      case 1:
        dayOfWeekName = "Monday";
        break;
      case 2:
        dayOfWeekName = "Tuesday";
        break;
      case 3:
        dayOfWeekName = "Wednesday";
        break;
      case 4:
        dayOfWeekName = "Thursday";
        break;
      case 5:
        dayOfWeekName = "Friday";
        break;
      case 6:
        dayOfWeekName = "Saturday";
        break;
    }

    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;

    return `${dayOfWeekName}, ${day}-${month}-${year}`;
  };
  const getAmPm = (hour) => {
    return hour >= 12 ? "PM" : "AM";
  };

  const fetchData = async () => {
    const formatInputStartDate = `${currentDate.getUTCFullYear()}-${String(
      currentDate.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getUTCDate()).padStart(
      2,
      "0"
    )}%2000:00:00`;
    const formatInputEndDate = `${currentDate.getUTCFullYear()}-${String(
      currentDate.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getUTCDate()).padStart(
      2,
      "0"
    )}%2023:59:00`;

    const result = await getDataOfTempThingSpeak(
      formatInputStartDate,
      formatInputEndDate
    );

    return result;
  };

  const fetchDataThuDuc = async () => {
    const formatInputStartDate = `${currentDate.getUTCFullYear()}-${String(
      currentDate.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getUTCDate()).padStart(
      2,
      "0"
    )}%2000:00:00`;
    const formatInputEndDate = `${currentDate.getUTCFullYear()}-${String(
      currentDate.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getUTCDate()).padStart(
      2,
      "0"
    )}%2023:59:00`;

    const result = await getDataOfTempThuDuc(
      formatInputStartDate,
      formatInputEndDate
    );

    return result;
  };

  const options = [
    { value: "SVR", label: "SVR" },
    { value: "SARIMA", label: "SARIMA" },
    { value: "RF", label: "RF" },
    { value: "GB", label: "GB" },
    { value: "XGB", label: "XGB" },
    { value: "LR", label: "LR" },
    { value: "KNN", label: "KNN" },
    { value: "TEST", label: "TEST" },
  ];

  const selectOption = (option) => {
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

  const realChart = {
    accessibility: {
      enabled: false,
    },
    title: {
      text: `Real-time data of Temperature on ${formatDate(currentDate)}`,
    },
    subtitle: {
      text: "Notice: The data is updated every 5 minutes and pinch to zoom in",
      align: "center",
    },
    chart: {
      style: {
        fontFamily: "Montserrat",
        fontSize: "16px",
        backgroundColor: "rgba(255, 255, 255, 0.0)",
      },
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      categories: chartData.timeData,
      title: {
        text: "Hour (UTC+7)",
      },
      labels: {
        step: 12,
      },
    },
    yAxis: {
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      reversed: false,
      title: {
        x: -16,
        text: "Temperature (°C)",
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
          },
        },
      ],
    },
    plotOptions: {
      // line: {
      //   dataLabels: {
      //     enabled: true,
      //   },
      // },
      marker: {
        radius: 2,
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
    },

    // legend: {
    //   layout: "vertical",
    //   align: "right",
    //   verticalAlign: "middle",
    //   itemMarginTop: 10,
    //   itemMarginBottom: 10,
    // },
    series: [
      {
        type: "line",
        name: "Ho Chi Minh City",
        data: chartData.seriesData,
      },
      {
        type: "line",
        name: "Thu Duc City",
        data: chartDataThuDuc.seriesData,
      },
    ],
  };

  const predictChart = {
    accessibility: {
      enabled: false,
    },
    title: {
      text: `Predicted data of Temperature for next hour on ${formatDate(
        currentDate
      )}`,
    },
    subtitle: {
      text: "Notice: The data predicted is just a relative value and not save in database",
    },
    chart: {
      style: {
        fontFamily: "Montserrat",
        fontSize: "16px",
        backgroundColor: "rgba(255, 255, 255, 0.0)",
      },
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      categories: predictData.timeData,
      title: {
        text: "Hour (UTC+7)",
      },
      labels: {
        step: 12,
      },
    },
    yAxis: {
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      reversed: false,
      title: {
        x: -16,
        text: "Temperature (°C)",
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
          },
        },
      ],
    },
    plotOptions: {
      marker: {
        radius: 2,
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
    },
    series: [
      {
        type: "line",
        name: "Ho Chi Minh City",
        data: predictData.seriesData,
      },
    ],
  };

  const realtimeFunction = () => {
    setCheckPredict(false);
  };

  const predictLRFunction = async () => {
    fetchData().then(async (result) => {
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
    fetchData().then(async (result) => {
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
    fetchData().then(async (result) => {
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
    fetchData().then(async (result) => {
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
    fetchData().then(async (result) => {
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
    fetchData().then(async (result) => {
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

  useEffect(() => {
    fetchData().then((result) => {
      const data = result.data.feeds.map((item) => parseFloat(item.field1));

      const time = result.data.feeds.map((item) => {
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

      setChartData({ seriesData: data, timeData: time });
    });
    fetchDataThuDuc().then((result) => {
      const data = result.data.feeds.map((item) => parseFloat(item.field1));

      const time = result.data.feeds.map((item) => {
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

      setChartDataThuDuc({ seriesData: data, timeData: time });
    });
    setInterval(fetchData, 5 * 60 * 1000);
  }, []);

  return (
    <>
      <div className="line-chart-container">
        <div className="btn-line-chart">
          <div className="btn-chart">
            <button
              className={
                active === "realtime" ? "btn-realtime" : "btn-realtime-active"
              }
              onClick={() => {
                setActive("realtime");
                realtimeFunction();
              }}
            >
              Real-time
            </button>
            <button>
              <Dropdown
                options={options}
                onChange={selectOption}
                placeholder="Select algorithm"
              />
            </button>
          </div>
          {checkPredict == false ? (
            <HighchartsReact highcharts={Highcharts} options={realChart} />
          ) : (
            <HighchartsReact highcharts={Highcharts} options={predictChart} />
          )}
        </div>
      </div>
    </>
  );
};

export default TempChart;
