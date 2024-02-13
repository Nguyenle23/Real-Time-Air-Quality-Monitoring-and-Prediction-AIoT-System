import { get100DataOfTempHCM, getDataOfTempHCM } from "../apis/callAPI";
import {
  formatInputStartDate,
  formatInputEndDate,
  formatInputStartPrevDate,
  formatInputEndPrevDate,
} from "../utils/utilsDay";

export const fetchDataTempHCM = async () => {
  const result = await getDataOfTempHCM(
    formatInputStartDate,
    formatInputEndDate,
  );
  return result;
};

export const fetch100DataOfTempHCM = async () => {
  const result = await get100DataOfTempHCM(
    formatInputStartPrevDate,
    formatInputEndPrevDate,
  );
  return result;
};
