import { prisma } from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/component";
import IssuesAction from "./IssuesAction";
import { Status } from "@prisma/client";

interface IssuesPageProps {
  searchParams: { status: Status };
}

export default async function IssuesPage({ searchParams }: IssuesPageProps) {
  const params = await searchParams;
  const statuses = Object.values(Status);
  const status = statuses.includes(params.status as Status)
    ? (params.status as Status)
    : undefined;

  const issues = await prisma.issue.findMany({
    where: { status },
  });

  return (
    <div>
      <IssuesAction />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Create
            </Table.ColumnHeaderCell>
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
    </div>
  );
}
