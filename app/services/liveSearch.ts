import axiosInstance from "../lib/axiosInstance";

export interface LiveSearchFile {
  title: string;
  duration: string;
  s_id: string;
  slug: string;
}

export interface LiveSearchCategory {
  name: string;
  thumb: string ;
  sb_id: string;
  slug: string;
}

export interface LiveSearchUser {
  name: string;
  uid: string;
}

export interface LiveSearchData {
  files: LiveSearchFile[];
  categories: LiveSearchCategory[];
  users: LiveSearchUser[];
  total_files: number;
  total_categories: number;
}

export interface LiveSearchResponse {
  success: boolean;
  data: LiveSearchData;
}

export const liveSearch = async (search: string): Promise<LiveSearchResponse> => {

  if (!search || search.trim().length < 2) {
    return {
      success: true,
      data: {
        files: [],
        categories: [],
        users: [],
        total_files: 0,
        total_categories: 0,
      },
    };
  }

  const res = await axiosInstance.get<LiveSearchResponse>(
    `/api/live-search/${encodeURIComponent(search)}`
  );

  return res.data;
}
