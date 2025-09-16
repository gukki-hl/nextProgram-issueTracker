import { prisma } from "@/prisma/client";
import { Table, Flex, Avatar,Card,Heading } from "@radix-ui/themes";
import Link from "next/link";
import { IssueStatusBadge } from "./component";

const Latestissues = async () => {
  const issues = await prisma.issue.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { assignedToUser: true },
  });

  return (
    <Card>
      <Heading size="6" mb="4">
        Latest Issues
      </Heading>
      <Table.Root>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Flex justify="between">
                  <Flex direction="column" align="start" gap="2">
                    <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                    <IssueStatusBadge status={issue.status} />
                  </Flex>
                  {issue.assignedToUser && (
                    <Avatar
                      src={issue.assignedToUser.image!}
                      fallback="?"
                      size={"2"}
                      radius="full"
                    />
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default Latestissues;
