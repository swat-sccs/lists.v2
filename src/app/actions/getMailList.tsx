"use server";

import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/app/lib/auth";
import type { mailinglist } from "@/generated/prisma/client";

export async function getMailList(
  id?: string
): Promise<{ memberCount: number } & mailinglist> {
  let mailingList = null;

  mailingList = await prisma.mailinglist.findFirst({
    where: {
      list_id: id,
    },
  });

  //count how many members are associated with this list
  const memberCount = await prisma.member.count({
    where: {
      list_id: id,
    },
  });

  return { ...mailingList, memberCount: memberCount } as { memberCount: number } & mailinglist;
}
