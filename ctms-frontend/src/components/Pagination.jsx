import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
      {/* Info */}
      <p className="text-xs text-gray-500">
        Page <span className="font-semibold text-gray-700">{currentPage}</span>{" "}
        of <span className="font-semibold text-gray-700">{totalPages}</span>
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft size={14} />
          Prev
        </button>

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
