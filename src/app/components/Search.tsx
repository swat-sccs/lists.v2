// /components/Search.tsx
"use client";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "@heroui/input";
import { Button, ButtonGroup } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { MailmanMember } from "../types/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type userData = {
  counts: { owner: number; moderator: number; member: number; total: number };
  mailingLists: MailmanMember[];
};

// Define the types for the component's props
type SearchProps = {
  userData: userData;
  totalPageCount: number;
};

/**
 * A reusable MailList component.
 * @param {SearchProps} props - The props for the Search component.
 */
export const Search = ({ userData, totalPageCount }: SearchProps) => {
  const { data: session, status } = useSession();
  const [selected, setSelected] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  const handleFilterChange = (filter: string) => {
    setSelected(filter);
    params.set("filter", filter);
    params.set("page", "1"); // Reset to page 1 when filter changes
    router.push(`?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to page 1 when filter changes
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    setSelected(params.get("filter") || "all");
  }, [searchParams]);

  return (
    <Card className="m-5">
      <CardBody className="flex flex-row justify-between items-center gap-5">
        <Tabs
          aria-label="View Options"
          color="primary"
          selectedKey={selected}
          onSelectionChange={(key) => handleFilterChange(key as string)}
        >
          <Tab key="all" title={`All (${totalPageCount})`}></Tab>
          {status == "authenticated" && (
            <>
              <Tab
                key="member"
                title={`Member (${userData.counts.member})`}
              ></Tab>
              <Tab key="owner" title={`Owner (${userData.counts.owner})`}></Tab>
            </>
          )}
        </Tabs>
        <Input
          className="w-96"
          variant="flat"
          label="Search"
          type="text"
          placeholder="Type to search..."
          startContent={<SearchIcon />}
          value={searchValue}
          onValueChange={handleSearchChange}
          isClearable
          onClear={() => handleSearchChange("")}
        />
      </CardBody>
    </Card>
  );
};

export default Search;
