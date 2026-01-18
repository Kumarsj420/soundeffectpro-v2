import axiosInstance from "../lib/axiosInstance";
import { IUser } from "../models/User";

export interface IUserResponse {
  success: boolean;
  data: IUser;
}

export const nameService = {
  updateName: async ({
    uid,
    name,
  }: {
    uid: string;
    name: string;
  }): Promise<IUserResponse> => {
    const res = await axiosInstance.patch<IUserResponse>("/api/name", {
      uid,
      name,
    });
    return res.data;
  },
};
