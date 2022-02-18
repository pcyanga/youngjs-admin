import axios from "axios";
import request from "./server";

export class Server {
  page(params) {
    return request({
      url: `admin/notice/page`,
      method: "post",
      data: params,
    });
  }
  update(params) {
    return request({
      url: `admin/notice/update`,
      method: "post",
      data: params,
    });
  }
  add(params) {
    return request({
      url: `admin/notice/add`,
      method: "post",
      data: params,
    });
  }
  delete(params) {
    return request({
      url: `admin/notice/delete`,
      method: "post",
      data: params,
    });
  }
}
