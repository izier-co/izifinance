import Decimal from 'decimal.js';

export type ReinbursementNotes = {
    createdAt : Date
    updatedAt : Date
    reinbursementNoteID : Number
    status : "Pending" | "Paid" | "Rejected" | "Void"
    notes? : String
    recipientAccount : String
    bankTypeCode : Number
    recipientCompanyCode : Number
    bankAccountCode : String 
    changeReason? : String 
}

export type ReinbursementItems = {
    createdAt : Date
    updatedAt : Date
    reinbursementNoteID : Number
    name : String
    quantity : Number
    individualPrice : Decimal 
    totalPrice : Decimal
    currency : String
    categoryID : Number    
}

export type ReinbursementCategory = {
    createdAt : Date
    updatedAt : Date
    categoryID : Number
    categoryName : String
    categoryDescription? : String
    active : boolean
    status : boolean
}