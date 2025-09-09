import { IssueSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

//编辑issue API
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { id } = await params;
  const validation = IssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issue) return NextResponse.json("此id 不存在", { status: 404 });

  const updataIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(updataIssue);
}

//删除issue API
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  //如果问题不存在，返回404错误
  if (!issue) return NextResponse.json("此问题 不存在", { status: 404 });
  //如果存在，使用Prisma删除用户
  await prisma.issue.delete({
    where: { id: issue.id },
  });
  return NextResponse.json({});
}
