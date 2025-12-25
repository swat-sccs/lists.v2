// /components/MailListPagination.tsx
"use client";
import { Pagination } from "@heroui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

type MailListPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export const MailListPagination = ({
  currentPage,
  totalPages,
}: MailListPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-row gap-5 align-bottom justify-center mt-10 w-full">
      <Pagination
        color="primary"
        page={currentPage}
        total={totalPages}
        onChange={handlePageChange}
        showControls
      />
    </div>
  );
};

export default MailListPagination;
