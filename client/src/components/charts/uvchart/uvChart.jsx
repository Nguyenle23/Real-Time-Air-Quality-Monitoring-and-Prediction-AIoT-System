import React, { useEffect, useState } from "react";
import "./uvChart.css";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getDataOfUVThingSpeak, predictUV } from "../../../apis/callAPI";

const UVChart = () => {
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
      text: `Real-time data of UV index on ${formatDate(currentDate)}`,
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
        text: "UV Index",
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
      text: `Predicted data of UV index for next hour on ${formatDate(
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
        text: "UV Index",
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
    const result = await getDataOfUVThingSpeak(
      formatUTCDateStart,
      formatUTCDateEnd
    );
    const data = result.data.feeds.map((item) => parseFloat(item.field5));

    const getAmPm = (hour) => {
      return hour >= 12 ? "PM" : "AM";
    };

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

    const [hours, minutes] = bangkokTime.split(":").map(Number);
    const nextHour = new Date(lastDataPointTime);
    nextHour.setHours(hours + 1, minutes);

    const nextHourBangkokTime = `${String(nextHour.getHours()).padStart(
      2,
      "0"
    )}:${String(nextHour.getMinutes()).padStart(2, "0")}`;

    time.push(nextHourBangkokTime);

    const dataTemp = await predictUV(data);
    const resultPredict = dataTemp.data;

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

      const result = await getDataOfUVThingSpeak(
        formatUTCDateStart,
        formatUTCDateEnd
      );

      const data = result.data.feeds.map((item) => parseFloat(item.field5));

      const getAmPm = (hour) => {
        return hour >= 12 ? "PM" : "AM";
      };

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

export default UVChart;
