export type UserRole = 'patient' | 'doctor' | 'admin';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type Language = 'am' | 'en';
export type Urgency = 'low' | 'medium' | 'high';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  date_of_birth: string | null;
  address: string | null;
  emergency_contact: string | null;
  role: UserRole;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  datetime: string;
  status: AppointmentStatus;
  reason: string;
  notes: string | null;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  diagnosis: string;
  treatment_plan: string | null;
  prescription: Record<string, unknown> | null;
  ai_suggestions: string | null;
  attachments: string[] | null;
  visit_date: string;
  created_at: string;
}

export interface AiChatSession {
  id: string;
  patient_id: string;
  started_at: string;
  language: Language;
}

export interface AiChatMessage {
  id: string;
  session_id: string;
  sender: 'patient' | 'ai';
  message: string;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

// Minimal typed surface for supabase-js generics. Extend via `supabase gen types`
// once your project is live for full inference on every query.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      appointments: {
        Row: Appointment;
        Insert: Partial<Appointment> & Pick<Appointment, 'patient_id' | 'datetime' | 'reason'>;
        Update: Partial<Appointment>;
        Relationships: [];
      };
      medical_records: {
        Row: MedicalRecord;
        Insert: Partial<MedicalRecord> & Pick<MedicalRecord, 'patient_id' | 'doctor_id' | 'diagnosis'>;
        Update: Partial<MedicalRecord>;
        Relationships: [];
      };
      ai_chat_sessions: {
        Row: AiChatSession;
        Insert: Partial<AiChatSession> & Pick<AiChatSession, 'patient_id' | 'language'>;
        Update: Partial<AiChatSession>;
        Relationships: [];
      };
      ai_chat_messages: {
        Row: AiChatMessage;
        Insert: Partial<AiChatMessage> & Pick<AiChatMessage, 'session_id' | 'sender' | 'message'>;
        Update: Partial<AiChatMessage>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: Partial<NotificationRow> & Pick<NotificationRow, 'user_id' | 'title' | 'body'>;
        Update: Partial<NotificationRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
