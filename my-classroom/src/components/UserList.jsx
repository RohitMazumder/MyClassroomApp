import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PeopleIcon from "@material-ui/icons/People";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import styles from "../assets/styles/userListStyles";

const useStyles = makeStyles(styles);

export default function UserList(props) {
  const classes = useStyles();
  const userList = props.userList.map((user) => {
    return (
      <ListItem key={user.id}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary={user.username} />
      </ListItem>
    );
  });

  return (
    <div className={classes.root}>
      <CssBaseline />
      <List style={{ maxHeight: "100%", overflow: "auto" }}>
        <ListItem>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Active Users (` + props.userList.length + `)`}
          />
        </ListItem>
        {userList}
      </List>
    </div>
  );
}
