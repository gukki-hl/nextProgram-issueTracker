"use client";
import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const selectes: { label: string; value?: Status | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Close", value: "CLOSED" },
  { label: "In Progress", value: "IN_PROGRESS" },
];
// 实际的过滤器内容组件
const IssueStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); //获取 URL 查询参数
  const currentStatus = searchParams.get("status") || "ALL"; //获取当前选择的状态，默认 "ALL"
  const handleStatusChange = (status: Status | "ALL") => {
    const params = new URLSearchParams(searchParams.toString()); //创建一个新的 URLSearchParams 对象
    params.set("page", "1"); //状态改变时重置页码为 1
    if (status === "ALL" || !status) {
      params.delete("status"); //如果选择 "ALL"，则删除 status 参数
    } else {
      params.set("status", status); //否则设置新的 status 参数
    }
    if (searchParams.get("orderBy"))
      //保留现有的排序参数（orderBy），如果存在的话
      params.set("orderBy", searchParams.get("orderBy") as string);
    const query = params.size ? `?${params.toString()}` : ""; //仅当有参数时（params.size > 0）才添加 ? 前缀
    router.push("/issues/list" + query); //导航到新的 URL
  };
  return (
    <>
      <Select.Root
        defaultValue={searchParams.get("status") || "ALL"}
        onValueChange={(value) => handleStatusChange( value as Status | "ALL") }
      >
        <Select.Trigger placeholder="Select a status..." />
        <Select.Content>
          {selectes.map((s) => (
            <Select.Item key={s.value} value={s.value || ""}>
              {s.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </>
  );
};

// 用 Suspense 包裹的导出组件
const IssueStatusFilterWithSuspense = () => {
  return (
    <Suspense fallback={<div className="w-[150px] h-9 bg-gray-200 animate-pulse rounded"></div>}>
      <IssueStatusFilter />
    </Suspense>
  );
};

export default IssueStatusFilterWithSuspense;