"use server";

import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/app/lib/auth";
import type { mailinglist, member } from "@/generated/prisma/client";

export async function getMembers(id?: string): Promise<member[]> {
  const members = await prisma.member.findMany({
    where: {
      list_id: id,
    },
  });

  return members;
}
