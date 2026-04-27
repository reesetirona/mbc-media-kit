export interface KitRequest {
  client_name: string;
  industry: string;
  objective: string;
  audience: string;
  budget: string;
  selected_sbus: string[];
  notes: string;
  rep_name: string;
  rep_mobile: string;
  rep_email: string;
}

export interface KitContent {
  tagline: string;
  client_intro: string;
  client_why: string;
  sbu_1_name: string;
  sbu_1_desc: string;
  sbu_2_name: string;
  sbu_2_desc: string;
  sbu_3_name: string;
  sbu_3_desc: string;
  campaign_title: string;
  campaign_desc: string;
  deliverable_1: string;
  deliverable_2: string;
  deliverable_3: string;
  platform_1: string;
  pct_1: string;
  platform_2: string;
  pct_2: string;
  platform_3: string;
  pct_3: string;
  cta_line: string;
  recommended_sbus: string[];
}

export type GenerationStatus = "idle" | "loading" | "success" | "error";

export interface GeneratorState {
  status: GenerationStatus;
  loadingMessage: string;
  errorMessage: string;
  downloadUrl: string | null;
  filename: string | null;
}
