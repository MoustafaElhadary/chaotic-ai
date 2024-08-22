import { Toaster } from "@/components/ui/sonner";
import { checkAuth } from "@/lib/auth/utils";
import TrpcProvider from "@/lib/trpc/Provider";
import { ClerkProvider } from "@clerk/nextjs";
import { cookies } from "next/headers";

import AppHeader from "@/components/AppHeader";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
    <ClerkProvider>
      <TrpcProvider cookies={cookies().toString()}>
        <>{children}</>
        <Toaster richColors />
      </TrpcProvider>
    </ClerkProvider>
  );
}
