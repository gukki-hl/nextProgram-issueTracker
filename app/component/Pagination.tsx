import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Text, Button, Flex } from "@radix-ui/themes";
import React from "react";

interface Props {
  itemCount: number; //总条目数
  pageSize: number; //每页条目数
  currentPage: number; //当前页码
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
  const totalPages = Math.ceil(itemCount / pageSize); //计算总页数
  if (totalPages === 0) return null; //没有数据时不显示分页
  return (
    <Flex align="center" gap={"2"}>
      <Text size="2">
        Page {currentPage} of {itemCount}
      </Text>
      <Button color="gray" variant="soft" disabled={currentPage === 1}>
        <DoubleArrowLeftIcon />
      </Button>
      <Button color="gray" variant="soft" disabled={currentPage === 1}>
        <ChevronLeftIcon />
      </Button>
      <Button color="gray" variant="soft" disabled={currentPage === totalPages}>
        <ChevronRightIcon />
      </Button>
      <Button color="gray" variant="soft" disabled={currentPage === totalPages}>
        <DoubleArrowRightIcon />
      </Button>
    </Flex>
  );
};

export default Pagination;
