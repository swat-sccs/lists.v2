// /components/MailList.tsx
"use client";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { MailingList } from "../types/types";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";

// Define the types for the component's props
type MailListProps = {
  mailingLists: MailingList[];
};

/**
 * A reusable MailList component.
 * @param {MailListProps} props - The props for the MailList.
 */
export const MailList = ({ mailingLists }: MailListProps) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <ScrollShadow className="w-full h-full">
        <div className="px-5 overflow-y-scroll flex flex-col gap-4">
          {mailingLists.length > 0 ? (
            mailingLists.map((list) => (
              <Card
                key={list.list_id}
                className="p-4 hover:scale-102 transition-all duration-150 min-h-40"
              >
                <CardBody className="flex flex-row items-center gap-10 max-h-32 overflow-y-clip ">
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
                        <h3 className="text-lg font-semibold">
                          {list.display_name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {list.member_count} members
                        </span>
                      </div>
                      <div className="flex flex-row gap-10">
                        <Switch defaultSelected>
                          <p className="text-sm">Recieve Emails</p>
                        </Switch>
                        <Button color="primary">Subscribe</Button>
                      </div>
                    </div>
                    <p className="text-orange-600 text-sm">
                      {list.display_name}@{list.mail_host}
                    </p>
                    <div>
                      <p className="text-sm text-gray-300 max-h-10 overflow-y-clip text-ellipsis line-clamp-2">
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
      </ScrollShadow>
    </div>
  );
};

export default MailList;
