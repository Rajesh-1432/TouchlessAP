import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Sidebar from "../components/Sidebar";
import bg from '../assets/bg.jpeg';
const Cards = () => {
  const [processCount, setProcessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem("apidata");
    try {
      const myres = JSON.parse(storedData);
      if (myres && Array.isArray(myres)) {
        let processCount = 0;
        let errorCount = 0;

        myres.forEach((item) => {
          if (item.attachmentsCount > 0) {
            processCount += 1;
          } else {
            errorCount += 1;
          }
        });

        setProcessCount(processCount);
        setErrorCount(errorCount);
      } else {
        console.error("myres data not found in local storage");
      }
    } catch (error) {
      console.error("Error parsing local storage data:", error);
    }
  }, [localStorage.getItem("apidata")]);

  const getColor = (name) => {
    switch (name) {
      case "PROCESS":
        return "#51EA3F"; // Green for PROCESS
      case "ERROR":
        return "#E14032"; // Red for ERROR
      default:
        return "#8884d8"; // Default color
    }
  };

  const chartData = [
    { name: "PROCESS", value: processCount },
    { name: "ERROR", value: errorCount },
    { name: "GR NO", value: 0 }, // You can set a default value for GR NO or fetch it from your data
  ];

  return (
    <div style={{ display: "flex",   background: `url(${bg})`, // Apply background image
    backgroundSize: 'cover', // Adjust as needed
    backgroundPosition: 'center center', // Adjust as needed
    position:'sticky', }}>
      <Sidebar />

      <div style={{ width: "100%", margin: "30px",}}>
        {/* Cards Row */}
        <Row gutter={[16, 16]} justify="center">
          <Col>
            <Card
              style={{
                width: "350px",
                backgroundColor: "#0BDA51",
                paddingRight: "300px",
                height: "150px",
              }}
            >
              <b
                style={{
                  color: "black",
                  fontSize: "25px",
                  fontFamily: "monospace",
                }}
              >
                PROCESS
              </b>
              <ArrowUpOutlined style={{ color: "black", fontSize: "30px" }} />
              <b style={{ color: "Black", fontSize: "25px" }}>{processCount}</b>
            </Card>
          </Col>

          <Col>
            <Card
              style={{
                width: "350px",
                backgroundColor: "#FF0000",
                paddingRight: "300px",
                marginLeft: "40px",
                height: "150px",
              }}
            >
              <b style={{ fontSize: "25px", fontFamily: "monospace" }}>ERROR</b>
              <ArrowDownOutlined style={{ color: "white", fontSize: "30px" }} />
              <b style={{ fontSize: "20px", color: "white" }}>{errorCount}</b>
            </Card>
          </Col>

          <Col>
            <Card
              style={{
                width: "350px",
                backgroundColor:'#D8BFD8',
                paddingRight: "300px",
                marginLeft: "40px",
                height: "150px",
              }}
            >
              <b style={{ fontSize: "25px", fontFamily: "monospace" }}>GRNO</b>

              <PlusOutlined style={{ fontSize: "35px" }} />
              <b style={{ fontSize: "20px" }}>0</b>
            </Card>
          </Col>
        </Row>

        {/* Charts Container */}

        <ChartsContainer chartData={chartData} getColor={getColor} />
      </div>
    </div>
  );
};

const ChartsContainer = ({ chartData, getColor }) => (
  <div
    style={{
      margin: "65px",
      display: "flex",
      justifyContent: "space-between",
      width: "83%",
    }}
  >
    {/* Pie Chart */}
    <Card title="Pie Chart" bordered={false} style={{ flex: 1 }}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" fill="#8884d8">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
    {/* Bar Chart */}
    <Card title="Bar Chart" bordered={false} style={{ flex: 1 ,marginLeft:'50px' }}>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value">
            
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Bar>
          
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

export default Cards;
