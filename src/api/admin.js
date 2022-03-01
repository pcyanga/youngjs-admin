import axios from "axios";
import request from "./server";
export class Server {
  host = "http://localhost:3005/";
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
  delete(params) {
    return request({
      url: `admin/user/delete`,
      method: "post",
      data: params,
    });
  }
  add(params) {
    return request({
      url: `admin/user/add`,
      method: "post",
      data: params,
    });
  }
  page(params) {
    return request({
      url: `admin/user/page`,
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
  getRoles(params) {
    return request({
      url: `admin/role/list`,
      method: "post",
      data: params,
    });
  }
  makeGoogleUrl() {
    return request({
      url: `admin/user/makeGoogleUrl`,
      method: "get",
    });
  }
}
