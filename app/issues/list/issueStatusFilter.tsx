import { Select } from "@radix-ui/themes";
import React from "react";

const selectes: { label: string; value: string }[] = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Close", value: "CLOSED" },
  { label: "In Progress", value: "IN_PROGRESS" },
];

const IssueStatusFilter = () => {
  return (
    <Select.Root>
      <Select.Trigger placeholder="Select a status..." />
      <Select.Content>
          {selectes.map((s) => (
            <Select.Item key={s.value} value={s.value}>
              {s.label}
            </Select.Item>
          ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssueStatusFilter;
