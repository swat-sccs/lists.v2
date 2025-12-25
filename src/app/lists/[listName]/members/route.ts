import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Member } from "@/app/types/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listName: string }> }
) {
  const { listName } = await params;

  const filtered_output: Array<Member> = [];
  const api_link =
    process.env.MAILMAN_API + "lists/" + listName + "/roster/member" || ""; //Pagination if necessary
  const data = {};

  console.log(api_link)
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
            filtered_output.push(list);
        }
      }
    });

  return NextResponse.json(filtered_output, { status: 200 });
}


