// 从 Prisma 的类型定义中导入 Status（通常是 Prisma schema 中的枚举）
import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

// 创建 status 映射表：键为 Status（"OPEN" | "IN_PROGRESS" | "CLOSED"）
// 值为包含文案 label 与配色 color 的对象；color 被限制为 "red" | "violet" | "green"
// 使用 Record 可在编译期强制覆盖所有 Status 枚举值，避免漏配
const statusMap: Record<
  Status,
  { label: string; color: "red" | "violet" | "green" }
> = {
  OPEN: { label: "Open", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "violet" },
  CLOSED: { label: "Closed", color: "green" },
};
// 声明一个展示组件：接收一个 props —— status，类型为 Status
const IssueStatusBadge = ({ status }: { status: Status }) => {
  return (
    <div>
      {/* 
        使用 Radix 的 Badge 展示状态：
        - color 从映射中按当前 status 取出，如 statusMap["OPEN"].color
        - 文案同样从映射中取 label
        这样能保证文案与颜色始终与状态绑定，避免 if/else 分散逻辑
      */}
      <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
    </div>
  );
};
// 默认导出组件，供其他页面/组件引入使用
export default IssueStatusBadge;
