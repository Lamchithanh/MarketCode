import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "x-client-info": "market-code@1.0.0",
    },
  },
});

// Admin client with service role key (for server-side operations)
// Using SERVICE ROLE for full database access - Admin/Roles server
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "x-client-info": "market-code-admin@1.0.0",
      },
    },
  }
);

// Primary client using SERVICE ROLE for this roles/admin server
export const supabaseServiceRole = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "x-client-info": "market-code-service-role@1.0.0",
      },
    },
  }
);

// Types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      User: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string;
          role: "USER" | "ADMIN";
          avatar: string | null;
          isActive: boolean;
          lastLoginAt: string | null;
          emailVerified: string | null;
          createdAt: string;
          updatedAt: string;
          deletedAt: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password: string;
          role?: "USER" | "ADMIN";
          avatar?: string | null;
          isActive?: boolean;
          lastLoginAt?: string | null;
          emailVerified?: string | null;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password?: string;
          role?: "USER" | "ADMIN";
          avatar?: string | null;
          isActive?: boolean;
          lastLoginAt?: string | null;
          emailVerified?: string | null;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string | null;
        };
      };
      Product: {
        Row: {
          id: string;
          userId: string;
          categoryId: string;
          title: string;
          slug: string;
          description: string | null;
          price: number;
          thumbnailUrl: string | null;
          fileUrl: string | null;
          demoUrl: string | null;
          githubUrl: string | null;
          downloadCount: number;
          viewCount: number;
          isActive: boolean;
          technologies: string[];
          fileSize: number | null;
          createdAt: string;
          updatedAt: string;
          deletedAt: string | null;
        };
        Insert: {
          id?: string;
          userId: string;
          categoryId: string;
          title: string;
          slug: string;
          description?: string | null;
          price: number;
          thumbnailUrl?: string | null;
          fileUrl?: string | null;
          demoUrl?: string | null;
          githubUrl?: string | null;
          downloadCount?: number;
          viewCount?: number;
          isActive?: boolean;
          technologies?: string[];
          fileSize?: number | null;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string | null;
        };
        Update: {
          id?: string;
          userId?: string;
          categoryId?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          thumbnailUrl?: string | null;
          fileUrl?: string | null;
          demoUrl?: string | null;
          githubUrl?: string | null;
          downloadCount?: number;
          viewCount?: number;
          isActive?: boolean;
          technologies?: string[];
          fileSize?: number | null;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string | null;
        };
      };
      // Add other table types as needed...
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      Role: "USER" | "ADMIN";
      PaymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
      OrderStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
      VerificationCodeType: "EMAIL_VERIFICATION" | "PASSWORD_RESET";
    };
  };
};
