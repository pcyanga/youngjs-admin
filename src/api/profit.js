import axios from "axios";
import request from "./server";

export class Server {
  page(params) {
    return request({
      url: `admin/profit/page`,
      method: "post",
      data: params,
    });
  }
  update(params) {
    return request({
      url: `admin/profit/update`,
      method: "post",
      data: params,
    });
  }
}
