import React, { useState } from "react";
import ChatbotV2 from "../../components/Chatbot/ChatBotV2";
import DynamicTable from "../../components/dynamic/Table";
import GiftFormDetails from "./components/GiftFormDetails";

export const Gifty: React.FC = () => {
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [data, setData] = useState<any>(null);

    const onHtmlLoad = (htmlStr: string) => {
        setHtmlContent(htmlStr); // store the HTML string from LLM
    }

    const onDataLoad = (data: string) => {
        setData(data);
    }

    return (
        <div>

            {data && Array.isArray(data) && <div style={{ padding: '10px' }}>
                <DynamicTable data={data} />
            </div>}

            {data && !Array.isArray(data) && <div style={{ padding: '10px' }}>
                <GiftFormDetails data={data} />
            </div>}

            <ChatbotV2 onHtmlLoad={onHtmlLoad} onDataLoad={onDataLoad} />

            {/* Render the HTML string safely */}
            {htmlContent && (
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            )}
        </div>
    );
}
