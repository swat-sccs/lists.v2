"use server";

import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { MailingList } from "@/app/types/types";
import { auth } from "@/app/lib/auth";

const ITEMS_PER_PAGE = 10;

// Mailman role constants
const ROLE_MEMBER = 1;
const ROLE_OWNER = 2;

// Get list_ids where user has a specific role
export async function getUserListIds(
  email?: string,
  role?: number
): Promise<string[]> {
  const session = await auth();
  if (!session) return [];
  const userEmail = session?.user?.email;
  let memberships;
  try {
    memberships = await prisma.member.findMany({
      where: {
        address: { email: email ? email : userEmail },
        ...(role !== undefined ? { role } : { role: ROLE_MEMBER }),
      },
      select: { list_id: true },
    });
  } catch (error) {
    console.error("getUserListIds ERROR:", error);
    return [];
  }

  return memberships
    .map((m) => m.list_id)
    .filter((id): id is string => id !== null);
}

// Helper to map database row to MailingList type
function mapToMailingList(row: {
  advertised: boolean | null;
  display_name: string | null;
  list_name: string | null;
  mail_host: string | null;
  list_id: string | null;
  volume: number | null;
  description: string | null;
  member_count?: number | bigint | null;
}): MailingList {
  return {
    advertised: row.advertised ?? false,
    display_name: row.display_name ?? "",
    fqdn_listname: `${row.list_name}@${row.mail_host}`,
    list_id: row.list_id ?? "",
    list_name: row.list_name ?? "",
    mail_host: row.mail_host ?? "",
    member_count: Number(row.member_count ?? 0),
    volume: row.volume ?? 0,
    description: row.description ?? "",
    self_link: "",
    http_etag: "",
  };
}

export async function searchMailLists(
  term?: string,
  filter?: string
): Promise<{
  totalSize: number;
  totalPages: number;
  mailingLists: MailingList[];
}> {
  const session = await auth();

  const userEmail = session?.user?.email;

  // Determine role filter based on filter prop
  let userListIds: string[] | null = null;
  if (userEmail && filter && filter !== "all") {
    const role =
      filter === "owner"
        ? ROLE_OWNER
        : filter === "member"
          ? ROLE_MEMBER
          : undefined;
    if (role !== undefined) {
      userListIds = await getUserListIds(userEmail, role);
      if (userListIds.length === 0) {
        return { totalSize: 0, totalPages: 0, mailingLists: [] };
      }
    }
  }
  let totalCount;
  try {
    totalCount = await prisma.mailinglist.count({
      where: {
        advertised: true,
      },
    });
  } catch (error) {
    totalCount = 0;
  }

  // No search term - use raw SQL to include member_count
  try {
    if (!term || term.trim() === "") {
      const listIdFilter = userListIds
        ? Prisma.sql`AND list_id = ANY(${userListIds}::text[])`
        : Prisma.empty;

      const results = await prisma.$queryRaw<
        Array<{
          list_name: string | null;
          mail_host: string | null;
          list_id: string | null;
          display_name: string | null;
          description: string | null;
          advertised: boolean | null;
          volume: number | null;
          member_count: bigint;
        }>
      >`
      SELECT 
        list_name, mail_host, list_id, display_name, description, advertised, volume,
        (SELECT COUNT(*) FROM member WHERE member.list_id = mailinglist.list_id) as member_count
      FROM mailinglist
      WHERE advertised = true
        ${listIdFilter}
      ORDER BY list_name ASC
      LIMIT ${ITEMS_PER_PAGE}
    `;

      return {
        totalSize: totalCount,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
        mailingLists: results.map(mapToMailingList),
      };
    }
  } catch (error) {
    console.error("searchMailLists ERROR:", error);
    return { totalSize: 0, totalPages: 0, mailingLists: [] };
  }

  // Format search term for PostgreSQL full-text search
  const formattedTerm = term
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => `${word}:*`)
    .join(" & ");

  if (!formattedTerm) {
    return { totalSize: 0, totalPages: 0, mailingLists: [] };
  }

  // Build dynamic SQL filter for list_ids
  const listIdFilter = userListIds
    ? Prisma.sql`AND list_id = ANY(${userListIds}::text[])`
    : Prisma.empty;

  // Run count and search queries in parallel
  let countResult, results;
  try {
    [countResult, results] = await Promise.all([
      prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM mailinglist
      WHERE advertised = true
        ${listIdFilter}
        AND to_tsvector('english', COALESCE(list_name, '') || ' ' || COALESCE(display_name, '') || ' ' || COALESCE(description, ''))
            @@ to_tsquery('english', ${formattedTerm})
    `,
      prisma.$queryRaw<
        Array<{
          list_name: string | null;
          mail_host: string | null;
          list_id: string | null;
          display_name: string | null;
          description: string | null;
          advertised: boolean | null;
          volume: number | null;
          member_count: bigint;
        }>
      >`
      SELECT 
        list_name, mail_host, list_id, display_name, description, advertised, volume,
        (SELECT COUNT(*) FROM member WHERE member.list_id = mailinglist.list_id) as member_count
      FROM mailinglist
      WHERE advertised = true
        ${listIdFilter}
        AND to_tsvector('english', COALESCE(list_name, '') || ' ' || COALESCE(display_name, '') || ' ' || COALESCE(description, ''))
            @@ to_tsquery('english', ${formattedTerm})
      ORDER BY ts_rank(
        to_tsvector('english', COALESCE(list_name, '') || ' ' || COALESCE(display_name, '') || ' ' || COALESCE(description, '')),
        to_tsquery('english', ${formattedTerm})
      ) DESC
      LIMIT ${ITEMS_PER_PAGE}
    `,
    ]);
  } catch (error) {
    console.error("searchMailLists ERROR:", error);
    return { totalSize: 0, totalPages: 0, mailingLists: [] };
  }
  return {
    totalSize: totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    mailingLists: results.map(mapToMailingList),
  };
}
