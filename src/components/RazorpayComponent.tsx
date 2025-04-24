import logo from '../assets/dark_logo.png'
import { User } from "../types/user";
import { useEffect } from "react";

interface RazonpayComponentProps {
    amount: number,
    orderId: string,
    user?: User,
    description?: string,
    onPaymentDone: (data: any) => void
    onClose: () => void
}

const RazonpayComponent: React.FC<RazonpayComponentProps> = ({ amount, orderId, description, user, onPaymentDone, onClose }) => {

    const loadScript = (src: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            const displayRazorpay = async () => {
                // load Razorpay script
                const res = await loadScript(
                    "https://checkout.razorpay.com/v1/checkout.js"
                );
        
                if (!res) {
                    alert("Razorpay SDK failed to load. Are you online?");
                    return;
                }
        
                const options = {
                    key: import.meta.env.RAZORPAY_KEY_ID,
                    amount: (amount * 100).toFixed(0), // in paise
                    currency: "INR",
                    name: "14 Trees",
                    description: description,
                    image: { logo },
                    order_id: orderId,
                    handler: function (response: any) {
                        const data = {
                            order_id: orderId,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        };
            
                        onPaymentDone(data);
                    },
                    modal: {
                        ondismiss: () => {
                            onClose();
                        },
                    },
                    prefill: user ? {
                        name: user.name,
                        email: user.email,
                        contact: user.phone,
                    } : undefined,
                    theme: {
                        color: "#61dafb",
                    },
                }
                
                console.log( "Razorpay display called:" ,options);
                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            }

            displayRazorpay();
        }, 500) 
        
        return () => {
            clearTimeout(handler);
        }
    }, [amount, orderId, description, user, onPaymentDone])

    return null;
}

export default RazonpayComponent;