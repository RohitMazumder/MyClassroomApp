import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useForm } from "react-hook-form";
import Grid from "@material-ui/core/Grid";

import ClassroomService from "../service/classroom";

import styles from "../assets/styles/formStyles";
const useStyles = makeStyles(styles);

export default function CreateClassroomForm(props) {
  const { register, handleSubmit, errors } = useForm();
  const classes = useStyles();
  const { open, setOpenCreateClassroomForm } = props;
  const [isCreating, setIsCreating] = useState(false);
  const [createErrorMessage, setCreateErrorMessage] = useState(null);
  const [isCreateSuccessful, setIsCreateSuccessful] = useState(false);

  function handleClose() {
    setOpenCreateClassroomForm(false);
  }

  function createNewClassroomHandler(data) {
    const { name, description } = data;
    setIsCreating(true);
    setCreateErrorMessage(null);
    setIsCreateSuccessful(false);
    ClassroomService.create(name, description).then(
      () => {
        setIsCreateSuccessful(true);
        setIsCreating(false);
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setIsCreating(false);
        setCreateErrorMessage(resMessage);
      }
    );
  }

  function createNotification() {
    if (createErrorMessage) {
      return <Alert severity="error">{createErrorMessage}</Alert>;
    } else if (isCreateSuccessful) {
      return (
        <Alert severity="success">{`Classroom created successfully!`}</Alert>
      );
    }
  }

  function createForm() {
    return (
      <form
        className={classes.form}
        onSubmit={handleSubmit(createNewClassroomHandler)}
      >
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <TextField
              name="name"
              variant="outlined"
              required
              fullWidth
              id="name"
              label="Name"
              autoFocus
              inputRef={register({
                required: true,
                minLength: 2,
                maxLength: 35,
              })}
            />
            {errors.name && (
              <div className={classes.validationError}>
                Class Name needs to at least 2 characters long and at most 35
                characters long
              </div>
            )}
          </Grid>
          <Grid item>
            <TextField
              name="description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              id="description"
              label="Description"
              autoFocus
              inputRef={register({ maxLength: 250 })}
            />
            {errors.description && (
              <div className={classes.validationError}>
                Description should be at max 250 characters long.
              </div>
            )}
          </Grid>
        </Grid>
        <DialogActions>
          <Button onClick={handleClose} disabled={isCreating} color="primary">
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating} color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
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
          {isCreating && <CircularProgress />}

          <DialogTitle id="form-dialog-title">Create New Classroom</DialogTitle>
          {createNotification()}

          <DialogContent>
            {isCreateSuccessful ? (
              <Button onClick={handleClose} variant="outlined" color="primary">
                Close
              </Button>
            ) : (
              createForm()
            )}
          </DialogContent>
        </div>
      </Container>
    </Dialog>
  );
}
