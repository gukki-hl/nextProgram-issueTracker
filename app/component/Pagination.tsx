"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Text, Button, Flex } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  itemCount: number; //总条目数
  pageSize: number; //每页条目数
  currentPage: number; //当前页码
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams(); //获取当前的查询参数
  const totalPages = Math.ceil(itemCount / pageSize); //计算总页数
  if (totalPages === 0) return null; //没有数据时不显示分页

  const changePage = (page: number) => {
    //创建一个新的 URLSearchParams 实例
    //使用当前 URL 的查询参数初始化，保留其他已有的查询参数（如排序、筛选等）
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());//更新页码参数
    router.push("?" + params.toString());
  };

  return (
    <Flex align="center" gap={"2"}>
      <Text size="2">
        Page {currentPage} of {itemCount}
      </Text>
      <Button
        color="gray"
        variant="soft"
        disabled={currentPage === 1}
        onClick={() => changePage(1)}
      >
        <DoubleArrowLeftIcon />
      </Button>
      <Button
        color="gray"
        variant="soft"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        color="gray"
        variant="soft"
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
      >
        <ChevronRightIcon />
      </Button>
      <Button
        color="gray"
        variant="soft"
        disabled={currentPage === totalPages}
        onClick={() => changePage(totalPages)}
      >
        <DoubleArrowRightIcon />
      </Button>
    </Flex>
  );
};

export default Pagination;
