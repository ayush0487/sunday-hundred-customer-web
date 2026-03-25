import { User, MapPin, CreditCard, Bell, Star, Gift, Briefcase, Settings, ChevronRight, BookOpen, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { UserProfile, defaultUserProfile, getUserProfile } from "@/data/profile";

const stats = [
  { label: "Bookings", value: "24", icon: BookOpen },
  { label: "Reviews", value: "12", icon: Star },
  { label: "Saved", value: "₹4,800", icon: Wallet },
];

const menuItems = [
  { label: "My Profile", icon: User },
  { label: "Saved Addresses", icon: MapPin },
  { label: "Payment Methods", icon: CreditCard },
  { label: "Notifications", icon: Bell },
  { label: "My Reviews", icon: Star },
  { label: "Refer & Earn", icon: Gift },
  { label: "Business Panel", icon: Briefcase },
  { label: "Settings", icon: Settings },
];

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  return (
    <Layout>
      <div className="container py-6 md:py-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card shadow-elevated p-6 md:p-8 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden gradient-gold flex items-center justify-center">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground" />
              )}
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">{profile.phone}</p>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-card shadow-card p-4 text-center"
            >
              <stat.icon className="h-5 w-5 text-gold mx-auto mb-2" />
              <p className="font-bold text-lg">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl bg-card shadow-card overflow-hidden">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-accent transition-colors border-b border-border last:border-b-0"
              onClick={() => {
                if (item.label === "My Profile") {
                  router.push("/profile/manage");
                }
              }}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
