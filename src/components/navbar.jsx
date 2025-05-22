"use client";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Button } from "./ui/button";
import { AvatarDropdown } from "./avatar-dropdown";
import { useAuth } from "@/context/authContext";
import { useSearchParams } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export const Navbar = () => {
  const { isAdmin } = useAuth();

  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  return (
    <nav className="flex items-center justify-between pb-10">
      <div>
        <h1 className="block sm:hidden sr-only">PlanHive</h1>
        <Link
          className={cn(
            "text-4xl font-bold hidden sm:block",
            poppins.className
          )}
          href="/"
        >
          <h1>PlanHive</h1>
        </Link>
        <Link
          className={cn(
            "text-4xl font-bold block sm:hidden",
            poppins.className
          )}
          href="/"
        >
          PH
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="lg">
          <Link href={`${date ? `/?date=${date}` : "/"}`}>Min dag</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="hidden md:flex">
          <Link href="/assignments">Mina uppgifter</Link>
        </Button>

        {isAdmin() && (
          <>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hidden lg:flex"
            >
              <Link href={`${date ? `/all/?date=${date}` : "/all"}`}>
                Administrera
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hidden lg:flex"
            >
              <Link href="/add">Skapa uppgift</Link>
            </Button>
          </>
        )}
        <AvatarDropdown date={date} />
      </div>
    </nav>
  );
};
