"use client";
import { ContinuousCounter } from "@/components/continuous-counter";
import { ContinuousParticles } from "@/components/continuous-particles";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  Coins,
  Database,
  Layers,
  Shield,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative">
      <ContinuousParticles />
      <Header />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="constainer mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="inline-flex bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-800/20 dark:text-purple-300 animate-pulse">
                    Solana Powered
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Compress Your Solana Tokens
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Save up to 98% on storage costs with our state-of-the-art
                    token compression service. Scale your Solana project without
                    breaking the bank.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 transition-transform hover:translate-y-[-2px]"
                  >
                    <Link href={"/create-c-token"}>
                      Start Compressing <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="transition-transform hover:translate-y-[-2px]"
                  >
                    View Documentation
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No code required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>98% cost savings</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Instant setup</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-teal-500 opacity-20 blur-3xl animate-pulse"></div>
                  <div className="relative h-full w-full rounded-xl border bg-background p-4 shadow-xl">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-dashed p-6">
                      <Layers className="h-16 w-16 text-purple-500 mb-4 animate-bounce" />
                      <div className="text-center">
                        <h3 className="text-xl font-bold">
                          Token Compression Dashboard
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Visualize your savings and manage all your compressed
                          tokens in one place
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 bg-white dark:bg-slate-950 overflow-hidden">
          <div className="constainer mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Trusted by leading projects on Solana
              </p>
            </div>
            <div className="mt-6 relative">
              <div className="flex animate-marquee whitespace-nowrap">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center mx-8 h-12"
                  >
                    <div className="flex items-center justify-center h-10 w-32 rounded-md bg-slate-100 dark:bg-slate-800">
                      <span className="text-sm font-medium text-muted-foreground">
                        Partner {i + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i + 10}
                    className="flex items-center justify-center mx-8 h-12"
                  >
                    <div className="flex items-center justify-center h-10 w-32 rounded-md bg-slate-100 dark:bg-slate-800">
                      <span className="text-sm font-medium text-muted-foreground">
                        Partner {i + 11}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900"
        >
          <div className="constainer mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="border-purple-500 text-purple-500"
                >
                  Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why Choose CompressX?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers the most advanced token compression tools
                  for Solana projects of any size.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Compress thousands of tokens in seconds with our optimized
                    compression algorithm.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Secure & Reliable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Enterprise-grade security with cryptographic proofs to
                    ensure token integrity.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <Coins className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Cost Effective</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Save up to 98% on storage costs compared to traditional
                    Solana tokens.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white dark:bg-slate-950">
          <div className="constainer mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className="border-purple-500 text-purple-500"
                  >
                    Stats
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Compression by the Numbers
                  </h2>
                  <p className="text-muted-foreground md:text-xl">
                    Our platform is continuously processing and optimizing
                    tokens across the Solana ecosystem.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="flex flex-col items-center justify-center space-y-2 bg-slate-50 dark:bg-slate-900 p-6 rounded-lg">
                  <ContinuousCounter
                    end={1000000}
                    duration={3000}
                    suffix="+"
                    className="text-3xl md:text-4xl font-bold text-purple-600"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Tokens Compressed
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2 bg-slate-50 dark:bg-slate-900 p-6 rounded-lg">
                  <ContinuousCounter
                    end={98}
                    duration={2000}
                    suffix="%"
                    className="text-3xl md:text-4xl font-bold text-purple-600"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Average Cost Savings
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2 bg-slate-50 dark:bg-slate-900 p-6 rounded-lg">
                  <ContinuousCounter
                    end={500}
                    duration={2500}
                    suffix="+"
                    className="text-3xl md:text-4xl font-bold text-purple-600"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Active Projects
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2 bg-slate-50 dark:bg-slate-900 p-6 rounded-lg">
                  <ContinuousCounter
                    end={5000}
                    duration={2800}
                    suffix="SOL"
                    className="text-3xl md:text-4xl font-bold text-purple-600"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Total Saved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="constainer mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="border-purple-500 text-purple-500"
                >
                  Process
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our compression process is simple, secure, and efficient.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center group">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 transition-transform group-hover:scale-110 duration-300">
                  <Wallet className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">1. Connect Wallet</h3>
                <p className="mt-2 text-muted-foreground">
                  Connect your Solana wallet to our platform with a single
                  click.
                </p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 transition-transform group-hover:scale-110 duration-300">
                  <Database className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">2. Select Tokens</h3>
                <p className="mt-2 text-muted-foreground">
                  Choose which tokens you want to compress from your wallet or
                  upload a list.
                </p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 transition-transform group-hover:scale-110 duration-300">
                  <Layers className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">3. Compress & Save</h3>
                <p className="mt-2 text-muted-foreground">
                  Our system compresses your tokens and provides you with a
                  merkle tree for verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900"
        >
          <div className="constainer mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="border-purple-500 text-purple-500"
                >
                  Pricing
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that fits your project&apos;s needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <Card className="border-2 border-muted transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-bold">
                    Free
                    <span className="ml-1 text-lg font-medium text-muted-foreground">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Up to 1,000 tokens</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Basic compression</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Community support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full transition-all hover:shadow-md hover:-translate-y-1">
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-2 border-purple-600 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <CardHeader>
                  <Badge className="absolute right-4 top-4 bg-purple-600">
                    Popular
                  </Badge>
                  <CardTitle>Pro</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-bold">
                    $49
                    <span className="ml-1 text-lg font-medium text-muted-foreground">
                      /month
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Up to 100,000 tokens</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Advanced compression</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>API access</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-all hover:shadow-md hover:-translate-y-1">
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-2 border-muted transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-bold">
                    Custom
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Unlimited tokens</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Maximum compression</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Dedicated support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Custom integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>SLA guarantee</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    Contact Sales
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="constainer mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="border-purple-500 text-purple-500"
                >
                  FAQ
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to know about our token compression
                  service.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-3xl gap-4 py-12">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>What is token compression on Solana?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Token compression on Solana is a technique that allows you
                    to store token data off-chain while maintaining
                    cryptographic verification on-chain. This significantly
                    reduces storage costs and increases scalability.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Is it safe to compress my tokens?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, our compression technology uses cryptographic proofs to
                    ensure that your tokens remain secure and verifiable. The
                    compression process does not affect the ownership or
                    functionality of your tokens.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>
                    How much can I save with token compression?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Most projects save between 95-98% on storage costs when
                    using our compression service. The exact savings depend on
                    the number and type of tokens you&apos;re compressing.
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Can I decompress tokens if needed?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can decompress tokens at any time. Our platform
                    provides simple tools to compress and decompress tokens as
                    needed for your project.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1500')] opacity-5 bg-repeat"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent animate-pulse"></div>
          <div className="constainer mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Compressing?
                </h2>
                <p className="max-w-[900px] text-purple-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of projects already saving with CompressX.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-purple-600 hover:bg-purple-100 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <Link href={"/create-c-token"}>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-purple-600 hover:bg-purple-100 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="constainer mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="h-6 w-6 text-purple-500" />
                <span className="text-xl font-bold">CompressX</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The leading token compression service for Solana projects.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    API
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CompressX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
