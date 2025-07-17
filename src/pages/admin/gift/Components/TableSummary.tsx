import { Table } from "antd";
import { GiftCard } from "../../../../types/gift_card";

interface TableSummaryProps {
    giftRequests: GiftCard[];
    selectedGiftRequestIds: number[];
    totalColumns: number;
}

const TableSummary = ({ giftRequests, selectedGiftRequestIds, totalColumns }: TableSummaryProps) => {
    const calculateSum = (data: (number | undefined)[]) => {
        return data.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    }

    return (
        <Table.Summary fixed='bottom'>
            <Table.Summary.Row style={{ backgroundColor: 'rgba(172, 252, 172, 0.2)' }}>
                <Table.Summary.Cell align="center" index={1} colSpan={5}>
                    <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell align="center" index={5} colSpan={1}>
                    {calculateSum(giftRequests.filter((giftRequest) => selectedGiftRequestIds.includes(giftRequest.id)).map((giftRequest) => giftRequest.no_of_cards))}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="center" index={8} colSpan={9}></Table.Summary.Cell>
                <Table.Summary.Cell align="center" index={15} colSpan={1}>
                    {calculateSum(giftRequests.filter((giftRequest) => selectedGiftRequestIds.includes(giftRequest.id)).map((giftRequest: any) => giftRequest.total_amount))}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="center" index={16} colSpan={1}>
                    {calculateSum(giftRequests.filter((giftRequest) => selectedGiftRequestIds.includes(giftRequest.id)).map((giftRequest) => giftRequest.amount_received))}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="center" index={13} colSpan={3}></Table.Summary.Cell>
            </Table.Summary.Row>
        </Table.Summary>
    )
}

export default TableSummary;