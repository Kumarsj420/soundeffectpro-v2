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

export const fileService = {
    getFiles: async (): Promise<IFilesResponse> => {
        const response = await axiosInstance.get<IFilesResponse>('/api/sounds')
        return response.data;
    }
}