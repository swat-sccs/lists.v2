import { MailList } from "./components/MailList";
import { MailListPagination } from "./components/MailListPagination";
import {
  getMailLists,
  getMailListsByUser,
  getUserLists,
} from "./actions/getMailLists";
import { Suspense } from "react";
import { Spinner } from "@heroui/spinner";
import Search from "./components/Search";
import { MailingList, MailmanMember } from "./types/types";

type SearchParams = Promise<{
  page?: string;
  filter?: string;
  search?: string;
}>;
interface getMailingListsResponse {
  totalSize?: number;
  mailingLists: MailingList[];
  counts?: { owner: number; moderator: number; member: number; total: number };
}

const ITEMS_PER_PAGE = 10;

async function MailListLoader({
  page,
  filter,
  search,
}: {
  page: number;
  filter?: string;
  search?: string;
}) {
  let mailingLists: getMailingListsResponse;
  mailingLists = await getMailLists(page, search);

  if (!filter || filter == "all") {
    mailingLists = await getMailLists(page, search);
  } else {
    let userLists = await getMailListsByUser(filter, search);
    if (userLists) {
      mailingLists = userLists;
    }
  }

  return <MailList mailingLists={mailingLists.mailingLists} />;
}

async function getTotalPages() {
  const data = await getMailLists(1);
  return Math.ceil(data.totalSize / ITEMS_PER_PAGE);
}

async function getTotalLists() {
  const data = await getMailLists(1);
  return data.totalSize;
}

type userData = {
  counts: { owner: number; moderator: number; member: number; total: number };
  mailingLists: MailmanMember[];
};
async function loadUserData() {
  const data: userData = await getUserLists();
  return data;
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, filter, search } = await searchParams;
  const currentPage = Number(page) || 1;
  const totalPages = await getTotalPages();
  const userData: userData = await loadUserData();
  const totalLists = await getTotalLists();

  return (
    <div className="">
      <Search userData={userData} totalPageCount={totalLists} />

      <Suspense
        key={`${currentPage}-${filter}-${search}`}
        fallback={
          <div className="flex flex-col gap-4 h-[60vh] p-5">
            <div className="flex items-center justify-center gap-3 py-4">
              <Spinner color="primary" size="lg" />
              <span className="text-gray-500">Loading mailing lists...</span>
            </div>
          </div>
        }
      >
        <div className="h-[60vh] ">
          <MailListLoader page={currentPage} filter={filter} search={search} />
        </div>
      </Suspense>
      <MailListPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
