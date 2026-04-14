/*
  # Multi-Agent System Database Schema

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `goal_text` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, references goals)
      - `task_text` (text)
      - `priority` (text)
      - `completed` (boolean)
      - `created_at` (timestamptz)
    
    - `schedules`
      - `id` (uuid, primary key)
      - `task_id` (uuid, references tasks)
      - `scheduled_date` (date)
      - `created_at` (timestamptz)
    
    - `decisions`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, references goals)
      - `path_type` (text)
      - `summary` (text)
      - `outcome` (text)
      - `risk` (integer)
      - `success` (integer)
      - `is_recommended` (boolean)
      - `created_at` (timestamptz)
    
    - `memory_logs`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, references goals)
      - `log_data` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_text text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  task_text text NOT NULL,
  priority text DEFAULT 'medium',
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  path_type text NOT NULL,
  summary text NOT NULL,
  outcome text NOT NULL,
  risk integer NOT NULL,
  success integer NOT NULL,
  is_recommended boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS memory_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  log_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = tasks.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = tasks.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = tasks.goal_id
    AND goals.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = tasks.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = tasks.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own schedules"
  ON schedules FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tasks
    JOIN goals ON goals.id = tasks.goal_id
    WHERE tasks.id = schedules.task_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own schedules"
  ON schedules FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM tasks
    JOIN goals ON goals.id = tasks.goal_id
    WHERE tasks.id = schedules.task_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own schedules"
  ON schedules FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tasks
    JOIN goals ON goals.id = tasks.goal_id
    WHERE tasks.id = schedules.task_id
    AND goals.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM tasks
    JOIN goals ON goals.id = tasks.goal_id
    WHERE tasks.id = schedules.task_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own schedules"
  ON schedules FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tasks
    JOIN goals ON goals.id = tasks.goal_id
    WHERE tasks.id = schedules.task_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own decisions"
  ON decisions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = decisions.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own decisions"
  ON decisions FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = decisions.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own decisions"
  ON decisions FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = decisions.goal_id
    AND goals.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = decisions.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own decisions"
  ON decisions FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = decisions.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own memory logs"
  ON memory_logs FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = memory_logs.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own memory logs"
  ON memory_logs FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = memory_logs.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own memory logs"
  ON memory_logs FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = memory_logs.goal_id
    AND goals.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = memory_logs.goal_id
    AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own memory logs"
  ON memory_logs FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = memory_logs.goal_id
    AND goals.user_id = auth.uid()
  ));