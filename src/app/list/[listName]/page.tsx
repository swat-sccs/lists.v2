//list/[listName]/page.tsx

import { getMailList } from "@/app/actions/getMailList";
import ListInfo from "@/app/components/ListInfo";
import { Card } from "@heroui/card";
export default async function List({
  params,
}: {
  params: Promise<{ listName: string }>;
}) {
  const { listName } = await params;
  const listData = await getMailList(listName);

  return (
    <div className="flex flex-col gap-4 h-full ">
      {listData ? (
        <ListInfo mailingListInfo={listData} />
      ) : (
        <Card>No Data</Card>
      )}
    </div>
  );
}
