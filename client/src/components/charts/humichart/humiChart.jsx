import React, { useEffect, useState } from "react";
import "./humiChart.css";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import { formatDate, convertToBangkokTime } from "../../../utils/utilDay";
import { options, selectOption } from "../../../utils/utilOptionModel";
import { currentDate } from "../../../constants/constanst";
import { fetchDataHumiHCM, fetchDataHumiThuDuc } from "../../../data/dataHumi";

const HumiChart = () => {
  const [chartData, setChartData] = useState({ seriesData: [], timeData: [] });
  const [chartDataThuDuc, setChartDataThuDuc] = useState({
    seriesData: [],
    timeData: [],
  });
  const [predictData, setPredictData] = useState({
    seriesData: [],
    timeData: [],
  });
  const [checkPredict, setCheckPredict] = useState(false);

  const [active, setActive] = useState("realtime");

  const realChart = {
    accessibility: {
      enabled: false,
    },
    title: {
      text: `Timeseries data of Humidity on ${formatDate(currentDate)}`,
    },
    subtitle: {
      text: "Notice: The data is updated every 5 minutes and pinch to zoom in",
      align: "center",
    },
    chart: {
      style: {
        fontFamily: "Quicksand",
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
        text: "Humidity (%)",
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
      line: {
        dataLabels: {
          enabled: true,
        },
      },
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
      text: `Predicted data of Humidity for next hour on ${formatDate(
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
        text: "Humidity (%)",
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

  useEffect(() => {
    fetchDataHumiHCM().then((result) => {
      const data = result.data.feeds.map((item) => parseFloat(item.field2));
      const time = result.data.feeds.map((item) => {
        const date = new Date(item.created_at);
        const bangkokTime = convertToBangkokTime(date);
        return `${bangkokTime.hour}:${bangkokTime.minute} ${bangkokTime.amPm}`;
      });
      setChartData({ seriesData: data, timeData: time });
    });

    fetchDataHumiThuDuc().then((result) => {
      const data = result.data.feeds.map((item) => parseFloat(item.field2));
      const time = result.data.feeds.map((item) => {
        const date = new Date(item.created_at);
        const bangkokTime = convertToBangkokTime(date);
        return `${bangkokTime.hour}:${bangkokTime.minute} ${bangkokTime.amPm}`;
      });
      setChartDataThuDuc({ seriesData: data, timeData: time });
    });
    setInterval(fetchDataHumiHCM, 5 * 60 * 1000);
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
              Now
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

export default HumiChart;
