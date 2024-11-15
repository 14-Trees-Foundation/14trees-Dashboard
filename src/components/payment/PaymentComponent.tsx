import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit";

import { Payment } from "../../types/payment"
import ApiClient from "../../api/apiClient/apiClient"
import GeneralTable from "../GenTable";
import PaymentBaseForm from "./PaymentBaseForm";

interface PaymentProps {
    initialAmount?: number
    paymentId?: number | null
    onChange?: (paymentId: number) => void
}

const PaymentComponent: React.FC<PaymentProps> = ({ initialAmount, paymentId, onChange }) => {

    const [openEdit, setOpenEdit] = useState(false);
    const [amount, setAmount] = useState(initialAmount || 0);
    const [amountPayed, setAmountPayed] = useState(0);
    const [donorType, setDonorType] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [payment, setPayment] = useState<Payment | null>(null);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const getPayment = async (paymentId: number) => {
        try {
            const apiClient = new ApiClient();
            const payment = await apiClient.getPayment(paymentId)
            setPayment(payment);

            setAmount(payment.amount);
            setDonorType(payment.donor_type);
            setPanNumber(payment.pan_number ? payment.pan_number : '');
            setAmountPayed(payment?.payment_history ? payment.payment_history.map(item => item.amount).reduce((prev, curr) => prev + curr) : 0)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (paymentId) getPayment(paymentId);
    }, [paymentId]);

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handleSavePayment = async () => {
        if (payment) {

        } else {
            
        }
    }

    const columns: any[] = [
        {
            dataIndex: "amount",
            key: "amount",
            title: "amount",
            align: "center",
            width: 100,
        },
        {
            dataIndex: "payment_method",
            key: "payment_method",
            title: "Payment Method",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "payment_proof",
            key: "payment_proof",
            title: "Payment Proof",
            align: "center",
            width: 200,
        },
        {
            dataIndex: "payment_received_date",
            key: "payment_received_date",
            title: "Received Date",
            align: "center",
            width: 100,
        },
        {
            dataIndex: "status",
            key: "status",
            title: "Status",
            align: "center",
            width: 150,
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 100,
            align: "center",
            render: (value: any, record: any, index: number) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant='outlined'
                        color='success'
                        style={{ margin: "0 5px" }}
                        onClick={() => {  }}
                    >
                        <EditIcon />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <Box>
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Box style={{ flexGrow: 1 }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <Typography>Donor Type: {donorType || "N/A"}</Typography>
                        <Typography ml={2}>Pan number: {panNumber || "N/A"}</Typography>
                    </Box>
                    <Box display="flex" mt={1}>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Total amount:</Typography>
                                <Typography ml={10}>{new Intl.NumberFormat('en-IN').format(amount)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Amount paid:</Typography>
                                <Typography ml={10}>{new Intl.NumberFormat('en-IN').format(amountPayed)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Remaining amount:</Typography>
                                <Typography ml={10}>{new Intl.NumberFormat('en-IN').format(amount - amountPayed)}</Typography>
                            </Box>
                        </Box>
                        <Box style={{ flexGrow: 1 }}></Box>
                    </Box>
                </Box>

                <Box>
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => {
                            setOpenEdit(true);
                        }}>
                        <EditIcon />
                    </Button>
                </Box>
            </Box>
            
            <Box mt={2}>
                <Typography>Payment History</Typography>
                <GeneralTable 
                    loading={false}
                    rows={payment?.payment_history ? payment.payment_history.slice(page * pageSize, page * pageSize + pageSize) : []}
                    columns={columns}
                    totalRecords={payment?.payment_history ? payment.payment_history.length : 0}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={handlePaginationChange}
                    onDownload={async() => { return payment?.payment_history || [] }}
                    tableName="Payment History"
                />
            </Box>

            <Dialog open={openEdit} fullWidth maxWidth="md">
                <DialogTitle>Payment Details</DialogTitle>
                <DialogContent dividers>
                    <PaymentBaseForm
                        amount={amount}
                        donorType={donorType}
                        panNumber={panNumber}
                        onDonorTypeChange={donorType => { setDonorType(donorType) }}
                        onPanNumberChange={panNumber => { setPanNumber(panNumber) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenEdit(false) }} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSavePayment} color="success" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default PaymentComponent;