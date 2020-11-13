import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import ClassroomService from "../service/classroom";

import styles from "../assets/styles/formStyles";
const useStyles = makeStyles(styles);

export default function ClassroomDeleteConfirmation(props) {
  const {
    uid,
    open,
    setOpenClassroomDeleteConfirmation,
    deleteClassroom,
  } = props;

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(null);
  const classes = useStyles();

  function handleClose() {
    setOpenClassroomDeleteConfirmation(false);
  }

  function deleteButtonHandler(event) {
    event.preventDefault();
    setIsDeleting(true);
    setDeleteErrorMessage(null);
    ClassroomService.delete(uid).then(
      () => {
        setIsDeleting(false);
        deleteClassroom(uid);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setDeleteErrorMessage(resMessage);
      }
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <div className={classes.paperModal}>
          {isDeleting && <CircularProgress />}
          <DialogTitle id="form-dialog-title">
            {`Edit User Permission`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action is permanent. Are you sure you want to remove this
              classroom?
            </DialogContentText>
            {deleteErrorMessage && (
              <Alert severity="error">{deleteErrorMessage}</Alert>
            )}
            <DialogActions>
              <Button
                variant="outlined"
                onClick={handleClose}
                color="primary"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                onClick={deleteButtonHandler}
                color="primary"
                disabled={isDeleting}
              >
                Delete
              </Button>
            </DialogActions>
          </DialogContent>
        </div>
      </Container>
    </Dialog>
  );
}
