import axios from "axios";
import request from "./server";
export class Server {
  host = "http://localhost:3001/";
  login(params) {
    return request({
      url: `admin/user/login`,
      method: "post",
      data: params,
    });
  }
  info(token) {
    return axios({
      url: `${this.host}admin/user/info`,
      method: "get",
      headers: {
        authorization: token,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err);
      });
  }
  update(params) {
    return request({
      url: `admin/user/update`,
      method: "post",
      data: params,
    });
  }
}
