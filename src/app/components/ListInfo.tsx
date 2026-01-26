//components/ListInfo.tsx
"use client";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import type { mailinglist } from "@/generated/prisma/client";
import { Divider } from "@heroui/divider";
import { useEffect, useState } from "react";

export default function ListInfo({
  mailingListInfo,
}: {
  mailingListInfo: ({ memberCount: number } & mailinglist) | null;
}) {
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [lastPostAt, setLastPostAt] = useState<string | null>(null);

  // Format dates on client side only to avoid hydration mismatch
  useEffect(() => {
    if (mailingListInfo?.created_at) {
      setCreatedAt(new Date(mailingListInfo.created_at).toLocaleString());
    }
    if (mailingListInfo?.last_post_at) {
      setLastPostAt(new Date(mailingListInfo.last_post_at).toLocaleString());
    }
  }, [mailingListInfo?.created_at, mailingListInfo?.last_post_at]);

  return (
    <Card className="p-4 h-full text-black dark:text-white">
      <CardHeader className="text-2xl flex flex-row justify-between ">
        <div className="flex flex-col gap-2">
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
          <p>Created: {createdAt ?? ""}</p>
          {mailingListInfo?.last_post_at ? (
            <p>Last Post: {lastPostAt ?? ""}</p>
          ) : (
            <p>Last Post: None</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
