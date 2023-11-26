import { getDataOfHumiHCM, getDataOfHumiThuDuc } from "../apis/callAPI";
import { formatInputStartDate, formatInputEndDate } from "../utils/utilDay";

export const fetchDataHumiHCM = async () => {
  const result = await getDataOfHumiHCM(
    formatInputStartDate,
    formatInputEndDate
  );
  return result;
};

export const fetchDataHumiThuDuc = async () => {
  const result = await getDataOfHumiThuDuc(
    formatInputStartDate,
    formatInputEndDate
  );
  return result;
};