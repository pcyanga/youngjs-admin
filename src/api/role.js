import request from "./server";
export class Server {
  update(params) {
    return request({
      url: `admin/role/update`,
      method: "post",
      data: params,
    });
  }
  add(params) {
    return request({
      url: `admin/role/add`,
      method: "post",
      data: params,
    });
  }
  delete(params) {
    return request({
      url: `admin/role/delete`,
      method: "post",
      data: params,
    });
  }
  page(params) {
    return request({
      url: `admin/role/page`,
      method: "post",
      data: params,
    });
  }
  getRoleMenu(params) {
    return request({
      url: `admin/role/getRoleMenu`,
      method: "get",
      params,
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
