import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Tooltip, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import FileInputComponent from "../FileInputComponent";
import PaymentQR14tree from "../../assets/PaymentQR14tree.jpg";
import TreeCostChart from "../../assets/tree-cost-chart.png";
import { Payment, PaymentHistory } from "../../types/payment";
import GeneralTable from "../GenTable";
import { getHumanReadableDate } from "../../helpers/utils";
import { HelpOutline, VisibilityOutlined } from "@mui/icons-material";
import { AWSUtils } from "../../helpers/aws";
import ApiClient from "../../api/apiClient/apiClient";
import { toast } from "react-toastify";

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
    onChange: (donorType: string, panNumber: string | null) => void
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

    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
    const [payingAmount, setPayingAmount] = useState<number>(0);

    useEffect(() => {
        if (payment && payment.payment_history && payment.payment_history.length > 0) {
            const paid = payment.payment_history.map(item => item.amount).reduce((prev, curr) => prev + curr, 0);
            const verified = payment.payment_history.filter(item => item.status === 'validated').map(item => item.amount_received).reduce((prev, curr) => prev + curr, 0);

            setAmountData({
                totalAmount: amount,
                paidAmount: paid,
                verifiedAmount: verified,
            })

            setPayingAmount(amount - paid > 0 ? amount - paid : 0);
        } else {
            setPayingAmount(amount);
        }

        setDonorType(payment ? payment.donor_type : '');
        setPanNumber(payment?.pan_number ? payment.pan_number : '');
    }, [payment, amount])

    useEffect(() => {
        onChange(donorType, panNumber);
    }, [donorType, panNumber])

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

    const handleAddPaymentHistory = async () => {
        const apiClient = new ApiClient();
        let pmt = payment;
        if (!pmt) {
            if (!donorType) toast.error("Please select citizenship!");
            else pmt = await apiClient.createPayment(amount, donorType, panNumber);

            if (!pmt) {
                toast.error("Something went wrong please try again");
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
            width: 100,
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
            width: 100,
            render: getHumanReadableDate,
        },
    ]

    return (
        <Box style={{ padding: '40px', width: '100%' }}>

            <Box style={{ display: 'flex', justifyContent: 'center' }}>
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
                                disabled
                                value={new Intl.NumberFormat('en-IN').format(amount)}
                                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography mb={1}>Tax Benefits:</Typography>
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
                            label="Pan card Number"
                            name="pan_number"
                            value={panNumber}
                            onChange={(e) => { setPanNumber(e.target.value.toUpperCase().trim()) }}
                            fullWidth
                        />
                    </Box>
                </Box>
            </Box>
            <Box mt={10}>
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
                        <Button
                            sx={{ mt: 2 }}
                            disabled={!paymentMethod || !paymentProof}
                            onClick={handleAddPaymentHistory}
                            color="success" variant="contained">
                            Add Payment Details
                        </Button>
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
            </Box>

            {
                payment && payment.payment_history && payment.payment_history.length > 0 && <Box mt={5}>
                    <Typography variant="h6" mb={1}>Past payment details</Typography>
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
                    <Typography variant="h6" mb={1}>Payment History</Typography>
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
        </Box >
    );
}

export default PaymentForm;
