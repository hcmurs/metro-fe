import {
  Calendar,
  ChevronLeft,
  Eye,
  Facebook,
  Linkedin,
  MessageCircle,
  Twitter,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryColor } from "../News/News";
import useBlogDetail from "../../queries/useBlogsDetail";
import LoadingCute from "../../components/LoadingCute";

// For related articles
interface RelatedArticle {
  id: number;
  title: string;
  image: string;
  category: string;
  date: string;
}

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Use our custom hook to fetch blog detail
  const { data: blog, isLoading, error } = useBlogDetail(id);

  // Get related articles based on the same category
  // In a real app, you would fetch related articles from the API
  const relatedArticles: RelatedArticle[] = [
    {
      id: 9,
      title: "Cybersecurity Trends: Protecting Digital Assets",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      category: blog?.category || "Technology",
      date: "May 23, 2025",
    },
    {
      id: 10,
      title: "Quantum Computing: The Future of Processing Power",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
      category: blog?.category || "Technology",
      date: "May 21, 2025",
    },
  ];

  if (isLoading) {
    return <LoadingCute />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Error loading article</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Format date for display
  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Format views for display
  const formattedViews =
    blog.views > 1000
      ? `${(blog.views / 1000).toFixed(1)}K`
      : blog.views.toString();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to News</span>
        </button>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[50vh] relative">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Article Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Category and Title */}
            <div className="-mt-20 relative z-10 bg-white p-8 rounded-lg shadow-lg mb-8">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-4 ${getCategoryColor(
                  blog.category
                )}`}
              >
                {blog.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center text-gray-600 gap-y-2">
                <div className="flex items-center mr-6">
                  <User className="w-4 h-4 mr-2" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center mr-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center mr-6">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>{blog.comments} comments</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  <span>{formattedViews} views</span>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mb-12">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Share this article
              </h3>
              <div className="flex space-x-4">
                <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Comments ({blog.comments})
              </h3>

              {/* Comment Form */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Leave a Comment
                </h4>
                <form>
                  <div className="mb-4">
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Write your comment here..."
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Post Comment
                  </button>
                </form>
              </div>

              {/* Sample Comments */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                      <div>
                        <h5 className="font-bold text-gray-900">John Doe</h5>
                        <p className="text-sm text-gray-600">
                          May 27, 2025 at 10:32 AM
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-blue-600">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-700">
                    This article provides a fascinating overview of how AI is
                    transforming various industries.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                About the Author
              </h3>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-bold text-gray-900">{blog.author}</h4>
                  <p className="text-sm text-gray-600">
                    {blog.category} Writer
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Experienced writer with expertise in{" "}
                {blog.category.toLowerCase()} topics and digital content
                creation.
              </p>
            </div>

            {/* Related Articles */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((related) => (
                  <div
                    key={related.id}
                    className="block group cursor-pointer"
                    onClick={() => navigate(`/news/${related.id}`)}
                  >
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-md">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white mb-1 ${getCategoryColor(
                            related.category
                          )}`}
                        >
                          {related.category}
                        </span>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-600">{related.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsDetail;
