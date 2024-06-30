"use client";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Typography
} from "@material-tailwind/react";
import {CircularProgress,Chip} from "@nextui-org/react";
import {Progress} from "@nextui-org/react";
import Chart from "react-apexcharts";
const chartConfig = {
  type: "line",
  height: 240,
  series: [
    {
      name: "Sales",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617"],
    stroke: {
      lineCap: "round",
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
      categories: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "dark",
    },
  },
};

const BarChartConfig = {
  type: "bar",
  height: 240,
  series: [
    {
      name: "Sales",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617"],
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 2,
      },
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
      categories: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "dark",
    },
  },
};

const PieChartConfig = {
  type: "pie",
  width: 280,
  height: 280,
  series: [44, 55, 13, 43, 22],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617", "#ff8f00", "#00897b", "#1e88e5", "#d81b60"],
    legend: {
      show: false,
    },
  },
};


const UserAnalysis = () => {

    const [value, setValue] = React.useState(0);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setValue((v) => (v >= 100 ? 0 : v + 10));
      }, 500);
  
      return () => clearInterval(interval);
    }, []);
  return (
    <>
      <div className="bg-black p-8">
        <h1 className="font-bold bg-gradient-to-r  to-[#f84a4a]  to-[#c6ff77] to-[#ff7f7f] from-[#71bdff] to-[#ffff] bg-clip-text text-transparent flex justify-center mt-4 mb-8 lg:text-4xl text-3xl ">
          User Ananlysis
        </h1>
        <Card>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
          >
            <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                />
              </svg>
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                Line Chart
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className="max-w-sm font-normal"
              >
                Visualize your data in a simple way using the
                @material-tailwind/react chart plugin.
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="px-2 pb-0">
            <Chart {...chartConfig} />
          </CardBody>
        </Card>

        <div className="p-3 flex justify-between flex-wrap mt-5 mb-5">
          <Card>
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
            >
              <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                  />
                </svg>
              </div>
              <div>
                <Typography variant="h6" color="blue-gray">
                  Bar Chart
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="max-w-sm font-normal"
                >
                  Visualize your data in a simple way using the
                  @material-tailwind/react chart plugin.
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="px-2 pb-0">
              <Chart {...BarChartConfig} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
            >
              <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                  />
                </svg>
              </div>
              <div>
                <Typography variant="h6" color="blue-gray">
                  Pie Chart
                </Typography>
                <Typography
                  variant="small"
                  color="gray"
                  className="max-w-sm font-normal"
                >
                  Visualize your data in a simple way using the
                  @material-tailwind/react chart plugin.
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="mt-4 grid place-items-center px-2">
              <Chart {...PieChartConfig} />
            </CardBody>
          </Card>
          <div>
          <Card className=" h-[200px] border-none bg-gradient-to-br from-[#fffee4] to-[#ffff] mt-4 m-4">
                <CardBody className=" flex justify-center items-center pb-0">
                  <CircularProgress
                    classNames={{
                      svg: "w-24 h-24 drop-shadow-md",
                      indicator: "stroke-yellow-900",
                      track: "stroke-black/10",
                      value: "text-xl font-semibold text-black",
                    }}
                    value={80}
                    className="mt-2 mb-4"
                    strokeWidth={4}
                    showValueLabel={true}
                  />
                </CardBody>
                <CardFooter className="justify-center items-center pt-0">
                  <Chip
                    classNames={{
                      base: "border-1 border-black/30",
                      content: "text-black/90 text-small font-semibold",
                    }}
                    className="font-bold text-black"
                    variant="bordered"
                  >
                    20 Workers Present Today
                  </Chip>
                </CardFooter>
              </Card>
              <Card className=" h-[200px] border-none bg-gradient-to-br from-[#fffee4] to-[#ffff] mt-4 m-4">
                <CardBody className=" flex justify-center items-center pb-0">
                  <CircularProgress
                    classNames={{
                      svg: "w-24 h-24 drop-shadow-md",
                      indicator: "stroke-black",
                      track: "stroke-black/10",
                      value: "text-xl font-semibold text-black",
                    }}
                    value={30}
                    className="mt-2 mb-4"
                    strokeWidth={4}
                    showValueLabel={true}
                  />
                </CardBody>
                <CardFooter className="justify-center items-center pt-0">
                  <Chip
                    classNames={{
                      base: "border-1 border-black/30",
                      content: "text-black/90 text-small font-semibold",
                    }}
                    className="font-bold text-black"
                    variant="bordered"
                  >
                    20 Workers Present Today
                  </Chip>
                </CardFooter>
              </Card>
              </div>
        </div>
      </div>
    </>
  );
};

export default UserAnalysis;
