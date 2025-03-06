import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ApiClient from "../../../../api/apiClient/apiClient";

const COLORS = ["#FF0000", "#1C39BB", "#006400"]; // Bright Red, Persian Blue, Dark Green

const GiftRequestsChart: React.FC<{ card?: boolean }> = ({ card }) => {
    const [chartData, setChartData] = useState<{ name: string; value: number }>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("useEffect triggered!");

        const fetchData = async () => {
            console.log("Fetching chart data...");

            const apiClientInstance = new ApiClient();
            console.log("ApiClient Instance:", apiClientInstance);

            try {
                const response = await apiClientInstance.api.get('/gift-cards/requests/distribution');
                console.log("API Data:", response.data);

                if (!response.data) {
                    console.error("API response data is undefined:", response);
                    return;
                }

                const data = response.data;
                console.log("Parsed Values:", data.birthday_requests, data.memorial_requests, data.general_requests);

                const formattedData = [
                    { name: "Birthday", value: parseInt(data.birthday_requests, 10) || 0 },
                    { name: "Memorial", value: parseInt(data.memorial_requests, 10) || 0 },
                    { name: "General", value: parseInt(data.general_requests, 10) || 0 }
                ];

                console.log("Formatted Chart Data (Before Setting State):", formattedData);

                setTimeout(() => {
                    setChartData(formattedData);
                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error("Error fetching gift request distribution:", error);
                setLoading(false);
            }
        };

        fetchData();
    },);

    useEffect(() => {
        console.log("Updated Chart Data (After State Update):", chartData);
    }, [chartData]);

    console.log("Final Chart Data:", chartData);

    if (loading) {
        return <p style={{ textAlign: "center", margin: "50px 10px" }}>Loading chart data...</p>;
    }

    if (chartData.length === 0) {
        return <p style={{ textAlign: "center", margin: "50px 10px" }}>No data available.</p>;
    }

    const chartContent = (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: "500px", width: "100%", textAlign: "center" }}>
                <h3>Gift Requests Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name }) => name}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    // Conditional rendering for the card wrapper
    if (card) {
        return (
            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                margin: '10px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                {chartContent} 
            </div>
        );
    }

    return chartContent; 
};

export default GiftRequestsChart;

