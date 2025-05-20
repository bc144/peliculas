interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const maxPages = Math.min(totalPages, 500); // TMDb API limit
  
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(maxPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }

    if (currentPage - delta > 2) {
      pages.unshift('...');
    }
    if (currentPage + delta < maxPages - 1) {
      pages.push('...');
    }

    pages.unshift(1);
    if (maxPages !== 1) {
      pages.push(maxPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-gray-800 transition-colors"
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
          className={`px-4 py-2 rounded-md transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          } ${page === '...' ? 'cursor-default' : ''}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPages}
        className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-gray-800 transition-colors"
      >
        Next
      </button>
    </div>
  );
} 