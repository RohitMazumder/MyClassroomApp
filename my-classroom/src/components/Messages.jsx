import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "./Message";

import styles from "../assets/styles/messageStyles";
const useStyles = makeStyles(styles);

export default function Messages(props) {
  const classes = useStyles();
  const { messages } = props;
  return (
    <ScrollToBottom className={classes.messages}>
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} />
        </div>
      ))}
    </ScrollToBottom>
  );
}
