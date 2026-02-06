import Link from "next/link";
import Image from "next/image";
import { HeaderNav } from "./HeaderNav";

export function Header() {
  return (
    <header className="bg-cream">
      {/* Main Header with Banner — server-rendered for LCP */}
      <Link
        href="/"
        className="block w-full"
        aria-label="Half Pint Mama - Home"
      >
        <Image
          src="/hpm-banner-v2.png"
          alt="Half Pint Mama"
          width={1920}
          height={280}
          className="w-full h-auto block"
          priority
          sizes="100vw"
        />
      </Link>

      {/* Navigation — client component for interactivity */}
      <HeaderNav />
    </header>
  );
}
