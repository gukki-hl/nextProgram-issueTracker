import { Status } from "@prisma/client";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

interface Props {
  openIssues: number;
  closedIssues: number;
  inProgressIssues: number;
}

const IssueSummary = ({
  openIssues,
  closedIssues,
  inProgressIssues,
}: Props) => {
  const container: { label: string; value: number; status: Status }[] = [
    { label: "Open Issues", value: openIssues, status: "OPEN" },
    {
      label: "In-progress Issues",
      value: inProgressIssues,
      status: "IN_PROGRESS",
    },
    { label: "Close Issues", value: closedIssues, status: "CLOSED" },
  ];
  return (
    <Flex gap="4">
      {container.map((item) => (
        <Card key={item.label}>
          <Flex direction={"column"} gap={"1"}>
            <Link
              className="text-sm font-medium"
              href={`/issues/list?status=${item.status}`}
            >
              {item.label}
            </Link>
            <Text size="5" className="font-bold">
              {item.value}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;
