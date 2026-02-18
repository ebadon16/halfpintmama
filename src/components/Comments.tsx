"use client";

import { useState, useEffect, useCallback } from "react";
import { StarRating, RatingSummary } from "./StarRating";
import { ThemedIcon } from "@/components/ThemedIcon";
import { MessageCircle } from "lucide-react";

interface Comment {
  _id: string;
  author: string;
  content: string;
  rating: number;
  parentId: string | null;
  createdAt: string;
  replies?: Comment[];
}

interface CommentsProps {
  postSlug: string;
  postTitle: string;
  category?: string;
  initialRatingAverage?: number;
  initialRatingCount?: number;
}

interface CommentsPreviewProps {
  postSlug: string;
  category?: string;
  initialRatingAverage?: number;
  initialRatingCount?: number;
  initialCommentCount?: number;
}

// Preview component to show at top of post
export function CommentsPreview({ postSlug, category, initialRatingAverage = 0, initialRatingCount = 0, initialCommentCount }: CommentsPreviewProps) {
  const [commentCount, setCommentCount] = useState(initialCommentCount ?? 0);

  const isRecipe = category === "cooking";
  const title = isRecipe ? "Rate & Review This Recipe" : "Rate & Review";
  const emptyText = isRecipe ? "Be the first to rate this recipe!" : "Be the first to leave a review!";

  useEffect(() => {
    // Skip fetch if server provided the count
    if (initialCommentCount != null) return;

    async function fetchCommentCount() {
      try {
        const res = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`);
        if (res.ok) {
          const data = await res.json();
          const topLevel = data.comments?.filter((c: Comment) => !c.parentId) || [];
          setCommentCount(topLevel.length);
        }
      } catch {
        // Silently fail
      }
    }
    fetchCommentCount();
  }, [postSlug, initialCommentCount]);

  const scrollToComments = () => {
    const commentsSection = document.getElementById("comments-section");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gradient-to-r from-terracotta/10 to-soft-pink/10 rounded-2xl p-6 my-8 border-2 border-terracotta/20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2">
            {title}
          </h3>
          {initialRatingCount > 0 ? (
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <RatingSummary averageRating={initialRatingAverage} totalRatings={initialRatingCount} />
              <span className="text-charcoal/70">|</span>
              <span className="text-sm text-charcoal/70">{commentCount} comment{commentCount !== 1 ? "s" : ""}</span>
            </div>
          ) : (
            <p className="text-charcoal/70 text-sm">{emptyText}</p>
          )}
        </div>
        <button
          onClick={scrollToComments}
          className="px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Leave a Review
        </button>
      </div>
    </div>
  );
}

export function Comments({ postSlug, postTitle, category, initialRatingAverage = 0, initialRatingCount = 0 }: CommentsProps) {
  const isRecipe = category === "cooking";
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToComment, setReplyingToComment] = useState<Comment | null>(null);
  const [formData, setFormData] = useState({
    author: "",
    email: "",
    content: "",
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch comments from Sanity on mount
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`);
      if (res.ok) {
        const data = await res.json();
        // Organize comments into threads (top-level + replies)
        const allComments: Comment[] = data.comments || [];
        const topLevel = allComments.filter((c) => !c.parentId);
        const replies = allComments.filter((c) => c.parentId);

        // Attach replies to their parent comments
        const threaded = topLevel.map((comment) => ({
          ...comment,
          replies: replies.filter((r) => r.parentId === comment._id),
        }));

        setComments(threaded);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: formData.author,
          email: formData.email,
          content: formData.content,
          rating: replyingTo ? 0 : formData.rating,
          postSlug,
          postTitle,
          isReply: !!replyingTo,
          parentId: replyingTo,
          replyToAuthor: replyingToComment?.author,
          replyToEmail: "", // We don't expose emails in the frontend
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit comment");
      }

      // Success - refresh comments
      await fetchComments();

      // Reset form
      setFormData({ author: "", email: "", content: "", rating: 0 });
      setShowForm(false);
      setReplyingTo(null);
      setReplyingToComment(null);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const CommentCard = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? "ml-8 mt-4" : ""}`}>
      <div className={`bg-white rounded-xl p-5 ${isReply ? "border-l-4 border-sage" : "shadow-sm"}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sage to-deep-sage rounded-full flex items-center justify-center text-white font-semibold">
                {comment.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-charcoal">{comment.author}</h4>
                <p className="text-xs text-charcoal/70">{formatDate(comment.createdAt)}</p>
              </div>
            </div>
          </div>
          {comment.rating > 0 && (
            <StarRating rating={comment.rating} readonly size="sm" />
          )}
        </div>
        <p className="text-charcoal/80 mb-3">{comment.content}</p>
        {!isReply && (
          <button
            onClick={() => {
              setReplyingTo(comment._id);
              setReplyingToComment(comment);
              setShowForm(true);
            }}
            className="text-sm text-terracotta hover:text-deep-sage transition-colors"
          >
            Reply
          </button>
        )}
      </div>
      {comment.replies?.map((reply) => (
        <CommentCard key={reply._id} comment={reply} isReply />
      ))}
    </div>
  );

  return (
    <section id="comments-section" className="bg-cream py-12">
      <div className="max-w-3xl mx-auto px-4 border-2 border-light-sage rounded-2xl bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold">
              Comments & Ratings
            </h2>
            {initialRatingCount > 0 && (
              <div className="mt-2">
                <RatingSummary averageRating={initialRatingAverage} totalRatings={initialRatingCount} />
              </div>
            )}
          </div>
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                setReplyingTo(null);
                setReplyingToComment(null);
              }}
              className="px-5 py-2.5 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Leave a Review
            </button>
          )}
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div role="status" className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
            Thank you for your comment! It has been posted.
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
            {submitError}
          </div>
        )}

        {/* Comment Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-crimson)] text-xl text-charcoal font-semibold">
                {replyingTo ? "Write a Reply" : "Leave a Comment"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setReplyingTo(null);
                  setReplyingToComment(null);
                  setSubmitError("");
                }}
                aria-label="Close comment form"
                className="text-charcoal/70 hover:text-charcoal transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating - only for top-level comments */}
              {!replyingTo && (
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Your Rating
                  </label>
                  <StarRating
                    rating={formData.rating}
                    onRate={(rating) => setFormData({ ...formData, rating })}
                    size="lg"
                  />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-charcoal mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="author"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-light-sage rounded-lg focus:outline-none focus:border-sage transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
                    Email * <span className="text-xs text-charcoal/70">(not published)</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    aria-label="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-light-sage rounded-lg focus:outline-none focus:border-sage transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-charcoal mb-1">
                  Comment *
                </label>
                <textarea
                  id="content"
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-light-sage rounded-lg focus:outline-none focus:border-sage transition-colors resize-none"
                  placeholder={replyingTo ? "Write your reply..." : isRecipe ? "Share your experience with this recipe..." : "Share your thoughts..."}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-charcoal/70">
                  Your email address will not be published.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div role="status" aria-live="polite" className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto"></div>
            <p className="text-charcoal/70 mt-2">Loading comments...</p>
          </div>
        )}

        {/* Comments List */}
        {!isLoading && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))}
          </div>
        ) : (
          !isLoading && !showForm && (
            <div className="text-center py-12 bg-white rounded-2xl">
              <div className="flex justify-center mb-4"><ThemedIcon icon={MessageCircle} size="lg" color="sage" /></div>
              <h3 className="font-[family-name:var(--font-crimson)] text-xl text-charcoal font-semibold mb-2">
                No comments yet
              </h3>
              <p className="text-charcoal/70 mb-4">
                {isRecipe ? "Be the first to share your thoughts on this recipe!" : "Be the first to share your thoughts!"}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="text-terracotta font-medium hover:text-deep-sage transition-colors"
              >
                Leave a comment &rarr;
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
}
