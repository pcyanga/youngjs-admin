import request from "./server";
export class Server {
  update(params) {
    return request({
      url: `admin/task/update`,
      method: "post",
      data: params,
    });
  }
  add(params) {
    return request({
      url: `admin/task/add`,
      method: "post",
      data: params,
    });
  }
  delete(params) {
    return request({
      url: `admin/task/delete`,
      method: "post",
      data: params,
    });
  }
  page(params) {
    return request({
      url: `admin/task/page`,
      method: "post",
      data: params,
    });
  }
}
