import ChatBot, { Params } from "react-chatbotify";
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

2. 📝 **Update an Existing Request**  
   Edit the occasion, message, or recipient details of a tree gift you've already created.

3. 📋 **View Your Past Requests**  
   See all your previous tree gifting requests and their details.

4. 🎁 **Send Tree Cards or Dashboards**  
   Email tree cards or tree dashboards to recipients from your past requests.

5. 💬 **Get Support**  
   Connect with a team member for help or additional questions.
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

    const flow = {
        start: {
            message: marked(defaultMessage),
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
            path: "user",
            renderHtml: ["BOT", "USER"],
        } as HtmlRendererBlock,
    }

    return (
        <ChatBot
            plugins={plugins}
            flow={flow}
            settings={{
                chatButton: {
                    icon: Chat
                },
                header: {
                    title: <div style={{ cursor: 'pointer', margin: '0px', fontSize: '20px', fontWeight: 'bold' }}>14 Trees</div>
                },
                footer: {
                    text: ''
                },
                fileAttachment: {
                    multiple: true,
                    accept: 'image/*',
                    sendFileName: true,
                    showMediaDisplay: true,
                }
            }}
            styles={{
                chatButtonStyle: {
                    backgroundColor: '#28a745',
                    backgroundImage: 'none',
                },
                botBubbleStyle: {
                    backgroundColor: 'rgb(14 142 81)'
                },
                userBubbleStyle: {
                    color: 'black',
                    backgroundColor: 'rgb(167 235 199)'
                },
                sendButtonStyle: {
                    backgroundColor: 'rgb(14 142 81)'
                },
                sendButtonHoveredStyle: {
                    backgroundColor: 'rgb(167 235 199)'
                },
                chatInputAreaFocusedStyle: {
                    boxShadow: 'rgb(167 235 199) 0px 0px 5px'
                },
                tooltipStyle: {
                    backgroundColor: 'rgb(14 142 81)'
                },
                headerStyle: {
                    backgroundImage: 'linear-gradient(to right, rgb(14 142 81), rgb(110 197 151))',
                }
            }}
        />
    );
}

export default ChatbotV2;