import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/policies/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: "Privacy Policy — INFINA" }] }),
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <h1 className="font-serif text-4xl">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>We respect your privacy. This page outlines what we collect and how we use it.</p>
        <h2 className="mt-6 font-serif text-2xl text-foreground">What we collect</h2>
        <p>Newsletter sign-ups (email only), wishlist data stored locally in your browser, and standard analytics for traffic understanding.</p>
        <h2 className="mt-6 font-serif text-2xl text-foreground">Affiliate tracking</h2>
        <p>When you click through to a partner site, that partner may set cookies to track the referral. INFINA does not receive your personal information from these clicks.</p>
        <h2 className="mt-6 font-serif text-2xl text-foreground">Contact</h2>
        <p>Questions? Email <a className="text-primary" href="mailto:privacy@INFINA.example">privacy@INFINA.example</a>.</p>
      </div>
    </div>
  );
}
