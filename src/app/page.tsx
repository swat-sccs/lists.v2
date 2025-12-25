import { MailList } from "./components/MailList";
import { MailListPagination } from "./components/MailListPagination";
import { getMailLists } from "./actions/getMailLists";
import { Suspense } from "react";
import { Skeleton } from "@heroui/skeleton";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

type SearchParams = Promise<{ page?: string }>;
type getMailingListsResponse = {
  totalSize: number;
  mailingLists: Array<any>;
};

const ITEMS_PER_PAGE = 10;

async function MailListLoader({ page }: { page: number }) {
  const mailingLists: getMailingListsResponse = await getMailLists(page);
  return <MailList mailingLists={mailingLists.mailingLists} />;
}

async function getTotalPages() {
  const data = await getMailLists(1);
  return Math.ceil(data.totalSize / ITEMS_PER_PAGE);
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const totalPages = await getTotalPages();

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="grid grid-cols-5 grid-rows-1 w-full flex-col pl-5 bg-white dark:bg-black min-h-screen">
        <div className="col-span-1 py-5">
          <SideBar />
        </div>

        <div className="col-span-4 h-[60vh]">
          <div className=" p-5 ">
            <Header title="All Lists" />
          </div>
          <Suspense
            key={currentPage}
            fallback={
              <div className="flex flex-col gap-4 h-[60vh] p-5 mt-30">
                <Skeleton className="h-32 rounded-lg bg-default-300"></Skeleton>
                <Skeleton className="h-32 rounded-lg bg-default-300"></Skeleton>
                <Skeleton className="h-32 rounded-lg bg-default-300"></Skeleton>
                <Skeleton className="h-32 rounded-lg bg-default-300"></Skeleton>
                <Skeleton className="h-32 rounded-lg bg-default-300"></Skeleton>
              </div>
            }
          >
            {/* TODO: REMOVE MT to leave space for filters and search*/}
            <div className="h-[60vh] mt-30">
              <MailListLoader page={currentPage} />
            </div>
          </Suspense>
          <MailListPagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </main>
    </div>
  );
}
