import axios from "axios";
import type { Blog } from "../types/blog.type";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../types/api.type";
import { API_PATH } from "../constants/path";

type BlogResponse = {
  items: Blog[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

const fetchBlogsList = async (
  page: number,
  perPage: number
): Promise<Blog[]> => {
  try {
    const res = await axios.get<ApiResponse<BlogResponse>>(
      `${API_PATH.BLOG}?page=${page}&perPage=${perPage}`,
      {
        params: {
          page,
          perPage,
        },
      }
    );
    if (res.status === 200) {
      return res.data.data.items;
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
  return useQuery<Blog[], Error>({
    queryKey: ["blogs", page, perPage],
    queryFn: () => fetchBlogsList(page, perPage),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // exponential backoff
  });
};

export default useBlogs;
