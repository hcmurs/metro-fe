import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../apis/api";
import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import type { Blog, BlogCategory, BlogTag } from "../types/blog.type";

// Types for blog creation and update
export interface CreateBlogRequest {
  title: string;
  category: BlogCategory;
  author: string;
  image: string;
  content: string;
  excerpt: string;
  readTime: string;
  tags: BlogTag[];
}

export interface UpdateBlogRequest extends CreateBlogRequest {
  id: number;
}

// Create Blog
const createBlog = async (blogData: CreateBlogRequest): Promise<Blog> => {
  try {
    const res = await api.post<ApiResponse<Blog>>(`${API_PATH.BLOG}`, blogData);
    if (res.status === 201 || res.status === 200) {
      return res.data.data;
    } else {
      throw new Error(`Error creating blog: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error instanceof Error
      ? error
      : new Error("Unknown error creating blog");
  }
};

// Update Blog
const updateBlog = async (blogData: UpdateBlogRequest): Promise<Blog> => {
  try {
    const res = await api.put<ApiResponse<Blog>>(
      `${API_PATH.BLOG}/${blogData.id}`,
      blogData
    );
    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error(`Error updating blog: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error instanceof Error
      ? error
      : new Error("Unknown error updating blog");
  }
};

// Delete Blog
const deleteBlog = async (id: number): Promise<void> => {
  try {
    const res = await api.delete(`${API_PATH.BLOG}/${id}`);
    if (res.status !== 200 && res.status !== 204) {
      throw new Error(`Error deleting blog: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error instanceof Error
      ? error
      : new Error("Unknown error deleting blog");
  }
};

// Custom hooks
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBlog,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", data.id.toString()] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
