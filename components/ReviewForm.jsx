"use client";

import { useState } from "react";
import { submitReview } from "@/lib/api";

const RATINGS = [1, 2, 3, 4, 5];

export default function ReviewForm({ product }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [status, setStatus] = useState("idle");

  if (!product?.documentId) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");

    try {
      await submitReview({
        name: form.name,
        rating: form.rating,
        comment: form.comment,
        productDocumentId: product.documentId,
      });

      setStatus("success");
      setForm({ name: "", rating: 5, comment: "" });
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 rounded-full border-2 border-[#B2A3FF] bg-[#E9DFFF] px-5 py-2.5 text-sm font-extrabold text-ink transition hover:-translate-y-0.5 hover:shadow-lift"
      >
        Write a review
      </button>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-line bg-card p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-ink">Write a review</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Your review is checked before it is published.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-3 py-1 text-sm font-bold text-ink-soft hover:bg-pink/10"
        >
          Close
        </button>
      </div>

      {status === "success" ? (
        <div className="mt-5 rounded-2xl bg-mint/40 p-4 text-sm font-semibold text-ink">
          Thank you! Your review has been submitted for approval.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-extrabold text-ink">Your name</span>
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-deep"
              placeholder="Your name"
            />
          </label>

          <fieldset>
            <legend className="text-sm font-extrabold text-ink">
              Your rating
            </legend>

            <div className="mt-2 flex gap-2">
              {RATINGS.map((rating) => (
                <button
                  key={rating}
                  type="button"
                  aria-label={`${rating} star rating`}
                  onClick={() => setForm({ ...form, rating })}
                  className={`text-3xl leading-none transition hover:scale-110 ${
                    rating <= form.rating
                      ? "text-pink-deep"
                      : "text-line"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-sm font-extrabold text-ink">
              Your review
            </span>
            <textarea
              required
              rows="5"
              value={form.comment}
              onChange={(event) =>
                setForm({ ...form, comment: event.target.value })
              }
              className="mt-1.5 w-full resize-y rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-deep"
              placeholder="Tell other customers about this product..."
            />
          </label>

          {status === "error" && (
            <p className="text-sm font-semibold text-red-500">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            disabled={status === "loading"}
            className="rounded-full bg-pink-deep px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Submitting..." : "Submit review"}
          </button>
        </form>
      )}
    </section>
  );
}