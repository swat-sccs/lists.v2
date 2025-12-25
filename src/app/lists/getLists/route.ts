import { NextResponse } from "next/server";
import axios from "axios";
import { EmailList } from "@/app/types/types";

export async function GET() {
  const filtered_output: Array<EmailList> = [];
  const api_link = process.env.MAILMAN_API + "lists?count=100&page=1" || ""; //Pagination if necessary
  const data = {};
  ///lists/ant@example.com/roster/member
  await axios
    .get(api_link, {
      params: data,
      auth: {
        username: process.env.MAILMAN_USER || "",
        password: process.env.MAILMAN_PASS || "",
      },
    })
    .then((response) => {
      if (response.data) {
        for (const list of response.data.entries) {
          if (list.member_count > 0) {
            filtered_output.push(list);
          }
        }
      }
    });

  return NextResponse.json(filtered_output, { status: 200 });
}
