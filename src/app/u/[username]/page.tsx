"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { messageSchema } from "@/src/schemas/messageSchema";
import { ApiResponse } from "@/src/types/ApiResponse";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";

const initialSuggestions = [
  "What's a hobby you've recently started?",
  "If you could have dinner with any historical figure, who would it be?",
  "What's a simple thing that makes you happy?",
];

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isSending, setIsSending] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const messageContent = form.watch("content");

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });
      toast.success(response.data.message);
      form.reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to send message."
      );
    } finally {
      setIsSending(false);
    }
  };

  const fetchSuggestions = async () => {
    setIsSuggesting(true);
    try {
      const response = await axios.post<ApiResponse & { messages?: string[] }>(
        "/api/suggest-messages"
      );
      const messages = (response.data as { messages?: string[] }).messages;
      if (messages?.length) {
        setSuggestions(messages);
      } else {
        toast.error("No suggestions were returned.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to load suggestions."
      );
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-muted px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Public Profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Send an anonymous message to{" "}
            <span className="font-medium text-foreground">@{username}</span>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send Anonymous Message</CardTitle>
            <CardDescription>
              Your identity stays completely private.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write your anonymous message here..."
                          className="min-h-28 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSending || !messageContent}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Need inspiration?</CardTitle>
                <CardDescription>
                  Tap a suggestion to use it as your message.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={fetchSuggestions}
                disabled={isSuggesting}
              >
                {isSuggesting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Suggest
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  form.setValue("content", suggestion, {
                    shouldValidate: true,
                  })
                }
                className="w-full rounded-md border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-accent"
              >
                {suggestion}
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="rounded-lg border bg-background p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Want your own message board?
          </p>
          <Link href="/sign-up">
            <Button className="mt-3">Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
