import axios from "axios";
import request from "./server";

export class Server {
  page(params) {
    return request({
      url: `admin/param/page`,
      method: "post",
      data: params,
    });
  }
  update(params) {
    return request({
      url: `admin/param/update`,
      method: "post",
      data: params,
    });
  }
  add(params) {
    return request({
      url: `admin/param/add`,
      method: "post",
      data: params,
    });
  }
  delete(params) {
    return request({
      url: `admin/param/delete`,
      method: "post",
      data: params,
    });
  }
}
