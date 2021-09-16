export interface Items {
  description: string;
  price: number;
  quantity: number;
}

export interface Invoice {
  customer: string;
  invoice_no: string;
  description: string;
  cgst: number;
  sgst: number;
  items: Array<{ description: string; price: number; quantity: number }>;
}
