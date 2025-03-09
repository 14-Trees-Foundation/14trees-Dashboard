import React, { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList } from "recharts";
import axios from "axios";

// Utility function to get previous months in YYYY-MM-DD format
const getPreviousMonthDate = (monthsAgo: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    return date.toISOString().split("T")[0]; // Get YYYY-MM-DD format
};

const GiftRequestsChart: React.FC = () => {
    const [startDate, setStartDate] = useState<string>(getPreviousMonthDate(3));
    const [endDate, setEndDate] = useState<string>(getPreviousMonthDate(0));
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [chartType, setChartType] = useState<"line" | "bar">("bar"); // Default to Bar Chart

    useEffect(() => {
        fetchChartData();
    }, [startDate, endDate]);

    const fetchChartData = async () => {
        setLoading(true);
        const baseURL = "http://localhost:8088/api/gift-cards/requests/distribution";
        const params = `start_date=${startDate}&end_date=${endDate}`;
        const finalURL = `${baseURL}?${params}`;
        console.log("Final API URL:", finalURL);

        try {
            const response = await axios.get(finalURL);
            console.log("RAW API Response:", JSON.stringify(response.data, null, 2));

            if (!response.data || response.data.length === 0) {
                console.warn("No data received from API");
                setChartData([]);
                return;
            }

            console.log("Formatting Data...");
            const formattedData = response.data.map((item: any) => ({
                ...item,
                birthday_requests: Number(item.birthday_requests) || 0,
                memorial_requests: Number(item.memorial_requests) || 0,
                general_requests: Number(item.general_requests) || 0,
            }));

            console.log("Formatted Data:", formattedData);
            setChartData(formattedData);
        } catch (error) {
            console.error("Error fetching gift requests data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Format X-Axis labels for better readability
    const formatXAxis = (month: string, index: number) => {
        if (index === 0) return startDate; // Show start date for first entry
        if (index === chartData.length - 1) return endDate; // Show end date for last entry
        return month; // Default to month_start
    };

    // Custom Tooltip Formatter
    const tooltipFormatter = (value: number | string, name: string) => {
        return [`${value} requests`, name.replace("_", " ")]; // Convert "birthday_requests" to "Birthday Requests"
    };

    return (
        <div style={{ width: "950px", height: "650px", border: "1px solid black", padding: "10px", margin: "0 auto", backgroundColor: "#f9f9f9" }}>
            <div style={{ marginBottom: "10px", textAlign: "center" }}>
                <label>Start Date: </label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ marginRight: "10px", padding: "5px" }} />
                
                <label>End Date: </label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: "5px" }} />
            </div>

            {/* Chart Type Selector */}
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <label>Select Chart Type: </label>
                <select value={chartType} onChange={(e) => setChartType(e.target.value as "line" | "bar")} style={{ padding: "5px" }}>
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                </select>
            </div>

            <h2 style={{ textAlign: "center", fontWeight: "bold", marginTop: "10px" }}>Gift Request Trends Over Time</h2>

            {loading ? (
                <p>Loading...</p>
            ) : chartData.length > 0 ? (
                chartType === "line" ? (
                    <LineChart width={900} height={500} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="month_start" 
                            tick={{ fontSize: 14 }} 
                            interval={0} 
                            tickFormatter={formatXAxis} 
                            padding={{ right: 40 }}  
                            allowDuplicatedCategory={false}
                        />
                        <YAxis domain={[0, "dataMax"]} tick={{ fontSize: 14 }} />
                        <Tooltip formatter={tooltipFormatter} />
                        <Legend verticalAlign="top" align="center" height={50} />
                        
                        <Line type="monotone" dataKey="birthday_requests" stroke="#FF0000" name="Birthday Requests" dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="memorial_requests" stroke="#00C853" name="Memorial Requests" dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="general_requests" stroke="#FF9100" name="General Requests" dot={{ r: 5 }} />
                    </LineChart>
                ) : (
                    <BarChart width={900} height={500} data={chartData} barSize={50}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="month_start" 
                            tick={{ fontSize: 14 }} 
                            interval={0} 
                            tickFormatter={formatXAxis} 
                            padding={{ right: 40 }}  
                            allowDuplicatedCategory={false}
                        />
                        <YAxis domain={[0, "dataMax"]} tick={{ fontSize: 14 }} />
                        
                        {/* Fixed Tooltip Formatting */}
                        <Tooltip 
                            formatter={tooltipFormatter} 
                            labelFormatter={(label) => `Date: ${label}`}
                        />

                        <Legend verticalAlign="top" align="center" height={50} />

                        {/* Bars with Labels on Top */}
                        <Bar dataKey="birthday_requests" fill="#FF0000" name="Birthday Requests">
                            <LabelList dataKey="birthday_requests" position="top" style={{ fontSize: 14, fill: "#FF0000" }} />
                        </Bar>
                        <Bar dataKey="memorial_requests" fill="#00C853" name="Memorial Requests">
                            <LabelList dataKey="memorial_requests" position="top" style={{ fontSize: 14, fill: "#00C853" }} />
                        </Bar>
                        <Bar dataKey="general_requests" fill="#FF9100" name="General Requests">
                            <LabelList dataKey="general_requests" position="top" style={{ fontSize: 14, fill: "#FF9100" }} />
                        </Bar>
                    </BarChart>
                )
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default GiftRequestsChart;
