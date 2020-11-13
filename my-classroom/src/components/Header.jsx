import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AuthenticationService from "../service/authentication";
import { getCurrentUsername } from "../service/utils";

import styles from "../assets/styles/headerStyles";
import CreateClassroomForm from "./CreateClassroomForm";
import JoinClassroomForm from "./JoinClassroomForm";
const useStyles = makeStyles(styles);

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const [openCreateClassroomForm, setOpenCreateClassroomForm] = useState(false);
  const [openJoinClassroomForm, setOpenJoinClassroomForm] = useState(false);

  const logoutHandler = () => {
    AuthenticationService.logout();
    history.push("/login");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Welcome, {getCurrentUsername()}!
          </Typography>

          <Button
            color="inherit"
            onClick={() => setOpenJoinClassroomForm(true)}
          >
            Join Classroom
          </Button>

          <JoinClassroomForm
            open={openJoinClassroomForm}
            setOpenJoinClassroomForm={setOpenJoinClassroomForm}
          />

          <Button
            color="inherit"
            onClick={() => setOpenCreateClassroomForm(true)}
          >
            Create Classroom
          </Button>

          <CreateClassroomForm
            open={openCreateClassroomForm}
            setOpenCreateClassroomForm={setOpenCreateClassroomForm}
          />
          <Button onClick={logoutHandler} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
