-- SQL script to seed users into Supabase
-- Run this in the Supabase SQL Editor

-- 1. Create table if it doesn't exist (ensuring schema matches requirements)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  cpf TEXT,
  role TEXT DEFAULT 'user',
  bairro TEXT,
  cep TEXT,
  cidade TEXT,
  estado TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert MASTER User (Anthony)
INSERT INTO public.users (email, password_hash, name, role, phone, cpf, bairro, cep, cidade, estado)
VALUES (
  'Anthony.aacdm@gmail.com',
  '070117Ar!', -- NOTE: For production, this should be hashed (e.g., bcrypt) or use Supabase Auth
  'Anthony',
  'master',
  '81997015454',
  '00000000000',
  'Centro',
  '00000-000',
  'Recife',
  'PE'
) ON CONFLICT (email) DO NOTHING;

-- 3. Insert ADMIN User (Andrew)
INSERT INTO public.users (email, password_hash, name, role, phone, cpf, bairro, cep, cidade, estado)
VALUES (
  'Anthonyandrewcdm@gmail.com',
  'Admgerenciador!', -- NOTE: For production, this should be hashed
  'Andrew',
  'admin',
  '81997015454',
  '11111111111',
  'Centro',
  '00000-000',
  'Recife',
  'PE'
) ON CONFLICT (email) DO NOTHING;