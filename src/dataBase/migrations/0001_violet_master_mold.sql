CREATE TABLE "vacation_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "vacation_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "vacations" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "vacations" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "vacations" ADD COLUMN "status_id" integer;--> statement-breakpoint
ALTER TABLE "vacations" ADD COLUMN "type_id" integer;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "status" varchar(50);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "progress" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "vacations" ADD CONSTRAINT "vacations_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "public"."vacation_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vacations" ADD CONSTRAINT "vacations_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."vacation_statuses"("id") ON DELETE no action ON UPDATE no action;