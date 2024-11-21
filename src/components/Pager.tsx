import React from 'react';

interface PagerProps {
  totalEntries: number;
  entriesPerPage: number;
  currentPage: number;
  onEntriesPerPageChange: (entriesPerPage: number) => void;
  onPageChange: (page: number) => void;
}

const Pager: React.FC<PagerProps> = ({
  totalEntries,
  entriesPerPage,
  currentPage,
  onEntriesPerPageChange,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  return (
    <div className="pager">
      <div>
        <label>
          Entries per page:
          <select
            value={entriesPerPage}
            onChange={(e) => onEntriesPerPageChange(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pager;