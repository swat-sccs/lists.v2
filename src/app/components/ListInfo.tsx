//components/ListInfo.tsx
"use client";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import type { mailinglist } from "@/generated/prisma/client";
import { Divider } from "@heroui/divider";
export default function ListInfo({
  mailingListInfo,
}: {
  mailingListInfo: ({ memberCount: number } & mailinglist) | null;
}) {
  console.log(mailingListInfo);
  return (
    <Card className="p-4 h-full text-black dark:text-white">
      <CardHeader className="text-2xl flex flex-row justify-between ">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl text-orange-600">
            {mailingListInfo?.list_name}
          </h1>
          <h3 className="text-sm">
            Owner Contact: {mailingListInfo?.list_name}-owner@
            {mailingListInfo?.mail_host}
          </h3>
        </div>
        <h3 className="text-lg ">
          {" "}
          {` (${mailingListInfo?.memberCount} members)`}
        </h3>
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-col justify-between">
        <div>
          <div className="text-2xl">Description</div>
          <p>{mailingListInfo?.description}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl">List Metrics</h1>
          <p>
            Created:{" "}
            {new Date(mailingListInfo?.created_at ?? "").toLocaleString()}
          </p>
          {mailingListInfo?.last_post_at ? (
            <p>
              Last Post:{" "}
              {new Date(mailingListInfo?.last_post_at ?? "").toLocaleString()}
            </p>
          ) : (
            <p>Last Post: None</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
