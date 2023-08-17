import React, { useEffect, useState } from "react";
import "./co2Chart.css";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getDataOfCO2ThingSpeak, predictCO2 } from "../../../apis/callAPI";

const CO2Chart = () => {
  const [chartData, setChartData] = useState({ seriesData: [], timeData: [] });
  const [predictData, setPredictData] = useState({
    seriesData: [],
    timeData: [],
  });
  const [checkPredict, setCheckPredict] = useState(false);

  const [active, setActive] = useState('realtime');

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

  const realChart = {
    accessibility: {
      enabled: false,
    },
    title: {
      text: `Real-time data of CO2 values on ${formatDate(currentDate)}`,
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
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      reversed: false,
      title: {
        x: -16,
        text: "CO2 Values (ppm)",
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
      text: `Predicted data of CO2 Values for next hour on ${formatDate(
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
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      reversed: false,
      title: {
        x: -16,
        text: "CO2 Values (ppm)",
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

  const predictFunction = async () => {
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
    const result = await getDataOfCO2ThingSpeak(
      formatUTCDateStart,
      formatUTCDateEnd
    );
    const data = result.data.feeds.map((item) => parseFloat(item.field3));

    const time = result.data.feeds.map((item) => {
      const date = new Date(item.created_at);
      return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
        date.getUTCMinutes()
      ).padStart(2, "0")}`;
    });

    //next hour based on time of last data point
    const nextHour = new Date(
      result.data.feeds[result.data.feeds.length - 1].created_at
    );
    nextHour.setHours(nextHour.getHours() + 1);
    const nextHourString = `${String(nextHour.getUTCHours()).padStart(
      2,
      "0"
    )}:${String(nextHour.getUTCMinutes()).padStart(2, "0")}`;
    time.push(nextHourString);

    const dataTemp = await predictCO2(data);
    const resultPredict = dataTemp.data;

    //time for predict data
    const timeTemp = new Date(nextHour);
    timeTemp.setHours(timeTemp.getHours() + 1);
    const timeTempString = `${String(timeTemp.getUTCHours()).padStart(
      2,
      "0"
    )}:${String(timeTemp.getUTCMinutes()).padStart(2, "0")}`;
    time.push(timeTempString);

    setCheckPredict(true);
    setPredictData({
      timeData: time,
      seriesData: data.concat(resultPredict),
    });
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

      const result = await getDataOfCO2ThingSpeak(
        formatUTCDateStart,
        formatUTCDateEnd
      );

      const data = result.data.feeds.map((item) => parseFloat(item.field3));

      const time = result.data.feeds.map((item) => {
        const date = new Date(item.created_at);
        return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
          date.getUTCMinutes()
        ).padStart(2, "0")}`;
      });

      setChartData({ seriesData: data, timeData: time });
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
              className={active === 'realtime' ? 'btn-realtime-active' : 'btn-realtime'}
              onClick={() => {
                setActive('realtime');
                realtimeFunction();
              }}
            >
              Real-time
            </button>
            <button
              className={active === 'predict' ? 'btn-predict' : 'btn-predict-active'}
              onClick={() => {
                setActive('predict');
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

export default CO2Chart;
