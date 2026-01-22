// /components/Header.tsx
"use client";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import InputIcon from "@mui/icons-material/Input";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useParams, usePathname } from "next/navigation";

// Define the types for the component's props
type HeaderProps = {
  title: string;
};

/**
 * A reusable Header component.
 * @param {HeaderProps} props - The props for the Header.
 */
export const Header = ({ title }: HeaderProps) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <Card className="dark:text-white text-black">
      <CardBody className="px-5">
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <Breadcrumbs itemClasses={{}} separator="/">
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
            <h1 className="text-3xl font-bold mt-2">{title}</h1>
          </div>

          <div className="flex flex-col justify-center items-end">
            {status === "authenticated" ? (
              <div className="flex flex-row gap-3 items-center">
                <div className="flex flex-col items-end">
                  <h3 className="text-lg semibold">{session?.user.name}</h3>
                  <h3 className="text-xs text-gray-300">
                    {session.user.role?.toLowerCase() == "admin" ? "Admin" : ""}
                  </h3>
                </div>

                <Dropdown>
                  <DropdownTrigger>
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
