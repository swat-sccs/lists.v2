// /components/SideBar.tsx
"use client";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import ViewListIcon from "@mui/icons-material/ViewList";
import GetAppIcon from "@mui/icons-material/GetApp";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useState } from "react";
import { Button } from "@heroui/button";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";

// Define the types for the component's props

export const SideBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Positions corresponding to top-34, top-52, top-72
  const positions = ["8rem", "12.5rem", "17rem"];

  return (
    <Card className="min-h-full flex flex-col">
      <CardBody className="px-5 flex flex-col justify-start items-center gap-10 ">
        <Card
          className="w-2 bg-orange-400 h-10 absolute left-0 transition-all duration-300 ease-in-out"
          style={{ top: positions[activeIndex] }}
        ></Card>

        <div className="flex flex-row ">
          <Image
            width={80}
            alt="Lists Logo, an envelope with speed lines to the left of it."
            src="/logos/logo_main.png"
          ></Image>
          <h1 className="text-xl font-bold mt-2">Mailing Lists</h1>
        </div>

        <div className="flex flex-col gap-10 mt-10">
          <div className="flex flex-row gap-4 items-center">
            <ViewListIcon className="" fontSize="large" />
            <Link
              color="foreground"
              href="#"
              className="text-2xl font-bold"
              onPress={() => setActiveIndex(0)}
            >
              All Lists
            </Link>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <AdminPanelSettingsIcon className="" fontSize="large" />
            <Link
              color="foreground"
              href="#"
              className="text-2xl font-bold"
              onPress={() => setActiveIndex(1)}
            >
              Owner View
            </Link>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <GetAppIcon className="" fontSize="large" />
            <Link
              color="foreground"
              href="#"
              className="text-2xl font-bold"
              onPress={() => setActiveIndex(2)}
            >
              Migration
            </Link>
          </div>
        </div>
        <Button
          color="primary"
          variant="flat"
          className="px-6 py-3 items-center mt-auto mb-8"
          onPress={() => signOut()}
        >
          <LogoutIcon fontSize="large" />
          Sign Out
        </Button>
      </CardBody>
    </Card>
  );
};

export default SideBar;
