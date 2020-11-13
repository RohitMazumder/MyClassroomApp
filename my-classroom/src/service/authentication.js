import axios from "axios";
import {
  LOGIN_API_ENDPOINT,
  REGISTER_API_ENDPOINT,
} from "../resources/apiEndpoints";
import { addCurrentUser, getCurrentUser, removeCurrentUser } from "./utils";

class AuthenticationService {
  login({ username, password }) {
    return axios
      .post(LOGIN_API_ENDPOINT, {
        username,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          addCurrentUser(JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    removeCurrentUser();
  }

  register({ firstName, lastName, username, email, password }) {
    return axios.post(REGISTER_API_ENDPOINT, {
      firstName,
      lastName,
      username,
      email,
      password,
    });
  }

  isUserLoggedIn() {
    //console.log(getCurrentUser() === null)
    return !(getCurrentUser() === null);
  }
}

export default new AuthenticationService();
