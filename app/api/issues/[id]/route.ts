import { patchIssueSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOption";

// 编辑issue API
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 修改：params 现在是 Promise 类型
) {
  // 获取用户登录会话
  const session = await getServerSession(authOptions);
  // 如果用户未登录，返回 401 未授权
  if (!session) return NextResponse.json({}, { status: 401 });
  
  // 捕获非法 JSON 请求体，防止解析失败报错
  let body;
  try {
    body = await req.json(); // 解析请求体
  } catch (err) {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }
  
  // 修复：await params 解构
  const { id } = await params; // 从路由参数获取 issue id
  
  // 使用 Zod 验证请求数据是否合法
  const validation = patchIssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });
    
  // 解构验证后的数据
  const { title, description, assignedToUserId } = validation.data;
  
  // 如果请求中有指定 assignedToUserId，需要验证该用户是否存在
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId }, // 按 id 查询用户
    });
    if (!user) return NextResponse.json({ error: "用户无效" }, { status: 400 });
  }
  
  // 查询要更新的 issue 是否存在
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });
  if (!issue) return NextResponse.json("此id 不存在", { status: 404 });
  
  // 更新 issue 数据
  const updatedIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      title,
      description,
      assignedToUserId,
    },
  });
  
  // 返回更新后的 issue 数据
  return NextResponse.json(updatedIssue);
}

// 删除issue API
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 修改：params 现在是 Promise 类型
) {
  // 修复：await params 解构
  const { id } = await params; // 从路由参数获取 issue id

  const session = await getServerSession(authOptions);
  // 如果用户没有登录返回登录页
  if (!session) return NextResponse.json({}, { status: 401 });
  
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });
  // 如果问题不存在，返回404错误
  if (!issue) return NextResponse.json("此问题 不存在", { status: 404 });
  
  // 如果存在，使用Prisma删除用户
  await prisma.issue.delete({
    where: { id: issue.id },
  });
  
  return NextResponse.json({});
}