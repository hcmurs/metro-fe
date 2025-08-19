import { useQuery } from "@tanstack/react-query";
import api from "../apis/api";
import { API_PATH } from "../constants/path";
import type { PaginatedResponse } from "../types/api.type";
import type { Blog } from "../types/blog.type";

const fetchBlogsList = async (
  page: number,
  perPage: number
): Promise<PaginatedResponse<Blog>["data"]> => {
  try {
    const res = await api.get<PaginatedResponse<Blog>>(`${API_PATH.BLOG}`, {
      params: {
        page,
        size: perPage,
      },
    });
    if (res.status === 200) {
      return res.data.data; // Return the full data object with pagination info
    } else {
      throw new Error(`Error fetching blogs: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching blogs list:", error);
    throw error instanceof Error
      ? error
      : new Error("Unknown error fetching blogs list");
  }
};

const useBlogs = (page: number, perPage: number) => {
  return useQuery<PaginatedResponse<Blog>["data"], Error>({
    queryKey: ["blogs", page, perPage],
    queryFn: () => fetchBlogsList(page, perPage),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // exponential backoff
  });
};

export default useBlogs;
