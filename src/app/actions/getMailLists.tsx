import axios from "axios";
import { MailingList } from "@/app/types/types";

export async function getMailLists(page: number = 1) {
  let filtered_output: Array<MailingList> = [];
  const api_link =
    process.env.MAILMAN_OLD_API + `lists?count=10&page=${page}` || ""; //Pagination if necessary
  const data = {};
  let totalSize = 0;

  await axios
    .get(api_link, {
      params: data,
      timeout: 2000,
      auth: {
        username: process.env.MAILMAN_USER || "",
        password: process.env.MAILMAN_OLD_PASS || "",
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
