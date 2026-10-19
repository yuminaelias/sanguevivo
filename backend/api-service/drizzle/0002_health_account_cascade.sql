ALTER TABLE api.sv_donors ADD CONSTRAINT sv_donors_user_fk FOREIGN KEY (user_id) REFERENCES auth."user"(id) ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE api.sv_appeals ADD CONSTRAINT sv_appeals_user_fk FOREIGN KEY (created_by) REFERENCES auth."user"(id) ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE api.sv_responses ADD CONSTRAINT sv_responses_user_fk FOREIGN KEY (user_id) REFERENCES auth."user"(id) ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE api.sv_memberships ADD CONSTRAINT sv_memberships_user_fk FOREIGN KEY (user_id) REFERENCES auth."user"(id) ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE api.sv_applications ADD CONSTRAINT sv_applications_user_fk FOREIGN KEY (user_id) REFERENCES auth."user"(id) ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE api.sv_reports ADD CONSTRAINT sv_reports_user_fk FOREIGN KEY (user_id) REFERENCES auth."user"(id) ON DELETE CASCADE;
