import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// *********************************Chart Testing Imports ***********************************//

import { TrendingUp } from "lucide-react";
import { Bar, BarChart } from "recharts";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// ****************************************************************************************//

import { FaUserCircle, FaBell, FaThLarge } from "react-icons/fa";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { FaStreetView } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { PiStudentBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Dashboard = () => {
  const [data, setData] = useState([
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]);

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "green",
    },
    mobile: {
      label: "Mobile",
      color: "blue",
    },
  };

  const chartData2 = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const chartConfig2 = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  };

  return (
    <div>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[100vh] max-w-full rounded-lg border md:min-w-[450px]"
      >
        {/* Sidebar */}
        <ResizablePanel defaultSize={20} className="bg-white border-r">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-5 flex items-center gap-2 border-b">
              <FaThLarge className="text-blue-500 text-2xl" />
              <span className="text-xl font-bold text-pink-600">MindEase</span>
            </div>

            {/* Sidebar Items */}
            <nav className="flex flex-col p-4 gap-4 text-gray-700 font-medium">
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                <FaStreetView /> Overview
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                <RiDashboardLine /> Analytic Dashboard
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                <PiStudentBold /> Students
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
                <GiTeacher /> Counselors
              </div>
            </nav>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Main Content */}
        <ResizablePanel defaultSize={80} className="bg-gray-50">
          <div className="flex flex-col h-full px-12">
            {/* Top Navbar */}
            <div className="flex justify-end gap-10 items-center p-4 bg-white border-b">
              <div className="flex items-center gap-6">
                <FaBell className="text-gray-600 cursor-pointer" />
                <FaRegCircleQuestion className="text-gray-600 cursor-pointer" />
                <FaUserCircle className="text-gray-600 text-2xl cursor-pointer" />
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Heading */}
              <h1 className="text-2xl font-bold text-gray-800 mb-6">MIET</h1>

              <h1>Key Metrics</h1>

              {/* Overview Cards */}
              <div className="flex items-center justify-around py-2 gap-6 mb-4">
                <div className="bg-white px-8 py-3 rounded-lg border">
                  <h2 className="text-sm text-gray-600">Total Students</h2>
                  <p className="text-2xl font-bold text-black">1,240</p>
                </div>
                <div className="bg-white px-8 py-3 rounded-lg border">
                  <h2 className="text-sm text-gray-600">Active Counselors</h2>
                  <p className="text-2xl font-bold text-black">48</p>
                </div>
                <div className="bg-white px-8 py-3 rounded-lg border">
                  <h2 className="text-sm text-gray-600">Open Tickets</h2>
                  <p className="text-2xl font-bold text-black">32</p>
                </div>
                <div className="bg-white px-8 py-3 rounded-lg border">
                  <h2 className="text-sm text-gray-600">Upcoming Events</h2>
                  <p className="text-2xl font-bold text-black">5</p>
                </div>
              </div>

              {/* Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placeholder chart 1 */}
                {/* *************************************************************************** */}
                <Card>
                  <CardHeader>
                    <CardTitle>Student Performance Trends</CardTitle>
                    <CardDescription>
                      Average pre vs post counseling scores over time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig}>
                      <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent />}
                        />
                        <Line
                          dataKey="desktop"
                          type="monotone"
                          stroke="blue"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          dataKey="mobile"
                          type="monotone"
                          stroke="red"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                      <div className="flex text-muted-foreground items-center gap-2 leading-none font-medium">
                        Post-Counseling Score
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 leading-none">
                        Pre-Counseling Score
                      </div>
                    </div>
                  </CardFooter>
                </Card>

                {/* *************************************************************************** */}

                {/* Placeholder chart 2 */}
                <Card>
                  <CardHeader>
                    <CardTitle>Counseling Session Impact</CardTitle>
                    <CardDescription>
                      Average improvement score by counseling type.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig2}>
                      <BarChart accessibilityLayer data={chartData2}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="desktop" fill="green" radius={8} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 text-center w-fit mx-auto justify-center leading-none font-medium">
                      Average Impact Score
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="mt-10 bg-white shadow-md p-6 rounded-lg border">
                <h1 className="text-black text-2xl font-bold pb-8">
                  Student Progress & Activities
                </h1>
                <h2 className="text-lg font-semibold">
                  Individual Student Progress
                </h2>
                <p className="text-xs text-gray-600 pb-4">
                  Overview of student improvement after counseling.
                </p>
                <Table>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Invoice</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((data) => (
                      <TableRow key={data.invoice}>
                        <TableCell className="font-medium">
                          {data.invoice}
                        </TableCell>
                        <TableCell>{data.paymentStatus}</TableCell>
                        <TableCell>{data.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          {data.totalAmount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;
