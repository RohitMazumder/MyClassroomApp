import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import AuthenticationService from "../service/authentication";
import { Link as RouterLink } from "react-router-dom";

import styles from "../assets/styles/formStyles";
const useStyles = makeStyles(styles);

export default function Register() {
  const classes = useStyles();
  const { register, handleSubmit, errors, watch } = useForm();
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  function signUpHandler(data) {
    setShowLoadingSpinner(true);
    setErrorMessage(null);

    AuthenticationService.register(data).then(
      () => {
        setShowLoadingSpinner(false);
        setRegisterSuccess(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setShowLoadingSpinner(false);
        setErrorMessage(resMessage);
      }
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {registerSuccess ? (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            {`Registration Successful — Click here to proceed to `}
            <Link component={RouterLink} to="/login" variant="body2">
              login
            </Link>
          </Alert>
        ) : (
          <React.Fragment>
            <Typography component="h1" variant="h5">
              Register
            </Typography>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <form
              className={classes.form}
              onSubmit={handleSubmit(signUpHandler)}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    inputRef={register({
                      required: true,
                      minLength: 2,
                      maxLength: 15,
                    })}
                  />
                  {errors.firstName && (
                    <div className={classes.validationError}>
                      First Name must be at least 2 characters long and at most
                      15 characters long.
                    </div>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    inputRef={register({
                      required: true,
                      minLength: 2,
                      maxLength: 15,
                    })}
                  />
                  {errors.lastName && (
                    <div className={classes.validationError}>
                      Last Name must be at least 2 characters long and at most
                      15 characters long.
                    </div>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    inputRef={register({ required: true, maxLength: 20 })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    inputRef={register({
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address.",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className={classes.validationError}>
                      {errors.email.message}
                    </div>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    inputRef={register({
                      required: true,
                      minLength: 6,
                      maxLength: 40,
                    })}
                  />
                  {errors.password && (
                    <div className={classes.validationError}>
                      Password needs to at least 6 characters long and at most
                      40 characters long.
                    </div>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="retypePassword"
                    label="Retype Password"
                    type="password"
                    id="retypePassword"
                    inputRef={register({
                      required: true,
                      validate: (value) => {
                        return value === watch("password");
                      },
                    })}
                  />
                  {errors.retypePassword && (
                    <div className={classes.validationError}>
                      Password and Retype-Password must match.
                    </div>
                  )}
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Register
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Login.
                  </Link>
                </Grid>
              </Grid>
            </form>

            {showLoadingSpinner && <CircularProgress />}
          </React.Fragment>
        )}
      </div>
    </Container>
  );
}
