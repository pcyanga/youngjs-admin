import axios from "axios";
import request from "./server";

export class Server {
  page(params) {
    return request({
      url: `admin/account/page`,
      method: "post",
      data: params,
    });
  }
  update(params) {
    return request({
      url: `admin/account/update`,
      method: "post",
      data: params,
    });
  }
  add(params) {
    return request({
      url: `admin/account/add`,
      method: "post",
      data: params,
    });
  }
  delete(params) {
    return request({
      url: `admin/account/delete`,
      method: "post",
      data: params,
    });
  }
}
