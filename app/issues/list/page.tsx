import { prisma } from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/component";
import IssuesAction from "./IssuesAction";
import { Issue, Status } from "@prisma/client";
import NextLink from "next/link";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "@/app/component/Pagination";

// 定义页面 props 的类型：searchParams 是从 URL query 中解析出来的
interface IssuesPageProps {
  searchParams: { status: Status; orderBy?: keyof Issue; page: string };
}

const columns: { label: string; value: keyof Issue; className?: string }[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  { label: "Create", value: "createdAt", className: "hidden md:table-cell" },
];

export default async function IssuesPage({ searchParams }: IssuesPageProps) {
  const params = await searchParams;
  const statuses = Object.values(Status); //获取 Status 枚举值
  // 判断 URL 里的 status 是否是合法的枚举值，如果不是就置为 undefined
  const status = statuses.includes(params.status as Status)
    ? (params.status as Status)
    : undefined;
  // 检查传入的 orderBy 是否在 columns 中存在，如果合法则构造 Prisma 所需的排序对象
  // { [params.orderBy]: "asc" } => 比如 { createdAt: "asc" }
  const orderBy = columns
    .map((c) => c.value)
    .includes(params.orderBy as keyof Issue)
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
    <div>
      <IssuesAction />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className}
              >
                <NextLink
                  href={{ query: { ...params, orderBy: column.value } }}
                >
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
      <Pagination
        itemCount={issueCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
}
