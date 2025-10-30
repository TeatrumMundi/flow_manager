CREATE TABLE "employment_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"abbreviation" varchar(50) NOT NULL,
	CONSTRAINT "employment_types_name_key" UNIQUE("name"),
	CONSTRAINT "employment_types_abbreviation_key" UNIQUE("abbreviation")
);
--> statement-breakpoint
CREATE TABLE "financial_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"total_hours" numeric(10, 2),
	"total_costs" numeric(12, 2),
	"profit_margin" numeric(5, 2),
	"report_date" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"role_on_project" varchar(255),
	"assigned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_costs" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"type" varchar(100),
	"description" text,
	"amount" numeric(12, 2),
	"recorded_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"budget" numeric(12, 2),
	"start_date" date,
	"end_date" date,
	"is_archived" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"title" varchar(255),
	"description" text,
	"assigned_to_id" integer,
	"status" varchar(100),
	"estimated_hours" numeric(6, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"password_hash" text NOT NULL,
	"password_updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_credentials_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"position" varchar(255),
	"employment_type_id" integer,
	"supervisor_id" integer,
	"salary_rate" numeric(10, 2),
	"vacation_days_total" integer,
	CONSTRAINT "user_profiles_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	CONSTRAINT "user_roles_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"role_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vacations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"start_date" date,
	"end_date" date,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "work_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"task_id" integer,
	"project_id" integer,
	"date" date,
	"hours_worked" numeric(5, 2),
	"is_overtime" boolean DEFAULT false,
	"note" text
);
--> statement-breakpoint
ALTER TABLE "financial_reports" ADD CONSTRAINT "financial_reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_assignments" ADD CONSTRAINT "project_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_assignments" ADD CONSTRAINT "project_assignments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_costs" ADD CONSTRAINT "project_costs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_employment_type_id_fkey" FOREIGN KEY ("employment_type_id") REFERENCES "public"."employment_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vacations" ADD CONSTRAINT "vacations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_logs" ADD CONSTRAINT "work_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_logs" ADD CONSTRAINT "work_logs_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_logs" ADD CONSTRAINT "work_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;