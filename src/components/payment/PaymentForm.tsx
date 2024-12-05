import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import TreeCostChart from "../../assets/tree-cost-chart.png";
import { Payment, PaymentHistory } from "../../types/payment";
import GeneralTable from "../GenTable";
import { getHumanReadableDate } from "../../helpers/utils";
import { HelpOutline, PaymentOutlined, VisibilityOutlined } from "@mui/icons-material";
import { AWSUtils } from "../../helpers/aws";
import ApiClient from "../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import RazonpayComponent from "../RazorpayComponent";
import { LoadingButton } from "@mui/lab";
import PaymentQRInfo from "../PaymentQRInfo";
import FileInputComponent from "../FileInputComponent";

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

interface PaymentFormProps {
    amount: number,
    payment: Payment | null
    onPaymentChange: (payment: Payment | null) => void
    onChange: (donorType: string, panNumber: string | null, consent: boolean) => void
}

const PaymentForm: FC<PaymentFormProps> = ({ payment, amount, onPaymentChange, onChange }) => {
    const [filePreview, setFilePreview] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<PaymentHistory | null>(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [amountData, setAmountData] = useState({
        totalAmount: 0,
        paidAmount: 0,
        verifiedAmount: 0,
    })

    const [donorType, setDonorType] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [consent, setConsent] = useState(false);

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
    const [payingAmount, setPayingAmount] = useState<number>(0);
    const [showRazorpay, setShowRazorpay] = useState(false);
    const [rpPayments, setRPPayments] = useState<any[]>([]);

    useEffect(() => {
        let paid = 0, verified = 0;
        if (payment && payment.payment_history && payment.payment_history.length > 0) {
            paid = payment.payment_history.map(item => item.amount).reduce((prev, curr) => prev + curr, 0);
            verified = payment.payment_history.filter(item => item.status === 'validated').map(item => item.amount_received).reduce((prev, curr) => prev + curr, 0);

            setPayingAmount(amount - paid > 0 ? amount - paid : 0);
        } else {
            setPayingAmount(amount);
        }

        const rpAmount = rpPayments.filter(pt => pt.status === "captured").map(pt => pt.amount - pt.fee).reduce((prev, curr) => prev + curr, 0)
        paid += rpAmount / 100;
        verified += rpAmount / 100;

        setAmountData({
            totalAmount: amount,
            paidAmount: paid,
            verifiedAmount: verified,
        })

        setDonorType(payment ? payment.donor_type : '');
        setPanNumber(payment?.pan_number ? payment.pan_number : '');
    }, [payment, amount, rpPayments])

    useEffect(() => {
        onChange(donorType, panNumber, consent);
    }, [donorType, panNumber, consent])

    useEffect(() => {
        const createPayment = async () => {
            const apiClient = new ApiClient();
            const pmt = await apiClient.createPayment(amount, donorType, panNumber, consent);
            if (!pmt) {
                toast.error("Something went wrong please try again");
                return;
            }

            onPaymentChange(pmt);
        }
        if (showRazorpay && !payment) {
            createPayment();
        }
    }, [showRazorpay, payment, amount, donorType, panNumber, consent])

    useEffect(() => {
        const handler = setTimeout(() => {
            if (payment) {
                getPaymentsForOrderId(payment.order_id)
            } else {
                setRPPayments([]);
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        }
    }, [payment])

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const handleOpenPreview = (record: PaymentHistory) => {
        setFilePreview(true);
        setSelectedHistory(record);
    }

    const handleClosePreview = () => {
        setFilePreview(false);
        setSelectedHistory(null);
    }

    const getPaymentsForOrderId = async (orderId: string) => {
        try {
            const apiClient = new ApiClient();
            const data = await apiClient.getPaymentsForOrder(orderId);
            setRPPayments(data);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const handlePaymentComplete = async (data: any) => {
        setShowRazorpay(false);
        if (!payment) return;

        setLoading(true);
        const apiClient = new ApiClient();
        try {
            await apiClient.verifyPayment(payment.order_id, data.razorpay_payment_id, data.razorpay_signature);
            toast.success("Payment done successfully!");
        } catch (error: any) {
            toast.error(error.message);
        }

        getPaymentsForOrderId(payment.order_id);
        setLoading(false);
    }

    const handleAddPaymentHistory = async () => {
        setLoading(true);
        const apiClient = new ApiClient();
        let pmt = payment;
        if (!pmt) {
            if (!donorType) toast.error("Please select citizenship!");
            else pmt = await apiClient.createPayment(amount, donorType, panNumber, consent);
            if (!pmt) {
                toast.error("Something went wrong please try again");
                setLoading(false);
                return;
            }

            onPaymentChange(pmt);
        }


        if (paymentMethod) {
            let paymentProofLink: string | null = null;
            if (paymentProof) {
                const awsUtils = new AWSUtils();
                const location = await awsUtils.uploadFileToS3("payment", paymentProof);
                if (location) paymentProofLink = location;
            }

            try {
                const resp = await apiClient.createPaymentHistory(pmt.id, payingAmount, paymentMethod, paymentProofLink);

                onPaymentChange({
                    ...pmt,
                    payment_history: pmt?.payment_history ? [...pmt.payment_history, resp] : [resp],
                })
            } catch (error: any) {
                toast.error("Failed to save payment made!")
            }
        }

        setPaymentMethod(undefined);
        setPaymentProof(null);
        setLoading(false);
        setVisible(false);
    }

    const columns: any[] = [
        {
            dataIndex: "amount",
            key: "amount",
            title: "Amount paid",
            align: "center",
            width: 100,
            render: (value: number, record: any) => record.payment_method ? value : value / 100
        },
        {
            dataIndex: "method",
            key: "method",
            title: "Payment Method",
            align: "center",
            width: 200,
            render: (value: any, record: any) => value ? value : record.payment_method
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
            dataIndex: "created_at",
            key: "created_at",
            title: "Payment Date",
            align: "center",
            width: 150,
            render: (value: number, record: any) => record.payment_date ? getHumanReadableDate(record.payment_date) : getHumanReadableDate(value * 1000),
        },
        // {
        //     dataIndex: "amount_received",
        //     key: "amount_received",
        //     title: "Amount received",
        //     align: "center",
        //     width: 150,
        //     className: "orange-column",
        //     render: (value: number, record: PaymentHistory) => {
        //         if (record.status !== 'validated') return '';
        //         else return value;
        //     }
        // },
        {
            dataIndex: "status",
            key: "status",
            title: "Status",
            align: "center",
            width: 150,
            render: (value: string) => value === "captured" ? "Success" : value === "failed" ? "Failed" : getReadableStatus(value),
        },
        // {
        //     dataIndex: "payment_received_date",
        //     key: "payment_received_date",
        //     title: "Received Date",
        //     align: "center",
        //     width: 150,
        //     className: "orange-column",
        //     render: (value: string, record: PaymentHistory) => {
        //         if (record.status !== 'validated') return '';
        //         else return getHumanReadableDate(value);
        //     },
        // },
    ]

    return (
        <Box style={{ padding: '0px 40px', width: '100%' }}>
            {((payment && payment.payment_history && payment.payment_history.length > 0) || (rpPayments.length > 0)) && <Box mb={1} display="flex" alignItems="center" justifyContent="flex-end">
                <Button
                    sx={{ ml: 2, textTransform: 'none' }}
                    onClick={() => { setVisible(true) }}
                    color="success" variant="contained">
                    Bank Transfer
                </Button>
                <Button
                    sx={{ ml: 2, textTransform: 'none' }}
                    onClick={() => { setShowRazorpay(true) }}
                    color="success" variant="contained">
                    Pay using Razorpay
                </Button>
            </Box>}
            <Box style={{ display: 'flex', justifyContent: (payment && payment.payment_history && payment.payment_history.length > 0) ? 'space-between' : 'center' }}>
                <Box width="45%">
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="amount">Total Amount</InputLabel>
                            <OutlinedInput
                                id="amount"
                                disabled
                                value={new Intl.NumberFormat('en-IN').format(amount)}
                                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                                label="Total Amount"
                            />
                            <FormHelperText>How is the above amount calculated?
                                <Tooltip title={<img
                                    src={TreeCostChart}
                                    alt="Tree Cost"
                                    style={{ width: 600, height: 'auto' }}
                                />}>
                                    <Button color="success" sx={{ ml: -2 }}><HelpOutline fontSize={"small"} /></Button>
                                </Tooltip></FormHelperText>
                        </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography mb={1}>Details to avail tax benefits:</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="donor-label">Citizenship (Applicable for 80G/501(c)/FCRA)</InputLabel>
                            <Select
                                labelId="donor-label"
                                value={donorType}
                                label="Citizenship (Applicable for 80G/501(c)/FCRA)"
                                onChange={(e) => { setDonorType(e.target.value); }}
                            >
                                <MenuItem value={'Indian Citizen'}>Indian Citizen</MenuItem>
                                <MenuItem value={'Foreign Donor'}>Foreign Donor</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }} hidden={donorType !== 'Indian Citizen'}>
                        <TextField
                            label="PAN Number"
                            name="pan_number"
                            value={panNumber}
                            onChange={(e) => { setPanNumber(e.target.value.toUpperCase().trim()) }}
                            fullWidth
                        />
                    </Box>
                    <Box sx={{ mt: 2 }} hidden={donorType !== 'Indian Citizen' || panNumber !== ''}>
                        <FormControlLabel control={<Checkbox checked={consent} onChange={(e, checked) => { setConsent(checked); }} />} label="I'm not provided PAN number and I understand that I will not qualify for 80G benefit" />
                    </Box>
                    {!((payment && payment.payment_history && payment.payment_history.length > 0) || (rpPayments.length > 0)) &&
                        <Box>
                            <Typography mb={1} mt={3}>For larger amounts, we highly recommend making bank transfer (option 1 below)</Typography>
                            <Box mb={1} display="flex" alignItems="center" justifyContent="flex-start">
                                <Button
                                    sx={{ textTransform: 'none' }}
                                    onClick={() => { setVisible(true) }}
                                    color="success" variant="contained">
                                    Bank Transfer
                                </Button>
                                <Button
                                    sx={{ ml: 2, textTransform: 'none' }}
                                    onClick={() => { setShowRazorpay(true) }}
                                    color="success" variant="contained">
                                    Pay using Razorpay
                                </Button>
                            </Box>
                        </Box>
                    }
                </Box>
                {
                    ((payment && payment.payment_history && payment.payment_history.length > 0) || (rpPayments.length > 0)) && <Box width="45%">
                        <Typography variant="h6" mb={1}>Payment Summary:</Typography>
                        <TableContainer sx={{ maxWidth: 650 }} component={Paper}>
                            <Table sx={{ maxWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#9ca29021" }}>
                                        <TableCell colSpan={2} align="center"><strong>User provided details</strong></TableCell>
                                        <TableCell colSpan={2} align="center"><strong>For backoffice usage only</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#ffeedad4" }}
                                    >
                                        <TableCell align="left">Remaining amount:</TableCell>
                                        <TableCell align="right">{new Intl.NumberFormat('en-IN').format(amountData.totalAmount - amountData.paidAmount)}</TableCell>
                                        <TableCell align="left">Unverified amount:</TableCell>
                                        <TableCell align="right">{new Intl.NumberFormat('en-IN').format(amountData.paidAmount - amountData.verifiedAmount)}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#dfffd5d4" }}
                                    >
                                        <TableCell align="left">Paid amount:</TableCell>
                                        <TableCell align="right">{new Intl.NumberFormat('en-IN').format(amountData.paidAmount)}</TableCell>
                                        <TableCell align="left">Verified amount:</TableCell>
                                        <TableCell align="right">{new Intl.NumberFormat('en-IN').format(amountData.verifiedAmount)}</TableCell>
                                    </TableRow>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: "#B9C0AB1C" }}
                                    >
                                        <TableCell align="left">Total amount:</TableCell>
                                        <TableCell align="right">{new Intl.NumberFormat('en-IN').format(amountData.totalAmount)}</TableCell>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                }
            </Box>
            {
                (rpPayments.length > 0 || (payment?.payment_history && payment?.payment_history.length > 0)) && <Box>
                    <Typography sx={{ mt: 5, mb: 1 }} variant="h6">Transaction History:</Typography>
                    <GeneralTable
                        loading={false}
                        rows={[...rpPayments, ...(payment?.payment_history ? payment.payment_history : [])].slice(page * pageSize, page * pageSize + pageSize)}
                        columns={columns}
                        totalRecords={rpPayments.length + (payment?.payment_history ? payment.payment_history.length : 0)}
                        page={page}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        onDownload={async () => { return payment?.payment_history || [] }}
                        tableName="Payment History"
                        rowClassName={(record, index) => record.status === 'failed' ? 'pending-item' : ''}
                    />
                </Box>
            }

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

            <Dialog open={visible} fullWidth maxWidth='md'>
                <DialogTitle>Payment Info</DialogTitle>
                <DialogContent dividers>
                    <Typography sx={{ mb: 2 }}>
                        Please use below details for payment (QR Code or wire transfer whichever is convenient for you).
                    </Typography>
                    <PaymentQRInfo />
                    <Divider />
                    <Box mt={3}>
                        <Typography>Once the payment is done, please make sure to upload the payment screenshot with details below:</Typography>
                        <Box mt={2}>
                            <FileInputComponent file={paymentProof} onFileChange={(file: File | null) => setPaymentProof(file)} />
                        </Box>
                        <Box mt={2}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="amount">Amount transferred</InputLabel>
                                <OutlinedInput
                                    id="amount"
                                    value={payingAmount ? new Intl.NumberFormat('en-IN').format(payingAmount) : ''}
                                    startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                                    label="Amount transferred"
                                    onChange={(e) => { setPayingAmount(parseInt(e.target.value.replaceAll(',', ''))) }}
                                />
                            </FormControl>
                        </Box>
                        <Box mt={2}>
                            <FormControl fullWidth>
                                <InputLabel id="payment-method-label">Transfer Mode</InputLabel>
                                <Select
                                    disabled={donorType !== 'Indian Citizen'}
                                    labelId="payment-method-label"
                                    value={paymentMethod || "None"}
                                    label="Transfer Mode"
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setVisible(false) }} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <LoadingButton
                        loading={loading}
                        loadingPosition="start"
                        variant="contained"
                        color="success"
                        onClick={handleAddPaymentHistory}
                        startIcon={<PaymentOutlined />}
                        disabled={!paymentMethod || !paymentProof}
                    >
                        Add Payment
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            {(payment && showRazorpay) && <RazonpayComponent
                amount={payingAmount}
                orderId={payment.order_id}
                onPaymentDone={handlePaymentComplete}
                onClose={() => { setShowRazorpay(false) }}
            />}
        </Box >
    );
}

export default PaymentForm;
