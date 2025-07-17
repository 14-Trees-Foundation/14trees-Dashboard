import { Table } from "antd";
import { Plot } from "../../../../../types/plot";

const calculateUnion = (plantTypes: (string[] | undefined)[]) => {
    const allTypes = plantTypes.flat().filter((type): type is string => type !== undefined);
    return Array.from(new Set(allTypes));
}

const calculateSum = (data: (number | undefined)[]) => {
    return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
}

export const PlotTableSummary = (plots: Plot[], selectedPlotIds: number[], totalColumns: number) => {
    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="right" index={2} colSpan={2}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={3} colSpan={1}>
                    {calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.total))}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={4} colSpan={1}>
                    {calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.tree_count))}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={5} colSpan={1}>
                    {calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.shrub_count))}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={6} colSpan={1}>
                    {calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.herb_count))}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={7} colSpan={1}>
                    {calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.available))}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={8} colSpan={1}>
                    {calculateSum(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.card_available))}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={9} colSpan={1}>
                    {calculateUnion(plots.filter((plot) => selectedPlotIds.includes(plot.id)).map((plot) => plot.distinct_plants)).length}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={10} colSpan={totalColumns - 9}></Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    )
}

export { calculateUnion };