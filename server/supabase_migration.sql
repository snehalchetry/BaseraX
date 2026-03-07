-- HostelERP: Supabase Migration
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(10) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'parent', 'warden', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    avatar TEXT DEFAULT '',
    roll_number VARCHAR(50) UNIQUE,
    room_number VARCHAR(50),
    block VARCHAR(50),
    parent_id UUID REFERENCES users(id),
    warden_id UUID REFERENCES users(id),
    student_ids UUID[] DEFAULT '{}',
    assigned_block VARCHAR(50),
    refresh_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_roll_number ON users(roll_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ─── Complaints ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id),
    category VARCHAR(30) NOT NULL CHECK (category IN ('electrical', 'plumbing', 'furniture', 'cleaning', 'internet', 'other')),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    room_number VARCHAR(50),
    block VARCHAR(50),
    images TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'closed')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    assigned_to VARCHAR(200),
    assigned_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    timeline JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaints_student_id ON complaints(student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);

-- ─── Food Menus ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS food_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_start_date TIMESTAMPTZ NOT NULL,
    days JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_food_menus_week ON food_menus(week_start_date);
CREATE INDEX IF NOT EXISTS idx_food_menus_active ON food_menus(is_active);

-- ─── Notifications ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_id UUID,
    related_model VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ─── Outing Requests ───────────────────────────────────
CREATE TABLE IF NOT EXISTS outing_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id),
    parent_id UUID REFERENCES users(id),
    warden_id UUID REFERENCES users(id),
    date TIMESTAMPTZ NOT NULL,
    time_from VARCHAR(20) NOT NULL,
    time_to VARCHAR(20) NOT NULL,
    purpose VARCHAR(500) NOT NULL,
    destination VARCHAR(200) NOT NULL,
    emergency_contact VARCHAR(10),
    status VARCHAR(30) DEFAULT 'pending_parent' CHECK (status IN ('pending_parent', 'parent_approved', 'parent_rejected', 'pending_warden', 'warden_approved', 'warden_rejected', 'completed')),
    parent_comment TEXT DEFAULT '',
    warden_comment TEXT DEFAULT '',
    parent_action_at TIMESTAMPTZ,
    warden_action_at TIMESTAMPTZ,
    pass_code VARCHAR(50) UNIQUE,
    timeline JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outing_student ON outing_requests(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outing_parent ON outing_requests(parent_id, status);
CREATE INDEX IF NOT EXISTS idx_outing_warden ON outing_requests(warden_id, status);

-- ─── Auto-update updated_at trigger ────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_food_menus_updated_at BEFORE UPDATE ON food_menus FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_outing_requests_updated_at BEFORE UPDATE ON outing_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Disable RLS (this is a server-side only backend) ──
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE food_menus DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE outing_requests DISABLE ROW LEVEL SECURITY;
