"use client";

import React from "react";

import Link from "next/link";

import { useWallet } from "@solana/wallet-adapter-react";

import { WSOL_MINT, USDC_MINT } from "@/lib/consts";

import { UserDropdown } from "@/components/sol/user-dropdown";
import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

import ThemeToogle from "./ThemeToogle";
import {
  BinaryIcon,
  GithubIcon,
  LayoutDashboardIcon,
  RefreshCcwIcon,
  TwitterIcon,
} from "lucide-react";
import useAssets from "@/hooks/useAssets";
import Logo from "./Logo";

const userAssets = [WSOL_MINT, USDC_MINT];

type HeaderProps = {
  showSidebarTrigger?: boolean;
};

const Header = ({ showSidebarTrigger = false }: HeaderProps) => {
  const { connected, publicKey, connecting } = useWallet();
  const [demoDropdownOpen, setDemoDropdownOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const { data: assets, isPending } = useAssets({
    addresses: userAssets,
    owner: publicKey ?? undefined,
  });

  React.useEffect(() => {
    setIsMounted(!connecting);
  }, [connecting]);

  return (
    <header className="flex h-16 w-full items-center border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center justify-between gap-6 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {showSidebarTrigger && <SidebarTrigger />}
          <Link href="/" className="mr-auto">
            <h1 className="flex items-center gap-2 text-3xl font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#14F195] to-[#9945FF]">
                <BinaryIcon size={22} className="text-white" />
              </div>
              <Logo />
            </h1>
          </Link>
        </div>
        <nav className="flex items-center gap-4 font-mono lg:gap-10">
          <ul className="hidden items-center gap-10 lg:flex">
            <Link
              href="#features"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-primary xl:block font-medium"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-primary xl:block font-medium"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-primary xl:block font-medium"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-primary xl:block font-medium"
            >
              FAQ
            </Link>
            {/* <li>
              <Link
                href="/create-c-token"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-primary xl:block font-medium"
              >
                Create cToken
              </Link>
            </li> */}

            <li>
              <DropdownMenu
                open={demoDropdownOpen}
                onOpenChange={setDemoDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <button className="text-sm text-muted-foreground outline-none transition-colors hover:text-primary font-medium">
                    Tools
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  side="bottom"
                  align="center"
                  sideOffset={12}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setDemoDropdownOpen(false)}
                    >
                      <Link
                        href="/create-c-token"
                        className="flex w-full cursor-pointer items-center gap-2"
                      >
                        <LayoutDashboardIcon size={16} />
                        <span>Create cToken</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDemoDropdownOpen(false)}
                    >
                      <Link
                        href="/create-c-token-with-solana-pay"
                        className="flex w-full cursor-pointer items-center gap-2"
                      >
                        <LayoutDashboardIcon size={16} />
                        <span>Create cToken with Solana Pay</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDemoDropdownOpen(false)}
                    >
                      <Link
                        href={`/tokens/${publicKey}`}
                        className="flex w-full cursor-pointer items-center gap-2"
                      >
                        <RefreshCcwIcon size={16} />
                        <span>Manage cToken</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
          {!isMounted || (connected && publicKey) ? (
            <UserDropdown
              address={publicKey}
              assets={assets}
              isLoading={isPending}
            />
          ) : (
            <ConnectWalletDialog
              title={
                <span className="text-4xl dark:bg-gradient-to-r dark:from-teal-200 dark:to-violet-500 dark:bg-clip-text dark:text-transparent">
                  cToken Tool
                </span>
              }
              description={
                <span className="font-mono">
                  Connect your wallet to continue
                </span>
              }
            />
          )}
          <ul className="hidden items-center gap-4 lg:flex">
            <li>
              <Link
                href="https://github.com/HongThaiPham/ctoken-tool"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon size={18} />
              </Link>
            </li>
            <li>
              <Link
                href="https://x.com/leopham_it"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon size={18} />
              </Link>
            </li>
            <li>
              <ThemeToogle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { Header };
