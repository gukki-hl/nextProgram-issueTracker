import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import React from "react";

//params 是 Next.js 动态路由传递进来的参数
// 比如路径 /issues/123 => params.id = "123"
interface Props {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Props) => {

  //使用prisma查询数据库issue表里的id
  //路径输入的 params.id 是string，用parseInt 转为number
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) }, // 按主键 id 唯一查询
  });
  //如果没找到输入的id路径，触发next.js内置的404页面
  if (!issue) notFound();

  return (
    <div>
      <p>{issue.title}</p>
      <p>{issue.description}</p>
      <p>{issue.status}</p>
      <p>{issue.createdAt.toDateString()}</p>
    </div>
  );
};

export default IssueDetailPage;
