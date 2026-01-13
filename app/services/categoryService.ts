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
    }
}