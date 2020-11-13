import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import UserPermissionsForm from "./UserPermissionsForm";
import ClassroomDeleteConfirmation from "./ClassroomDeleteConfirmation";

export default function ClassroomCard(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const handleAnchorClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAnchorClose = () => {
    setAnchorEl(null);
  };

  const getCardHeader = () => {
    const { name, uid, deleteClassroom } = props;
    return (
      <React.Fragment>
        <CardHeader
          title={
            <Typography variant="subtitle1" component="h2">
              {name}
            </Typography>
          }
          subheader={"Room Id: " + uid}
          action={
            <IconButton onClick={handleAnchorClick} aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
        />
        <MoreOptionsAnchor
          uid={uid}
          anchorEl={anchorEl}
          deleteClassroom={deleteClassroom}
          handleAnchorClose={handleAnchorClose}
        />
      </React.Fragment>
    );
  };

  const getCardContent = () => {
    const { description } = props;
    return (
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
    );
  };

  const joinNowHandler = () => {
    const { uid } = props;
    history.push("/classroom/" + uid);
  };

  return (
    <Card>
      {getCardHeader()}
      {getCardContent()}
      <CardActions>
        <Button size="small" onClick={joinNowHandler}>
          Join Now
        </Button>
      </CardActions>
    </Card>
  );
}

function MoreOptionsAnchor(props) {
  const { uid, anchorEl, handleAnchorClose, deleteClassroom } = props;
  const [openUserPermissionsForm, setOpenUserPermissionsForm] = useState(false);
  const [
    openClassroomDeleteConfirmation,
    setOpenClassroomDeleteConfirmation,
  ] = useState(false);

  function handleUserPermissions() {
    setOpenUserPermissionsForm(true);
  }

  function handleClassroomDelete() {
    setOpenClassroomDeleteConfirmation(true);
  }

  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleAnchorClose}
    >
      <MenuItem onClick={handleUserPermissions}>Edit user permissions</MenuItem>
      <UserPermissionsForm
        uid={uid}
        open={openUserPermissionsForm}
        setOpenUserPermissionsForm={setOpenUserPermissionsForm}
      />
      <MenuItem onClick={handleClassroomDelete}>Delete classroom</MenuItem>
      <ClassroomDeleteConfirmation
        uid={uid}
        open={openClassroomDeleteConfirmation}
        setOpenClassroomDeleteConfirmation={setOpenClassroomDeleteConfirmation}
        deleteClassroom={deleteClassroom}
      />
    </Menu>
  );
}
