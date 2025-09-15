import { IssueStatusBadge } from "@/app/component";
import { Issue } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import NextLink from "next/link";

export interface IssueQuery {
  status: string;
  orderBy?: keyof Issue;
  page: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: Issue[];
}

const IssueTable = async ({ searchParams, issues }: Props) => {
  const params = await searchParams;
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <NextLink href={{ query: { ...params, orderBy: column.value } }}>
                {column.label}
              </NextLink>
              {column.value === params.orderBy && (
                <ArrowUpIcon className="inline" />
              )}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {issues.map((i) => (
          <Table.Row key={i.id}>
            <Table.Cell>
              <Link href={`/issues/${i.id}`}>{i.title}</Link>
              <div className="block md:hidden">
                <IssueStatusBadge status={i.status} />
              </div>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <IssueStatusBadge status={i.status} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {i.createdAt.toDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof Issue;
  className?: string;
}[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  { label: "Create", value: "createdAt", className: "hidden md:table-cell" },
];

export const columnNames = columns.map((c) => c.value);

export default IssueTable;
