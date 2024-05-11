"use client";

import { useChat } from "ai/react";
import styles from "./chatInterface.module.css";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "../chatMessage/ChatMessage";

type PropType = {
  sentenceQuery?: string;
  translatedSentence?: string;
};

const ChatInterface = ({ sentenceQuery, translatedSentence }: PropType) => {
  const [sentenceContext, setSentenceContext] = useState<PropType>({
    sentenceQuery,
    translatedSentence,
  });

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onError: (e) => console.log(e),
    body: sentenceContext,
  });

  const messageContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageContainer?.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  });

  useEffect(() => {
    setSentenceContext({ sentenceQuery, translatedSentence });
  }, [sentenceQuery, translatedSentence]);

  return (
    <div className={styles.container}>
      <div className={styles.textDiv}>
        <h3>Need help?</h3>
        <p>
          Ask our chatbot about the sentence you translated or anything else
          about Korean
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={input}
          placeholder='Ask something...'
          onChange={handleInputChange}
        />
      </form>
      <div className={styles.messageContainer} ref={messageContainer}>
        <ul className={styles.messageList}>
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatInterface;
