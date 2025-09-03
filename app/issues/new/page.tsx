"use client";

import { TextField, Button, Callout } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
// @ts-ignore
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "@/app/component/ErrorMessage";
import Spinner from "@/app/component/Spinner";

// 定义表单类型
type IssueForm = z.infer<typeof createIssueSchema>;

// 动态引入 SimpleMDE，关闭 SSR，避免 document 未定义错误
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const NewIssuePage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  // 用 useCallback 保证 onChange 函数引用稳定（避免子组件重复渲染）
  const onChange = useCallback((value: string) => {
    setValue(value); // 更新本地状态
  }, []);

  return (
    <div className="max-w-xl">
      {/* 如果存在全局错误信息，显示红色提示框 */}
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className="space-y-3"
        onSubmit={handleSubmit(async (data) => {
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
        })}
      >
        {/* 输入框 */}
        <TextField.Root placeholder="Search the docs…" {...register("title")}>
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
          render={({ field }) => (
            <SimpleMDE
              {...field} // 注入 RHF 的 value 和 onChange
              value={value} // 本地状态
              onChange={(val) => {
                setValue(val), // 更新本地状态
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

export default NewIssuePage;
