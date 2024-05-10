import axiosInstance, { BASE_API } from "../axios";

export const ConvertStringToDate = (dateString, timeString) => {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6) - 1; // Month is zero-based in JavaScript Date objects
  const day = dateString.substring(6, 8);

  // Extract hour, minute, and second from the time string
  const hour = timeString.substring(0, 2);
  const minute = timeString.substring(2, 4);
  const second = timeString.substring(4, 6);

  // Create a Date object
  const combinedDate = new Date(year, month, day, hour, minute, second);
  return combinedDate;
}

export const setUserDetails = (userDetails) => {
  localStorage.setItem("user_details", JSON.stringify(userDetails));
}

export const getUserDetails = () => {
  return JSON.parse(localStorage.getItem("user_details"));
}

export const setAccessToken = (accessToken) => {
  localStorage.setItem("access_token", accessToken);
}

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
}

export const makePostCall = (url, payload) => {
  return axiosInstance.post( BASE_API +  url, payload);
}

export const makeGetCall = (url) => {
  return axiosInstance.get( BASE_API +  url);
}
