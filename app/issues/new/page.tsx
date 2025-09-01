"use client";
import React from "react";
import { TextField,TextArea, Button } from "@radix-ui/themes";
// @ts-ignore
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const NewIssuePage = () => {
  return (
    <div className="max-w-xl space-y-3" >
      <TextField.Root placeholder="Search the docs…">
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <TextArea size='3' placeholder="Reply to comment…" />
      <Button>Submit</Button>
    </div>
  );
};

export default NewIssuePage;
