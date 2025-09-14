"use client";
import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

const selectes: { label: string; value?: Status | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Close", value: "CLOSED" },
  { label: "In Progress", value: "IN_PROGRESS" },
];

const IssueStatusFilter = () => {
  const router = useRouter();
  return (
    <>
      <Select.Root
        onValueChange={(status) => {
          router.push(`/issues/list?status=${status}`);
        }}
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
