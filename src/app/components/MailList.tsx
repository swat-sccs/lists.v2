// /components/MailList.tsx
"use client";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { MailingList, MailmanMember, UserData } from "../types/types";
import { Button } from "@heroui/button";
import { Subscribe, Unsubscribe } from "../actions/subscribe";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ScrollShadow } from "@heroui/react";

// Define the types for the component's props
type MailListProps = {
  mailingLists: MailingList[];
  userData: UserData;
};

/**
 * A reusable MailList component.
 * @param {MailListProps} props - The props for the MailList.
 */
export const MailList = ({ mailingLists, userData }: MailListProps) => {
  const [loadingListId, setLoadingListId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  async function handleSubscribe(listId: string): Promise<void> {
    setLoadingListId(listId);
    const result = await Subscribe(listId);

    if (result.status === "success" || result.status === "pending") {
      setLoadingListId(null);
      // A pending Mailman confirmation is already an accepted subscription request.
      router.refresh();
    } else {
      setLoadingListId(null);
      alert("Failed to subscribe to the mailing list. Please try again.");
    }
  }
  async function handleUnsubscribe(listId: string): Promise<void> {
    setLoadingListId(listId);
    const result = await Unsubscribe(listId);

    if (result.status == "success") {
      setLoadingListId(null);
      // Optionally, refresh the page or update state to reflect the new subscription
      window.location.reload();
    } else {
      setLoadingListId(null);
      alert("Failed to unsubscribe from the mailing list. Please try again.");
      //TODO: Better error handling UI wise
    }
  }
  return (
    // this outer div thing is ugly; ScrollShadow needs to be in a client side component for some reason
    // ScrollShadow should really be in page.tsx if we can make it work...

    //Taking scrollshadow out for now, didn't realize how awful it looked in light mode
    //TODO: Fix ScrollShadow for light mode with more lists to test with

    //@Nick overflow-x/y was causing ugly shadow clip

    <div className="flex flex-col gap-4 h-full">
      {mailingLists.length > 0 ? (
        mailingLists.map((list) => (
          <Card key={list.list_id} className="min-h-40 cursor-pointer">
            <CardBody
              key={list.list_id}
              onClick={() => router.push(`/list/${list.list_id}`)}
              className="flex flex-row items-center gap-10 p-4"
            >
              <div>
                <Image
                  isBlurred
                  alt="HeroUI Album Cover"
                  className="m-2"
                  src="https://heroui.com/images/album-cover.png"
                  width={100}
                />
              </div>
              <div className="grid grid-rows-2 w-full ">
                <div className="row-span-1 flex flex-row justify-between items-center ">
                  <div className="flex flex-row gap-4 items-center">
                    <h3 className="text-lg font-semibold text-inherit">
                      {list.display_name}
                    </h3>

                    <span className="text-xs text-inherit">
                      {list.member_count} members
                    </span>
                  </div>

                  <div className="flex flex-row gap-10">
                    {/*
                        <Switch defaultSelected>
                          <p className="text-sm">Recieve Emails</p>
                        </Switch>
                        */}
                    {status === "authenticated" ? (
                      searchParams.get("filter") != "owner" ? (
                        userData.listsIDs.includes(list.list_id) ? (
                          <Button
                            color="secondary"
                            isLoading={loadingListId === list.list_id}
                            onPress={(e) => {
                              handleUnsubscribe(list.list_id);
                            }}
                          >
                            Unsubscribe
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            isLoading={loadingListId === list.list_id}
                            onPress={() => handleSubscribe(list.list_id)}
                          >
                            Subscribe
                          </Button>
                        )
                      ) : (
                        <>
                          <Button>Manage</Button>
                        </>
                      )
                    ) : null}
                  </div>
                </div>

                <p className="text-orange-600 text-sm">{list.fqdn_listname}</p>

                <div>
                  <p className="text-sm max-h-10 text-ellipsis line-clamp-2">
                    {list.description}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))
      ) : (
        <Card className="p-4 hover:scale-102 transition-all duration-150">
          <CardBody className="flex flex-row justify-center">
            <h1 className="">
              Oh no! We couldn't find any mailing lists at this time. Please
              check back later.
            </h1>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default MailList;
