import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./LineChart.css";
import { getDataThingSpeak } from "../../../apis/callAPI";

const LineChart = ({ type }) => {
  var rowFormat = (e) => {
    return {
      temp: Number(e.field1),
      humi: Number(e.field2),
      mq135: Number(e.field3),
      mq7: Number(e.field4),
      pm25: Number(e.field5),
      uvIndex: Number(e.field6),
      created_at: new Date(e.created_at),
    };
  };
  useEffect(() => {
    const fetchData = async () => {
      const objMap = [];
      const dataset = [
        {
          key: "temp",
          value: [],
          colorScale: "#EBC33D",
        },
        {
          key: "humi",
          value: [],
          colorScale: "#14BAE3",
        },
        {
          key: "mq135",
          value: [],
          colorScale: "#7753B1",
        },
        {
          key: "mq7",
          value: [],
          colorScale: "#FF0000",
        },
        {
          key: "pm25",
          value: [],
          colorScale: "#1F4F66",
        },
        {
          key: "uvIndex",
          value: [],
          colorScale: "#5C4929",
        },
      ];
      await getDataThingSpeak().then((res) => {
        var getFeeds = res.feeds;
        console.log(getFeeds);
        getFeeds.forEach((element) => {
          objMap.push(rowFormat(element));
        });

        for (var i = 0; i < getFeeds.length; i++) {
          if (Object.keys(getFeeds[i])[2] == "field1") {
            dataset[0].value.push({
              temp: Number(getFeeds[i].field1),
              created_at: new Date(getFeeds[i].created_at),
            });
          }
          if (Object.keys(getFeeds[i])[3] == "field2") {
            dataset[1].value.push({
              humi: Number(getFeeds[i].field2),
              created_at: new Date(getFeeds[i].created_at),
            });
          }
          if (Object.keys(getFeeds[i])[4] == "field3") {
            dataset[2].value.push({
              mq135: Number(getFeeds[i].field3) * 100,
              created_at: new Date(getFeeds[i].created_at),
            });
          }
          if (Object.keys(getFeeds[i])[5] == "field4") {
            dataset[3].value.push({
              mq7: Number(getFeeds[i].field4) * 10,
              created_at: new Date(getFeeds[i].created_at),
            });
          }
          if (Object.keys(getFeeds[i])[6] == "field5") {
            dataset[4].value.push({
              pm25: Number(getFeeds[i].field5) * 100,
              created_at: new Date(getFeeds[i].created_at),
            });
          }
          if (Object.keys(getFeeds[i])[7] == "field6") {
            dataset[5].value.push({
              uvIndex: Number(getFeeds[i].field6) * 100,
              created_at: new Date(getFeeds[i].created_at),
            });
          }
        }
        console.log(dataset);
      });
      const data = objMap;

      const scale_value = 2.5;
      const chart_frame_height = 500;
      const distance_next_rect = 40;
      const padding_x = 128;

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.created_at))
        .range([0, data.length * distance_next_rect * scale_value]);

      var formatTime = d3.timeFormat("%H:%M:%S");
      const xAxis = d3.axisBottom(xScale).ticks(150).tickFormat(formatTime);

      const yScale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([chart_frame_height, 0]);
      const yAxis = d3.axisLeft(yScale).ticks(10);

      const svg = d3
        .select("#chart")
        .append("svg")
        .attr(
          "width",
          objMap.length * distance_next_rect * scale_value + padding_x
        )
        .attr("height", chart_frame_height)
        .append("g");

      //color
      var colorScale = d3
        .scaleOrdinal()
        .domain(["temp", "humi", "mq135", "mq7", "pm25", "uvIndex"])
        .range([
          "#EBC33D",
          "#14BAE3",
          "#7753B1",
          "#FF0000",
          "#1F4F66",
          "#5C4929",
        ]);

      //declare line
      var line = d3
        .line()
        .x((d) => {
          return xScale(d.created_at) + 70;
        })
        .y((d) => {
          if (Object.keys(d)[0] == "temp") {
            return yScale(d.temp);
          }
          if (Object.keys(d)[0] == "humi") {
            return yScale(d.humi);
          }
          if (Object.keys(d)[0] == "mq135") {
            return yScale(d.mq135);
          }
          if (Object.keys(d)[0] == "mq7") {
            return yScale(d.mq7);
          }
          if (Object.keys(d)[0] == "pm25") {
            return yScale(d.pm25);
          }
          if (Object.keys(d)[0] == "uvIndex") {
            return yScale(d.uvIndex);
          }
        });

      let lines = svg.append("g").attr("class", "lines");

      //multiple line
      dataset.forEach((d, i) => {
        console.log(d.value);
        svg
          .append("path")
          .attr("class", "line")
          .style("stroke", () => {
            if (d.key == "temp") {
              return d.colorScale;
            } else if (d.key == "humi") {
              return d.colorScale;
            } else if (d.key == "mq135") {
              return d.colorScale;
            } else if (d.key == "mq7") {
              return d.colorScale;
            } else if (d.key == "pm25") {
              return d.colorScale;
            } else if (d.key == "uvIndex") {
              return d.colorScale;
            }
          })
          .style("stroke-width", 2)
          .attr("d", line(d.value))
          .attr("transform", `translate(50, -40)`);

        //circle
        lines
          .selectAll("circle-group")
          .data(dataset)
          .enter()
          .append("g")
          .style("fill", (d, i) => colorScale(d.key))
          .selectAll("circle")
          .data((d) => d.value)
          .enter()
          .append("g")
          .attr("class", "circle")
          .append("circle")
          .attr("cx", (d) => {
            return xScale(d.created_at) + 70;
          })
          .attr("cy", (d) => {
            if (Object.keys(d)[0] == "temp") {
              return yScale(d.temp);
            } else if (Object.keys(d)[0] == "humi") {
              return yScale(d.humi);
            } else if (Object.keys(d)[0] == "mq135") {
              return yScale(d.mq135);
            } else if (Object.keys(d)[0] == "mq7") {
              return yScale(d.mq7);
            } else if (Object.keys(d)[0] == "pm25") {
              return yScale(d.pm25);
            } else if (Object.keys(d)[0] == "uvIndex") {
              return yScale(d.uvIndex);
            }
          })
          .attr("r", 5)
          .attr("transform", `translate(50, -40)`)
          .on("mouseover", (event, d) => {
            d3.select(this).attr("r", 15);
            tooltip.transition().duration(200).style("opacity", 0.9);
            if (Object.keys(d)[0] == "temp") {
              tooltip
                .html(`Time: ${formatTime(d.created_at)}<br/>Temp: ${d.temp}°C`)
                .style("left", event.pageX - 60 + "px")
                .style("top", event.pageY - 80 + "px");
            } else if (Object.keys(d)[0] == "humi") {
              tooltip
                .html(`Time: ${formatTime(d.created_at)}<br/>Humi: ${d.humi}%`)
                .style("left", event.pageX - 60 + "px")
                .style("top", event.pageY - 80 + "px");
            } else if (Object.keys(d)[0] == "mq135") {
              tooltip
                .html(
                  `Time: ${formatTime(d.created_at)}<br/>MQ135: ${d.mq135}ppm`
                )
                .style("left", event.pageX - 60 + "px")
                .style("top", event.pageY - 80 + "px");
            } else if (Object.keys(d)[0] == "mq7") {
              tooltip
                .html(`Time: ${formatTime(d.created_at)}<br/>MQ7: ${d.mq7}ppm`)
                .style("left", event.pageX - 60 + "px")
                .style("top", event.pageY - 80 + "px");
            } else if (Object.keys(d)[0] == "pm25") {
              tooltip
                .html(
                  `Time: ${formatTime(d.created_at)}<br/>PM2.5: ${d.pm25}μg/m3`
                )
                .style("left", event.pageX - 60 + "px")
                .style("top", event.pageY - 80 + "px");
            } else if (Object.keys(d)[0] == "uvIndex") {
              tooltip
                .html(
                  `Time: ${formatTime(d.created_at)}<br/>UV Index: ${d.uvIndex}`
                )
                .style("left", event.pageX - 60 + "px")
                .style("top", event.pageY - 80 + "px");
            }
          })
          .on("mouseleave", (d) => {
            d3.select(this).attr("r", 4);
            tooltip.transition().duration(100).style("opacity", 0);
          });
      });

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(70, ${chart_frame_height - 40})`)
        .style("stroke-width", 2)
        .call(xAxis);

      svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(70, -40)`)
        .style("stroke-width", 2)
        .call(yAxis);

      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .attr("x", 700)
        .attr("y", 500)
        .text("Time");

      svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .attr("x", -200)
        .attr("y", 25)
        .text("Level");
    };
    fetchData();
  });

  return (
    <div id="chart-frame">
      <div id="chart"></div>
      <h2 className="title">Line - Stacked chart</h2>
    </div>
  );
};

export default LineChart;
