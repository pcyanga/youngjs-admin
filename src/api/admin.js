import axios from "axios";
import request from "./server";
export class Server {
  host = "/api/";
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
  count() {
    return request({
      url: `admin/user/count`,
      method: "get",
    });
  }
}
