import { MailList } from "@/app/components/MailList";
import { MailListPagination } from "@/app/components/MailListPagination";
import { getMailLists, getUserLists } from "@/app/actions/getMailLists";
import { searchMailLists, getUserListIds } from "@/app/actions/searchMailLists";
import { Suspense } from "react";
import { Spinner } from "@heroui/spinner";
import Search from "@/app/components/Search";
import { MailingList, MailmanMember, UserData } from "@/app/types/types";

type SearchParams = Promise<{
  page?: string;
  filter?: string;
  search?: string;
}>;
interface getMailingListsResponse {
  totalSize?: number;
  mailingLists: MailingList[];
  totalPages: number;
  counts?: { owner: number; moderator: number; member: number; total: number };
}
const ITEMS_PER_PAGE = 10;

async function fetchData({
  search,
  filter,
}: {
  search?: string;
  filter?: string;
}) {
  let mailingLists: getMailingListsResponse;

  mailingLists = await searchMailLists(search, filter);
  return mailingLists;
}

async function loadMailmanUserData() {
  let data: any = await getUserLists();
  const listIDs = await getUserListIds();

  data["listsIDs"] = listIDs;

  return data;
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, filter, search } = await searchParams;
  const currentPage = Number(page) || 1;
  const userData: UserData = await loadMailmanUserData();
  const mailingLists = await fetchData({ search, filter });

  const totalLists = mailingLists.totalSize || 0;
  const totalPages = mailingLists.totalPages || 0;

  return (
    <div className="flex flex-col h-full">
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
        <MailList
          mailingLists={mailingLists.mailingLists}
          userData={userData}
        />
      </Suspense>
      <MailListPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
