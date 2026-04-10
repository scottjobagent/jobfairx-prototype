/**
 * Account & Billing domain types
 */

export interface PersonalInfo {
  firstName: string
  lastName: string
  companyName: string
  jobTitle: string
  email: string
  phone: string
}

export interface CompanyInfo {
  companyName: string
  billingEmail: string
}

export interface BillingAddress {
  street: string
  city: string
  zip: string
  country: string
  state: string
}

export interface PaymentMethod {
  cardBrand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER'
  lastFour: string
  expiryMonth: number
  expiryYear: number
  nameOnCard: string
}

export type AccountTab = 'account' | 'billing'

export interface AccountTabDef {
  key: AccountTab
  label: string
  icon: string
}
