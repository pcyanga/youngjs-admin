import axios from "axios";
import { ElMessage } from "element-plus";
const host = "/api/";
export class Server {
  async req(path, params = {}, headers = {}) {
    let aciotns = localStorage.getItem("aciotnsList");
    const aciotnsList = JSON.parse(aciotns) || [];
    const find = aciotnsList.filter((a) => {
      return a.indexOf(path) >= 0;
    });
    const method = find.length ? find[0].split(":")[1] : "get";
    headers.authorization = localStorage.getItem("token");
    const data = await axios({
      url: `${host}admin/${path}`,
      method,
      data: method == "post" ? params : undefined,
      params: method == "get" ? params : undefined,
      headers,
    })
      .then((res) => res.data)
      .catch((err) => {
        this.dealError(err);
        return;
      });
    if (!data) return { code: 0 };
    if (data.code != 1000) {
      ElMessage.error(data.message);
    }
    return data;
  }
  login(params) {
    return axios({
      url: `${host}admin/system/user/login`,
      method: "post",
      data: params,
    })
      .then((res) => res.data)
      .catch((err) => {
        this.dealError(err);
        return err;
      });
  }
  dealError(err) {
    const { response, message } = err;
    if (response.status == 403) {
      ElMessage.error("登录失效,请重新登录");
    } else if (response.status == 401) {
      ElMessage.error("没有访问权限,请联系管理员");
    } else {
      ElMessage.error(message);
    }
  }
}
