import {
  boolean,
  date,
  foreignKey,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoles = pgTable(
  "user_roles",
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
  },
  (table) => [unique("user_roles_name_key").on(table.name)],
);

export const users = pgTable(
  "users",
  {
    id: serial().primaryKey().notNull(),
    email: varchar({ length: 255 }).notNull(),
    roleId: integer("role_id"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [userRoles.id],
      name: "users_role_id_fkey",
    }),
    unique("users_email_key").on(table.email),
  ],
);

export const userCredentials = pgTable(
  "user_credentials",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    passwordHash: text("password_hash").notNull(),
    passwordUpdatedAt: timestamp("password_updated_at", {
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_credentials_user_id_fkey",
    }),
    unique("user_credentials_user_id_key").on(table.userId),
  ],
);

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    position: varchar({ length: 255 }),
    employmentType: varchar("employment_type", { length: 100 }),
    supervisorId: integer("supervisor_id"),
    salaryRate: numeric("salary_rate", { precision: 10, scale: 2 }),
    vacationDaysTotal: integer("vacation_days_total"),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_profiles_user_id_fkey",
    }),
    foreignKey({
      columns: [table.supervisorId],
      foreignColumns: [users.id],
      name: "user_profiles_supervisor_id_fkey",
    }),
    unique("user_profiles_user_id_key").on(table.userId),
  ],
);

export const projectAssignments = pgTable(
  "project_assignments",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    projectId: integer("project_id").notNull(),
    roleOnProject: varchar("role_on_project", { length: 255 }),
    assignedAt: timestamp("assigned_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "project_assignments_user_id_fkey",
    }),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "project_assignments_project_id_fkey",
    }),
  ],
);

export const projects = pgTable("projects", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }),
  description: text(),
  budget: numeric({ precision: 12, scale: 2 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const tasks = pgTable(
  "tasks",
  {
    id: serial().primaryKey().notNull(),
    projectId: integer("project_id"),
    title: varchar({ length: 255 }),
    description: text(),
    assignedToId: integer("assigned_to_id"),
    status: varchar({ length: 100 }),
    estimatedHours: numeric("estimated_hours", { precision: 6, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "tasks_project_id_fkey",
    }),
    foreignKey({
      columns: [table.assignedToId],
      foreignColumns: [users.id],
      name: "tasks_assigned_to_id_fkey",
    }),
  ],
);

export const workLogs = pgTable(
  "work_logs",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id"),
    taskId: integer("task_id"),
    projectId: integer("project_id"),
    date: date(),
    hoursWorked: numeric("hours_worked", { precision: 5, scale: 2 }),
    isOvertime: boolean("is_overtime").default(false),
    note: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "work_logs_user_id_fkey",
    }),
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
      name: "work_logs_task_id_fkey",
    }),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "work_logs_project_id_fkey",
    }),
  ],
);

export const vacations = pgTable(
  "vacations",
  {
    id: serial().primaryKey().notNull(),
    userId: integer("user_id"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    status: varchar({ length: 50 }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "vacations_user_id_fkey",
    }),
  ],
);

export const projectCosts = pgTable(
  "project_costs",
  {
    id: serial().primaryKey().notNull(),
    projectId: integer("project_id"),
    type: varchar({ length: 100 }),
    description: text(),
    amount: numeric({ precision: 12, scale: 2 }),
    recordedAt: date("recorded_at").defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "project_costs_project_id_fkey",
    }),
  ],
);

export const financialReports = pgTable(
  "financial_reports",
  {
    id: serial().primaryKey().notNull(),
    projectId: integer("project_id"),
    totalHours: numeric("total_hours", { precision: 10, scale: 2 }),
    totalCosts: numeric("total_costs", { precision: 12, scale: 2 }),
    profitMargin: numeric("profit_margin", { precision: 5, scale: 2 }),
    reportDate: date("report_date").defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "financial_reports_project_id_fkey",
    }),
  ],
);
