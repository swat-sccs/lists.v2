// /components/SideBar.tsx
"use client";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import ViewListIcon from "@mui/icons-material/ViewList";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import GetAppIcon from "@mui/icons-material/GetApp";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SortIcon from "@mui/icons-material/Sort";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Switch, Checkbox, CheckboxGroup } from "@heroui/react";
import { Divider } from "@heroui/divider";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

// Define the types for the component's props

export const SideBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isSelected, setIsSelected] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [membershipFilters, setMembershipFilters] = useState<string[]>([]);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
    setIsSelected(theme === "dark");
  }, []);

  return (
    <Card className="min-h-full flex flex-col ">
      <CardBody className="px-5 flex flex-col justify-start items-center gap-6 ">
        <Link href="/" className="text-decoration-none">
          <div className="flex flex-row ">
            <Image
              width={80}
              alt="Lists Logo, an envelope with speed lines to the left of it."
              src="/logos/logo_main.png"
            ></Image>
            <h1 className="text-xl font-bold mt-2 ">Mailing Lists</h1>
          </div>
        </Link>

        <Divider />

        {/* Sorting Section */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SortIcon fontSize="small" />
            <span>Sort</span>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="w-full justify-between">
                {sortOrder === "asc" ? "A → Z" : "Z → A"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort options"
              selectionMode="single"
              selectedKeys={new Set([sortOrder])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as "asc" | "desc";
                if (selected) setSortOrder(selected);
              }}
            >
              <DropdownItem key="asc">Alphabetical (A → Z)</DropdownItem>
              <DropdownItem key="desc">Alphabetical (Z → A)</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <Divider />

        {/* Tags Section */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LocalOfferIcon fontSize="small" />
            <span>Tags</span>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="w-full justify-between">
                {selectedTags.length > 0
                  ? `${selectedTags.length} selected`
                  : "Select tags"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Tag options"
              selectionMode="multiple"
              selectedKeys={new Set(selectedTags)}
              onSelectionChange={(keys) => {
                setSelectedTags(Array.from(keys) as string[]);
              }}
              closeOnSelect={false}
            >
              <DropdownItem key="academic">Academic</DropdownItem>
              <DropdownItem key="sports">Sports</DropdownItem>
              <DropdownItem key="clubs">Clubs</DropdownItem>
              <DropdownItem key="announcements">Announcements</DropdownItem>
              <DropdownItem key="events">Events</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <Divider />

        {/* Membership Filters Section */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FilterListIcon fontSize="small" />
            <span>Membership Type</span>
          </div>
          <CheckboxGroup
            value={membershipFilters}
            onValueChange={setMembershipFilters}
            size="sm"
          >
            <Checkbox value="application">Application Required</Checkbox>
            <Checkbox value="open">Open Membership</Checkbox>
            <Checkbox value="tryout">Tryout Required</Checkbox>
          </CheckboxGroup>
        </div>

        <Divider />

        <Switch
          isSelected={isSelected}
          onValueChange={setIsSelected}
          color="primary"
          size="lg"
          className="px-6 py-3 items-center mt-auto mb-8"
          onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          thumbIcon={({ isSelected, className }) =>
            isSelected ? (
              <DarkModeIcon className={className} />
            ) : (
              <LightModeIcon className={className} />
            )
          }
        ></Switch>
      </CardBody>
    </Card>
  );
};

export default SideBar;
