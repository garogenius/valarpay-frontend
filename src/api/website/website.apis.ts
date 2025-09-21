import { request } from "@/utils/axios-utils";

export const getLineStats = () => {
  return request({
    url: `/user/statistics-line-chart`,
  });
};

export const getPieStats = ({ sort }: { sort: string }) => {
  return request({
    url: `/user/statistics-pie-chart?sort=${sort}`,
  });
};
