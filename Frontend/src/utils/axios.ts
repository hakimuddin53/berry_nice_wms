import axios from "axios";
import queryString from "query-string";

export const baseURL = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: Number(process.env.REACT_APP_AXIOS_TIMEOUT),
  paramsSerializer: (params) =>
    queryString.stringify(params, {
      arrayFormat: "index",
      skipNull: true,
      skipEmptyString: false,
    }),
});

axiosInstance.interceptors.request.use(
  (request) => {
    //Edit request config to work with HttpOnly JWT token
    request.withCredentials = true;

    return request;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response || "Something went wrong");
  }
);

export default axiosInstance;
