import Pagination from "@/app/component/Pagination";
import { prisma } from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import IssuesAction from "./IssuesAction";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";

// 定义页面 props 的类型：searchParams 是从 URL query 中解析出来的
interface IssuesPageProps {
  searchParams: IssueQuery;
}

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
    ? { [params.orderBy as string]: "asc" }
    : undefined;

  const where = status ? { status } : {}; // 如果 status 存在则添加过滤条件
  const page = parseInt(params.page) || 1; // 获取当前页码，默认第 1 页
  const pageSize = 10; // 每页显示的条数
  // 查询数据库：根据 status 过滤，根据 orderBy 排序
  const issues = await prisma.issue.findMany({
    where, //过滤
    orderBy, //排序
    skip: (page - 1) * pageSize, //跳过前几页
    take: pageSize, //取多少条
  });
  // 获取总条数，用于计算总页数
  const issueCount = await prisma.issue.count({ where });

  return (
    <Flex direction="column" gap="4">
      <IssuesAction />
      <IssueTable searchParams={searchParams} issues={issues} />
      <Pagination
        itemCount={issueCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </Flex>
  );
}
