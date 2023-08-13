import React, { useEffect, useState } from "react";
import "./TempChart.css";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getDataOfDayThingSpeak } from "../../../apis/callAPI";

const TempChart = () => {
  const [chartData, setChartData] = useState({ seriesData: [], timeData: [] });
  const [predictData, setPredictData] = useState({
    seriesData: [],
    timeData: [],
  });
  const [checkPredict, setCheckPredict] = useState(false);

  const currentDate = new Date();
  const formatDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    //get the date of  the week
    let dayOfWeek = date.getDay();
    let dayOfWeekName = "";
    switch (dayOfWeek) {
      case 0:
        dayOfWeekName = "Sunday";
      case 1:
        dayOfWeekName = "Monday";
      case 2:
        dayOfWeekName = "Tuesday";
      case 3:
        dayOfWeekName = "Wednesday";
      case 4:
        dayOfWeekName = "Thursday";
      case 5:
        dayOfWeekName = "Friday";
      case 6:
        dayOfWeekName = "Saturday";
    }

    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;

    return `${dayOfWeekName}, ${day}-${month}-${year}`;
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
        text: "Hour (UTC)",
      },
      labels: {
        step: 12,
      },
    },
    yAxis: {
      min: 0,
      tickInterval: 10,
      categories: chartData.seriesData,
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
        text: "Hour (UTC)",
      },
      labels: {
        step: 12,
      },
    },
    yAxis: {
      min: 0,
      tickInterval: 10,
      categories: predictData.seriesData,
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

  const predictFunction = () => {
    const predictData = async () => {
      // const startDate = "2023-08-10%2000:00:00";
      // const endDate = "2023-08-10%2023:59:00";
      // const result = await axios.get(
      //   "https://api.thingspeak.com/channels/2115707/fields/1.json?api_key=8XAK02XOFU2XN9AV&timezone=Asia%2Bangkok&results=288&start=" +
      //     startDate +
      //     "&end=" +
      //     endDate
      // );
      // const data = result.data.feeds.map((item) => parseFloat(item.field1));

      // const time = result.data.feeds.map((item) => {
      //   const date = new Date(item.created_at);
      //   return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
      //     date.getUTCMinutes()
      //   ).padStart(2, "0")}`;
      // });

      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const time = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      setPredictData({ seriesData: data, timeData: time });
    };
    predictData();
    setCheckPredict(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const formatUTCDateStart = `${currentDate.getUTCFullYear()}-${String(
        currentDate.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(currentDate.getUTCDate()).padStart(
        2,
        "0"
      )}%2000:00:00`;
      const formatUTCDateEnd = `${currentDate.getUTCFullYear()}-${String(
        currentDate.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(currentDate.getUTCDate()).padStart(
        2,
        "0"
      )}%2023:59:00`;

      const result = await getDataOfDayThingSpeak(
        formatUTCDateStart,
        formatUTCDateEnd
      );

      const data = result.data.feeds.map((item) => parseFloat(item.field1));

      const time = result.data.feeds.map((item) => {
        const date = new Date(item.created_at);
        return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
          date.getUTCMinutes()
        ).padStart(2, "0")}`;
      });

      setChartData({ seriesData: data, timeData: time });
      // const fields = _.pickBy(result.data.channel, (value, key) =>
      //   key.includes("field")
      // );

      // const newData = { seriesData: [], timeData: [] };

      // _.forOwn(fields, (name, key) => {
      //   newData.seriesData.push({
      //     name,
      //     data: result.data.feeds.map((item) => parseFloat(item[key])),
      //   });
      // });

      // result.data.feeds.map((item) => {
      //   const dateObject = new Date(item.created_at);
      //   const hour = String(dateObject.getUTCHours()).padStart(2, "0");
      //   const minute = String(dateObject.getUTCMinutes()).padStart(2, "0");
      //   const formattedTime = `${hour}:${minute}`;
      //   newData.timeData.push(formattedTime);
      // });
    };
    fetchData();
    setInterval(fetchData, 5 * 60 * 1000);
  }, []);

  return (
    <>
      <div className="line-chart-container">
        <div className="btn-line-chart">
          <div className="btn-chart">
            <button
              className="btn-realtime"
              onClick={() => {
                realtimeFunction();
              }}
            >
              Real-time
            </button>
            <button
              className="btn-predict"
              onClick={() => {
                predictFunction();
              }}
            >
              Predict
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
