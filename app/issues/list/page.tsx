import Pagination from "@/app/component/Pagination";
import { prisma } from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import IssuesAction from "./IssuesAction";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { cache } from "react";

// 定义页面 props 的类型：searchParams 是从 URL query 中解析出来的
interface IssuesPageProps {
  searchParams: Promise<IssueQuery>
}

//使用cache优化数据获取
const fetchIssues = cache(
  async (
    query: IssueQuery,
    status: Status | undefined,
    orderBy: { [key: string]: "asc" } | undefined
  ) => {
    const page = parseInt(query.page) || 1; // 获取当前页码，默认第 1 页
    const pageSize = 10; // 每页显示的条数
    const where = status ? { status } : {}; // 如果 status 存在则添加过滤条件
    // 查询数据库：根据 status 过滤，根据 orderBy 排序
    const issues = await prisma.issue.findMany({
      where, //过滤
      orderBy, //排序
      skip: (page - 1) * pageSize, //跳过前几页
      take: pageSize, //取多少条
    });
    // 获取总条数，用于计算总页数
    const issueCount = await prisma.issue.count({ where });

    return { issues, issueCount };
  }
);

export default async function IssuesPage({ searchParams }: IssuesPageProps) {
  const params = await searchParams;
  const statuses = Object.values(Status); //获取 Status 枚举值

  // 判断 URL 里的 status 是否是合法的枚举值，如果不是就置为 undefined
  const status = statuses.includes(params.status as Status)
    ? (params.status as Status)
    : undefined;

  // 检查传入的 orderBy 是否在 columns 中存在，如果合法则构造 Prisma 所需的排序对象
  // { [params.orderBy]: "asc" } => 比如 { createdAt: "asc" }
  const orderBy = columnNames.includes(params.orderBy as keyof Issue)
    ? { [params.orderBy as keyof Issue]: "asc" as const }
    : undefined;

  // 查询数据库：根据 status 过滤，根据 orderBy 排序
  const { issues, issueCount } = await fetchIssues(params, status, orderBy);
  const page = parseInt(params.page) || 1;
  const pageSize = 10;

  return (
    <Flex direction="column" gap="4">
      <IssuesAction />
      <IssueTable searchParams={params} issues={issues} />
      <Pagination
        itemCount={issueCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </Flex>
  );
}

export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "view all of project issues on the dashboard",
};
