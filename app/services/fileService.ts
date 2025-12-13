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
    }
}