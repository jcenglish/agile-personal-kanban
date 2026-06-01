export interface Board {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  columns: Column[];
}

export interface Column {
  id: string;
  board_id: string;
  name: string;
  position: number;
  is_done_column: boolean;
}

export interface Epic {
  id: string;
  board_id: string;
  name: string;
  color: string;
  description: string | null;
  created_at: string;
}

export type SprintStatus = "planning" | "active" | "completed";

export interface Sprint {
  id: string;
  board_id: string;
  name: string;
  goal: string | null;
  status: SprintStatus;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface SprintDetail extends Sprint {
  stories: Story[];
}

export type EnergyType = "physical" | "cognitive" | "emotional";

export interface Story {
  id: string;
  board_id: string;
  sprint_id: string | null;
  epic_id: string | null;
  column_id: string | null;
  title: string;
  description: string | null;
  points: number | null;
  position: number | null;
  is_urgent: boolean | null;
  is_important: boolean | null;
  energy_type: EnergyType | null;
  created_at: string;
  completed_at: string | null;
}

export interface Template {
  id: string;
  board_id: string;
  title: string;
  points: number | null;
  is_urgent: boolean | null;
  is_important: boolean | null;
  energy_type: EnergyType | null;
  epic_id: string | null;
  created_at: string;
}

export interface SprintSnapshot {
  id: string;
  sprint_id: string;
  snapshot_date: string;
  points_remaining: number;
  points_completed: number;
}

export interface BurndownPoint {
  date: string;
  ideal_remaining: number;
  actual_remaining: number;
}

export interface VelocityPoint {
  sprint_name: string;
  committed_points: number;
  completed_points: number;
}
