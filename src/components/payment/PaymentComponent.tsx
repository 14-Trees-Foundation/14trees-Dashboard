import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Tooltip, Typography } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit";

import { Payment, PaymentHistory } from "../../types/payment"
import ApiClient from "../../api/apiClient/apiClient"
import GeneralTable from "../GenTable";
import PaymentBaseForm from "./PaymentBaseForm";
import { HelpOutline, VisibilityOutlined } from "@mui/icons-material";
import { getHumanReadableDate } from "../../helpers/utils";
import PaymentHistoryForm from "./PaymentHistoryForm";
import FileInputComponent from "../FileInputComponent";

import PaymentQR14tree from "../../assets/PaymentQR14tree.jpg";
import TreeCostChart from "../../assets/tree-cost-chart.png";
import { AWSUtils } from "../../helpers/aws";

const paymentStatusList = [
    {
        value: "pending_validation",
        label: "Pending validation"
    },
    {
        value: "payment_not_received",
        label: "Payment not received"
    },
    {
        value: "validated",
        label: "Validated"
    },
]

const getReadableStatus = (value: string) => {
    const status = paymentStatusList.find(item => item.value === value)
    return status ? status.label : '';
}

interface PaymentProps {
    initialAmount?: number
    paymentId?: number | null
    onChange?: (paymentId: number) => void
}

