-- ============================================================
-- Agritha — Dev Seed Data
-- Run AFTER the initial schema migration
-- Use Supabase test OTP (123456) to log in as these users
-- ============================================================

-- NOTE: In dev, create users via the app (phone OTP flow with test code 123456)
-- Then paste their UUIDs here and run to add profile data

-- Example CHC seed (replace UUID with real user id from auth.users):
/*
INSERT INTO public.users (id, phone, role) VALUES
  ('replace-with-real-uuid', '+919876543210', 'chc');

INSERT INTO public.chc_profiles (user_id, name, description, location, address, district) VALUES
  ('replace-with-real-uuid',
   'Kumar Agri Services',
   'We provide tractors and harvesters for paddy fields in Thanjavur district.',
   ST_GeogFromText('SRID=4326;POINT(79.1378 10.7870)'),
   'Thanjavur, Tamil Nadu',
   'Thanjavur');

INSERT INTO public.equipment (chc_id, type, name, description, price_per_hour, price_per_day) VALUES
  ((SELECT id FROM public.chc_profiles WHERE name = 'Kumar Agri Services'),
   'tractor',
   'Mahindra 475 DI',
   'Heavy-duty tractor suitable for ploughing and tilling. 42HP engine.',
   350,
   2500);
*/
