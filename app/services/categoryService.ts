import { CategoryInterface } from "../models/Category";
import axiosInstance from "../lib/axiosInstance";

export interface ICategoryResponse {
    success: boolean;
    data: CategoryInterface[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ICategoryFiles {
    page?: number,
    limit?: number,
    search?: string,
    sortBy?: string,
    order?: string,
    sbID?: string,
    visibility?: string,
    thumb?: boolean,
    userID?: string
}

export interface CreateCategoryPayload {
    name: string;
    slug: string;
    visibility: boolean;
    user: {
        uid: string;
        name: string;
    };
}

export interface UpdateCategoryPayload {
    name?: string;
    slug?: string;
    visibility?: boolean;
}


export const categoryService = {
    getCategory: async (params?: ICategoryFiles): Promise<ICategoryResponse> => {
        const response = await axiosInstance.get<ICategoryResponse>('/api/category', {
            params,
        })

        return response.data;
    },
    getCategoryByID: async (id: string) => {
        const response = await axiosInstance.get(`/api/category/${id}`);
        return response.data;
    },

    createCategory: async (
        payload: CreateCategoryPayload,
        thumb: File
    ): Promise<{ success: boolean; data: CategoryInterface }> => {

        const formData = new FormData();

        formData.append("thumb", thumb);
        formData.append("data", JSON.stringify(payload));

        const response = await axiosInstance.post("/api/category", formData);

        return response.data;
    },

    updateCategory: async (
        id: string,
        payload: UpdateCategoryPayload,
        thumb?: File
    ): Promise<{ success: boolean; data: CategoryInterface }> => {

        const formData = new FormData();

        formData.append("id", id);
        formData.append("data", JSON.stringify(payload));

        if (thumb) {
            formData.append("thumb", thumb);
        }

        const response = await axiosInstance.patch("/api/category", formData);

        return response.data;
    },

    deleteCategory: async (
        id: string
    ): Promise<{ success: boolean; message: string }> => {

        const response = await axiosInstance.delete("/api/category", {
            data: { id }
        });

        return response.data;
    },
}