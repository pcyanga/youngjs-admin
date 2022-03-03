import axios from "axios";
import request from "./server";

export class Server {
  page(params) {
    return request({
      url: `admin/agent/page`,
      method: "post",
      data: params,
    });
  }
  update(params) {
    return request({
      url: `admin/agent/update`,
      method: "post",
      data: params,
    });
  }
  add(params) {
    return request({
      url: `admin/agent/add`,
      method: "post",
      data: params,
    });
  }
  delete(params) {
    return request({
      url: `admin/agent/delete`,
      method: "post",
      data: params,
    });
  }
}
