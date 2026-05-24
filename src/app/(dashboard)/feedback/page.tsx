"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface FeedbackItem {
  _id: string;
  rating: number;
  category: string;
  message: string;
  suggestions?: string;
  createdAt: string;
  userId?: { name: string };
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState("usability");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFeedback = () => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setFeedbacks(json.data.feedbacks);
          setAvgRating(Math.round(json.data.averageRating * 10) / 10);
        }
      });
  };

  useEffect(() => { fetchFeedback(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, category, message, suggestions }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      toast.success("Feedback submitted. Thank you!");
      setMessage("");
      setSuggestions("");
      setRating(5);
      fetchFeedback();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Usability Testing</h2>
        <p className="text-muted-foreground">Share feedback and rate your experience</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="feedback-form">
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <div className="flex gap-1" data-testid="rating-stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1"
                      data-testid={`star-${n}`}
                    >
                      <Star
                        className={`h-6 w-6 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="usability">Usability</option>
                  <option value="performance">Performance</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  data-testid="feedback-message"
                />
              </div>
              <div className="space-y-2">
                <Label>Suggestions (optional)</Label>
                <Textarea
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  rows={2}
                  data-testid="feedback-suggestions"
                />
              </div>
              <Button type="submit" disabled={loading} data-testid="feedback-submit">
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Feedback Summary
              {avgRating > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  Avg: {avgRating}/5
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedbacks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No feedback yet</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto" data-testid="feedback-list">
                {feedbacks.map((fb) => (
                  <div key={fb._id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`h-4 w-4 ${n <= fb.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs capitalize text-muted-foreground">{fb.category}</span>
                    </div>
                    <p className="text-sm mt-2">{fb.message}</p>
                    {fb.suggestions && (
                      <p className="text-xs text-muted-foreground mt-1">💡 {fb.suggestions}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(fb.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
