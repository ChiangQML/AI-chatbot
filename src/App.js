import './App.css';
import ChatbotIcon from "./components/ChatbotIcon";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ChatForm from "./components/ChatForm";
import {useEffect, useRef, useState} from "react";
import ChatMessage from "./components/ChatMessage";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import CloseIcon from '@mui/icons-material/Close';
import {definedInfo} from "./definedInfo";

const { GoogleGenerativeAI } = require("@google/generative-ai");



function App() {

    const [chatHistory, setChatHistory] = useState([
        // {
        // hideInChat:true,
        // role:"mode",
        // text:definedInfo
        // }
    ]);
    const chatBodyRef = useRef();

    const [showChatbot, setShowChatbox] = useState(true);

    const generateBotResponse = async (history) => {
        const updateHistory = (text, isError = false) => {
            setChatHistory(prevState => [
                ...prevState.filter(mes => mes.text !== "Thinking..."),
                { role: "mode", text, isError: isError }
            ]);
        };

        try {
            if (!history || history.length === 0) {
                console.error("❌ Error: Chat history is empty.");
                return;
            }

            const formattedHistory = history.map(({ role, text }) => ({
                role: role === "mode" ? "model" : "user",
                parts: [{ text }]
            }));

            const latestMessage = formattedHistory[formattedHistory.length - 1];

            if (!latestMessage) {
                console.error("❌ Error: No valid latest message found.");
                return;
            }

            console.log("Sending Full Chat History to API:", JSON.stringify(formattedHistory, null, 2));

            const genAI = new GoogleGenerativeAI(YOUR_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent({ contents: formattedHistory });

            const responseText = result.response.candidates[0].content.parts[0].text;

            const jsonResponse = {
                botMessage: responseText,
                timestamp: new Date().toISOString(),
            };

            console.log("Bot Response (JSON):", JSON.stringify(jsonResponse, null, 2));

            updateHistory(responseText);

            return jsonResponse;
        } catch (error) {
            console.error("Error generating response:", error);
            updateHistory(error.message, true);
        }
    };


    useEffect(()=>{
        chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
    },[chatHistory])

    return (

        <div className="App">
            <div className={`container ${showChatbot ? "show-chatbox" : ""}`}>
                <button id="chatbot-toggle" onClick={() => setShowChatbox(prevState => !prevState)}>
                    {showChatbot ? <CloseIcon/> : <ModeCommentIcon/>}
                </button>

                <div className="chatbot-popup">
                    {/*Chatbot header*/}
                    <div className="chat-header">

                    <div className="header-info">
                            <ChatbotIcon></ChatbotIcon>
                            <h2 className="logo-text">Chatbot</h2>
                        </div>
                        <button onClick={() => setShowChatbox(prevState => !prevState)}><ArrowDropDownIcon/></button>
                    </div>

                    {/*Chatbot body*/}
                    <div ref={chatBodyRef} className="chat-body">
                        <div className="message bot-message">
                            <ChatbotIcon/>
                            <p className="message-text">
                                Hey there 👋 <br/>How can I help you today
                            </p>
                        </div>


                        {/* render the chat history dynamically*/}
                        {chatHistory.map((chat,index) =>(
                            <ChatMessage key={index} chat={chat}/>
                        ))}


                    </div>

                    {/*Chatbot Footer*/}
                    <div className="chat-footer">
                        <ChatForm chatHistory={chatHistory} setChatHistory = {setChatHistory} generateBotResponse={generateBotResponse}/>
                    </div>

                </div>



            </div>
        </div>
    );
}

export default App;
