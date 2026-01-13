import axiosInstance from "../lib/axiosInstance";

export type R2Folder = "store" | "thumb" | "avatars";

export interface UploadResponse {
  key: string;
  url: string;
}

export const r2Service = {
  upload: async ({
    file,
    folder,
  }: {
    file: File;
    folder: R2Folder;
  }): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await axiosInstance.post<UploadResponse>(
      "/api/uploadR2",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },

  delete: async ({
    key,
  }: {
    key: string;
  }): Promise<{ success: boolean }> => {
    const res = await axiosInstance.post("/api/deleteR2", { key });
    return res.data;
  },
};
