import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  Calendar,
  User,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import useBlogs from "../../../../queries/useBlogs";
import {
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
  type CreateBlogRequest,
  type UpdateBlogRequest,
} from "../../../../queries/useBlogMutations";
import BlogForm from "./BlogForm";
import {
  getCategoryColor,
  getCategoryDisplayName,
  type Blog,
} from "../../../../types/blog.type";
import toast from "react-hot-toast";
import LoaderContainer from "../../../../components/Loader/LoaderContainer";

const BlogManagement = () => {
  const { t } = useTranslation("blogManagement");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deletingBlogId, setDeletingBlogId] = useState<number | null>(null);

  // Fetch blogs
  const { data: blogData, isLoading, error } = useBlogs(currentPage, 10);

  // Extract blogs and pagination info
  const blogs = blogData?.content || [];
  const isLastPage = blogData?.last ?? false;
  const totalElements = blogData?.totalElements ?? 0;

  // Mutations
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryDisplayName(blog.category, t)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleCreateBlog = (blogData: CreateBlogRequest) => {
    createBlogMutation.mutate(blogData, {
      onSuccess: () => {
        setIsFormOpen(false);
        toast.success(t("messages.createSuccess"));
      },
      onError: (error) => {
        console.error("Error creating blog:", error);
        toast.error(t("messages.createError"));
      },
    });
  };

  const handleUpdateBlog = (blogData: CreateBlogRequest) => {
    if (!editingBlog) return;

    const updateData: UpdateBlogRequest = {
      ...blogData,
      id: editingBlog.id,
    };

    updateBlogMutation.mutate(updateData, {
      onSuccess: () => {
        setIsFormOpen(false);
        setEditingBlog(null);
        toast.success(t("messages.updateSuccess"));
      },
      onError: (error) => {
        console.error("Error updating blog:", error);
        toast.error(t("messages.updateError"));
      },
    });
  };

  const handleDeleteBlog = (id: number) => {
    if (window.confirm(t("messages.deleteConfirm"))) {
      deleteBlogMutation.mutate(id, {
        onSuccess: () => {
          setDeletingBlogId(null);
          // If we're on the last page and only have one item, go back to previous page
          if (isLastPage && blogs.length === 1 && currentPage > 0) {
            setCurrentPage(currentPage - 1);
          }
          toast.success(t("messages.deleteSuccess"));
        },
        onError: (error) => {
          console.error("Error deleting blog:", error);
          toast.error(t("messages.deleteError"));
        },
      });
    }
  };

  const openEditForm = (blog: Blog) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingBlog(null);
    setIsFormOpen(true);
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBlog(null);
  };

  if (isLoading) {
    return <LoaderContainer />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>
          {t("messages.errorLoading")}: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-600 mt-1">{t("subtitle")}</p>
        </div>
        <button
          onClick={openCreateForm}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t("actions.create")}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t("actions.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Blogs Table - Responsive */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">
                  {t("table.blog")}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  {t("table.category")}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  {t("table.author")}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  {t("table.stats")}
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  {t("table.date")}
                </th>
                <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  {t("table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-2 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={blog.image}
                          alt={blog.title}
                        />
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div
                          className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                          title={blog.title}
                        >
                          {blog.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {blog.readTime}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getCategoryColor(
                        blog.category
                      )}`}
                    >
                      {getCategoryDisplayName(blog.category, t)}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span
                        className="text-sm text-gray-900 truncate max-w-[100px]"
                        title={blog.author}
                      >
                        {blog.author}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{blog.views}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{blog.comments}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditForm(blog)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title={t("actions.edit")}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        disabled={deletingBlogId === blog.id}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                        title={t("actions.delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t("messages.noBlogs")}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {blogs.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-700">
            {t("messages.showing")} {blogs.length} {t("messages.blogs")} {totalElements > 0 && `of ${totalElements} total`}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              {t("actions.previous")}
            </button>
            <span className="px-3 py-1 text-sm">
              {t("messages.page")} {currentPage + 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={isLastPage}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              {t("actions.next")}
            </button>
          </div>
        </div>
      )}

      {/* Blog Form Modal */}
      <BlogForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
        blog={editingBlog}
        isLoading={createBlogMutation.isPending || updateBlogMutation.isPending}
      />
    </div>
  );
};

export default BlogManagement;
