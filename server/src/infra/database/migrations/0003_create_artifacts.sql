CREATE TABLE "artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"root_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"period" text NOT NULL,
	"range_from" timestamp with time zone NOT NULL,
	"range_to" timestamp with time zone NOT NULL,
	"timezone" text NOT NULL,
	"providers" text[] NOT NULL,
	"payload" jsonb NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "artifacts_user_generated_idx" ON "artifacts" USING btree ("user_id","generated_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "artifacts_root_generated_idx" ON "artifacts" USING btree ("root_id","generated_at" DESC NULLS LAST);