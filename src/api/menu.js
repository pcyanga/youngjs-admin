import request from "./server";
export class Server {
  update(params) {
    return request({
      url: `admin/menu/update`,
      method: "post",
      data: params,
    });
  }
  add(params) {
    return request({
      url: `admin/menu/add`,
      method: "post",
      data: params,
    });
  }
  delete(params) {
    return request({
      url: `admin/menu/delete`,
      method: "post",
      data: params,
    });
  }
  getAllMenu(params) {
    return request({
      url: `admin/menu/list`,
      method: "post",
      params,
    });
  }
}
