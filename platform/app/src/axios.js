import { message } from "antd";
import axios, { AxiosHeaders } from "axios";

// export const BASE_API = "http://localhost:4000";
export const BASE_API = "http://192.152.80.24:4000";
// export const BASE_API = "https://his-beta-api.yashodahospital.com";
// export const BASE_API = "https://ircapi.lexyslabs.com";
// export const BASE_API = "https://irc-api.starof.com";
export const BASE_URL = BASE_API + `/api/V1`;

const headers = {};
if (localStorage.getItem("access_token")) {
  headers.Authorization = "Bearer " + localStorage.getItem("access_token");
}
// @ts-ignore
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers,
});

axiosInstance.interceptors.request.use(function (config) {
  const token = "Bearer " + localStorage.getItem("access_token");
  config.headers.Authorization = token;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return new Promise((resolve, reject) => {
      resolve(response);
    });
  },
  (error) => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    if (error.response.status === 401 || error.response.status === 403) {
      console.log("Invalid Access Token");
      message.error("Session expired! Redirecting to login..");
      setTimeout(() => {
        localStorage.setItem("path_before_login", window.location.pathname);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_details");
        window.location = `/login`;
      }, 2000);
    } else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }
);

export default axiosInstance;
