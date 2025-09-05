import { prisma } from "@/prisma/client";
import { Button, Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import IssueStatusBadge from "../component/IssueStatusBadge";
// 定义一个异步组件 IssuesPage（Next.js 13 的 Server Component 支持 async）
const IssuesPage = async () => {
  //使用prisma从数据库中查询issue表里的所有数据
  const issues = await prisma.issue.findMany();
  // 返回渲染的 JSX
  return (
    <div>
      <div className="mb-5">
        {/* 使用 Radix 的 Button 包裹 Next.js 的 Link，点击后跳转到新建 issue 的页面 */}
        <Button>
          <Link href="/issues/new">new issue</Link>
        </Button>
      </div>
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
          {/* 遍历 issues 数据，逐行数据渲染 */}
          {issues.map((i) => (
            <Table.Row key={i.id}>
              <Table.Cell>
                {i.title}
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
};

export default IssuesPage;
