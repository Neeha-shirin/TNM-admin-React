import React, { useState } from "react";
import { FaStar, FaUserCircle, FaFilter, FaChevronDown } from "react-icons/fa";

const ReviewCard = ({ name, rating, comment, date }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col gap-3 border border-gray-100">
      {/* Reviewer Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-800">{name}</span>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full">
          <FaStar className="text-sm" />
          <span className="font-semibold text-sm">{rating}.0</span>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < rating ? "text-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-600 leading-relaxed">{comment}</p>
    </div>
  );
};

const RatingSummary = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  
  // Calculate rating distribution
  const distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
  reviews.forEach(review => {
    distribution[review.rating]++;
  });

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-center mb-6 md:mb-0">
          <h2 className="text-5xl font-bold">{averageRating.toFixed(1)}</h2>
          <div className="flex justify-center items-center gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(averageRating) ? "text-yellow-300" : "text-white opacity-40"}
              />
            ))}
          </div>
          <p className="text-white opacity-90">{totalReviews} reviews</p>
        </div>
        
        <div className="w-full md:w-1/2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2 mb-2">
              <span className="w-10 text-sm">{rating} star</span>
              <div className="flex-1 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-300 rounded-full" 
                  style={{ width: `${(distribution[rating] / totalReviews) * 100}%` }}
                ></div>
              </div>
              <span className="w-10 text-right text-sm">{Math.round((distribution[rating] / totalReviews) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ active, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-blue-500 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
};

export default function Reviews() {
  // Static dummy data with dates
  const allReviews = [
    { id: 1, name: "Alice Johnson", rating: 5, comment: "Excellent course! Very detailed and easy to follow. The instructor's teaching style made complex topics simple to understand.", date: "2 days ago" },
    { id: 2, name: "Bob Smith", rating: 4, comment: "Really good, but could use more practical examples. The content was valuable but some sections felt rushed.", date: "1 week ago" },
    { id: 3, name: "Catherine Lee", rating: 5, comment: "Loved it! The instructor explained concepts very clearly. The projects helped solidify my understanding of the material.", date: "2 weeks ago" },
    { id: 4, name: "David Brown", rating: 3, comment: "Average, some topics were rushed. I expected more depth in the advanced sections but overall it was okay.", date: "3 weeks ago" },
    { id: 5, name: "Emma Wilson", rating: 4, comment: "Good course with helpful resources. The community support was fantastic and the Q&A section had answers to all my questions.", date: "1 month ago" },
    { id: 6, name: "Michael Taylor", rating: 5, comment: "Absolutely worth every penny! Transformed my skills and helped me land a new job. Can't recommend enough!", date: "1 month ago" },
    { id: 7, name: "Sophia Martinez", rating: 2, comment: "Expected more advanced content. The beginner sections were good but the course didn't deliver on the advanced topics as promised.", date: "2 months ago" },
    { id: 8, name: "James Anderson", rating: 4, comment: "Well-structured content with practical exercises. The instructor was engaging and knowledgeable throughout.", date: "2 months ago" },
  ];

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredReviews = allReviews.filter(review => {
    if (filter === "all") return true;
    return review.rating === parseInt(filter);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "newest") return b.id - a.id;
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return 0;
  });

  const filters = [
    { label: "All", value: "all" },
    { label: "5 Stars", value: "5" },
    { label: "4 Stars", value: "4" },
    { label: "3 Stars", value: "3" },
    { label: "2 Stars", value: "2" },
    { label: "1 Star", value: "1" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            ⭐ Student Reviews
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover what students are saying about this course. {allReviews.length} reviews with an average rating of {
              (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1)
            } out of 5.
          </p>
        </header>

        {/* Rating Summary */}
        <section className="mb-10">
          <RatingSummary reviews={allReviews} />
        </section>

        {/* Filters and Sorting */}
        <section className="mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 md:mb-0">
                <FaFilter className="text-gray-500" />
                <span className="font-medium text-gray-700">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.map(({ label, value }) => (
                  <FilterButton
                    key={value}
                    active={filter === value}
                    onClick={() => setFilter(value)}
                  >
                    {label}
                  </FilterButton>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium"
              >
                Sort by: {sortBy === "newest" ? "Newest" : sortBy === "highest" ? "Highest Rated" : "Lowest Rated"}
                <FaChevronDown className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setShowFilters(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("highest");
                      setShowFilters(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Highest Rated
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("lowest");
                      setShowFilters(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Lowest Rated
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reviews List */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.name}
                rating={review.rating}
                comment={review.comment}
                date={review.date}
              />
            ))}
          </div>
        </section>

        {/* Load More Button (for future implementation) */}
        <div className="mt-12 text-center">
          <button className="px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  );
}