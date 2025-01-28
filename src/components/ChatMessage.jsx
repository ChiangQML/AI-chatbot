import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({chat})=>{
    return (
        // !chat.hideInChat &&
        (<div className={`message ${chat.role === "mode" ? 'bot' : 'user'}-message ${chat.isError ? "error" : ""}`}>

            {chat.role === "mode" && <ChatbotIcon/>}
            <p className="message-text">
                {chat.text}
            </p>
        </div>
        )
    );
}
export default ChatMessage