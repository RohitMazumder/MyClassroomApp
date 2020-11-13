import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { useForm } from "react-hook-form";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import Messages from "./Messages";

import styles from "../assets/styles/chatDrawerStyles";
const useStyles = makeStyles(styles);

export default function ChatDrawer(props) {
  const { chatMobileOpen, toggleChatDrawer } = props;
  const { register, handleSubmit } = useForm();
  const classes = useStyles();

  function createMobileDrawer() {
    return (
      <Drawer
        variant="temporary"
        anchor="right"
        open={chatMobileOpen}
        onClose={toggleChatDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {createDrawerContent()}
      </Drawer>
    );
  }

  function createLargeScreenDrawer() {
    return (
      <Drawer
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="permanent"
        open
        anchor="right"
      >
        {createDrawerContent()}
      </Drawer>
    );
  }

  function createDrawerHeader() {
    return (
      <React.Fragment>
        <Typography variant="button" display="block" gutterBottom>
          Group Messages
        </Typography>
        <Divider />
      </React.Fragment>
    );
  }

  function sendMessageHandler(data) {
    props.sendMessage(data.message);
  }

  function writeMessageForm() {
    return (
      <form onSubmit={handleSubmit(sendMessageHandler)}>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <TextField
              name="message"
              variant="outlined"
              required
              fullWidth
              id="message"
              label="Type a message"
              autoFocus
              inputRef={register({
                required: true,
              })}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton edge="end" type="submit" aria-label="send-message">
              <SendIcon />
            </IconButton>
          </Grid>
        </Grid>
      </form>
    );
  }

  function createDrawerContent() {
    return (
      <div className={classes.content}>
        {createDrawerHeader()}
        <Messages messages={props.messages} />
        {writeMessageForm()}
      </div>
    );
  }

  return (
    <div className={classes.drawer} aria-label="chat drawer">
      <Hidden smUp implementation="css">
        {createMobileDrawer()}
      </Hidden>
      <Hidden xsDown implementation="css">
        {createLargeScreenDrawer()}
      </Hidden>
    </div>
  );
}
