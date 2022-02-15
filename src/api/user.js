import axios from "axios";
import request from "./server";

export class Server {
  host = "http://localhost:3001/";
  page(params) {
    return request({
      url: `${this.host}admin/member/page`,
      method: "post",
      data: params,
    });
  }
  update(params) {
    return request({
      url: `${this.host}admin/member/update`,
      method: "post",
      data: params,
    });
  }
  delete(params) {
    return request({
      url: `${this.host}admin/member/delete`,
      method: "post",
      data: params,
    });
  }
}
