import React from "react";
import { Line } from "react-chartjs-2";
import "./Chart.css";

const Chart = (props) => {
  // console.log(props.data);
  let yAxis = [];
  let xAxis = [];
  if (props.data) {
    xAxis = props.data.map((res) => {
      return res.points;
    });
    yAxis = props.data.map((res) => {
      return res.objectID;
    });
  }
  const data = {
    labels: yAxis,
    datasets: [
      {
        label: "Votes vs IDs",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: xAxis,
      },
    ],
  };
  return (
    <div className="chartContainer">
      <Line data={data} />
    </div>
  );
};

export default Chart;
