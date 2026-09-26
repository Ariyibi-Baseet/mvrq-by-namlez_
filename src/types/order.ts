export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string; // same as the Paystack reference
  reference: string;
  amount: number; // NGN, not kobo
  status: "paid";
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: OrderItem[];
  createdAt: string;
}
