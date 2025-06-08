import axios from "axios";
import type { Blog } from "../types/blog.type";
import { useQuery } from "@tanstack/react-query";

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
    const res = await axios.get<BlogResponse>(
      `https://pkb.lch.id.vn/api/collections/blogs/records?page=${page}&perPage=${perPage}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
        params: {
          page,
          perPage,
        },
      }
    );
    if (res.status === 200) {
      return res.data.items;
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