const PaymentComponent: React.FC<PaymentProps> = ({ initialAmount, paymentId, onChange }) => {

    const [openEdit, setOpenEdit] = useState(false);
    const [amount, setAmount] = useState(initialAmount || 0);
    const [donorType, setDonorType] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [payment, setPayment] = useState<Payment | null>(null);

    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
    const [payingAmount, setPayingAmount] = useState<number>(0);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [filePreview, setFilePreview] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<PaymentHistory | null>(null);

    const [historyModal, setHistoryModal] = useState(false);
    const [historyForm, setHistoryForm] = useState({
        amount: 0,
        amountReceived: 0,
        paymentMethod: '',
        paymentProof: '',
        status: '',
        paymentDate: '',
        receivedDate: '',
    })

    const [amountData, setAmountData] = useState({
        totalAmount: 0,
        paidAmount: 0,
        verifiedAmount: 0,
    })

    useEffect(() => {
        if (payment && payment.payment_history && payment.payment_history.length > 0) {
            const paid = payment.payment_history.map(item => item.amount).reduce((prev, curr) => prev + curr, 0);
            const verified = payment.payment_history.filter(item => item.status === 'validated').map(item => item.amount_received).reduce((prev, curr) => prev + curr, 0);

            setAmountData({
                totalAmount: amount,
                paidAmount: paid,
                verifiedAmount: verified,
            });

            setPayingAmount(amount - paid);
        }
    }, [payment, amount])

    const getPayment = async (paymentId: number) => {
        try {
            const apiClient = new ApiClient();
            const payment = await apiClient.getPayment(paymentId)
            setPayment(payment);

            setAmount(payment.amount);
            setDonorType(payment.donor_type);
            setPanNumber(payment.pan_number ? payment.pan_number : '');
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
        setOpenEdit(false);
        const apiClient = new ApiClient();

        try {
            if (payment) {
                const data = { ...payment };
                data.donor_type = donorType;
                data.pan_number = panNumber ? panNumber : null;
                const resp = await apiClient.updatedPayment(data);

                setPayment({
                    ...payment,
                    donor_type: resp.donor_type,
                    pan_number: resp.pan_number,
                })
            } else {
                const resp = await apiClient.createPayment(amount, donorType, panNumber);
                setPayment(resp);
                onChange && onChange(resp.id);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const handleOpenPreview = (record: PaymentHistory) => {
        setFilePreview(true);
        setSelectedHistory(record);
    }

    const handleClosePreview = () => {
        setFilePreview(false);
        setSelectedHistory(null);
    }

    const handleOpenHistoryModal = (record: PaymentHistory) => {
        setHistoryModal(true);
        setSelectedHistory(record);
        setHistoryForm({
            amount: record.amount,
            amountReceived: record.amount_received,
            receivedDate: record.payment_received_date,
            paymentMethod: record.payment_method,
            paymentProof: record.payment_proof || '',
            status: record.status,
            paymentDate: record.payment_date,
        })
    }

    const handleCloseHistoryModal = () => {
        setHistoryModal(false);
        setSelectedHistory(null);
        setHistoryForm({
            amount: 0,
            amountReceived: 0,
            paymentMethod: '',
            paymentProof: '',
            status: '',
            paymentDate: '',
            receivedDate: '',
        })
    }

    const handleSavePaymentHistory = async () => {
        setHistoryModal(false);
        if (!selectedHistory) return;

        const data = { ...selectedHistory };
        data.amount_received = historyForm.amountReceived;
        data.payment_method = historyForm.paymentMethod;
        data.payment_received_date = historyForm.receivedDate;
        data.status = historyForm.status;

        const apiClient = new ApiClient();
        const resp = await apiClient.updatePaymentHistory(data);

        const idx = payment?.payment_history?.findIndex(item => item.id === resp.id);
        if (idx !== undefined && idx >= 0 && payment?.payment_history) {
            payment.payment_history[idx] = resp;
        }

        handleCloseHistoryModal();
    }

    const handleAddPaymentHistory = async () => {
        if (!payment) return;

        if (paymentMethod) {
            let paymentProofLink: string | null = null;
            if (paymentProof) {
                const awsUtils = new AWSUtils();
                const location = await awsUtils.uploadFileToS3("payment", paymentProof);
                if (location) paymentProofLink = location;
            }

            try {
                const apiClient = new ApiClient();
                const resp = await apiClient.createPaymentHistory(payment.id, payingAmount, paymentMethod, paymentProofLink);

                setPayment(prev => {
                    return prev ? {
                        ...prev,
                        payment_history: prev?.payment_history ? [...prev.payment_history, resp] : [resp],
                    } : null
                })
            } catch (error: any) {
                toast.error("Failed to save payment made!")
            }
        }
    }

    const columns: any[] = [
        {
            dataIndex: "amount",
            key: "amount",
            title: "Amount paid",
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
            width: 150,
            render: (value: any, record: any) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant='outlined'
                        color='success'
                        disabled={!value}
                        style={{ margin: "0 5px" }}
                        onClick={() => { handleOpenPreview(record) }}
                    >
                        <VisibilityOutlined />
                    </Button>
                </div>
            ),
        },
        {
            dataIndex: "payment_date",
            key: "payment_date",
            title: "Payment Date",
            align: "center",
            width: 150,
            render: getHumanReadableDate,
        },
        {
            dataIndex: "amount_received",
            key: "amount_received",
            title: "Amount received",
            align: "center",
            width: 150,
        },
        {
            dataIndex: "status",
            key: "status",
            title: "Status",
            align: "center",
            width: 150,
            render: getReadableStatus,
        },
        {
            dataIndex: "payment_received_date",
            key: "payment_received_date",
            title: "Received Date",
            align: "center",
            width: 150,
            render: getHumanReadableDate,
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
                        onClick={() => { handleOpenHistoryModal(record) }}
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
                                <Typography ml={10}>{new Intl.NumberFormat('en-IN').format(amountData.totalAmount)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Paid amount:</Typography>
                                <Typography ml={10}>{new Intl.NumberFormat('en-IN').format(amountData.paidAmount)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Remaining amount:</Typography>
                                <Typography ml={10}>{new Intl.NumberFormat('en-IN').format(amountData.totalAmount - amountData.paidAmount)}</Typography>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" gap={1} ml={10}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Verified amount:</Typography>
                                <Typography ml={10}>{new Intl.NumberFormat('en-IN').format(amountData.verifiedAmount)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>Unverified amount:</Typography>
                                <Typography ml={10}>{new Intl.NumberFormat('en-IN').format(amountData.paidAmount - amountData.verifiedAmount)}</Typography>
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

            {amountData.paidAmount !== amountData.totalAmount && <Box mt={10}>
                <Typography variant="h6">Please consider paying remaining amount</Typography>
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box width="45%">
                        <Box sx={{ mt: 2 }}>
                            <Typography>How is the below amount calculated?
                                <Tooltip title={<img
                                    src={TreeCostChart}
                                    alt="Tree Cost"
                                    style={{ width: 600, height: 'auto' }}
                                />}>
                                    <Button color="success"><HelpOutline /></Button>
                                </Tooltip>
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="amount">Amount</InputLabel>
                                <OutlinedInput
                                    id="amount"
                                    value={payingAmount ? new Intl.NumberFormat('en-IN').format(payingAmount) : ''}
                                    startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                                    label="Amount"
                                    onChange={(e) => { setPayingAmount(parseInt(e.target.value.replaceAll(',', ''))) }}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                                <Select
                                    disabled={donorType !== 'Indian Citizen'}
                                    labelId="payment-method-label"
                                    value={paymentMethod || "None"}
                                    label="Payment Method"
                                    onChange={(e) => { setPaymentMethod(e.target.value !== "None" ? e.target.value : undefined) }}
                                >
                                    <MenuItem value={"None"}>Not Selected</MenuItem>
                                    <MenuItem value={'UPI'}>UPI</MenuItem>
                                    <MenuItem value={'Net Banking'}>Net Banking</MenuItem>
                                    <MenuItem value={'Cheque'}>Cheque</MenuItem>
                                    <MenuItem value={'Cash'}>Cash</MenuItem>
                                    <MenuItem value={'Wire Transfer'}>Wire Transfer</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                    <Box width="45%">
                        <div style={{ textAlign: "center" }}>
                            <img
                                // eslint-disable-next-line no-octal-escape
                                src={PaymentQR14tree} // Replace with your QR code image URL
                                alt="QR Code"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "200px",
                                    marginBottom: "20px",
                                }}
                            />
                        </div>
                        <Box sx={{ mt: 2 }}>
                            <FileInputComponent file={paymentProof} onFileChange={(file: File | null) => setPaymentProof(file)} />
                        </Box>
                    </Box>
                </Box>
                <Button
                    disabled={!paymentMethod || !paymentProof}
                    onClick={handleAddPaymentHistory}
                    color="success" variant="contained">
                    Add Payment Details
                </Button>
            </Box>}

            <Box mt={10}>
                <Typography>Payment History</Typography>
                <GeneralTable
                    loading={false}
                    rows={payment?.payment_history ? payment.payment_history.slice(page * pageSize, page * pageSize + pageSize) : []}
                    columns={columns}
                    totalRecords={payment?.payment_history ? payment.payment_history.length : 0}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={handlePaginationChange}
                    onDownload={async () => { return payment?.payment_history || [] }}
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

            <Dialog open={historyModal} fullWidth maxWidth="md">
                <DialogTitle>Validate Payments</DialogTitle>
                <DialogContent dividers>
                    <PaymentHistoryForm
                        amount={historyForm.amount}
                        receivedAmount={historyForm.amountReceived}
                        onReceivedAmountChange={(amountReceived: number) => { setHistoryForm(prev => ({ ...prev, amountReceived })) }}
                        paymentMethod={historyForm.paymentMethod}
                        onPaymentMethodChange={(paymentMethod: string) => { setHistoryForm(prev => ({ ...prev, paymentMethod })) }}
                        paymentReceivedDate={historyForm.receivedDate}
                        onPaymentReceivedDateChange={(date: string) => { setHistoryForm(prev => ({ ...prev, receivedDate: date })) }}
                        status={historyForm.status}
                        onStatusChange={(status: string) => { setHistoryForm(prev => ({ ...prev, status })) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHistoryModal} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSavePaymentHistory} color="success" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={filePreview} fullWidth maxWidth="lg">
                <DialogTitle>Payment Proof</DialogTitle>
                <DialogContent dividers>
                    {selectedHistory && selectedHistory.payment_proof &&
                        <Box
                            width="100%"
                            maxHeight="65vh"
                            display="flex"
                            alignItems="center"
                            p={2}
                        >
                            {selectedHistory.payment_proof.endsWith('.pdf') ? (
                                <iframe
                                    src={selectedHistory.payment_proof}
                                    title="PDF Preview"
                                    style={{ border: 'none', width: '100%', height: '65vh', display: 'block' }}
                                ></iframe>
                            ) : (
                                <img
                                    src={selectedHistory.payment_proof}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                />
                            )}
                        </Box>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePreview} color="error" variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default PaymentComponent;