"use client";
import { useSession } from "next-auth/react";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LuBug } from "react-icons/lu";
import { Box } from "@radix-ui/themes";
const navbar = () => {
  const { status, data: session } = useSession();
  const currentPath = usePathname(); //获取当前路径
  const LINKS = [
    { label: "Dashboard", href: "/" },
    { label: "issues", href: "/issues/list" },
  ];
  if (status === "loading") return null;
  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <LuBug size={20} />
      </Link>
      <ul className="flex space-x-6">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={classNames({
                "text-zinc-900": link.href === currentPath,
                "text-zinc-500": link.href !== currentPath,
                "hover:text-zinc-800 transition-colors": true,
              })}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <Box>
        {status === "authenticated" && (
          <Link href="/api/auth/signout">SignOut</Link>
        )}
         {status === "unauthenticated" && (
          <Link href="/api/auth/signin">Login</Link>
        )}
      </Box>
    </nav>
  );
};

export default navbar;
