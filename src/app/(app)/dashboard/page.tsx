"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Check, Copy, Inbox, Link2, Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { acceptMessageSchema } from "@/src/schemas/acceptMessageSchema";
import { Message } from "@/src/model/User";
import { ApiResponse } from "@/src/types/ApiResponse";
import { Button } from "@/src/components/ui/button";
import { Switch } from "@/src/components/ui/switch";
import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";
import MessageCard from "@/src/components/MessageCard";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const username = session?.user?.username;

  useEffect(() => {
    if (username && typeof window !== "undefined") {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${username}`);
    }
  }, [username]);

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ??
          "Failed to fetch message settings."
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (showToast = false) => {
    setIsLoadingMessages(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages ?? []);
      if (showToast) {
        toast.success("Messages refreshed");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status !== 404) {
        toast.error(
          axiosError.response?.data.message ?? "Failed to fetch messages."
        );
      } else {
        setMessages([]);
      }
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchMessages();
    fetchAcceptMessages();
  }, [status, fetchMessages, fetchAcceptMessages]);

  const handleToggleAcceptMessages = async () => {
    const next = !acceptMessages;
    setValue("acceptMessages", next);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: next,
      });
      toast.success(response.data.message);
    } catch (error) {
      setValue("acceptMessages", !next);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to update settings."
      );
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.filter((message) => String(message._id) !== messageId)
    );
  };

  const copyProfileUrl = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Profile URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 md:px-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-muted-foreground">
        Please sign in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 md:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back
          {session?.user?.username ? `, ${session.user.username}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your anonymous message board.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Link2 className="size-4 text-primary" />
            Your unique link
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Share this link so anyone can send you anonymous feedback.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={profileUrl}
              readOnly
              onFocus={(e) => e.currentTarget.select()}
              className="w-full truncate rounded-md border bg-muted px-3 py-2 text-sm outline-none"
            />
            <Button
              onClick={copyProfileUrl}
              disabled={!profileUrl}
              className="shrink-0"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">Accept Messages</span>
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleToggleAcceptMessages}
                disabled={isSwitchLoading}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {acceptMessages
                ? "Your inbox is open — people can reach you."
                : "Your inbox is closed to new messages."}
            </p>
          </div>
          <span
            className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              acceptMessages
                ? "bg-green-500/10 text-green-600"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                acceptMessages ? "bg-green-600" : "bg-destructive"
              }`}
            />
            {acceptMessages ? "Accepting" : "Not accepting"}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">
          Messages{" "}
          <span className="text-muted-foreground">({messages.length})</span>
        </h2>
        <Button
          variant="outline"
          onClick={() => fetchMessages(true)}
          disabled={isLoadingMessages}
        >
          {isLoadingMessages ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCcw className="size-4" />
          )}
          Refresh
        </Button>
      </div>

      {isLoadingMessages ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : messages.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {messages.map((message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-xl border border-dashed p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <p className="mt-4 font-medium">No messages yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your link to start receiving anonymous feedback.
          </p>
        </div>
      )}
    </div>
  );
}
