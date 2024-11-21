alter table "public"."profiles" drop constraint "profiles_username_key";

alter table "public"."profiles" drop constraint "username_length";

drop index if exists "public"."profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK (((username IS NULL) OR (char_length(username) >= 3))) not valid;

alter table "public"."profiles" validate constraint "username_length";


