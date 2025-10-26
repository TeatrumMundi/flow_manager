import type { JSX } from "react";

export interface FullUserProfile {
  id: number;
  email: string;
  role: { id: number; name: string; description: string | null } | null;
  createdAt: string | null;
  updatedAt: string | null;
  profile: {
    firstName: string | null;
    lastName: string | null;
    position: string | null;
    employmentType: string | null;
    supervisor: { id: number; email: string } | null;
    salaryRate: number | string | null;
    vacationDaysTotal: number | null;
  } | null;
  projects: Array<{
    id: number;
    name: string | null;
    roleOnProject: string | null;
    isArchived: boolean | null;
  }>;
}

export interface menuTile {
  icon: JSX.Element;
  label: string;
  href: string;
  accessibleByRoles?: string[];
}
