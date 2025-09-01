"use client";

import { TextField, Button } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
// @ts-ignore
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface IssueForm {
  title: string;
  description: string;
}

// 动态引入 SimpleMDE，关闭 SSR，避免 document 未定义错误
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const NewIssuePage = () => {
  const { register, control, handleSubmit } = useForm<IssueForm>();
  const [value, setValue] = useState("Initial value");
  const router = useRouter();
  // 用 useCallback 保证 onChange 函数引用稳定（避免子组件重复渲染）
  const onChange = useCallback((value: string) => {
    setValue(value); // 更新本地状态
  }, []);

  return (
    <form
      className="max-w-xl space-y-3"
      onSubmit={handleSubmit(async (data) => {
        //提交表单数据到/api/issues
        await axios.post("/api/issues", data);
        //成功后跳转到/issues页面
        router.push("/issues");
      })}
    >
      {/* 输入框 */}
      <TextField.Root placeholder="Search the docs…" {...register("title")}>
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>
      {/* Markdown 编辑器（只在客户端渲染） */}
      <Controller
        name="description"
        control={control}//表单控制器
        render={({ field }) => (
          <SimpleMDE
            {...field}// 注入 RHF 的 value 和 onChange
            value={value} // 本地状态
            onChange={(val) => {
              setValue(val), // 更新本地状态
              field.onChange(val); // 同步到 RHF 表单状态
            }}
          />
        )}
      />

      {/* 提交按钮 */}
      <Button>Submit New Issue</Button>
    </form>
  );
};

export default NewIssuePage;
