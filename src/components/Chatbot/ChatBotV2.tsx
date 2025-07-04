
import ChatBot, { Button, Params } from "react-chatbotify";
import HtmlRenderer, { HtmlRendererBlock } from "@rcb-plugins/html-renderer";
import ApiClient from "../../api/apiClient/apiClient";
import { useEffect, useState, useRef, useCallback } from "react";
import { marked } from 'marked'
import { AWSUtils } from "../../helpers/aws";
// import { setupResizableDiv } from "./resizableHandler";
import path from "path";


const renderer = {
    image({ href, title, text }: { href: string; title: string | null; text: string }) {
        return `<img src="${href}" alt="${text}" title="${title || ''}" style="max-width: 100%;" />`;
    },
};

marked.use({ renderer });

const defaultMessage = `**Hello USER_NAME! 🌿 Greetings from 14 Trees Foundation!**  
I'm Gifty, your digital assistant, here to help you spread green joy through tree gifting. Here’s what I can help you with:
1. 🌱 **Create a Tree Gifting Request**
    Gift trees to someone special with a personalized message and occasion.
`

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
    const [isFirstChat, setIsFirstChat] = useState(true);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: defaultMessage,
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    
    // Use ref to track if component is mounted
    const isMountedRef = useRef(true);

    useEffect(() => {
        // Set up cleanup for the timeout
        const timeoutId = setTimeout(() => {
            if (isMountedRef.current) {
                // setupResizableDiv(); // Commented out since the function doesn't exist
            }
        }, 5000);

        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
            isMountedRef.current = false;
        };
    }, []);

    const getBotResponse = useCallback(async (userInput: string, history: Message[]): Promise<string> => {
        if (!isMountedRef.current) {
            return ""; // Return early if component is unmounted
        }
        
        const apiClient = new ApiClient();
        const resp = await apiClient.serveUserQuery(userInput, history);
        
        // Check again after async operation
        if (!isMountedRef.current) {
            return resp.text_output;
        }
        
        console.log(resp.sponsor_details);
        if (resp.sponsor_details) {
            if (resp.sponsor_details.name) {
                const userName = localStorage.getItem("userName")
                if (userName != resp.sponsor_details.name)
                    localStorage.setItem("userName", resp.sponsor_details.name);
            }

            if (resp.sponsor_details.email) {
                const userEmail = localStorage.getItem("userEmail")
                if (userEmail != resp.sponsor_details.email)
                    localStorage.setItem("userEmail", resp.sponsor_details.email);
            }
        }
        return resp.text_output;
    }, []);
    // const helpOptions = ["Quickstart", "API Docs", "Examples", "Github", "Discord"];
    const handleUpload = useCallback(async (params: Params) => {
        if (!params.files || params.files.length === 0 || !isMountedRef.current) return;

        const awsUtils = new AWSUtils();
        const date = new Date(new Date().toDateString()).getTime()
        for (const file of params.files) {
            if (!isMountedRef.current) break; // Stop if component unmounted
            const uploadPromise = awsUtils.uploadFileToS3('gift-request', file, 'images/' + date); // your S3 upload function
            uploadedFiles.push(uploadPromise);
        }

        if (isMountedRef.current) {
            await Promise.all(uploadedFiles);
        }
    }, []);

    const handleInitialMessage = useCallback(() => {
        if (!isMountedRef.current) return "";
        
        const userName = localStorage.getItem("userName");
        // const userEmail = localStorage.getItem("userEmail");

        // if (!userName)
        //     return "Greatings!\n\nBefore we start, please share your fullname."
        // else if (!userEmail)
        //     return `Hi ${userName},\n\nPlease share your email address.`
        // else


        return marked(defaultMessage.replace(" USER_NAME", userName ? " " + userName : ""));
    }, []);

    const flow = {
        start: {
            message: handleInitialMessage,
            file: (params) => handleUpload(params),
            // path: () => {
            //     const userName = localStorage.getItem("userName");
            //     const userEmail = localStorage.getItem("userEmail");
            //     return !userName
            //         ? "name"
            //         : !userEmail
            //             ? "email"
            //             : "user"
            // },
            path: 'user',
            renderHtml: ["BOT", "USER"],
        } as HtmlRendererBlock,
        name: {
            message: (params: Params) => {
                if (isMountedRef.current) {
                    localStorage.setItem("userName", params.userInput);
                    return handleInitialMessage();
                }
                return "";
            },
            path: "email",
            renderHtml: ["BOT", "USER"],
        } as HtmlRendererBlock,
        email: {
            message: (params: Params) => {
                if (isMountedRef.current) {
                    localStorage.setItem("userEmail", params.userInput);
                    return handleInitialMessage();
                }
                return "";
            },
            path: "user",
            renderHtml: ["BOT", "USER"],
        } as HtmlRendererBlock,
        user: {
            message: async (params: Params) => {

                let history: Message[] = []

                const strings = await Promise.all(uploadedFiles);
                let userInput = params.userInput;
                if (strings.length > 0) {
                    userInput += '  \n\n' + "Image urls:\n" + strings.join("  \n");
                }

                if (isFirstChat && isMountedRef.current) {
                    setIsFirstChat(false);
                    const userName = localStorage.getItem("userName");
                    const userEmail = localStorage.getItem("userEmail");
                    if (userName || userEmail)
                        userInput += `\n\nUsername: ${userName}\nUseremail: ${userEmail}`;
                }

                const userMessage: Message = {
                    id: Date.now().toString(),
                    text: userInput,
                    sender: 'user',
                    timestamp: new Date()
                };

                if (isMountedRef.current) {
                    setMessages(prev => {
                        history = prev;
                        return [...prev, userMessage]
                    })
                }

                const resp = await getBotResponse(userInput, history);
                
                if (!isMountedRef.current) {
                    return marked(resp); // Return early if component is unmounted
                }
                
                const botResponse: Message = {
                    id: Date.now().toString(),
                    text: resp,
                    sender: 'bot',
                    timestamp: new Date()
                };

                if (isMountedRef.current) {
                    setMessages(prev => [...prev, botResponse]);
                }

                if (resp.includes("Your tree gifting request has been successfully created")) {
                    await params.showToast("🎉 Your gift request was created successfully!", 3000);
                }

                return marked(resp);
            },
            file: (params: any) => params,
            path: "user",
            renderHtml: ["BOT", "USER"],
        } as HtmlRendererBlock,
        process_options: {
            transition: { duration: 0 },
            chatDisabled: false,
            path: async (params: Params) => {
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
                if (isMountedRef.current) {
                    await params.injectMessage("Sit tight! I'll send you right there!");
                    const timeoutId = setTimeout(() => {
                        if (isMountedRef.current) {
                            window.location.pathname = path;
                        }
                    }, 800);
                    
                    // Store timeout ID for potential cleanup (though navigation will happen)
                    // This is more for completeness
                }
                return "end";
            },
        },
        repeat: {
            transition: { duration: 3000 },
            path: "prompt_again"
        },
        prompt_again: {
            message: "Would you like help with anything else today?",
            // options: helpOptions,
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
                        icon: Chat
                        // icon: 'src/assets/logo_light.png'
                    },

                    general: {
                        primaryColor: 'brown',
                        secondaryColor: 'green',
                        fontFamily: 'Arial, sans-serif',
                        showFooter: false
                    },
                    botBubble: { simulateStream: true, showAvatar: true, animate: true, avatar: 'src/assets/tree-chat.png' },
                    userBubble: { showAvatar: true },
                    audio: { disabled: false, defaultToggledOn: true },
                    voice: { language: "en-US", defaultToggledOn: false, disabled: false },
                    chatWindow: { showScrollbar: true, defaultOpen: true },
                    chatInput: { allowNewline: true, botDelay: 500, buttons: [Button.FILE_ATTACHMENT_BUTTON, Button.EMOJI_PICKER_BUTTON, Button.VOICE_MESSAGE_BUTTON, Button.SEND_MESSAGE_BUTTON] },
                    fileAttachment: { disabled: false, multiple: true, accept: '*', sendFileName: true, showMediaDisplay: true },
                    header: {
                        title: <div style={{ cursor: 'pointer', margin: '0px', paddingTop: '5px', fontSize: '16px', fontWeight: 'light' }}>Gifty</div>,
                        avatar: 'src/assets/logo_light.png',
                        buttons: [Button.NOTIFICATION_BUTTON, Button.CLOSE_CHAT_BUTTON]
                    },
                    // tooltip: {text: "Let's spread green!", mode: 'ALWAYS'},
                    footer: {
                        text: ''
                    }
                }}
            styles={{
                botBubbleStyle: {
                    backgroundColor: '#B2E0B2', // Pistachio green (warm)
                    color: '#1a3e1a',
                    borderRadius: '0 18px 18px 18px',
                },
                userBubbleStyle: {
                    backgroundColor: '#c1e1c1', // Soft lime green
                    color: '#1a3e1a', // Dark green text
                    borderRadius: '18px 0 18px 18px',
                },
                sendButtonStyle: {
                    backgroundColor: '#005700'
                },
                sendButtonHoveredStyle: {
                    backgroundColor: 'rgb(167 235 199)'
                },
                headerStyle: {
                    backgroundImage: 'linear-gradient(to right, rgb(14 142 81), rgb(110 197 151))',
                    padding: '8px'
                },
                chatInputContainerStyle: {
                    padding: '0px 16px'
                },
                chatInputAreaStyle: {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '15px'
                },
            }}
        />
    );
}

export default ChatbotV2;