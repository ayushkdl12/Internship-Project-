"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(required?: boolean, requiredRole?: string) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (required && status === "unauthenticated") {
      router.push("/login");
    }

    if (
      requiredRole &&
      session?.user?.role &&
      session.user.role !== requiredRole &&
      session.user.role !== "admin"
    ) {
      // Redirect to appropriate dashboard based on role
      const roleRoutes: Record<string, string> = {
        student: "/dashboard/student",
        organization: "/dashboard/organization",
        college: "/dashboard/college",
        admin: "/dashboard/admin",
      };
      router.push(roleRoutes[session.user.role] || "/");
    }
  }, [session, status, required, requiredRole, router]);

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    role: session?.user?.role,
  };
}
