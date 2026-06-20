-- Optional demo data. Run AFTER 0001_init.sql, and after you have created
-- at least one real auth user (e.g. via the Register page) so you have a
-- real auth.users id to promote. Two common ways to use this file:
--
-- 1) Promote yourself to admin/doctor after registering normally:
--    update profiles set role = 'admin' where id = '<your-user-uuid>';
--
-- 2) For richer demo data (sample appointments / records), replace the
--    placeholder UUIDs below with real ids from `select id, email from auth.users;`
--    then run the inserts.

-- Example: promote a user to doctor
-- update profiles set role = 'doctor', full_name = 'Dr. Hana Bekele' where id = '00000000-0000-0000-0000-000000000000';

-- Example: promote a user to admin
-- update profiles set role = 'admin' where id = '00000000-0000-0000-0000-000000000000';

-- Example: seed a sample appointment between a patient and doctor you've created
-- insert into appointments (patient_id, doctor_id, datetime, status, reason)
-- values (
--   '11111111-1111-1111-1111-111111111111', -- patient id
--   '22222222-2222-2222-2222-222222222222', -- doctor id
--   now() + interval '2 days',
--   'confirmed',
--   'Routine cleaning and checkup'
-- );

-- Example: seed a sample medical record
-- insert into medical_records (patient_id, doctor_id, diagnosis, treatment_plan, visit_date)
-- values (
--   '11111111-1111-1111-1111-111111111111',
--   '22222222-2222-2222-2222-222222222222',
--   'Mild gingivitis, plaque buildup along the gumline',
--   'Professional cleaning, improved brushing technique, follow-up in 6 months',
--   current_date - interval '30 days'
-- );
