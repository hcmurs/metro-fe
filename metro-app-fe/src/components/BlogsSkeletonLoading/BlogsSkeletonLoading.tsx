import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BlogsSkeletonLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Skeleton */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative w-full h-full bg-gray-200">
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                {/* Category badge */}
                <Skeleton width={80} height={30} className="mb-4" />

                {/* Title */}
                <Skeleton height={60} className="mb-2" />
                <Skeleton height={60} width="80%" className="mb-4" />

                {/* Meta info */}
                <div className="flex flex-wrap gap-4">
                  <Skeleton width={120} height={20} />
                  <Skeleton width={120} height={20} />
                  <Skeleton width={120} height={20} />
                  <Skeleton width={120} height={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel controls skeleton */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton
              key={index}
              width={12}
              height={12}
              circle
              className="mx-1"
            />
          ))}
        </div>
      </section>

      {/* Category Sections Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category headers */}
        {[1, 2, 3].map((section) => (
          <section key={section} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Skeleton width={4} height={32} className="mr-4" />
                <Skeleton width={150} height={40} />
              </div>
              <Skeleton width={80} height={24} />
            </div>

            {/* Article grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm overflow-hidden p-2"
                  >
                    {/* Image */}
                    <Skeleton height={180} className="mb-4 rounded-lg" />

                    {/* Content */}
                    <div className="p-4">
                      <Skeleton height={28} className="mb-2" />
                      <Skeleton height={28} width="80%" className="mb-4" />

                      <Skeleton count={2} className="mb-4" />

                      {/* Footer */}
                      <div className="flex justify-between">
                        <div>
                          <Skeleton width={120} height={20} />
                        </div>
                        <div>
                          <Skeleton width={80} height={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default BlogsSkeletonLoading;
