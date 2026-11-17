// /components/Header.tsx
"use client";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import InputIcon from "@mui/icons-material/Input";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useParams, usePathname } from "next/navigation";
import { getMailList } from "../actions/getMailList";
import { useEffect, useState } from "react";

/**
 * A reusable Header component that displays the current list name
 * when on a /list/[listName] page, otherwise shows "All Lists".
 */
// Determine the title based on the current route
const getTitle = async (pathname: string, params: any) => {
  if (pathname?.startsWith("/") && params?.listName) {
    // Decode the list name in case it has URL encoding
    const listData = await getMailList(
      decodeURIComponent(params.listName as string),
    );
    return listData ? listData.display_name : "Mailing List";
  }
  return "All Lists";
};

export const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const params = useParams();
  const [title, setTitle] = useState("");

  useEffect(() => {
    getTitle(pathname, params).then((res) => {
      setTitle(res as string);
    });
  }, [pathname, params]);
  return (
    <Card className="">
      <CardBody className="px-5 pt-2 pb-5 overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <Breadcrumbs
              itemClasses={{ item: "text-inherit", separator: "text-inherit" }}
              separator="/"
            >
              <BreadcrumbItem href="/" key={"home"}>
                home
              </BreadcrumbItem>
              {pathname &&
                pathname
                  ?.split("/")
                  .slice(1)
                  .map((key) => (
                    <BreadcrumbItem key={key}>{key}</BreadcrumbItem>
                  ))}
            </Breadcrumbs>
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>

          <div className="flex flex-col justify-center items-end">
            {status === "authenticated" ? (
              <div className="flex flex-row gap-3 items-center">
                <div className="flex flex-col items-end">
                  <h3 className="text-md semibold">{session?.user.name}</h3>
                  <h3 className="text-xs ">
                    {session.user.role?.toLowerCase() == "admin" ? "Admin" : ""}
                  </h3>
                </div>

                <Dropdown>
                  <DropdownTrigger className="cursor-pointer">
                    <Avatar size="md" name={session?.user.name || ""} />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem key="logout" onPress={() => signOut()}>
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <>
                <Button
                  type="button"
                  variant="flat"
                  color="primary"
                  onPress={() => signIn("keycloak")}
                >
                  <InputIcon /> Log In
                </Button>
              </>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Header;
