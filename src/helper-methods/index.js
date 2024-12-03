import momenttz from "moment-timezone";
import { store as REDUX_STORE } from "../redux/store";
import { clearUserCredential } from "../redux/actions/userCredential";
import moment from "moment-timezone";

export const timezoneList = () => {
  const timeZones = momenttz.tz.names();
  // console.log(timeZones)
  return timeZones;
};

export const logout = () => {
  REDUX_STORE.dispatch(clearUserCredential());
  // showToast("Log out successfully", "success", 2000);
  window.location.href = "/";
};

export const structureQueryParams = (params) => {
  let queryStrings = "?";
  const keys = Object.keys(params);
  keys.forEach((key, index) => {
    queryStrings += key + "=" + params[key];
    if (params[keys[index + 1]]) {
      queryStrings += "&";
    }
  });
  return queryStrings;
};

export const formatDateAsPerTimeZOne = (value, timezone) => {
  if (!value) return "";

  const formattedDate = momenttz
    .tz(value, timezone)
    .format("MMM DD, YYYY, hh:mm A");
  const timezoneAbbreviation = momenttz.tz(value, timezone).format("z");

  return `${formattedDate} ${timezoneAbbreviation}`;
};

export const getTimeZoneAbbr = (value, timezone) => {
  return momenttz.tz(value, timezone).zoneAbbr();
};

export const formatDate = (date, timeZone = null) => {
  if (!date) return "";

  // if (timeZone) {
  //   let timeZoneName = getTimeZoneName(timeZone);
  //   date = MomentTimezone.tz(date, timeZoneName);
  // }

  // if (moment().isSame(date, "year")) {
  //   return moment(date).format("MMM DD");
  // } else {
  return moment(date).format("DD/MM/YYYY");
  // }
};

export const formatTime = (date, isTimezone = false) => {
  if (!date) return "";

  // if (isTimezone) {
  //   let timeZone = getTimezone();
  //   if (timeZone) date = MomentTimezone.tz(date, timeZone);
  // }

  return moment(date).format("HH:mm");
};

