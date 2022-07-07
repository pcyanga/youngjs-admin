import request from "./server";

export class Server {
  req(path, params = {}, headers = {}) {
    let aciotns = localStorage.getItem("aciotnsList");
    const aciotnsList = JSON.parse(aciotns);
    const find = aciotnsList.filter((a) => {
      return a.indexOf(path) >= 0;
    });
    const method = find.length ? find[0].split(":")[1] : "get";
    //获取方法
    return request({
      url: `admin/${path}`,
      method,
      data: method == "post" ? params : undefined,
      params: method == "get" ? params : undefined,
      headers,
    });
  }
  login(params) {
    return request({
      url: `admin/system/user/login`,
      method: "post",
      data: params,
    });
  }
}
