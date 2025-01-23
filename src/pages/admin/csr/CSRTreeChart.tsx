import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Area, AreaChart, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ApiClient from "../../../api/apiClient/apiClient";

interface CSRTreeChartProps {
    groupId?: number
}

const CSRTreeChart: React.FC<CSRTreeChartProps> = ({ groupId }) => {

    const [treesData, setTreesData] = useState<any[]>([]);

    const getTreeLoggingData = async (groupId?: number) => {
        try {
            const apiClient = new ApiClient();
            const resp = await apiClient.getCSRTreesLoggedByYear(groupId);

            let total = 0;
            const data: any[] = [];
            if (resp.length > 0) data.push({ year: resp[0].year - 1, "Total Sponsored Trees": 0, "Yearly Sponsored Trees": 0 });

            resp.forEach(item => {
                total += item.tree_count;

                data.push({ ...item, "Total Sponsored Trees": total, "Yearly Sponsored Trees": item.tree_count });
            })

            setTreesData(data);

        } catch (error: any) {

        }
    }

    useEffect(() => {
        getTreeLoggingData(groupId);
    }, [groupId])

    return (
        <Box mt={2}>
            <ResponsiveContainer height={480}>
                <AreaChart
                    data={treesData}
                    margin={{
                        top: 40,
                        right: 40,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <XAxis dataKey="year" >
                        <Label value="Year" offset={0} position='insideBottom' />
                    </XAxis>
                    <YAxis>
                        <Label value="Trees Sponsored" angle={-90} position='insideLeft' />
                    </YAxis>
                    <Tooltip />
                    <Legend verticalAlign="top" height={36}/>
                    <Area
                        type="linear"
                        dataKey="Total Sponsored Trees"
                        stroke={"green"}
                        fill={"green"}
                    />
                    <Area
                        type="linear"
                        dataKey="Yearly Sponsored Trees"
                        stroke={"rgb(18, 94, 123)"}
                        fill={"rgb(18, 94, 123)"}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default CSRTreeChart;