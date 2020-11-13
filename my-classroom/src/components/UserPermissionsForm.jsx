import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { useForm } from "react-hook-form";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { GET_USER_PERMISSIONS_ENDPOINT } from "../resources/apiEndpoints";
import useApiFetch from "../service/apiFetch";
import ClassroomService from "../service/classroom";

import styles from "../assets/styles/formStyles";
const useStyles = makeStyles(styles);

export default function UserPermissionsForm(props) {
  const { uid, open, setOpenUserPermissionsForm } = props;
  const classes = useStyles();

  const { register, handleSubmit } = useForm();
  const [isChanged, setIsChanged] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const [updateErrorMessage, setUpdateErrorMessage] = useState(null);

  const [
    {
      data: permissions,
      isLoading: fetchPermissionsLoading,
      errorMessage: fetchPermissionsError,
    },
    setPermissions,
  ] = useApiFetch(GET_USER_PERMISSIONS_ENDPOINT + "/" + uid, {
    allowAll: null,
    permittedUsers: [],
  });

  function handleClose() {
    setOpenUserPermissionsForm(false);
  }

  function handleAllowAll() {
    setAllowAll(!permissions.allowAll);
    setIsChanged(true);
  }

  function isFormDisabled() {
    return (
      fetchPermissionsLoading || fetchPermissionsError !== null || isUpdating
    );
  }

  const updateButtonHandler = (event) => {
    event.preventDefault();
    setIsUpdating(true);
    setIsChanged(false);
    setIsUpdateSuccessful(false);
    setUpdateErrorMessage(null);

    ClassroomService.updateUserPermissions(uid, permissions).then(
      () => {
        setIsUpdating(false);
        setIsUpdateSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setIsUpdating(false);
        setUpdateErrorMessage(resMessage);
      }
    );
  };

  function addNewUser(data) {
    const { username } = data;
    setPermittedUsers([...permissions.permittedUsers, username]);
    setIsChanged(true);
  }

  function deleteUser(userId) {
    const filteredUsers = permissions.permittedUsers.filter(
      (user, id) => id !== userId
    );
    setPermittedUsers(filteredUsers);
    setIsChanged(true);
  }

  function setAllowAll(newValue) {
    setPermissions((prevState) => {
      return {
        ...prevState,
        allowAll: newValue,
      };
    });
  }

  function setPermittedUsers(newPermittedUsers) {
    setPermissions((prevState) => {
      return {
        ...prevState,
        permittedUsers: newPermittedUsers,
      };
    });
  }

  function createNotification() {
    if (fetchPermissionsError) {
      return <Alert severity="error">{fetchPermissionsError}</Alert>;
    } else if (isChanged) {
      return (
        <Alert severity="info">
          {`User permissions have been changed. Click the Update button below to
      save.`}
        </Alert>
      );
    } else if (isUpdateSuccessful) {
      return (
        <Alert severity="success">
          {`User permissions have been updated successfully!`}
        </Alert>
      );
    } else if (updateErrorMessage) {
      return <Alert severity="error">{updateErrorMessage}</Alert>;
    }
  }

  function createUpdateForm() {
    return (
      <form className={classes.form} onSubmit={handleSubmit(addNewUser)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="username"
              variant="outlined"
              required
              fullWidth
              id="username"
              label="Username"
              autoFocus
              disabled={isFormDisabled() || permissions.allowAll === true}
              inputRef={register({ required: true })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={isFormDisabled() || permissions.allowAll === true}
              variant="outlined"
              type="submit"
            >
              Add User
            </Button>
          </Grid>
        </Grid>
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
          {isUpdating && <CircularProgress />}

          <DialogTitle id="form-dialog-title">Edit User Permission</DialogTitle>

          {createNotification()}

          <DialogContent>
            <DialogContentText>
              Add/Edit users you want to allow to join this classroom.
            </DialogContentText>
            {createUpdateForm()}
            {fetchPermissionsLoading ? (
              <CircularProgress />
            ) : (
              <PermittedUsersList
                permittedUsers={permissions.permittedUsers}
                deleteUser={deleteUser}
              />
            )}
            <Checkbox
              checked={permissions.allowAll}
              onChange={handleAllowAll}
              disabled={isFormDisabled()}
            />
            {`Allow everyone to join`}
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button
                disabled={isFormDisabled()}
                onClick={updateButtonHandler}
                color="primary"
              >
                Update
              </Button>
            </DialogActions>
          </DialogContent>
        </div>
      </Container>
    </Dialog>
  );
}

function PermittedUsersList(props) {
  const { permittedUsers, deleteUser } = props;
  const list = permittedUsers.map((permittedUser, id) => {
    return (
      <React.Fragment>
        <ListItem divider key={id} alignItems="flex-start">
          <ListItemText primary={permittedUser} />
          <IconButton onClick={() => deleteUser(id)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItem>
      </React.Fragment>
    );
  });
  return <List>{list}</List>;
}
