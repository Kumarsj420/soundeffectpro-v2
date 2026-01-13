import axiosInstance from "../lib/axiosInstance";
import { IUser } from "../models/User";

export interface IUserResponse {
    success: boolean;
    data: IUser;
}

export const userService = {
    getUserByUID: async (uid: string): Promise<IUserResponse> => {
        const res = await axiosInstance.get<IUserResponse>(
            `/api/user/${uid}`
        );
        return res.data;
    },

    updateUser: async (payload: Partial<IUser> ) => {
        const res = await axiosInstance.patch("/api/user", payload);
        return res.data;
    },

    deleteUser: async (uid: string) => {
        const res = await axiosInstance.delete("/api/user", {
            data: { uid },
        });
        return res.data;
    },

    checkUID: async (uid: string) => {
        const res = await axiosInstance.get("/api/user/check-uid", {
            params: { uid },
        });
        return res.data;
    }
};
