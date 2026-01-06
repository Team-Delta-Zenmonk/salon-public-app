import { axiosInstance } from "../../../config/axios";
import type { ListSalonsQuery, ListSalonsResponse } from "../salon.type";

const cleanQuery = (q: ListSalonsQuery) => {
  const params: Record<string, any> = {};
  Object.entries(q).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    params[k] = v;
  });
  return params;
};

export const listSalonsService = async (query: ListSalonsQuery = {}): Promise<ListSalonsResponse> => {
  const hasLat = typeof query.latitude === "number";
  const hasLng = typeof query.longitude === "number";

  const safeQuery =
    (hasLat && hasLng) || (!hasLat && !hasLng) ? query : { ...query, latitude: undefined, longitude: undefined };

  const res = await axiosInstance.get("/salons", { params: cleanQuery(safeQuery) });
  return res.data;
};
