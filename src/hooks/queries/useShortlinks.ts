import { useQuery } from "@tanstack/react-query";

import { getShortlinks } from "@/src/services/shortlinks/getShortlinks";

export const SHORTLINK_QUERY_KEY = ["shortlinks"] as const

export const useShortlinks = () => useQuery({
    queryFn: getShortlinks,
    queryKey: SHORTLINK_QUERY_KEY,
})