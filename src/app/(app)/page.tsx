"use client";

import { useRef } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Mail,
  MessageSquareHeart,
  MessageSquareLock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import messages from "@/src/messages.json";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/src/components/ui/carousel";

const features = [
  {
    icon: MessageSquareLock,
    title: "Truly Anonymous",
    description:
      "Senders stay completely hidden. Get the honest feedback people are afraid to say out loud.",
  },
  {
    icon: ShieldCheck,
    title: "You're in Control",
    description:
      "Toggle message acceptance on or off, and delete anything you don't want to keep.",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description:
      "Not sure what to ask? Let AI spark engaging, friendly conversation starters.",
  },
];

export default function Home() {
  const autoplay = useRef(Autoplay({ delay: 2800, stopOnInteraction: false }));

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-primary/5 via-background to-background" />
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
            <MessageSquareHeart className="size-4 text-primary" />
            Honest feedback, zero pressure
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Dive into the world of{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              anonymous feedback
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
            True Feedback lets anyone share candid, anonymous messages with you.
            Create your link, share it anywhere, and discover what people really
            think.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started — it&apos;s free
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 pb-8">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Messages people love to receive
        </h2>
        <Carousel
          plugins={[autoplay.current]}
          opts={{ loop: true, align: "center" }}
          className="w-full max-w-xl mx-auto"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="md:basis-4/5">
                <Card className="h-full border-primary/10 bg-card/60 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Mail className="size-4 text-primary" />
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-lg leading-relaxed">
                      “{message.content}”
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {message.received}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl border bg-primary p-10 text-center text-primary-foreground">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary-foreground/10 blur-2xl" />
          <h2 className="text-2xl font-bold md:text-3xl">
            Ready to hear the truth?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Set up your anonymous message board in under a minute.
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="mt-6">
              Create your account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} True Feedback. Built for honest
        conversations.
      </footer>
    </main>
  );
}
