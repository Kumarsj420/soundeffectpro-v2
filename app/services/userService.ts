import axiosInstance from "../lib/axiosInstance";
import { IUser } from "../models/User";

export interface IUserResponse {
    success: boolean;
    data: IUser;
}

export interface SoundboardPayload {
    sb_id: string;
    s_id: string;
}


export const userService = {
    getUserByUID: async (uid: string): Promise<IUserResponse> => {
        const res = await axiosInstance.get<IUserResponse>(
            `/api/user/${uid}`
        );
        return res.data;
    },

    updateUser: async (payload: Partial<IUser>) => {
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
    },

    userATS: async (
        payload: SoundboardPayload
    ): Promise<{ success: boolean; data: { sb_id: string; s_id: string } }> => {

        const res = await axiosInstance.post("/api/user/ats", payload);

        return res.data;
    },

    userDeleteSoundboard: async (
        payload: SoundboardPayload
    ): Promise<{ success: boolean; message: string }> => {

        const res = await axiosInstance.delete("/api/user/ats", {
            data: payload,
        });

        return res.data;
    },

    userFavToggle: async (s_id: string): Promise<{ success: boolean; status: string; message: string }> => {
        const res = await axiosInstance.post("/api/user/fav", { s_id });
        return res.data;
    }


};
