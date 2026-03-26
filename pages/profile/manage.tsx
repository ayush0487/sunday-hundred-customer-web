import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Mail, Phone, Save, Trash2, User } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile, defaultUserProfile, getUserProfile, saveUserProfile } from "@/data/profile";

export default function ManageProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [email, setEmail] = useState(defaultUserProfile.email);
  const [phone, setPhone] = useState(defaultUserProfile.phone);
  const [photoUrl, setPhotoUrl] = useState<string | null>(defaultUserProfile.photoUrl);

  useEffect(() => {
    const loaded = getUserProfile();
    setProfile(loaded);
    setEmail(loaded.email);
    setPhone(loaded.phone);
    setPhotoUrl(loaded.photoUrl);
  }, []);

  const onPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDeletePhoto = () => {
    setPhotoUrl(null);
  };

  const onSave = () => {
    saveUserProfile({
      ...defaultUserProfile,
      ...profile,
      email: email.trim(),
      phone: phone.trim(),
      photoUrl,
    });

    router.push("/profile");
  };

  return (
    <Layout>
      <div className="container py-6 md:py-10 max-w-3xl mx-auto">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl bg-card shadow-elevated overflow-hidden"
        >
          <div className="relative px-6 py-8 md:px-8 md:py-10 bg-gradient-to-br from-accent via-background to-background">
            <div className="absolute -top-10 -right-12 h-44 w-44 rounded-full bg-gold/10 blur-2xl" />
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">Manage Profile</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your photo and contact details.
                </p>
              </div>

              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-background shadow-card bg-muted flex items-center justify-center">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-muted-foreground" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/55 text-white text-[11px] py-1 text-center">
                  Profile Photo
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-5 md:px-8 md:pb-8 space-y-6">
            <section className="rounded-2xl border border-border bg-background p-4 md:p-5">
              <h2 className="text-sm font-semibold mb-4">Photo Actions</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="inline-flex w-full sm:w-auto">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPhotoChange}
                  />
                  <span className="inline-flex w-full sm:w-auto items-center justify-center gap-2 h-10 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-colors">
                    <Camera className="h-4 w-4" />
                    Upload New Photo
                  </span>
                </label>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDeletePhoto}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Photo
                </Button>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background p-4 md:p-5 space-y-4">
              <h2 className="text-sm font-semibold">Contact Details</h2>

              <div>
                <label className="text-sm font-medium inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Gmail
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@gmail.com"
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-2"
                />
              </div>
            </section>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/profile")}>Cancel</Button>
              <Button type="button" className="w-full sm:w-auto" onClick={onSave}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
