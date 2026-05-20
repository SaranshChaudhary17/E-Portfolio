"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const newMessage = {
        id: Date.now().toString(),
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        date: new Date().toISOString()
      };

      const docRef = doc(db, "cinematic_portfolio_data", "main");
      await updateDoc(docRef, { messages: arrayUnion(newMessage) });

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-[1.75rem] p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-denim">Name</span>
          <input name="name" required className="mt-2 w-full rounded-2xl border border-parchment/15 bg-black/35 px-4 py-3 text-pearl outline-none transition focus:border-ember" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-denim">Email</span>
          <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-parchment/15 bg-black/35 px-4 py-3 text-pearl outline-none transition focus:border-ember" />
        </label>
      </div>
      <label className="mt-5 block">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-denim">Project signal</span>
        <input name="subject" required className="mt-2 w-full rounded-2xl border border-parchment/15 bg-black/35 px-4 py-3 text-pearl outline-none transition focus:border-ember" />
      </label>
      <label className="mt-5 block">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-denim">Message</span>
        <textarea name="message" required rows={7} className="mt-2 w-full resize-none rounded-2xl border border-parchment/15 bg-black/35 px-4 py-3 text-pearl outline-none transition focus:border-ember" />
      </label>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send message"} <Send className="h-4 w-4" />
        </Button>
        {status === "sent" ? <p className="text-sm text-denim">Signal received. I will reply soon.</p> : null}
        {status === "error" ? <p className="text-sm text-ember">The signal could not be sent. Check Resend environment variables.</p> : null}
      </div>
    </form>
  );
}
