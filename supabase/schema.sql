create extension if not exists "pgcrypto";
create table profiles(id uuid primary key default gen_random_uuid(),auth_user_id uuid unique,full_name text not null,email text unique not null,role text default 'student',program text);
create table student_process(id uuid primary key default gen_random_uuid(),profile_id uuid references profiles(id),phase text default 'F1',status text,progress int default 0,updated_at timestamptz default now());
create table student_documents(id uuid primary key default gen_random_uuid(),profile_id uuid references profiles(id),name text,status text default 'pending',drive_url text,observations text);
create table groups(id uuid primary key default gen_random_uuid(),name text,description text);
create table group_members(group_id uuid references groups(id),profile_id uuid references profiles(id),primary key(group_id,profile_id));
create table messages(id uuid primary key default gen_random_uuid(),group_id uuid references groups(id),author_id uuid references profiles(id),body text,created_at timestamptz default now());
create table appointments(id uuid primary key default gen_random_uuid(),profile_id uuid references profiles(id),title text,start_at timestamptz,meeting_url text,status text default 'scheduled');
create table notifications(id uuid primary key default gen_random_uuid(),profile_id uuid references profiles(id),title text,body text,read_at timestamptz);