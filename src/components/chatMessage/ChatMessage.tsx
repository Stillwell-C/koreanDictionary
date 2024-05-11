import { Message as ChatMessageType } from "ai";
import styles from "./chatMessage.module.css";
import LinkParser from "../linkParser/LinkParser";

type Props = {
  message: ChatMessageType;
};

const ChatMessage = ({ message }: Props) => {
  return (
    <li
      key={message.id}
      className={`${styles.messages} ${
        message.role === "user" ? styles.messageRight : styles.messageLeft
      }`}
    >
      {message.role === "user" ? (
        message.content
      ) : (
        <LinkParser>{message.content}</LinkParser>
      )}
    </li>
  );
};

export default ChatMessage;
