import axios from "axios";
import request from "./server";

export class Server {
  page(params) {
    return request({
      url: `admin/member/page`,
      method: "post",
      data: params,
    });
  }
  update(params) {
    return request({
      url: `admin/member/update`,
      method: "post",
      data: params,
    });
  }
  delete(params) {
    return request({
      url: `admin/member/delete`,
      method: "post",
      data: params,
    });
  }
  team(params) {
    return request({
      url: `admin/member/team`,
      method: "get",
      params,
    });
  }
}
