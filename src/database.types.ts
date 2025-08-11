export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  dt_dwh: {
    Tables: {
      _debug_test: {
        Row: {
          data: string;
          id: number;
        };
        Insert: {
          data: string;
          id?: number;
        };
        Update: {
          data?: string;
          id?: number;
        };
        Relationships: [];
      };
      m_bank: {
        Row: {
          boActive: boolean;
          boEWallet: boolean;
          boLocalBank: boolean;
          boStatus: boolean;
          daCreatedAt: string;
          daUpdatedAt: string;
          inBankTypeCode: number;
          txBankName: string;
          uiBankId: string;
        };
        Insert: {
          boActive?: boolean;
          boEWallet?: boolean;
          boLocalBank?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inBankTypeCode?: number;
          txBankName: string;
          uiBankId?: string;
        };
        Update: {
          boActive?: boolean;
          boEWallet?: boolean;
          boLocalBank?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inBankTypeCode?: number;
          txBankName?: string;
          uiBankId?: string;
        };
        Relationships: [];
      };
      m_category: {
        Row: {
          boActive: boolean;
          boStatus: boolean;
          daCreatedAt: string;
          daUpdatedAt: string;
          inCategoryID: number;
          txCategoryDescription: string | null;
          txCategoryName: string;
          uiCategoryID: string;
        };
        Insert: {
          boActive?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inCategoryID?: number;
          txCategoryDescription?: string | null;
          txCategoryName: string;
          uiCategoryID?: string;
        };
        Update: {
          boActive?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inCategoryID?: number;
          txCategoryDescription?: string | null;
          txCategoryName?: string;
          uiCategoryID?: string;
        };
        Relationships: [];
      };
      m_company: {
        Row: {
          boActive: boolean;
          boStatus: boolean;
          daCreatedAt: string;
          daUpdatedAt: string;
          inCompanyCode: number;
          inCompanyTypeCode: number;
          txCompanyDetails: string | null;
          txCompanyName: string;
          uiCompanyId: string;
        };
        Insert: {
          boActive: boolean;
          boStatus: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inCompanyCode?: number;
          inCompanyTypeCode: number;
          txCompanyDetails?: string | null;
          txCompanyName: string;
          uiCompanyId?: string;
        };
        Update: {
          boActive?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inCompanyCode?: number;
          inCompanyTypeCode?: number;
          txCompanyDetails?: string | null;
          txCompanyName?: string;
          uiCompanyId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "m_company_inCompanyTypeCode_fkey";
            columns: ["inCompanyTypeCode"];
            isOneToOne: false;
            referencedRelation: "m_company_type";
            referencedColumns: ["inCompanyTypeCode"];
          },
        ];
      };
      m_company_type: {
        Row: {
          boActive: boolean;
          boStatus: boolean;
          daCreatedAt: string;
          daUpdatedAt: string;
          inCompanyTypeCode: number;
          txLongCompanyTypeName: string;
          txShortCompanyTypeName: string;
          uiCompanyTypeId: string;
        };
        Insert: {
          boActive: boolean;
          boStatus: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inCompanyTypeCode?: number;
          txLongCompanyTypeName: string;
          txShortCompanyTypeName: string;
          uiCompanyTypeId?: string;
        };
        Update: {
          boActive?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inCompanyTypeCode?: number;
          txLongCompanyTypeName?: string;
          txShortCompanyTypeName?: string;
          uiCompanyTypeId?: string;
        };
        Relationships: [];
      };
      m_employees: {
        Row: {
          boActive: boolean;
          boHasAdminAccess: boolean;
          boMarriageStatus: boolean;
          boStatus: boolean;
          daCreatedAt: string;
          daDateOfBirth: string;
          daJoinDate: string;
          daUpdatedAt: string;
          flSalary: number;
          inBankTypeCode: number;
          inCompanyCode: number;
          inEmploymentTypeCode: number;
          inMonth: number;
          inNumOfDeps: number;
          inReligionCode: number;
          inRoleCode: number;
          inYear: number;
          txBankAccountNumber: string;
          txEmailAddress: string;
          txEmployeeCode: string;
          txFullName: string;
          txHomeAddress: string;
          txNationalIdNumber: string;
          txPhoneNumber: string;
          txTaxNumber: string;
          uiEmployeeId: string;
          uiUserID: string | null;
        };
        Insert: {
          boActive: boolean;
          boHasAdminAccess?: boolean;
          boMarriageStatus: boolean;
          boStatus: boolean;
          daCreatedAt?: string;
          daDateOfBirth: string;
          daJoinDate: string;
          daUpdatedAt?: string;
          flSalary: number;
          inBankTypeCode: number;
          inCompanyCode: number;
          inEmploymentTypeCode: number;
          inMonth: number;
          inNumOfDeps: number;
          inReligionCode: number;
          inRoleCode: number;
          inYear: number;
          txBankAccountNumber: string;
          txEmailAddress: string;
          txEmployeeCode: string;
          txFullName: string;
          txHomeAddress: string;
          txNationalIdNumber: string;
          txPhoneNumber: string;
          txTaxNumber: string;
          uiEmployeeId?: string;
          uiUserID?: string | null;
        };
        Update: {
          boActive?: boolean;
          boHasAdminAccess?: boolean;
          boMarriageStatus?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daDateOfBirth?: string;
          daJoinDate?: string;
          daUpdatedAt?: string;
          flSalary?: number;
          inBankTypeCode?: number;
          inCompanyCode?: number;
          inEmploymentTypeCode?: number;
          inMonth?: number;
          inNumOfDeps?: number;
          inReligionCode?: number;
          inRoleCode?: number;
          inYear?: number;
          txBankAccountNumber?: string;
          txEmailAddress?: string;
          txEmployeeCode?: string;
          txFullName?: string;
          txHomeAddress?: string;
          txNationalIdNumber?: string;
          txPhoneNumber?: string;
          txTaxNumber?: string;
          uiEmployeeId?: string;
          uiUserID?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "m_employees_inBankTypeCode_fkey";
            columns: ["inBankTypeCode"];
            isOneToOne: false;
            referencedRelation: "m_bank";
            referencedColumns: ["inBankTypeCode"];
          },
          {
            foreignKeyName: "m_employees_inCompanyCode_fkey";
            columns: ["inCompanyCode"];
            isOneToOne: false;
            referencedRelation: "m_company";
            referencedColumns: ["inCompanyCode"];
          },
          {
            foreignKeyName: "m_employees_inEmploymentTypeCode_fkey";
            columns: ["inEmploymentTypeCode"];
            isOneToOne: false;
            referencedRelation: "m_employment";
            referencedColumns: ["inEmploymentTypeCode"];
          },
          {
            foreignKeyName: "m_employees_inReligionCode_fkey";
            columns: ["inReligionCode"];
            isOneToOne: false;
            referencedRelation: "m_religion";
            referencedColumns: ["inReligionCode"];
          },
          {
            foreignKeyName: "m_employees_inRoleCode_fkey";
            columns: ["inRoleCode"];
            isOneToOne: false;
            referencedRelation: "m_roles";
            referencedColumns: ["inRoleCode"];
          },
        ];
      };
      m_employment: {
        Row: {
          boActive: boolean;
          boStatus: boolean;
          daCreatedAt: string;
          daUpdatedAt: string;
          inEmploymentTypeCode: number;
          txEmploymentTypeName: string;
          uiEmploymentId: string;
        };
        Insert: {
          boActive: boolean;
          boStatus: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inEmploymentTypeCode?: number;
          txEmploymentTypeName: string;
          uiEmploymentId?: string;
        };
        Update: {
          boActive?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inEmploymentTypeCode?: number;
          txEmploymentTypeName?: string;
          uiEmploymentId?: string;
        };
        Relationships: [];
      };
      m_position: {
        Row: {
          boActive: boolean;
          boStatus: boolean;
          daCreatedAt: string;
          daUpdatedAt: string;
          inPositionCode: number;
          txPositionDetails: string | null;
          txPositionName: string;
          uiPositionId: string;
        };
        Insert: {
          boActive?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inPositionCode?: number;
          txPositionDetails?: string | null;
          txPositionName: string;
          uiPositionId?: string;
        };
        Update: {
          boActive?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inPositionCode?: number;
          txPositionDetails?: string | null;
          txPositionName?: string;
          uiPositionId?: string;
        };
        Relationships: [];
      };
      m_religion: {
        Row: {
          boActive: boolean;
          boStatus: boolean;
          daCreatedAt: string;
          daUpdatedAt: string;
          inReligionCode: number;
          txReligionName: string;
          uiReligionId: string;
        };
        Insert: {
          boActive: boolean;
          boStatus: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inReligionCode?: number;
          txReligionName: string;
          uiReligionId?: string;
        };
        Update: {
          boActive?: boolean;
          boStatus?: boolean;
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inReligionCode?: number;
          txReligionName?: string;
          uiReligionId?: string;
        };
        Relationships: [];
      };
      m_roles: {
        Row: {
          daCreatedAt: string;
          daUpdatedAt: string;
          inRoleCode: number;
          txLongRoleName: string;
          txRoleDescription: string | null;
          txShortRoleName: string | null;
          uiRolesId: string;
        };
        Insert: {
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inRoleCode?: number;
          txLongRoleName: string;
          txRoleDescription?: string | null;
          txShortRoleName?: string | null;
          uiRolesId?: string;
        };
        Update: {
          daCreatedAt?: string;
          daUpdatedAt?: string;
          inRoleCode?: number;
          txLongRoleName?: string;
          txRoleDescription?: string | null;
          txShortRoleName?: string | null;
          uiRolesId?: string;
        };
        Relationships: [];
      };
      reimbursement_items: {
        Row: {
          daCreatedAt: string;
          daUpdatedAt: string;
          deIndividualPrice: number;
          deTotalPrice: number;
          inQuantity: number;
          txName: string;
          txReimbursementNoteID: string;
          uiReimbursementItemID: string;
        };
        Insert: {
          daCreatedAt?: string;
          daUpdatedAt?: string;
          deIndividualPrice: number;
          deTotalPrice: number;
          inQuantity: number;
          txName: string;
          txReimbursementNoteID: string;
          uiReimbursementItemID?: string;
        };
        Update: {
          daCreatedAt?: string;
          daUpdatedAt?: string;
          deIndividualPrice?: number;
          deTotalPrice?: number;
          inQuantity?: number;
          txName?: string;
          txReimbursementNoteID?: string;
          uiReimbursementItemID?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reimbursement_items_txReimbursementNoteID_fkey";
            columns: ["txReimbursementNoteID"];
            isOneToOne: false;
            referencedRelation: "reimbursement_notes";
            referencedColumns: ["txReimbursementNoteID"];
          },
        ];
      };
      reimbursement_notes: {
        Row: {
          daCreatedAt: string;
          daUpdatedAt: string;
          dcNominalReimbursement: number;
          inBankTypeCode: number;
          inCategoryID: number;
          inRecipientCompanyCode: number;
          txBankAccountCode: string;
          txChangedBy: string | null;
          txChangeReason: string | null;
          txCurrency: string;
          txDescriptionDetails: string | null;
          txEmployeeCode: string;
          txRecipientAccount: string;
          txReimbursementNoteID: string;
          txStatus: string;
          uiIdempotencyKey: string;
          uiReimbursementID: string;
        };
        Insert: {
          daCreatedAt?: string;
          daUpdatedAt?: string;
          dcNominalReimbursement?: number;
          inBankTypeCode: number;
          inCategoryID: number;
          inRecipientCompanyCode: number;
          txBankAccountCode: string;
          txChangedBy?: string | null;
          txChangeReason?: string | null;
          txCurrency?: string;
          txDescriptionDetails?: string | null;
          txEmployeeCode: string;
          txRecipientAccount: string;
          txReimbursementNoteID?: string;
          txStatus?: string;
          uiIdempotencyKey: string;
          uiReimbursementID?: string;
        };
        Update: {
          daCreatedAt?: string;
          daUpdatedAt?: string;
          dcNominalReimbursement?: number;
          inBankTypeCode?: number;
          inCategoryID?: number;
          inRecipientCompanyCode?: number;
          txBankAccountCode?: string;
          txChangedBy?: string | null;
          txChangeReason?: string | null;
          txCurrency?: string;
          txDescriptionDetails?: string | null;
          txEmployeeCode?: string;
          txRecipientAccount?: string;
          txReimbursementNoteID?: string;
          txStatus?: string;
          uiIdempotencyKey?: string;
          uiReimbursementID?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reimbursement_notes_inCategoryID_fkey";
            columns: ["inCategoryID"];
            isOneToOne: false;
            referencedRelation: "m_category";
            referencedColumns: ["inCategoryID"];
          },
          {
            foreignKeyName: "reimbursement_notes_txChangedBy_fkey";
            columns: ["txChangedBy"];
            isOneToOne: false;
            referencedRelation: "m_employees";
            referencedColumns: ["txEmployeeCode"];
          },
          {
            foreignKeyName: "reimbursement_notes_txEmployeeCode_fkey";
            columns: ["txEmployeeCode"];
            isOneToOne: false;
            referencedRelation: "m_employees";
            referencedColumns: ["txEmployeeCode"];
          },
          {
            foreignKeyName: "reinbursement_notes_inBankTypeCode_fkey";
            columns: ["inBankTypeCode"];
            isOneToOne: false;
            referencedRelation: "m_bank";
            referencedColumns: ["inBankTypeCode"];
          },
          {
            foreignKeyName: "reinbursement_notes_inRecipientCompanyCode_fkey";
            columns: ["inRecipientCompanyCode"];
            isOneToOne: false;
            referencedRelation: "m_company";
            referencedColumns: ["inCompanyCode"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_unique_int4_id: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  dt_dwh: {
    Enums: {},
  },
} as const;
