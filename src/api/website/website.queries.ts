import { useQuery } from "@tanstack/react-query";
import { getPieStats } from "./website.apis";
import { getLineStats } from "./website.apis";
import { LineStatsProps, PieStatsProps } from "@/constants/types";

export const useGetLineStats = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["lineStats"],
    queryFn: () => getLineStats(),
  });

  const lineStats: LineStatsProps[] = data?.data?.data;

  return { lineStats, isPending, isError };
};

export const useGetPieStats = ({ sort }: { sort: string }) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["pieStats", { sort }],
    queryFn: () => getPieStats({ sort }),
  });

  const pieStats: PieStatsProps[] = data?.data?.data;

  return { pieStats, isPending, isError };
};
