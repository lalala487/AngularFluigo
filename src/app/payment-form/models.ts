// Default Stripe response object
export interface StripeObject {
  object: 'list' | 'charge' | 'customer' | 'source' | 'subscription';
  [key: string]: any;
}
// Customer
export interface Customer extends StripeObject {
  id: string;
  type: string;
  sources: StripeObject;
  subscriptions: StripeObject;
}
// Payment source, i.e credit or debit card
export interface Source extends StripeObject {
  id: string;
  type: string;
  status: string;
}
// Charge to the payment source
export interface Charge extends StripeObject {
  id: string;
  amount: number;
  currency: string;
  customer: string;
}
