import { ChevronLeft } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BlogsDetailSkeletonLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center text-gray-400">
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to News</span>
        </div>
      </div>

      {/* Hero Image Skeleton */}
      <div className="w-full h-[50vh] relative">
        <Skeleton height="100%" className="absolute inset-0" />
      </div>

      {/* Article Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Category and Title */}
            <div className="-mt-20 relative z-10 bg-white p-8 rounded-lg shadow-lg mb-8">
              <Skeleton width={80} height={30} className="mb-4" />
              <Skeleton height={48} className="mb-2" />
              <Skeleton height={48} width="80%" className="mb-6" />

              <div className="flex flex-wrap items-center gap-y-2">
                <div className="flex items-center mr-6 w-1/4">
                  <Skeleton width="100%" height={20} />
                </div>
                <div className="flex items-center mr-6 w-1/4">
                  <Skeleton width="100%" height={20} />
                </div>
                <div className="flex items-center mr-6 w-1/4">
                  <Skeleton width="100%" height={20} />
                </div>
                <div className="flex items-center w-1/4">
                  <Skeleton width="100%" height={20} />
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none mb-12">
              <Skeleton count={12} className="mb-4" />
              <Skeleton count={8} className="mb-6" />
              <Skeleton width="70%" className="mb-8" />
              <Skeleton count={10} className="mb-4" />
            </div>

            {/* Tags */}
            <div className="mb-12">
              <Skeleton width={100} height={28} className="mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton
                      key={index}
                      width={80}
                      height={30}
                      className="rounded-full"
                    />
                  ))}
              </div>
            </div>

            {/* Share */}
            <div className="mb-12">
              <Skeleton width={150} height={28} className="mb-4" />
              <div className="flex space-x-4">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={index} width={40} height={40} circle />
                  ))}
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <Skeleton width={200} height={32} className="mb-6" />

              {/* Comment Form */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <Skeleton width={150} height={28} className="mb-4" />
                <Skeleton height={100} className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Skeleton height={40} />
                  <Skeleton height={40} />
                </div>
                <Skeleton width={120} height={40} />
              </div>

              {/* Sample Comments */}
              <div className="space-y-6">
                {Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                          <Skeleton
                            circle
                            width={40}
                            height={40}
                            className="mr-3"
                          />
                          <div>
                            <Skeleton
                              width={100}
                              height={20}
                              className="mb-1"
                            />
                            <Skeleton width={150} height={16} />
                          </div>
                        </div>
                      </div>
                      <Skeleton count={3} />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <Skeleton width={150} height={24} className="mb-4" />
              <div className="flex items-center mb-4">
                <Skeleton circle width={64} height={64} className="mr-4" />
                <div>
                  <Skeleton width={120} height={20} className="mb-1" />
                  <Skeleton width={100} height={16} />
                </div>
              </div>
              <Skeleton count={3} className="mb-4" />
            </div>

            {/* Related Articles */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <Skeleton width={150} height={24} className="mb-4" />
              <div className="space-y-4">
                {Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex space-x-4">
                      <Skeleton width={80} height={80} className="rounded-md" />
                      <div className="flex-1">
                        <Skeleton width={60} height={16} className="mb-1" />
                        <Skeleton width="100%" height={20} className="mb-1" />
                        <Skeleton width={80} height={16} />
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

export default BlogsDetailSkeletonLoading;
