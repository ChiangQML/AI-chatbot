import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {useRef} from "react";

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) =>{
    const inputRef = useRef();

    const handleFormSubmit = (e) =>{
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
        inputRef.current.value = "";

        // update chat history with the user's message
        setChatHistory(history => [...history, {role:"user", text:userMessage}]);

        // bot's response
        setTimeout(() =>
        {
            // add a "thinking..." placeholder for the bot's response
            setChatHistory((history)=>[...history, {role:"mode", text:"Thinking..."}])

            // call the function to generate the bot's response
            // generateBotResponse([...chatHistory,{role:"user", text:`Using the details provided above, please address this query: ${userMessage}`}]);
            generateBotResponse([...chatHistory,{role:"user", text:userMessage}]);
        },600);

    }


    return (
        <form action="" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder="Message..." className="message-input" required/>
            <button className="material-symbols-rounded"><ArrowUpwardIcon/></button>
        </form>
    )
}
export default ChatForm;