import { IFile } from "../models/File";
import axiosInstance from "../lib/axiosInstance";

export interface IFilesResponse {
  success: boolean;
  data: IFile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IGetFilesParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;   // createdAt | views | downloads
  order?: "asc" | "desc";
  userId?: string;
  tag?: string;
}


export const fileService = {
  getFiles: async (params?: IGetFilesParams): Promise<IFilesResponse> => {
    const response = await axiosInstance.get<IFilesResponse>('/api/sounds', {
      params,
    })
    return response.data;
  },
  getFilesById: async (id: string) => {
    const response = await axiosInstance.get(`/api/sounds/${id}`)
    return response.data;
  },
  getRelatedFiles: async (
    s_id: string,
    page = 1,
    limit = 20,
    context?: {
      category?: string;
      tags?: string[];
      title?: string;
    }
  ) => {
    const res = await axiosInstance.get(
      `/api/sounds/related`,
      {
        params: {
          s_id,
          page,
          limit,
          category: context?.category,
          tags: context?.tags?.join(","),
          title: context?.title,
        },
      }
    );

    return res.data;
  },
  getFilesBySbID: async ({
    id,
    page,
    limit,
  }: {
    id: string;
    page: number;
    limit: number;
  }) => {
    const response = await axiosInstance.get(
      `/api/sounds/sb/${id}`,
      {
        params: { page, limit },
      }
    );

    return response.data;
  },
  getLikedFiles: async () => {
    const response = await axiosInstance.get('/api/sounds/fav');
    return response.data;
  }

}