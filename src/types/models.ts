import Decimal from "decimal.js";

export type ReinbursementNotes = {
  createdAt: Date;
  updatedAt: Date;
  reinbursementNoteID: number;
  status: "Pending" | "Paid" | "Rejected" | "Void";
  notes?: string;
  recipientAccount: string;
  bankTypeCode: number;
  recipientCompanyCode: number;
  bankAccountCode: string;
  changeReason?: string;
};

export type ReinbursementItems = {
  createdAt: Date;
  updatedAt: Date;
  reinbursementNoteID: number;
  name: string;
  quantity: number;
  individualPrice: Decimal;
  totalPrice: Decimal;
  currency: string;
  categoryID: number;
};

export type ReinbursementCategory = {
  createdAt: Date;
  updatedAt: Date;
  categoryID: number;
  categoryName: string;
  categoryDescription?: string;
  active: boolean;
  status: boolean;
};
