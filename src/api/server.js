import axios from "axios";
import { ElMessage } from "element-plus";
const request = (params) => {
  const host = "/api/";
  params.url = `${host}${params.url}`;
  params.headers = params.headers || {};
  params.headers.authorization = localStorage.getItem("token");
  return axios(params)
    .then((res) => res.data)
    .catch((err) => {
      const { response, message } = err;
      if (response.status == 403) {
        ElMessage.error("登录失效,请重新登录");
      } else if (response.status == 401) {
        ElMessage.error("没有访问权限,请联系管理员");
      } else {
        ElMessage.error(message);
      }
      return err;
    });
};
export default request;
