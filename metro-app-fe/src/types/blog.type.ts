export type Blog = {
  id: string;
  category: string;
  title: string;
  author: string;
  date: Date;
  comments: number;
  image: string;
  content: string;
  tags: string[];
  readTime: number;
  excerpt: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  collectionId: string;
  collectionName: "blogs";
};
