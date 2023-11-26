import { getDataOfTempHCM, getDataOfTempThuDuc } from "../apis/callAPI";
import { formatInputStartDate, formatInputEndDate } from "../utils/utilDay";

export const fetchDataTempHCM = async () => {
  const result = await getDataOfTempHCM(
    formatInputStartDate,
    formatInputEndDate
  );
  return result;
};

export const fetchDataTempThuDuc = async () => {
  const result = await getDataOfTempThuDuc(
    formatInputStartDate,
    formatInputEndDate
  );
  return result;
};