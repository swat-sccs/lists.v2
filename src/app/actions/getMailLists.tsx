import axios from "axios";
import { MailingList, MailmanMember } from "@/app/types/types";
import { auth } from "@/app/lib/auth";


export async function getMailListsByUser(role: string) {
  const session = await auth();

  if (session) {
    let filtered_output: Array<MailingList> = [];
    const api_link = process.env.MAILMAN_API + `lists/find` || ""; //Pagination if necessary

    let data = { subscriber: session.user.email, role: role };
    let totalSize = 0;

    await axios
      .get(api_link, {
        params: data,
        timeout: 2000,
        auth: {
          username: process.env.MAILMAN_USER || "",
          password: process.env.MAILMAN_PASS || "",
        },
      })
      .then((response) => {
        if (response.data) {
          totalSize = response.data.total_size;
          for (const list of response.data.entries) {
            filtered_output.push(list);
          }
        }
      })
      .catch((error) => {
        console.error("getMailList ERROR:", error);
        return [];
      });

    return { totalSize: totalSize, mailingLists: filtered_output };
  }
}

export async function getMailLists(page: number = 1, search?: string) {
  let filtered_output: Array<MailingList> = [];
  const api_link =
    process.env.MAILMAN_API + `lists?count=10&page=${page}&advertised=true` ||
    ""; //Pagination if necessary

  let data = {};
  let totalSize = 0;

  await axios
    .get(api_link, {
      params: data,
      timeout: 2000,
      auth: {
        username: process.env.MAILMAN_USER || "",
        password: process.env.MAILMAN_PASS || "",
      },
    })
    .then((response) => {
      if (response.data) {
        totalSize = response.data.total_size;
        for (const list of response.data.entries) {
          filtered_output.push(list);
        }
      }
    })
    .catch((error) => {
      console.error("getMailList ERROR:", error);
      return [];
    });

  return { totalSize: totalSize, mailingLists: filtered_output };
}

/*
  Fetches mailing lists associated with a specific user email.
  Returns an object containing counts of roles and an array of MailmanMember.

*/
export async function getUserLists() {
  const session = await auth();

  if (!session) {
    const MailLists = await getMailLists(1);

    return {
      counts: { owner: 0, moderator: 0, member: 0, total: MailLists.totalSize },
      mailingLists: [],
    };
  }

  let filtered_output: Array<MailmanMember> = [];
  const api_link = process.env.MAILMAN_API + `members/find` || ""; //Pagination if necessary
  let data = { subscriber: session.user.email };

  let counts = { member: 0, owner: 0, moderator: 0, total: 0 };

  await axios
    .get(api_link, {
      params: data,
      timeout: 5000,
      auth: {
        username: process.env.MAILMAN_USER || "",
        password: process.env.MAILMAN_PASS || "",
      },
    })
    .then((response) => {
      if (response.data) {
        counts.total = response.data.total_size;
        for (const list of response.data.entries) {
          filtered_output.push(list);
          if (list.role === "owner") {
            counts.owner += 1;
          } else if (list.role === "moderator") {
            counts.moderator += 1;
          } else if (list.role === "member") {
            counts.member += 1;
          }
        }
      }
    })
    .catch((error) => {
      console.error("getMailList ERROR:", error);
      return [];
    });

  return { counts: counts, mailingLists: filtered_output };
}

export async function getUserListsWithRole(filter?: string) {
  const session = await auth();

  if (!session) {
    const MailLists = await getMailLists(1);

    return {
      counts: { owner: 0, moderator: 0, member: 0, total: MailLists.totalSize },
      mailingLists: [],
    };
  }

  let filtered_output: Array<MailmanMember> = [];
  const api_link = process.env.MAILMAN_API + `members/find` || ""; //Pagination if necessary
  let data = { subscriber: session.user.email, role: "" };
  if (filter == "owner" || filter == "member") {
    data.role = filter;
  }

  let counts = { member: 0, owner: 0, moderator: 0, total: 0 };

  await axios
    .get(api_link, {
      params: data,
      timeout: 5000,
      auth: {
        username: process.env.MAILMAN_USER || "",
        password: process.env.MAILMAN_OLD_PASS || "",
      },
    })
    .then((response) => {
      if (response.data) {
        counts.total = response.data.total_size;
        for (const list of response.data.entries) {
          filtered_output.push(list);
          if (list.role === "owner") {
            counts.owner += 1;
          } else if (list.role === "moderator") {
            counts.moderator += 1;
          } else if (list.role === "member") {
            counts.member += 1;
          }
        }
      }
    })
    .catch((error) => {
      console.error("getMailList ERROR:", error);
      return [];
    });

  return {
    totalSize: counts.owner,
    counts: counts,
    mailingLists: filtered_output,
  };
}
