export type BlogCategory =
  | "SERVICE_UPDATE"
  | "SAFETY_GUIDELINE"
  | "RIDER_TIPS"
  | "TECH_BEHIND_METRO"
  | "SCHEDULE_INFO"
  | "PROMOTION"
  | "PUBLIC_ANNOUNCEMENT";

export type BlogTag =
  | "STATION_GUIDE"
  | "ELECTRONIC_TICKETING"
  | "MAP_UPDATE"
  | "DISCOUNT"
  | "MAINTENANCE_NOTICE"
  | "PEAK_HOUR_TIPS"
  | "NEW_LINE_OPENING"
  | "MOBILE_APP"
  | "LOST_AND_FOUND"
  | "PUBLIC_ANNOUNCEMENT"
  | "ACCESSIBILITY";

export type Blog = {
  id: number;
  title: string;
  category: BlogCategory;
  date: string;
  author: string;
  comments: number;
  image: string;
  content: string;
  excerpt: string;
  readTime: string;
  tags: BlogTag[];
  views: number;
  createdAt: string;
  updatedAt: string;
};

// Function to convert category to display text
export const getCategoryDisplayName = (category: BlogCategory): string => {
  switch (category) {
    case "SERVICE_UPDATE":
      return "Service Updates";
    case "SAFETY_GUIDELINE":
      return "Safety Guidelines";
    case "RIDER_TIPS":
      return "Rider Tips";
    case "TECH_BEHIND_METRO":
      return "Technology";
    case "SCHEDULE_INFO":
      return "Schedule Info";
    case "PROMOTION":
      return "Promotions";
    case "PUBLIC_ANNOUNCEMENT":
      return "Announcements";
    default:
      return "Metro News";
  }
};

// Function to convert tag to display text
export const getTagDisplayName = (tag: BlogTag): string => {
  switch (tag) {
    case "STATION_GUIDE":
      return "Station Guide";
    case "ELECTRONIC_TICKETING":
      return "Electronic Ticketing";
    case "MAP_UPDATE":
      return "Map Update";
    case "DISCOUNT":
      return "Discount";
    case "MAINTENANCE_NOTICE":
      return "Maintenance Notice";
    case "PEAK_HOUR_TIPS":
      return "Peak Hour Tips";
    case "NEW_LINE_OPENING":
      return "New Line Opening";
    case "MOBILE_APP":
      return "Mobile App";
    case "LOST_AND_FOUND":
      return "Lost and Found";
    case "PUBLIC_ANNOUNCEMENT":
      return "Public Announcement";
    case "ACCESSIBILITY":
      return "Accessibility";
    default:
      return (tag as string)
        .replace(/_/g, " ")
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};

// Category color function
export const getCategoryColor = (category: BlogCategory): string => {
  switch (category) {
    case "SERVICE_UPDATE":
      return "bg-blue-500";
    case "SAFETY_GUIDELINE":
      return "bg-red-500";
    case "RIDER_TIPS":
      return "bg-green-500";
    case "TECH_BEHIND_METRO":
      return "bg-purple-500";
    case "SCHEDULE_INFO":
      return "bg-yellow-500";
    case "PROMOTION":
      return "bg-pink-500";
    case "PUBLIC_ANNOUNCEMENT":
      return "bg-gray-500";
    default:
      return "bg-blue-500";
  }
};

// Constants for easier iteration
export const ALL_BLOG_CATEGORIES: BlogCategory[] = [
  "SERVICE_UPDATE",
  "SAFETY_GUIDELINE",
  "RIDER_TIPS",
  "TECH_BEHIND_METRO",
  "SCHEDULE_INFO",
  "PROMOTION",
  "PUBLIC_ANNOUNCEMENT",
];

export const ALL_BLOG_TAGS: BlogTag[] = [
  "STATION_GUIDE",
  "ELECTRONIC_TICKETING",
  "MAP_UPDATE",
  "DISCOUNT",
  "MAINTENANCE_NOTICE",
  "PEAK_HOUR_TIPS",
  "NEW_LINE_OPENING",
  "MOBILE_APP",
  "LOST_AND_FOUND",
  "PUBLIC_ANNOUNCEMENT",
  "ACCESSIBILITY",
];
