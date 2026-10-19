CREATE TABLE IF NOT EXISTS "api"."sv_appeals" (
	"id" text PRIMARY KEY NOT NULL,
	"created_by" text NOT NULL,
	"unit_id" text,
	"unit_name" text NOT NULL,
	"district" text NOT NULL,
	"blood_group" text NOT NULL,
	"urgency" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api"."sv_applications" (
	"user_id" text PRIMARY KEY NOT NULL,
	"unit_name" text NOT NULL,
	"district" text NOT NULL,
	"address" text NOT NULL,
	"professional_email" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api"."sv_donors" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"blood_group" text NOT NULL,
	"district" text NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"consent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api"."sv_memberships" (
	"user_id" text PRIMARY KEY NOT NULL,
	"unit_id" text,
	"role" text DEFAULT 'staff' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api"."sv_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"appeal_id" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api"."sv_responses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"appeal_id" text NOT NULL,
	"visit_day" text NOT NULL,
	"status" text DEFAULT 'interested' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api"."sv_units" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"district" text NOT NULL,
	"address" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api"."sv_appeals" ADD CONSTRAINT "sv_appeals_unit_id_sv_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "api"."sv_units"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api"."sv_memberships" ADD CONSTRAINT "sv_memberships_unit_id_sv_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "api"."sv_units"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api"."sv_reports" ADD CONSTRAINT "sv_reports_appeal_id_sv_appeals_id_fk" FOREIGN KEY ("appeal_id") REFERENCES "api"."sv_appeals"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api"."sv_responses" ADD CONSTRAINT "sv_responses_appeal_id_sv_appeals_id_fk" FOREIGN KEY ("appeal_id") REFERENCES "api"."sv_appeals"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sv_donor_appeal" ON "api"."sv_responses" USING btree ("user_id","appeal_id");