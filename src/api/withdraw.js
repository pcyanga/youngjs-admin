import axios from "axios";
import request from "./server";

export class Server {
  page(params) {
    return request({
      url: `admin/withdraw/page`,
      method: "post",
      data: params,
    });
  }
  update(params) {
    return request({
      url: `admin/withdraw/update`,
      method: "post",
      data: params,
    });
  }
}
