import axios from "axios";
import { ElMessage } from "element-plus";
const request = (params) => {
  const host = "/api/";
  params.url = `${host}${params.url}`;
  params.headers = {};
  params.headers.authorization = localStorage.getItem("token");
  return axios(params)
    .then((res) => res.data)
    .catch((err) => {
      const { statusCode, message } = err;
      if (message.indexOf("403") >= 0) {
        ElMessage.error("登录失效,请重新登录");
      } else {
        ElMessage.error(message);
      }
      return err;
    });
};
export default request;
