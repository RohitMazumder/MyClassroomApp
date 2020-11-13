import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CirclePicker } from "react-color";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";

import styles from "../assets/styles/toolsPanelStyles";
const useStyles = makeStyles(styles);

export default function ToolsPanel(props) {
  const history = useHistory();
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [openLeaveRoomConfirmation, setOpenLeaveRoomConfirmation] = useState(
    false
  );

  const classes = useStyles();

  const setLineWidthHandler = (width) => () => {
    props.setLineWidth(width);
  };

  const colorPickerHandler = () => {
    setOpenColorPicker((openColorPicker) => !openColorPicker);
  };

  const leaveRoomConfirmationHandler = () => {
    setOpenLeaveRoomConfirmation(
      (openLeaveRoomConfirmation) => !openLeaveRoomConfirmation
    );
  };

  const leaveRoomHandler = () => {
    props.leave();
    history.push("/home");
  };

  function createColorPickerDialog() {
    return (
      <Dialog
        onClose={colorPickerHandler}
        aria-labelledby="simple-dialog-title"
        open={openColorPicker}
        BackdropProps={{
          classes: {
            root: classes.root,
          },
        }}
        PaperProps={{
          classes: {
            root: classes.paper,
          },
        }}
      >
        <CirclePicker onChange={props.selectColor} color={props.currentColor} />
      </Dialog>
    );
  }

  function createLeaveRoomConfirmationDialog() {
    return (
      <Dialog
        open={openLeaveRoomConfirmation}
        onClose={leaveRoomConfirmationHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Leave Classroom ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to leave the classroom?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={leaveRoomConfirmationHandler}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={leaveRoomHandler}
            variant="outlined"
            color="primary"
            autoFocus
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  function createAppBar() {
    return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.grow} />
          <IconButton
            edge="end"
            onClick={props.toggleChatDrawer}
            className={classes.chatButton}
            aria-label="line-width-change-large"
          >
            <ChatBubbleIcon fontSize="large" />
          </IconButton>
          <IconButton
            edge="end"
            onClick={setLineWidthHandler(6)}
            aria-label="line-width-change-large"
          >
            <FiberManualRecordIcon fontSize="large" />
          </IconButton>
          <IconButton
            edge="end"
            onClick={setLineWidthHandler(4)}
            aria-label="line-width-change-med"
          >
            <FiberManualRecordIcon />
          </IconButton>
          <IconButton
            edge="end"
            onClick={setLineWidthHandler(2)}
            aria-label="line-width-change-small"
          >
            <FiberManualRecordIcon fontSize="small" />
          </IconButton>
          <IconButton
            edge="end"
            onClick={colorPickerHandler}
            aria-label="color-change"
          >
            <ColorLensIcon style={{ fontSize: 40 }} />
          </IconButton>
          <IconButton onClick={props.clearBoard} edge="end" aria-label="delete">
            <DeleteIcon style={{ fontSize: 40 }} />
          </IconButton>
          <IconButton
            edge="end"
            onClick={leaveRoomConfirmationHandler}
            aria-label="leave-classroom"
          >
            <CloseIcon style={{ fontSize: 40 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      {createColorPickerDialog()}
      {createLeaveRoomConfirmationDialog()}
      {createAppBar()}
    </React.Fragment>
  );
}
