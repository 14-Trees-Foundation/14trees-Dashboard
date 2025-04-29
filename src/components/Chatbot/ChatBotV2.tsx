import ChatBot, { Button, Params } from "react-chatbotify";
import HtmlRenderer, { HtmlRendererBlock } from "@rcb-plugins/html-renderer";
import ApiClient from "../../api/apiClient/apiClient";
import { useEffect, useState } from "react";
import { marked } from 'marked'
import { setupResizableDiv } from "./resizableHandler";
import path from "path";

import { AWSUtils } from "../../helpers/aws";
import ReactMarkdown from "react-markdown";

const renderer = {
    image({ href, title, text }: { href: string; title: string | null; text: string }) {
        return `<img src="${href}" alt="${text}" title="${title || ''}" style="max-width: 100%;" />`;
    },
};

marked.use({ renderer });

const defaultMessage = `**Hello!! Welcome to LightHouse AI Automation!**  
I'm your digital assistant, here to help you onboard new suppliers with ease. Here's what I can assist you with:
1. 📝 **Onboard a New Supplier**
    Provide the necessary details to add a new supplier to our system.
2. 📋 **View Existing Suppliers**
    Check the list of suppliers already in the system.
3. 🔍 **Search for a Supplier**
    Find a specific supplier by name or ID.
`;

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
};


const Chat: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        style={{ ...props.style, padding: 15 }}
        fill="currentColor"
    >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M8 8.22c0-.86.7-1.56 1.56-1.56.33 0 .64.1.89.28l-.01-.12c0-.86.7-1.56 1.56-1.56s1.56.7 1.56 1.56l-.01.12c.26-.18.56-.28.89-.28.86 0 1.56.7 1.56 1.56 0 .62-.37 1.16-.89 1.4.52.25.89.79.89 1.41 0 .86-.7 1.56-1.56 1.56-.33 0-.64-.11-.89-.28l.01.12c0 .86-.7 1.56-1.56 1.56s-1.56-.7-1.56-1.56l.01-.12c-.26.18-.56.28-.89.28-.86 0-1.56-.7-1.56-1.56 0-.62.37-1.16.89-1.4C8.37 9.38 8 8.84 8 8.22M12 19c-3.31 0-6-2.69-6-6 3.31 0 6 2.69 6 6 0-3.31 2.69-6 6-6 0 3.31-2.69 6-6 6"></path>
    </svg>
);

