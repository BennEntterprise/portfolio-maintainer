import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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

  // Calculate the index of the first and last entry on the current page
  const firstEntry = (currentPage - 1) * entriesPerPage + 1;
  const lastEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  return (
    <div className="pager flex flex-col items-center">
      <div id='page-controls' className="flex justify-evenly items-center w-full">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowLeft />
        </button>
        <div className='flex flex-col justify-center items-center'>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <span>
            Showing {firstEntry} to {lastEntry} of {totalEntries} entries
          </span>
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ArrowRight />
        </button>
      </div>
      {/* <div id='page-size-selector'>
        <label>
          <span>
            Entries per page:
          </span>
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
      </div> */}
    </div>
  );
};

export default Pager;