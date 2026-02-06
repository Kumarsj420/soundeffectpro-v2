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

export interface ReportPayload {
    senderEmail: string;
    type?: ReportType;
    content: string;
    target: {
        from: ReportTargetType;
        id: string;
    };
}


export type ReportTargetType = "sound" | "soundboard";

export type ReportType =
    | "hate speech"
    | "abuse"
    | "inappropriate content"
    | "sexual content"
    | "harassment and bullying"
    | "terrorism advocacy"
    | "misinformation"
    | "spam and scams"
    | "copyright violation"
    | "privacy violation"
    | "other";

export interface ReportResponse {
    success: boolean;
    message: string;
    data?: {
        _id: string;
        senderEmail: string;
        type: ReportType;
        content: string;
        read: boolean;
        target: {
            from: ReportTargetType;
            id: string;
        };
        createdAt: string;
        updatedAt: string;
    };
}

export interface MessagePayload {
    senderEmail: string;
    type?: MessageType;
    content: string;
}

export type MessageType =
    | "contact"
    | "feedback"
    | "inquiry"
    | "support"
    | "technical issue"
    | "other";


export interface MessageResponse {
    success: boolean;
    message: string;
    data?: {
        _id: string;
        senderEmail: string;
        type: MessageType;
        content: string;
        read: boolean;
        createdAt: string;
        updatedAt: string;
    };
    errors?: Array<{
        field: string;
        message: string;
    }>;
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
    },

    submitReport: async (
        payload: ReportPayload
    ): Promise<ReportResponse> => {
        const res = await axiosInstance.post<ReportResponse>(
            "/api/report",
            payload
        );

        return res.data;
    },

    postMessage: async (
        payload: MessagePayload
    ): Promise<MessageResponse> => {
        const res = await axiosInstance.post<MessageResponse>(
            "/api/message",
            payload
        );

        return res.data;
    },

};
