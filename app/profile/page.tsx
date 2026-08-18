import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ProfileBuilder } from "@/components/profile/profile-builder";

export const metadata: Metadata = {
  title: "My Profile",
};

export default function ProfilePage() {
  return (
    <AppShell>
      <ProfileBuilder />
    </AppShell>
  );
}
