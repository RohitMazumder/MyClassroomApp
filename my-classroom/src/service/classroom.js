import axios from "axios";
import {
  CREATE_CLASSROOM_ENDPOINT,
  EDIT_USER_PERMISSIONS_ENDPOINT,
  DELETE_CLASSROOM_ENDPOINT,
  IS_USER_PERMITTED_ENDPOINT,
} from "../resources/apiEndpoints";
import { createAuthorizationHeader } from "./utils";

class ClassroomService {
  create(name, description) {
    let axiosConfig = createAuthorizationHeader();
    return axios.post(
      CREATE_CLASSROOM_ENDPOINT,
      { name, description },
      axiosConfig
    );
  }

  delete(uid) {
    let axiosConfig = createAuthorizationHeader();
    return axios.delete(DELETE_CLASSROOM_ENDPOINT + "/" + uid, axiosConfig);
  }

  updateUserPermissions(classroomUid, { allowAll, permittedUsers }) {
    let axiosConfig = createAuthorizationHeader();
    return axios.put(
      EDIT_USER_PERMISSIONS_ENDPOINT,
      { classroomUid, allowAll, permittedUsernames: permittedUsers },
      axiosConfig
    );
  }

  checkPermission(classroomUid) {
    let axiosConfig = createAuthorizationHeader();
    return axios.get(
      IS_USER_PERMITTED_ENDPOINT + "/" + classroomUid,
      axiosConfig
    );
  }
}

export default new ClassroomService();
