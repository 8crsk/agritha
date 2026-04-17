-- ============================================================
-- Agritha — Initial Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS (role extension on top of Supabase Auth)
-- ============================================================
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text,
  role text NOT NULL CHECK (role IN ('farmer', 'chc')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read and update their own record"
  ON public.users FOR ALL
  USING (auth.uid() = id);

-- ============================================================
-- FARMER PROFILES
-- ============================================================
CREATE TABLE public.farmer_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  village text,
  district text,
  state text DEFAULT 'Tamil Nadu',
  language_pref text DEFAULT 'en' CHECK (language_pref IN ('en', 'ta', 'hi')),
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmer can manage own profile"
  ON public.farmer_profiles FOR ALL
  USING (auth.uid() = user_id);
CREATE POLICY "All authenticated users can read farmer profiles"
  ON public.farmer_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- CHC PROFILES
-- ============================================================
CREATE TABLE public.chc_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  location geography(POINT, 4326),
  address text,
  district text,
  state text DEFAULT 'Tamil Nadu',
  phone text,
  avatar_url text,
  verified boolean DEFAULT false,
  rating numeric(2,1) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX chc_profiles_location_idx ON public.chc_profiles USING GIST (location);

ALTER TABLE public.chc_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CHC can manage own profile"
  ON public.chc_profiles FOR ALL
  USING (auth.uid() = user_id);
CREATE POLICY "All authenticated users can read CHC profiles"
  ON public.chc_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- EQUIPMENT
-- ============================================================
CREATE TABLE public.equipment (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  chc_id uuid NOT NULL REFERENCES public.chc_profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('tractor', 'harvester', 'transport', 'other')),
  name text NOT NULL,
  description text,
  price_per_hour numeric,
  price_per_day numeric,
  images text[] DEFAULT '{}',
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CHC can manage own equipment"
  ON public.equipment FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM public.chc_profiles WHERE id = chc_id)
  );
CREATE POLICY "All authenticated users can read available equipment"
  ON public.equipment FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id uuid NOT NULL REFERENCES public.farmer_profiles(id) ON DELETE CASCADE,
  chc_id uuid NOT NULL REFERENCES public.chc_profiles(id) ON DELETE CASCADE,
  equipment_id uuid NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  payment_type text NOT NULL CHECK (payment_type IN ('upi', 'cash')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  total_amount numeric NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX bookings_farmer_id_idx ON public.bookings (farmer_id);
CREATE INDEX bookings_chc_id_idx ON public.bookings (chc_id);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmer can see own bookings"
  ON public.bookings FOR SELECT
  USING (
    auth.uid() = (SELECT user_id FROM public.farmer_profiles WHERE id = farmer_id)
  );
CREATE POLICY "Farmer can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.farmer_profiles WHERE id = farmer_id)
  );
CREATE POLICY "CHC can see bookings for their equipment"
  ON public.bookings FOR SELECT
  USING (
    auth.uid() = (SELECT user_id FROM public.chc_profiles WHERE id = chc_id)
  );
CREATE POLICY "CHC can update booking status"
  ON public.bookings FOR UPDATE
  USING (
    auth.uid() = (SELECT user_id FROM public.chc_profiles WHERE id = chc_id)
  );

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount numeric NOT NULL,
  status text DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Booking participants can read payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
      AND (
        auth.uid() = (SELECT user_id FROM public.farmer_profiles WHERE id = b.farmer_id)
        OR
        auth.uid() = (SELECT user_id FROM public.chc_profiles WHERE id = b.chc_id)
      )
    )
  );

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES public.users(id),
  reviewee_id uuid NOT NULL REFERENCES public.users(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All authenticated users can read reviews"
  ON public.reviews FOR SELECT
  USING (auth.role() = 'authenticated');
CREATE POLICY "Reviewer can create review"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Auto-update CHC rating when a review is added
CREATE OR REPLACE FUNCTION update_chc_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chc_profiles
  SET
    rating = (
      SELECT ROUND(AVG(r.rating)::numeric, 1)
      FROM public.reviews r
      JOIN public.bookings b ON b.id = r.booking_id
      JOIN public.chc_profiles c ON c.id = b.chc_id
      WHERE c.user_id = NEW.reviewee_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews r
      JOIN public.bookings b ON b.id = r.booking_id
      JOIN public.chc_profiles c ON c.id = b.chc_id
      WHERE c.user_id = NEW.reviewee_id
    )
  WHERE user_id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_chc_rating();

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id uuid NOT NULL REFERENCES public.farmer_profiles(id) ON DELETE CASCADE,
  chc_id uuid NOT NULL REFERENCES public.chc_profiles(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(farmer_id, chc_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can read their conversations"
  ON public.conversations FOR SELECT
  USING (
    auth.uid() = (SELECT user_id FROM public.farmer_profiles WHERE id = farmer_id)
    OR
    auth.uid() = (SELECT user_id FROM public.chc_profiles WHERE id = chc_id)
  );
CREATE POLICY "Participants can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.farmer_profiles WHERE id = farmer_id)
    OR
    auth.uid() = (SELECT user_id FROM public.chc_profiles WHERE id = chc_id)
  );

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.users(id),
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX messages_conversation_created_idx ON public.messages (conversation_id, created_at);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can read messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (
        auth.uid() = (SELECT user_id FROM public.farmer_profiles WHERE id = c.farmer_id)
        OR
        auth.uid() = (SELECT user_id FROM public.chc_profiles WHERE id = c.chc_id)
      )
    )
  );
CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
