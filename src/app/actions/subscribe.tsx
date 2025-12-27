"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import axios from "axios";

export async function Subscribe(listID: string) {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (session) {
    const api_link = process.env.MAILMAN_API + `members` || "";

    const data = {
      list_id: listID,
      subscriber: userEmail || "",
      pre_verified: false,
      pre_confirmed: true,
      pre_approved: true,
      send_welcome_message: true,
      display_name: session.user.name || "",
    };

    await axios
      .post(api_link, data, {
        timeout: 2000,
        auth: {
          username: process.env.MAILMAN_USER || "",
          password: process.env.MAILMAN_PASS || "",
        },
      })
      .then((response) => {
        if (response.status === 201) {
          console.log(userEmail + " Subscribed successfully " + listID);
        }
      })
      .catch((error) => {
        console.error(
          "SUBSCRIBE ERROR:",
          error.response?.data || error.message
        );
        return { status: "error" };
      });
  }
  return { status: "success" };
}

export async function Unsubscribe(listID: string) {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (session) {
    const memberID = await prisma.member.findFirst({
      where: {
        list_id: listID,
        address: { email: userEmail },
      },
    });
    const api_link =
      process.env.MAILMAN_API + `members/${memberID?.member_id}` || "";

    await axios
      .delete(api_link, {
        timeout: 2000,
        auth: {
          username: process.env.MAILMAN_USER || "",
          password: process.env.MAILMAN_PASS || "",
        },
      })
      .then((response) => {
        if (response.status === 201) {
          console.log(userEmail + " Unsubscribed successfully " + listID);
        }
      })
      .catch((error) => {
        console.error(
          "UNSUBSCRIBE ERROR:",
          error.response?.data || error.message
        );
        return { status: "error" };
      });
  }
  return { status: "success" };
}
