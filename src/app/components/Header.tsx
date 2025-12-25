// /components/Header.tsx
"use client";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

// Define the types for the component's props
type HeaderProps = {
  title: String;
};

/**
 * A reusable Header component.
 * @param {HeaderProps} props - The props for the Header.
 */
export const Header = ({ title }: HeaderProps) => {
  return (
    <Card>
      <CardBody className="px-5">
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <Breadcrumbs
              itemClasses={{
                separator: "px-2",
              }}
              separator="/"
            >
              <BreadcrumbItem>Home</BreadcrumbItem>
              <BreadcrumbItem>All Lists</BreadcrumbItem>
            </Breadcrumbs>
            <h1 className="text-3xl font-bold mt-2">{title}</h1>
          </div>

          <div className="flex flex-col justify-center items-end">
            <div className="flex flex-row gap-3 items-center">
              <div className="flex flex-col items-end">
                <h3 className="text-lg semibold">User Name</h3>
                <h3 className="text-xs text-gray-300">Admin</h3>
              </div>
              <Avatar
                size="md"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Header;
