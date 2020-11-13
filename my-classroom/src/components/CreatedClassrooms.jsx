import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import CssBaseline from "@material-ui/core/CssBaseline";

import ClassroomCard from "./ClassroomCard";
import useApiFetch from "../service/apiFetch";
import { GET_CREATED_CLASSROOMS_ENDPOINT } from "../resources/apiEndpoints";

import styles from "../assets/styles/dashboardStyles";
const useStyles = makeStyles(styles);

export default function CreatedClassrooms() {
  const classes = useStyles();
  const [
    { data: createdClassrooms, isLoading, errorMessage },
    setCreatedClassrooms,
  ] = useApiFetch(GET_CREATED_CLASSROOMS_ENDPOINT, []);

  function deleteClassroom(uid) {
    const filteredClassrooms = createdClassrooms.filter(
      (classroom) => classroom.uid !== uid
    );
    setCreatedClassrooms(filteredClassrooms);
  }

  function createNotification() {
    if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;
    else if (!isLoading && createdClassrooms.length === 0)
      return (
        <Alert severity="info">{`Start creating your own classrooms or join a classroom !`}</Alert>
      );
  }

  return (
    <main className={classes.content}>
      <CssBaseline />
      {createNotification()}
      {isLoading ? (
        <div className={classes.centre}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3} className={classes.grid}>
          {createdClassrooms.map((item) => (
            <Grid item key={item.uid} sm={4}>
              <ClassroomCard
                uid={item.uid}
                name={item.name}
                description={item.description}
                deleteClassroom={deleteClassroom}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </main>
  );
}
