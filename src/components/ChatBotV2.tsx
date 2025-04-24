import ChatBot, { Button, Params } from "react-chatbotify";
import HtmlRenderer, { HtmlRendererBlock } from "@rcb-plugins/html-renderer";
import ApiClient from "../api/apiClient/apiClient";
import { useState } from "react";
import { marked } from 'marked'

const renderer = {
    image({ href, title, text }: { href: string; title: string | null; text: string }) {
        return `<img src="${href}" alt="${text}" title="${title || ''}" style="max-width: 100%;" />`;
    },
};

marked.use({ renderer });

const defaultMessage = `**Hello! 🌿 Greetings from 14 Trees Foundation!**  
I'm your digital assistant, here to help you spread green joy through tree gifting. Here’s what I can help you with:
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
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: defaultMessage,
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    const getBotResponse = async (userInput: string, history: Message[]): Promise<string> => {
        const apiClient = new ApiClient();
        const resp = await apiClient.serveUserQuery(userInput, history);
        return resp.output;
    };
    const helpOptions = ["Quickstart", "API Docs", "Examples", "Github", "Discord"];
    const handleUpload = (params) => {
		const files = params.files;
		// handle files logic here
	}

    const flow = {
        start: {
            message: marked(defaultMessage),
            // options: helpOptions,
            file: (params) => handleUpload(params),
            path: "user",
            renderHtml: ["BOT", "USER"],
        } as HtmlRendererBlock,
        user: {
            message: async (params: Params) => {
                let history: Message[] = []
                const userMessage: Message = {
                    id: Date.now().toString(),
                    text: params.userInput,
                    sender: 'user',
                    timestamp: new Date()
                };

                setMessages(prev => {
                    history = prev;
                    return [...prev, userMessage]
                })

                const resp = await getBotResponse(params.userInput, history);
                const botResponse: Message = {
                    id: Date.now().toString(),
                    text: resp,
                    sender: 'bot',
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, botResponse]);
                return marked(resp, {

                });
            },
            file: (params) => handleUpload(params),
            path: "user",
            renderHtml: ["BOT", "USER"],
        } as HtmlRendererBlock,
        process_options: {
			transition: {duration: 0},
			chatDisabled: false,
			path: async (params) => {
				let link = "";
				switch (params.userInput) {
				case "Quickstart":
					link = "https://react-chatbotify.com/docs/introduction/quickstart/";
					break;
				case "API Docs":
					link = "https://react-chatbotify.com/docs/api/settings";
					break;
				case "Examples":
					link = "https://react-chatbotify.com/docs/examples/basic_form";
					break;
				case "Github":
					link = "https://github.com/tjtanjin/react-chatbotify/";
					break;
				case "Discord":
					link = "https://discord.gg/6R4DK4G5Zh";
					break;
				default:
					return "unknown_input";
				}
				await params.injectMessage("Sit tight! I'll send you right there!");
				setTimeout(() => {
					window.open(link);
				}, 1000)
				return "repeat"
			},
		},
		repeat: {
			transition: {duration: 3000},
			path: "prompt_again"
		},
        prompt_again: {
			message: "Do you need any other help?",
			options: helpOptions,
			path: "process_options"
		},
    }

    return (
        // <ChatBot settings={{general: {embedded: true}, chatHistory: {storageKey: "example_simulation_stream"}, botBubble: {simulateStream: true}}} flow={flow}/>
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
                    // audio: { disabled: false },
                    audio: {disabled: false, defaultToggledOn: true, tapToPlay: true},
                    voice: { language: "en-US", defaultToggledOn: false, disabled: false },
                    chatWindow: { showScrollbar: true, defaultOpen: true },
                    chatInput: { allowNewline: true, botDelay: 500, buttons: [Button.FILE_ATTACHMENT_BUTTON, Button.EMOJI_PICKER_BUTTON, Button.VOICE_MESSAGE_BUTTON, Button.SEND_MESSAGE_BUTTON] },
                    fileAttachment: { disabled: false, accept: '*', sendFileName: true, showMediaDisplay: true },
                    header: {
                        title: <div style={{ cursor: 'pointer', margin: '0px', paddingTop: '5px',  fontSize: '16px', fontWeight: 'light' }}>Gifty</div>,
                        avatar: 'src/assets/logo_light.png',
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
                // botBubbleStyle: {
                //     backgroundColor: 'rgb(14 142 81)'
                // },
                // userBubbleStyle: {
                //     color: 'black',
                //     backgroundColor: 'rgb(167 235 199)'
                // },
                sendButtonStyle: {
                    backgroundColor: 'rgb(14 142 81)'
                },
                sendButtonHoveredStyle: {
                    backgroundColor: 'rgb(167 235 199)'
                },
                // chatInputAreaFocusedStyle: {
                //     boxShadow: 'rgb(167 235 199) 0px 0px 5px'
                // },
                // tooltipStyle: {
                //     backgroundColor: 'rgb(14 142 81)'
                // },
                headerStyle: {
                    backgroundImage: 'linear-gradient(to right, rgb(14 142 81), rgb(110 197 151))',
                    padding: '8px'
                },
                chatInputContainerStyle:{
                    padding: '0px 16px'
                },
                chatInputAreaStyle:{
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