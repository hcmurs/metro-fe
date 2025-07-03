import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogsSkeletonLoading from "../../components/BlogsSkeletonLoading/BlogsSkeletonLoading";
import useBlogs from "../../queries/useBlogs";
import {
  getCategoryColor,
  getCategoryDisplayName,
  type BlogCategory,
} from "../../types/blog.type";

const Blogs = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch blogs data using the API
  const { data: blogs, isLoading, error } = useBlogs(0, 30);

  // Process the blogs data to separate hero and category articles
  const { heroNews, categoryNews } = useMemo(() => {
    if (!blogs || blogs.length === 0) {
      return {
        heroNews: [],
        categoryNews: {
          SERVICE_UPDATE: [],
          RIDER_TIPS: [],
          TECH_BEHIND_METRO: [],
          SAFETY_GUIDELINE: [],
          PROMOTION: [],
          SCHEDULE_INFO: [],
          PUBLIC_ANNOUNCEMENT: [],
        },
      };
    }

    // Sort blogs by date (most recent first)
    const sortedBlogs = [...blogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Take first 4 for hero carousel
    const heroNews = sortedBlogs.slice(0, 4).map((blog) => ({
      id: blog.id,
      image: blog.image,
      category: blog.category,
      title: blog.title,
      author: blog.author,
      date: new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      comments: blog.comments,
      views:
        blog.views > 1000
          ? `${(blog.views / 1000).toFixed(1)}K`
          : blog.views.toString(),
    }));

    // Group remaining blogs by category
    const remainingBlogs = sortedBlogs.slice(4);
    type CategoryArticle = {
      id: number;
      image: string;
      title: string;
      author: string;
      date: string;
      comments: number;
      excerpt: string;
      category: string;
    };

    const categoryNews: Record<string, CategoryArticle[]> = {
      SERVICE_UPDATE: [],
      RIDER_TIPS: [],
      TECH_BEHIND_METRO: [],
      SAFETY_GUIDELINE: [],
      PROMOTION: [],
      SCHEDULE_INFO: [],
      PUBLIC_ANNOUNCEMENT: [],
    };

    // Group blogs by their actual categories
    remainingBlogs.forEach((blog) => {
      if (categoryNews[blog.category]) {
        categoryNews[blog.category].push({
          id: blog.id,
          image: blog.image,
          title: blog.title,
          author: blog.author,
          date: new Date(blog.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          comments: blog.comments,
          excerpt: blog.excerpt,
          category: blog.category,
        });
      }
    });

    // Limit each category to 6 items
    Object.keys(categoryNews).forEach((key) => {
      categoryNews[key] = categoryNews[key].slice(0, 6);
    });

    return { heroNews, categoryNews };
  }, [blogs]);

  // Auto-advance carousel
  useEffect(() => {
    if (heroNews.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroNews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroNews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroNews.length) % heroNews.length);
  };

  const handleArticleClick = (id: number) => {
    navigate(`/blogs/${id}`);
  };

  // Loading state
  if (isLoading) {
    return <BlogsSkeletonLoading />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Articles
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!heroNews || heroNews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Articles Found
          </h2>
          <p className="text-gray-600">Check back later for new content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel - Update category display */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative w-full h-full">
          {heroNews.map((news, index) => (
            <div
              key={news.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={() => handleArticleClick(news.id)}
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl text-white">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getCategoryColor(
                          news.category as BlogCategory
                        )}`}
                      >
                        {getCategoryDisplayName(news.category)}
                      </span>
                      <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        {news.title}
                      </h2>
                      <div className="flex items-center space-x-6 text-gray-300">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{news.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{news.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>{news.comments} comments</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>{news.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroNews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Dynamic Category Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.entries(categoryNews).map(([categoryKey, articles]) => {
          const category = categoryKey as keyof typeof categoryNews;

          if (articles.length === 0) return null;

          return (
            <section key={category} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span
                    className={`w-1 h-8 ${getCategoryColor(
                      category as BlogCategory
                    )} mr-4 rounded`}
                  ></span>
                  {getCategoryDisplayName(category as BlogCategory)}
                </h2>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getCategoryColor(
                            article.category as BlogCategory
                          )}`}
                        >
                          {getCategoryDisplayName(
                            article.category as BlogCategory
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{article.date}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{article.comments}</span>
                          </span>
                          <div className="flex items-center space-x-2">
                            <button className="hover:text-red-500 transition-colors">
                              <Heart className="w-4 h-4" />
                            </button>
                            <button className="hover:text-blue-500 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default Blogs;
