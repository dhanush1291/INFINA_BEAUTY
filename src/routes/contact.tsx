import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Instagram } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — INFINA" },
      { name: "description", content: "Get in touch with the INFINA team." },
    ],
  }),
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <h1 className="font-serif text-4xl md:text-5xl">Contact us</h1>
      <p className="mt-3 text-muted-foreground">
        Questions, feedback, or partnership inquiries — we'd love to hear from you.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSending(true);
          setTimeout(() => {
            setSending(false);
            (e.target as HTMLFormElement).reset();
            toast.success("Thanks — we'll be in touch soon.");
          }, 600);
        }}
        className="mt-10 space-y-5 rounded-2xl border bg-card p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" rows={6} required />
        </div>
        <Button type="submit" size="lg" disabled={sending} className="w-full md:w-auto">
          {sending ? "Sending…" : "Send message"}
        </Button>
      </form>

      <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> hello@infina.beauty</span>
        <span className="inline-flex items-center gap-2"><Instagram className="h-4 w-4" /> @infina_beauty</span>
      </div>
    </div>
  );
}
