"use client";
import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";

const selectes: { label: string; value?: Status | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Close", value: "CLOSED" },
  { label: "In Progress", value: "IN_PROGRESS" },
];

const IssueStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); //获取 URL 查询参数

  const handleStatusChange = (status: Status) => {
    const params = new URLSearchParams(); //创建一个新的 URLSearchParams 对象
    if (status) params.append("status", status); //如果有选择状态（status），将其添加到参数中
    if (searchParams.get("orderBy"))
      //保留现有的排序参数（orderBy），如果存在的话
      params.append("orderBy", searchParams.get("orderBy") as string);
    const query = params.size ? `?${params.toString()}` : ""; //仅当有参数时（params.size > 0）才添加 ? 前缀
    router.push("/issues/list" + query); //导航到新的 URL
  };
  return (
    <>
      <Select.Root
        defaultValue={searchParams.get("status") || "ALL"}
        onValueChange={handleStatusChange}
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

export default IssueStatusFilter;
