"use client";

import ReactPaginate from "react-paginate";

const Pagination = ({
  pageCount,
  onPageChange,
  pageNumber,
}: {
  pageCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  pageNumber: number;
}) => {
  const handlePageClick = (selectedItem: { selected: number }) => {
    const selectedPage = selectedItem.selected + 1;
    onPageChange(selectedPage);
  };

  return (
    <div className="flex items-center ">
      <ReactPaginate
        breakLabel="..."
        previousLabel="←"
        nextLabel="→"
        onPageChange={handlePageClick}
        pageRangeDisplayed={window.innerWidth > 640 ? 3 : 2}
        marginPagesDisplayed={window.innerWidth > 640 ? 1 : 1}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        forcePage={pageNumber - 1}
        previousLinkClassName="text-[#46484F] mr-1.5 md:mr-2 px-2 2xs:px-2.5 md:px-3 py-1.5 xs:py-2 md:py-2.5 text-center rounded sm:rounded-md bg-[#F9F9F9] dark:bg-[#141414] border border-[#46484F] text-[#46484F]"
        nextLinkClassName="text-[#46484F] ml-1.5 md:ml-2 px-2 2xs:px-2.5 md:px-3 py-1.5 xs:py-2 md:py-2.5 text-center rounded sm:rounded-md bg-[#F9F9F9] dark:bg-[#141414] border border-[#46484F] text-[#46484F]"
        pageLinkClassName="px-3 md:px-4 py-1.5 xs:py-2 md:py-2.5 rounded-md bg-[#F9F9F9] dark:bg-[#141414] border border-[#46484F] text-[#46484F]"
        activeLinkClassName="border border-[#D4B139] rounded-md text-[#D4B139]"
        disabledLinkClassName="border rounded-md"
        className="flex items-center gap-0.5 2xs:gap-1 text-center text-xs 2xs:text-sm "
      />
    </div>
  );
};

export default Pagination;
