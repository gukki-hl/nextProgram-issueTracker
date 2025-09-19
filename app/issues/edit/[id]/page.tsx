import React, { cache } from "react";
import IssueForm from "../../_compoent/issueForm";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

// 使用 cache 优化数据获取
const fetchIssue = cache((issueId: number) =>
  prisma.issue.findUnique({
    where: { id: issueId },
  })
);
const EditIssuePage = async ({ params }: Props) => {
  const { id } = await params;
  // 查询 issue 数据
  const issue = await fetchIssue(parseInt(id));
  // 如果 issue 不存在，返回 404
  if (!issue) notFound();
  return <IssueForm issue={issue} />;
};

export default EditIssuePage;
