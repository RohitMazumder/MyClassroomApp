import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { getCurrentUsername } from "../service/utils";

import styles from "../assets/styles/messageStyles";
const useStyles = makeStyles(styles);

export default function Message(props) {
  const classes = useStyles();
  const { username, message } = props.message;

  return username === getCurrentUsername() ? (
    <div className={classes.myMessageContainer}>
      <p className={classes.sentText}>{username}</p>
      <div className={classes.messageBox}>
        <p className={classes.messageText}>{message}</p>
      </div>
    </div>
  ) : (
    <div className={classes.othersMessageContainer}>
      <div className={classes.messageBox}>
        <p className={classes.messageText}>{message}</p>
      </div>
      <p className={classes.receivedText}>{username}</p>
    </div>
  );
}
