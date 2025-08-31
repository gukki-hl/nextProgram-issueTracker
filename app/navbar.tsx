import Link from "next/link";
import React from "react";
import { LuBug } from "react-icons/lu";
const navbar = () => {
  const LINKS = [
    { label: "Dashboard", href: "/" },
    { label: "issues", href: "/issues" },
  ];
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
              className="text-zinc-800 hover:text-zinc-500 transition-colors "
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default navbar;