const ChatbotV2 = () => {
    const plugins = [HtmlRenderer()];
    const uploadedFiles: Promise<string>[] = [];
    const [botResp, setBotResp] = useState<string>('');
    let resolveMessage: ((value: string) => void) | null = null;
    let messageResponsePromise: Promise<string> | null = null;
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: defaultMessage,
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    const apiClient = new ApiClient();

    useEffect(() => {
        setTimeout(() => {
            setupResizableDiv();
        }, 5000);
    }, []);

    const getBotResponse = async (userInput: string, history: Message[]): Promise<string> => {
        const resp = await apiClient.handleSupplierQuery(userInput, history); // Call the new method
        return resp.output;
    };
    // const helpOptions = ["Quickstart", "API Docs", "Examples", "Github", "Discord"];
    const handleUpload = async (params: Params) => {
        if (!params.files || params.files.length === 0) return;

        const awsUtils = new AWSUtils();
        const date = new Date(new Date().toDateString()).getTime()
        for (const file of params.files) {
            const uploadPromise = awsUtils.uploadFileToS3('gift-request', file, 'images/' + date); // your S3 upload function
            uploadedFiles.push(uploadPromise);
        }

        await Promise.all(uploadedFiles);
    }

    const flow = {
        start: {
            message: marked(defaultMessage),
            // options: helpOptions,
            file: (params: any) => params,
            path: "process_options",
            renderHtml: ["BOT", "USER"],
        } as HtmlRendererBlock,  
        user: {
            message: async (params: Params) => {
                let history: Message[] = []
                if (!messageResponsePromise) {
                    messageResponsePromise = new Promise((resolve) => {
                        resolveMessage = resolve;
                    });
                }

                const strings = await Promise.all(uploadedFiles);
                let userInput = params.userInput;
                if (strings.length > 0) {
                    userInput += '  \n\n' + "Image urls:\n" + strings.join("  \n");
                }

                const userMessage: Message = {
                    id: Date.now().toString(),
                    text: userInput,
                    sender: 'user',
                    timestamp: new Date()
                };

                setMessages(prev => {
                    history = prev;
                    return [...prev, userMessage]
                })

                const resp = await getBotResponse(userInput, history);
                const botResponse: Message = {
                    id: Date.now().toString(),
                    text: resp,
                    sender: 'bot',
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, botResponse]);
                
                const respLower = resp.toLowerCase();
                 if (respLower.includes("successfully created") || 
                     respLower.includes("supplier has been created")) {
                     await params.showToast("✅ Supplier onboarded successfully!", 3000);
                }

                setBotResp(resp);

                if (resolveMessage) {
                    resolveMessage(resp);
                    resolveMessage = null;
                    messageResponsePromise = null;
                }

                return marked(resp);
                // params.injectMessage(<div
                //     className="rcb-bot-message rcb-bot-message-entry"
                //     style={{ backgroundColor: 'green', 'color': 'rgb(255, 255, 255)', maxWidth: '65%' }}
                // ><ReactMarkdown
                //     components={{
                //         img: ({ node, ...props }) => (
                //             <img
                //                 {...props}
                //                 style={{ maxWidth: '100%' }}
                //             />
                //         ),
                //         a: ({ node, ...props }) => (
                //             <a
                //                 {...props}
                //                 target="_blank"
                //                 rel="noopener noreferrer"
                //             >
                //                 {props.children}
                //             </a>
                //         )
                //     }}
                // >{resp}</ReactMarkdown></div>, 'BOT')
            },
            file: (params: any) => params,
            path: "user",
            renderHtml: ["BOT", "USER"],
        } as HtmlRendererBlock,
        process_options: {
			transition: {duration: 0},
			chatDisabled: false,
			path: async (params) => {
				let path = "";
				switch (params.userInput) {
                    case "🎁 View Gifts":
                    path = "/gifts";
                    break;
                case "👋 Visitor Page":
                    path = "/visitor";
                    break;
                default:
                    return "user";
            }
				await params.injectMessage("Sit tight! I'll send you right there!");
				setTimeout(() => {
                    window.location.pathname = path;
                }, 800);
                return "end";
			},
		},
		repeat: {
			transition: {duration: 3000},
			path: "prompt_again"
		},
        prompt_again: {
            message: "Would you like help with anything else today?",
          //  options: helpOptions,
            transition: { duration: 1000 },
            path: "process_options",
            renderHtml: ["BOT"],
        },
    }



    return (
        <ChatBot
            plugins={plugins}
            flow={flow}
            settings={
                {
                    chatButton: {
                       // icon: Chat
                        icon: 'src/assets/logo_lightthouse.jpg'
                    },

                    general: {
                        primaryColor: '#007BFF', // Bluish color
                        secondaryColor: '#003366', // Change this to the logo's blue color
                        fontFamily: 'Arial, sans-serif',
                        showFooter: false
                    },
                    botBubble: { simulateStream: true, showAvatar: true, animate: true, avatar: 'src/assets/botbubble_icon.jpg' },
                    userBubble: { showAvatar: true },
                    audio: { disabled: false, defaultToggledOn: true },
                    voice: { language: "en-US", defaultToggledOn: false, disabled: false },
                    chatWindow: { showScrollbar: true, defaultOpen: true },
                    chatInput: { allowNewline: true, botDelay: 500, buttons: [Button.FILE_ATTACHMENT_BUTTON, Button.EMOJI_PICKER_BUTTON, Button.VOICE_MESSAGE_BUTTON, Button.SEND_MESSAGE_BUTTON] },
                    fileAttachment: { disabled: false, multiple: true, accept: '*', sendFileName: true, showMediaDisplay: true },
                    header: {
                        title: <div style={{ cursor: 'pointer', margin: '0px', paddingTop: '5px', fontSize: '16px', fontWeight: 'light' }}>LightHouse</div>,
                        avatar: 'src/assets/logo_lightthouse.jpg',
                        buttons: [Button.NOTIFICATION_BUTTON, Button.CLOSE_CHAT_BUTTON]
                    },
                    // tooltip: {text: "Let's spread green!", mode: 'ALWAYS'},
                    footer: {
                        text: ''
                    }
                }}
             styles={{
                // chatButtonStyle: {
                //     backgroundColor: '#28a745',
                //     backgroundImage: 'none',
                // },
                botBubbleStyle: {
                    backgroundColor: '#B2D4E0', // Light bluish color
                    color: '#000000', // Black text
                    borderRadius: '0 18px 18px 18px',
                },
                 userBubbleStyle: {
                    backgroundColor: '#ADD8E6', // White
                    color: '#000000', // Black text
                    borderRadius: '18px 0 18px 18px',
                 },

                sendButtonStyle: {
                    backgroundColor: '#003366'
                },
                sendButtonHoveredStyle: {
                    backgroundColor: 'rgb(167 235 199)'
                },
                headerStyle: {
                    backgroundImage: 'linear-gradient(to right, #007BFF, #B2D4E0)', // Gradient
                    padding: '8px'
                },
                chatInputContainerStyle: {
                    padding: '0px 16px'
                },
                chatInputAreaStyle: {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '15px'
                },
                // notificationButtonStyle:{
                //     width: '25px',
                //     height: '25px'
                // },
                // voiceIconStyle:{
                //     width: '25px',
                //     height: '25px'
                // },
                // closeChatIconStyle:{
                //     width: '25px',
                //     height: '25px'
                // }
            }}
        />
    );
}

export default ChatbotV2;