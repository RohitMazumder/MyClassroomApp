import React from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useForm } from "react-hook-form";

export default function JoinClassroomForm(props) {
  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const { open, setOpenJoinClassroomForm } = props;
  const handleClose = () => setOpenJoinClassroomForm(false);

  const joinClassroomHandler = (data) => {
    const { classroomId } = data;
    history.push("/classroom/" + classroomId);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Join Classroom</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(joinClassroomHandler)}>
          <TextField
            name="classroomId"
            variant="outlined"
            required
            fullWidth
            id="classroomId"
            label="Classroom Id"
            autoFocus
            inputRef={register({ required: true })}
          />
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button type="submit" variant="outlined" color="primary">
              Join
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
