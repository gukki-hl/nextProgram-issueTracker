"use client";
import { useSession } from "next-auth/react";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LuBug } from "react-icons/lu";
import { Avatar, Box, DropdownMenu, Flex, Text } from "@radix-ui/themes";
const navbar = () => {
  return (
    <nav className="border-b mb-5 px-5 h-14 py-3 ">
      <Flex justify="between">
        <Flex align="center" gap="5">
          <Link href="/">
            <LuBug size={20} />
          </Link>
          <NavLink />
        </Flex>
        <AuthStatus />
      </Flex>
    </nav>
  );
};
const NavLink = () => {
  const currentPath = usePathname(); //获取当前路径
  const LINKS = [
    { label: "Dashboard", href: "/" },
    { label: "issues", href: "/issues/list" },
  ];
  return (
    <ul className="flex space-x-6">
      {LINKS.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={classNames({
              "nav-link": true,
              "!text-zinc-900": link.href === currentPath,
            })}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};
const AuthStatus = () => {
  const { status, data: session } = useSession();
  if (status === "loading") return null;
  if (status === "unauthenticated")
    return (
      <Link className="nav-link" href="/api/auth/signin">
        Login
      </Link>
    );

  return (
    <Box>
      {status === "authenticated" && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Avatar
              src={session.user?.image!}
              fallback="?"
              size="3"
              radius="full"
              className="cursor-pointer"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>
              <Text size="2">{session.user?.email}</Text>
            </DropdownMenu.Label>
            <DropdownMenu.Item>
              <Link href="/api/auth/signout">SignOut</Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}
    </Box>
  );
};

export default navbar;
