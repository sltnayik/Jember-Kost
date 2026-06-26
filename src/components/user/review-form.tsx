"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { upsertReview } from "@/actions/review";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReviewFormProps {
  kostId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string | null;
  } | null;
}

export function ReviewForm({ kostId, existingReview }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating?.toString() ?? "5");
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await upsertReview({
        kostId,
        reviewId: existingReview?.id,
        rating: Number(rating),
        comment,
        path: `/kost/${kostId}`,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <Card className="rounded-[2rem] border border-border/70 bg-background shadow-sm shadow-black/5">
      <CardHeader>
        <CardTitle>{existingReview ? "Edit review Anda" : "Tulis ulasan"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`rating-${kostId}`}>Rating</Label>
            <Input id={`rating-${kostId}`} type="number" min="1" max="5" value={rating} onChange={(event) => setRating(event.target.value)} className="h-11 rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`comment-${kostId}`}>Komentar</Label>
            <Textarea id={`comment-${kostId}`} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Cerita pengalaman Anda di kos ini" className="min-h-28 rounded-2xl" />
          </div>
          <Button type="submit" className="rounded-2xl bg-primary text-primary-foreground" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
            {existingReview ? "Perbarui review" : "Kirim ulasan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
