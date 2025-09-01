"use client";

import { TextField, Button } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
// @ts-ignore
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";

const NewIssuePage = () => {
  const [value, setValue] = useState("Initial value");
  const onChange = useCallback((value: string) => {
    // 定义 onChange 回调，接收新的文本
    setValue(value); // 更新 value 状态
  }, []); // 空依赖数组，保证函数引用不会在每次渲染时改变
  return (
    // JSX 渲染部分
    <div className="max-w-xl space-y-3">
      <TextField.Root placeholder="Search the docs…">
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      <SimpleMDE value={value} onChange={onChange} />{" "}
      {/* Markdown 编辑器，绑定 value 和 onChange */}
      <Button>Submit New Issue</Button>
    </div>
  );
};

export default NewIssuePage;
