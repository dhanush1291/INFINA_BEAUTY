import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  User, Mail, Phone, MapPin, Calendar, LogOut, Edit3, Save,
  Package, Heart, Settings, ChevronRight, Loader2, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "My Account — INFINA" },
      { name: "description", content: "Manage your INFINA Beauty account, profile, and preferences." },
    ],
  }),
});

function AccountPage() {
  const { user, userProfile, loading, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [displayName, setDisplayName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName ?? "");
      setCountryCode(userProfile.countryCode || "+91");
      setPhone(userProfile.phone ?? "");
      setGender(userProfile.gender ?? "");
      setDateOfBirth(userProfile.dateOfBirth ?? "");
    }
  }, [userProfile]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateUserProfile({
        displayName,
        countryCode,
        phone,
        gender,
        dateOfBirth,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    toast.success("Signed out successfully.");
    navigate({ to: "/" });
  }

  const menuItems = [
    { icon: Package, label: "My Orders", desc: "Track, return, or buy again", href: "/" },
    { icon: Heart, label: "Wishlist", desc: "Your saved items", href: "/wishlist" },
    { icon: ShieldCheck, label: "Privacy & Security", desc: "Manage your data", href: "/policies/privacy" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <div className="border-b bg-gradient-hero">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="relative">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.displayName}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary/10 shadow-lg">
                  <User className="h-10 w-10 text-primary" />
                </div>
              )}
              {userProfile?.provider === "google" && (
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </div>
              )}
            </div>

            {/* Name & Email */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-serif text-3xl md:text-4xl">
                {userProfile?.displayName || "Welcome"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-2 text-xs text-muted-foreground/70">
                Member since {userProfile?.createdAt?.toDate?.()
                  ? new Date(userProfile.createdAt.toDate()).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                  : "recently"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column — Quick Links */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-4 rounded-xl border bg-background p-4 transition-all hover:shadow-md group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>

          {/* Right column — Profile Details */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-background shadow-sm">
              <div className="flex items-center justify-between border-b p-6">
                <div>
                  <h2 className="font-serif text-xl">Personal Information</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Manage your profile details</p>
                </div>
                {!isEditing ? (
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button size="sm" className="gap-2" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Name & Email */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <User className="h-3.5 w-3.5" /> Full Name
                    </label>
                    {isEditing ? (
                      <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-11 rounded-lg" />
                    ) : (
                      <p className="py-2.5 text-sm font-medium">{userProfile?.displayName || "—"}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </label>
                    <p className="py-2.5 text-sm font-medium text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {/* Phone & Gender */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> Phone
                    </label>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="h-11 w-24 rounded-lg border border-input bg-background px-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                          <option value="+91">+91 (IN)</option>
                          <option value="+1">+1 (US)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+971">+971 (UAE)</option>
                          <option value="+65">+65 (SG)</option>
                          <option value="+61">+61 (AU)</option>
                          <option value="+1">+1 (CA)</option>
                        </select>
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="XXXXX XXXXX"
                          className="h-11 flex-1 rounded-lg"
                        />
                      </div>
                    ) : (
                      <p className="py-2.5 text-sm font-medium">
                        {userProfile?.countryCode || "+91"} {userProfile?.phone || "—"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="py-2.5 text-sm font-medium capitalize">{userProfile?.gender || "—"}</p>
                    )}
                  </div>
                </div>

                {/* DOB */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> Date of Birth
                    </label>
                    {isEditing ? (
                      <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="h-11 rounded-lg" />
                    ) : (
                      <p className="py-2.5 text-sm font-medium">{userProfile?.dateOfBirth || "—"}</p>
                    )}
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
