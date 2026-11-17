"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import axios from "axios";

type SubscriptionResult =
  | { status: "success" }
  | { status: "pending" }
  | { status: "error" };

export async function Subscribe(listID: string) {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!session || !userEmail) {
    return { status: "error" } satisfies SubscriptionResult;
  }

  const apiLink = `${process.env.MAILMAN_API ?? ""}members`;
  const data = {
    list_id: listID,
    subscriber: userEmail,
    pre_verified: false,
    pre_confirmed: true,
    pre_approved: true,
    send_welcome_message: true,
    display_name: session.user.name || "",
  };

  try {
    await axios.post(apiLink, data, {
      timeout: 2000,
      auth: {
        username: process.env.MAILMAN_USER || "",
        password: process.env.MAILMAN_PASS || "",
      },
    });
    console.log(`${userEmail} subscribed successfully to ${listID}`);
    return { status: "success" } satisfies SubscriptionResult;
  } catch (error) {
    const responseData = axios.isAxiosError(error) ? error.response?.data : null;
    const detail =
      typeof responseData === "string" ? responseData : JSON.stringify(responseData);

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 409 &&
      detail.includes("Subscription request already pending")
    ) {
      return { status: "pending" } satisfies SubscriptionResult;
    }

    console.error("SUBSCRIBE ERROR:", responseData || error);
    return { status: "error" } satisfies SubscriptionResult;
  }
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
