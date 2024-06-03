import { metaletApiV3 } from "./request";
import { getNetwork } from "@/lib/network";
import { useQuery } from "@tanstack/react-query";

// TODO: fix network switch

interface DiscoverStruct {
  name: string;
  icon: string;
  url: string;
  desc: string;
  recover: string;
  themeColor: string;
}

interface DiscoverData {
  recommend: DiscoverStruct[] | null;
  tops: DiscoverStruct[] | null;
  dapps: DiscoverStruct[] | null;
}

const fetchDiscoverData = async (): Promise<DiscoverData> => {
  const net = getNetwork();
  return metaletApiV3<DiscoverData>(`/dapp/list`).get({ net });
};

export const useDiscoverDataQuery = () => {
  return useQuery({
    queryKey: ["discoverData"],
    queryFn: () => fetchDiscoverData(),
  });
};
