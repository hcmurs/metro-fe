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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Fashion: "bg-pink-500",
    Nature: "bg-green-500",
    Technology: "bg-blue-500",
    Lifestyle: "bg-purple-500",
  };
  return colors[category] || "bg-gray-500";
};

const NewsPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero carousel data
  const heroNews = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=600&fit=crop",
      category: "Fashion",
      title: "Spring Fashion Trends 2025: What's Hot This Season",
      author: "Sarah Johnson",
      date: "May 28, 2025",
      comments: 45,
      views: "2.3K",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop",
      category: "Nature",
      title: "Climate Change Impact on Forest Ecosystems Worldwide",
      author: "Dr. Michael Chen",
      date: "May 27, 2025",
      comments: 89,
      views: "5.7K",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1666597107756-ef489e9f1f09?w=1200&h=600&fit=crop",
      category: "Technology",
      title: "AI Revolution: How Machine Learning is Changing Our Lives",
      author: "Alex Rivera",
      date: "May 26, 2025",
      comments: 156,
      views: "8.9K",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop",
      category: "Lifestyle",
      title: "Minimalist Living: Finding Joy in Simplicity",
      author: "Emma Thompson",
      date: "May 25, 2025",
      comments: 67,
      views: "3.2K",
    },
  ];

  // Category news data
  const categoryNews = {
    fashion: [
      {
        id: 5,
        image:
          "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=250&fit=crop",
        title: "Sustainable Fashion: Eco-Friendly Brands Leading the Way",
        author: "Lisa Park",
        date: "May 24, 2025",
        comments: 32,
        excerpt:
          "Discover how sustainable fashion brands are revolutionizing the industry with eco-friendly practices.",
      },
      {
        id: 6,
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=250&fit=crop",
        title: "Summer Wardrobe Essentials: Must-Have Pieces",
        author: "Rachel Green",
        date: "May 23, 2025",
        comments: 28,
        excerpt:
          "Build the perfect summer wardrobe with these essential pieces that combine style and comfort.",
      },
      {
        id: 7,
        image:
          "https://plus.unsplash.com/premium_photo-1681842021333-60504ef67f0c?w=400&h=250&fit=crop",
        title: "Street Style Inspiration from Fashion Capitals",
        author: "Marco Silva",
        date: "May 22, 2025",
        comments: 41,
        excerpt:
          "Get inspired by street style looks from Paris, Milan, New York, and Tokyo fashion weeks.",
      },
    ],
    technology: [
      {
        id: 8,
        image:
          "https://images.unsplash.com/photo-1610168388710-a8cfbafe6c30?w=400&h=250&fit=crop",
        title: "5G Technology: Transforming Mobile Communication",
        author: "David Kim",
        date: "May 24, 2025",
        comments: 73,
        excerpt:
          "Explore how 5G networks are revolutionizing mobile communication and enabling new technologies.",
      },
      {
        id: 9,
        image:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
        title: "Cybersecurity Trends: Protecting Digital Assets",
        author: "Jennifer Wu",
        date: "May 23, 2025",
        comments: 94,
        excerpt:
          "Stay ahead of cyber threats with the latest security trends and protection strategies.",
      },
      {
        id: 10,
        image:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
        title: "Quantum Computing: The Future of Processing Power",
        author: "Robert Martinez",
        date: "May 21, 2025",
        comments: 127,
        excerpt:
          "Discover how quantum computing is set to revolutionize data processing and problem-solving.",
      },
    ],
    lifestyle: [
      {
        id: 11,
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
        title: "Wellness Trends: Mind-Body Connection in 2025",
        author: "Dr. Amanda Foster",
        date: "May 24, 2025",
        comments: 56,
        excerpt:
          "Explore the latest wellness trends focusing on mental health and physical well-being integration.",
      },
      {
        id: 12,
        image:
          "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=250&fit=crop",
        title: "Travel Photography: Capturing Perfect Moments",
        author: "Chris Anderson",
        date: "May 22, 2025",
        comments: 38,
        excerpt:
          "Master the art of travel photography with expert tips for capturing stunning destination photos.",
      },
      {
        id: 13,
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop",
        title: "Home Design Trends: Creating Cozy Spaces",
        author: "Maria Rodriguez",
        date: "May 20, 2025",
        comments: 47,
        excerpt:
          "Transform your living space with the latest home design trends and interior styling tips.",
      },
    ],
  };

  // Auto-advance carousel
  useEffect(() => {
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
    navigate(`/news/${id}`);
  };
  if (!heroNews || !categoryNews) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative w-full h-full">
          {heroNews.map((news, index) => (
            <div
              key={news.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
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
                          news.category
                        )}`}
                      >
                        {news.category}
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
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
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

      {/* Category Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Fashion Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span
                className={`w-1 h-8 ${getCategoryColor(
                  "Fashion"
                )} mr-4 rounded`}
              ></span>
              Fashion
            </h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryNews.fashion.map((article) => (
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
                        "Fashion"
                      )}`}
                    >
                      Fashion
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

        {/* Technology Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span
                className={`w-1 h-8 ${getCategoryColor(
                  "Technology"
                )} mr-4 rounded`}
              ></span>
              Technology
            </h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryNews.technology.map((article) => (
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
                        "Technology"
                      )}`}
                    >
                      Technology
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

        {/* Lifestyle Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span
                className={`w-1 h-8 ${getCategoryColor(
                  "Lifestyle"
                )} mr-4 rounded`}
              ></span>
              Lifestyle
            </h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryNews.lifestyle.map((article) => (
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
                        "Lifestyle"
                      )}`}
                    >
                      Lifestyle
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
      </main>
    </div>
  );
};

export default NewsPage;
