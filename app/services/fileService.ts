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

export interface IUploadSoundMeta {
  title: string;
  slug: string;
  duration: string;
  tags: string[];
  category: string;
  description?: string;
  btnColor?: string;
  user: {
    uid: string;
    name: string;
  };
}

export interface IUploadSoundResponse {
  success: boolean;
  message: string;
  data: IFile[];
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

  getLikedFiles: async ({ page, limit }: { page: number; limit: number }) => {
    const response = await axiosInstance.get('/api/sounds/fav', {
      params: { page, limit },
    });
    return response.data;
  },

  postAudio: async ({
    files,
    metadata,
  }: {
    files: File | File[];
    metadata: IUploadSoundMeta | IUploadSoundMeta[];
  }): Promise<IUploadSoundResponse> => {

    const formData = new FormData();

    const fileList = Array.isArray(files) ? files : [files];
    const metaList = Array.isArray(metadata) ? metadata : [metadata];

    if (fileList.length !== metaList.length) {
      throw new Error("Files and metadata count mismatch");
    }

    fileList.forEach(file => {
      formData.append("audio", file);
    });

    formData.append("metadata", JSON.stringify(metaList));

    const response = await axiosInstance.post<IUploadSoundResponse>(
      "/api/sounds",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress(progressEvent) {

          const percent = Math.round(
            (progressEvent.loaded * 100) /
            (progressEvent.total || 1)
          );

          console.log("Upload progress:", percent, "%");
        },
      }
    );

    return response.data;
  },

  increaseViewCount: async (id: string) => {
    const response = await axiosInstance.patch(`/api/sounds/${id}/increment-view`);
    return response.data;
  },

  increaseDownloadCount: async (id: string) => {
    const response = await axiosInstance.post(`/api/sounds/${id}/increment-download`);
    return response.data;
  },

  deleteById: async (id: string) => {
    const response = await axiosInstance.delete(`/api/sounds/${id}`);
    return response.data;
  }

}