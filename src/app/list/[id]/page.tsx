import axios from "axios";
import { Member } from "@/app/types/types";
import { Card, CardBody } from "@heroui/card";

export default async function ListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <Card className="m-5 h-full">{id}</Card>;
}
