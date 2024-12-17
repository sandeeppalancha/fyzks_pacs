import axiosInstance, { BASE_API } from "../axios";


export const RADIOLOGY_URL = (pin, location) => `https://smj-pacs-int.yashodahospital.com/RadiologyDesk/PatientDetails_Tab.aspx?Pin=${pin}&LOC=${location}`
export const ConvertStringToDate = (dateString, timeString) => {
  if (!dateString || !timeString) return "";
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

export const makePostCall = (url, payload, headers) => {
  return axiosInstance.post(BASE_API + url, payload, headers);
}

export const makeGetCall = (url) => {
  return axiosInstance.get(BASE_API + url);
}


export const hisStatusOptions = [
  { label: 'UNCONFIRMED', value: 'UNCONFIRMED' },
  { label: 'CONFIRMATION_IN_PROGRESS', value: 'CONFIRMATION_IN_PROGRESS' },
  { label: 'WAIT_FOR_MANUAL_CONFIRMATION', value: 'WAIT_FOR_MANUAL_CONFIRMATION' },
  { label: 'CONFIRMED', value: 'CONFIRMED' },
  { label: 'DUPLICATE_ACCESSION_NO', value: 'DUPLICATE_ACCESSION_NO' },
  { label: 'CONFIRMATION_NOT_REQUIRED', value: 'CONFIRMATION_NOT_REQUIRED' },
]


export const hasReportingPermission = (userDetails) => {
  const userType = userDetails?.user_type;
  if (userType === 'radiologist' || userType === 'typist' || userType === 'hod') {
    // additionally check explicitly if the user has the particular permission
    return true;
  }
  return false;
}

export const hasStudyViewingPermission = (userDetails) => {
  const userType = userDetails?.user_type;
  if (userType === 'radiologist' || userType === 'hod' || userType === 'technician') {
    // additionally check explicitly if the user has the particular permission
    return true;
  }
  return false;
}

export const hasUploadNotesPermission = (userDetails) => {
  const userType = userDetails?.user_type;
  if (userType === 'technician') {
    // additionally check explicitly if the user has the particular permission
    return true;
  }
  return false;
}
