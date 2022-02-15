import axios from "axios";
import request from "./server";

export class Server {
  page(params) {
    return request({
      url: `admin/rate/page`,
      method: "post",
      data: params,
    });
  }
  add(params) {
    return request({
      url: `admin/rate/add`,
      method: "post",
      data: params,
    });
  }
  update(params) {
    return request({
      url: `admin/rate/update`,
      method: "post",
      data: params,
    });
  }
  delete(params) {
    return request({
      url: `admin/rate/delete`,
      method: "post",
      data: params,
    });
  }
}
