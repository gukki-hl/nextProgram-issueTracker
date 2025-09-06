"use client";

import { Button, Callout, TextField } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
// @ts-ignore
import { ErrorMessage, Spinner } from "@/app/component";
import { IssueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Issue } from "@prisma/client";

// 定义表单类型
type IssueForm = z.infer<typeof IssueSchema>;

// 动态引入 SimpleMDE，关闭 SSR，避免 document 未定义错误
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const IssueFormData = ({ issue }: { issue?: Issue }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(IssueSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      //提交表单数据到/api/issues
      await axios.post("/api/issues", data);
      //成功后跳转到/issues页面
      router.push("/issues");
    } catch (error) {
      setIsSubmitting(false);
      // 捕获异常，设置全局错误提示
      setError("An unexpected error occurred");
    }
  });
  return (
    <div className="max-w-xl">
      {/* 如果存在全局错误信息，显示红色提示框 */}
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        {/* 输入框 */}
        <TextField.Root
          defaultValue={issue?.title}
          placeholder="Search the docs…"
          {...register("title")}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
        {/* 标题字段错误提示 */}
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        {/* Markdown 编辑器（只在客户端渲染） */}
        <Controller
          name="description" //表单字段名
          control={control} //表单控制器
          defaultValue={issue?.description}
          render={({ field }) => (
            <SimpleMDE
              {...field} // 注入 RHF 的 value 和 onChange
              onChange={(val) => {
                field.onChange(val); // 同步到 RHF 表单状态
              }}
            />
          )}
        />
        {/* Markdown 编辑器错误提示 */}
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        {/* 提交按钮 */}
        <Button disabled={isSubmitting}>
          Submit New Issue
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueFormData;
