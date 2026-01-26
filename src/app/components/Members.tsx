//components/Members.tsx
"use client";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import type { mailinglist, member } from "@/generated/prisma/client";
import { Divider } from "@heroui/divider";

export default function Members({ members }: { members: member[] | null }) {
  return <Card className="p-4 h-full ">{members && <></>}</Card>;
}
