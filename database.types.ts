export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      exercise_data: {
        Row: {
          author_id: string
          created_at: string | null
          data: Json
          exercise_id: string
          id: string
          is_reviewed: boolean | null
        }
        Insert: {
          author_id: string
          created_at?: string | null
          data: Json
          exercise_id: string
          id?: string
          is_reviewed?: boolean | null
        }
        Update: {
          author_id?: string
          created_at?: string | null
          data?: Json
          exercise_id?: string
          id?: string
          is_reviewed?: boolean | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          created_at: string | null
          created_by: string
          deadline: Json
          id: string
          review_type:
            | Database["public"]["Enums"]["exercise_review_type"]
            | null
          slug: string
          status: Database["public"]["Enums"]["exercise_status"] | null
          team_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          deadline: Json
          id?: string
          review_type?:
            | Database["public"]["Enums"]["exercise_review_type"]
            | null
          slug: string
          status?: Database["public"]["Enums"]["exercise_status"] | null
          team_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          deadline?: Json
          id?: string
          review_type?:
            | Database["public"]["Enums"]["exercise_review_type"]
            | null
          slug?: string
          status?: Database["public"]["Enums"]["exercise_status"] | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          is_read: boolean
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
          is_read?: boolean
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          is_read?: boolean
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          id: string
          last_name: string | null
          notification_preferences: Json
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          notification_preferences?: Json
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notification_preferences?: Json
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string
          status: Database["public"]["Enums"]["team_invitation_status"] | null
          team_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by: string
          status?: Database["public"]["Enums"]["team_invitation_status"] | null
          team_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string
          status?: Database["public"]["Enums"]["team_invitation_status"] | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          avatar_url: string | null
          description: string | null
          first_name: string | null
          joined_at: string | null
          last_name: string | null
          profile_name: string | null
          role: Database["public"]["Enums"]["team_role"] | null
          team_id: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          description?: string | null
          first_name?: string | null
          joined_at?: string | null
          last_name?: string | null
          profile_name?: string | null
          role?: Database["public"]["Enums"]["team_role"] | null
          team_id: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          description?: string | null
          first_name?: string | null
          joined_at?: string | null
          last_name?: string | null
          profile_name?: string | null
          role?: Database["public"]["Enums"]["team_role"] | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          team_code: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          team_code?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          team_code?: string | null
        }
        Relationships: []
      }
      web_push_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          subscription: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          subscription: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          subscription?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "web_push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      team_members_view: {
        Row: {
          team_id: string | null
          team_members: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_permissions: {
        Row: {
          team_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_exercise_deadlines: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_team_management_permission: {
        Args: {
          team_id: string
          user_id: string
        }
        Returns: boolean
      }
      check_upcoming_deadlines: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_user_exists: {
        Args: {
          email_input: string
        }
        Returns: boolean
      }
      create_deadline_notification: {
        Args: {
          p_exercise_id: string
          p_deadline_type: string
        }
        Returns: undefined
      }
      create_exercise_status_notification: {
        Args: {
          p_exercise_id: string
        }
        Returns: undefined
      }
      create_new_exercise_notification: {
        Args: {
          p_exercise_id: string
        }
        Returns: undefined
      }
      create_team_invitation_notification:
        | {
            Args: {
              p_user_id: string
              p_team_id: string
              p_team_name: string
              p_inviter_name: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_user_id: string
              p_team_id: string
              p_team_name: string
              p_inviter_name: string
              p_invitation_id: string
            }
            Returns: undefined
          }
      current_user_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_team_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_active_exercises: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          team_id: string
          created_by: string
          created_at: string
          status: Database["public"]["Enums"]["exercise_status"]
          review_type: Database["public"]["Enums"]["exercise_review_type"]
          deadline: Json
          slug: string
          team_name: string
          creator_name: string
        }[]
      }
      get_my_profile: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["CompositeTypes"]["profile_response"]
      }
      get_pending_users:
        | {
            Args: {
              p_exercise_id: string
              p_status: Database["public"]["Enums"]["exercise_status"]
            }
            Returns: {
              user_id: string
              first_name: string
              last_name: string
              profile_name: string
            }[]
          }
        | {
            Args: {
              p_exercise_id: string
              p_status: Database["public"]["Enums"]["exercise_status"]
              p_current_user: string
            }
            Returns: {
              user_id: string
              first_name: string
              last_name: string
              profile_name: string
            }[]
          }
      get_team_exercise_data: {
        Args: {
          p_exercise_id: string
        }
        Returns: {
          id: string
          exercise_id: string
          author_id: string
          data: Json
          created_at: string
          is_reviewed: boolean
          author_name: string
        }[]
      }
      get_ttm_exercise_data: {
        Args: {
          p_user_id: string
        }
        Returns: {
          exercise_id: string
          author_id: string
          data: Json
          is_reviewed: boolean
          created_at: string
          exercise_status: Database["public"]["Enums"]["exercise_status"]
          exercise_deadline: Json
        }[]
      }
      get_user_email: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      get_user_team_exercises: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          team_id: string
          created_by: string
          created_at: string
          status: Database["public"]["Enums"]["exercise_status"]
          review_type: Database["public"]["Enums"]["exercise_review_type"]
          deadline: Json
          slug: string
          team_name: string
          team_members: Json
        }[]
      }
      increment_exercise_vote: {
        Args: {
          p_exercise_data_id: string
          p_json_path: string[]
        }
        Returns: Json
      }
      is_username_available: {
        Args: {
          p_username: string
        }
        Returns: boolean
      }
      join_team_by_code: {
        Args: {
          team_code_input: string
        }
        Returns: string
      }
      join_team_by_invitation: {
        Args: {
          invitation_id: string
          p_user_id: string
        }
        Returns: string
      }
      mark_notification_read: {
        Args: {
          p_notification_id: string
        }
        Returns: boolean
      }
      schedule_deadline_check: {
        Args: {
          exercise_id: string
          deadline_time: string
          new_status: string
        }
        Returns: undefined
      }
      sync_team_member_profile: {
        Args: {
          p_team_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      update_notification_preferences: {
        Args: {
          p_push_enabled?: boolean
          p_notification_settings?: Json
        }
        Returns: Json
      }
      update_profile: {
        Args: {
          p_username?: string
          p_first_name?: string
          p_last_name?: string
          p_avatar_url?: string
        }
        Returns: Database["public"]["CompositeTypes"]["profile_response"]
      }
      update_team_member_profile: {
        Args: {
          p_team_id: string
          p_profile_name?: string
          p_description?: string
        }
        Returns: Json
      }
      update_team_member_profile_name: {
        Args: {
          p_team_id: string
          p_profile_name: string
        }
        Returns: boolean
      }
    }
    Enums: {
      exercise_review_type: "read_only" | "vote"
      exercise_status: "writing" | "reviewing" | "completed"
      notification_type:
        | "team_invitation"
        | "exercise_status_change"
        | "new_exercise"
        | "upcoming_deadline"
      team_invitation_status:
        | "pending"
        | "awaiting_signup"
        | "accepted"
        | "rejected"
        | "expired"
      team_role: "member" | "facilitator"
    }
    CompositeTypes: {
      profile_response: {
        id: string | null
        username: string | null
        first_name: string | null
        last_name: string | null
        avatar_url: string | null
        updated_at: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

