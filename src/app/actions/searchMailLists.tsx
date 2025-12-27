import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { MailingList } from "@/app/types/types";
import { auth } from "@/app/lib/auth";

const ITEMS_PER_PAGE = 10;

// Mailman role constants
const ROLE_MEMBER = 1;
const ROLE_OWNER = 2;

// Get list_ids where user has a specific role
async function getUserListIds(email: string, role?: number): Promise<string[]> {
  const memberships = await prisma.member.findMany({
    where: {
      address: { email },
      ...(role !== undefined && { role }),
    },
    select: { list_id: true },
  });

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
}): MailingList {
  return {
    advertised: row.advertised ?? false,
    display_name: row.display_name ?? "",
    fqdn_listname: `${row.list_name}@${row.mail_host}`,
    list_id: row.list_id ?? "",
    list_name: row.list_name ?? "",
    mail_host: row.mail_host ?? "",
    member_count: 0,
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

  const totalCount = await prisma.mailinglist.count({
    where: {
      advertised: true,
    },
  });

  // No search term - use Prisma query builder
  if (!term || term.trim() === "") {
    const whereClause: Prisma.mailinglistWhereInput = {
      advertised: true,
      ...(userListIds && { list_id: { in: userListIds } }),
    };

    const [results] = await Promise.all([
      prisma.mailinglist.findMany({
        where: whereClause,
        take: ITEMS_PER_PAGE,
        orderBy: { list_name: "asc" },
        select: {
          list_name: true,
          mail_host: true,
          list_id: true,
          display_name: true,
          description: true,
          advertised: true,
          volume: true,
        },
      }),
    ]);

    return {
      totalSize: totalCount,
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
      mailingLists: results.map(mapToMailingList),
    };
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
  const [countResult, results] = await Promise.all([
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
      }>
    >`
      SELECT list_name, mail_host, list_id, display_name, description, advertised, volume
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
  return {
    totalSize: totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    mailingLists: results.map(mapToMailingList),
  };
}
