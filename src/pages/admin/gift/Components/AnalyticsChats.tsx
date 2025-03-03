import { Box, CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useAppSelector } from "../../../../redux/store/hooks";
import ApiClient from "../../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip, Text } from "recharts";

interface AnalyticsChatsProps {
    style?: React.CSSProperties
}

const COLORS = ["#0088FE", "#00C49F", "#6DBBFF", "#00DFB5"];

const AnalyticsChats: FC<AnalyticsChatsProps> = ({ style }) => {
    /*
        Analytics: { corporate_requests: number, personal_requests: number,
                        corporate_trees: number, personal_trees: number }
    */
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const giftCardsData = useAppSelector(state => state.giftCardsData);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const apiClient = new ApiClient();
                const resp = await apiClient.getGiftRequestAnalytics();
                setAnalytics(resp);
            } catch (error: any) {
                toast.error(error.message);
            }
            setLoading(false);
        }, 300)

        return () => {
            return clearTimeout(timeoutId);
        }

    }, [giftCardsData])

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${value}`}
            </text>
        );
    };

    return (
        <Box style={style}
            sx={{
                borderRadius: "15px",
                boxShadow: "7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9",
                maxWidth: "42%",
                height: 520,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '15px'
            }}
        >
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Tree Requests
                    </Typography>
                    <Typography sx={{ marginBottom: -3 }}>
                        Trees: {analytics?.corporate_trees + analytics?.personal_trees} | Requests: {analytics?.corporate_requests + analytics?.personal_requests}
                    </Typography>
                    <ResponsiveContainer height={480}>
                        <PieChart width={730} height={250} >
                            <Pie
                                data={[
                                    { name: "Corporate Trees", value: analytics?.corporate_trees },
                                    { name: "Personal Trees", value: analytics?.personal_trees },
                                ]}
                                dataKey="value"
                                nameKey="name"
                                cx="50%" cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {[
                                    { name: "Corporate Trees", value: analytics?.corporate_trees },
                                    { name: "Personal Trees", value: analytics?.personal_trees },
                                ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Pie
                                data={[
                                    { name: "Corporate Requests", value: analytics?.corporate_requests },
                                    { name: "Personal Requests", value: analytics?.personal_requests },
                                ]}
                                dataKey="value"
                                nameKey="name"
                                cx="50%" cy="50%"
                                innerRadius={110}
                                outerRadius={180}
                                fill="#82ca9d"
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {[
                                    { name: "Corporate Requests", value: analytics?.corporate_requests },
                                    { name: "Personal Requests", value: analytics?.personal_requests },
                                ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend 
                                formatter={(value, entry, index) => <span style={{ color: 'black' }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </>
            )}
        </Box>
    );
}

export default AnalyticsChats;