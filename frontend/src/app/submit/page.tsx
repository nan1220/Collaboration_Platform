"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const schema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Enter a valid email"),
  title: z.string().min(5, "Give the project a short title"),
  description: z.string().min(20, "Please describe the project in a bit more detail"),
});

type FormValues = z.infer<typeof schema>;

export default function SubmitProjectPage() {
  const [result, setResult] = useState<{ statusToken: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => api.submitCompanyProject(values),
    onSuccess: (data) => {
      setResult(data);
      reset();
    },
  });

  if (result) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Thanks — your submission is in</CardTitle>
          <CardDescription>
            An organizer will review it shortly. Save this link to check on its status any time:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={`/status/${result.statusToken}`} className="text-sm underline">
            /status/{result.statusToken}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Submit a project topic</CardTitle>
        <CardDescription>
          For companies proposing a project topic for students. No account needed — an organizer
          will review your submission.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="companyName">Company name</Label>
            <Input id="companyName" {...register("companyName")} />
            {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactName">Your name</Label>
            <Input id="contactName" {...register("contactName")} />
            {errors.contactName && <p className="text-xs text-destructive">{errors.contactName.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
            {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Project title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Project description</Label>
            <Textarea id="description" rows={6} {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          {mutation.isError && (
            <p className="text-sm text-destructive">
              {mutation.error instanceof ApiError ? mutation.error.message : "Something went wrong"}
            </p>
          )}
          <Button type="submit" disabled={mutation.isPending}>
            Submit for review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
