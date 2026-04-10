/**
 * Mock data for AccountBilling page
 * Replace with API calls when backend lands
 */

import type {
  PersonalInfo,
  CompanyInfo,
  BillingAddress,
  PaymentMethod,
} from '@/types/account'

export const MOCK_PERSONAL_INFO: PersonalInfo = {
  firstName: 'Sarah',
  lastName: 'Mitchell',
  companyName: 'Acme Healthcare',
  jobTitle: 'Talent Acquisition Manager',
  email: 'admin@acmehealthcare.com',
  phone: '(555) 123-4567',
}

export const MOCK_COMPANY_INFO: CompanyInfo = {
  companyName: 'Acme Healthcare',
  billingEmail: 'billing@acmehealthcare.com',
}

export const MOCK_BILLING_ADDRESS: BillingAddress = {
  street: '123 Innovation Blvd, Suite 400',
  city: 'Chicago',
  zip: '60601',
  country: 'United States',
  state: 'IL',
}

export const MOCK_PAYMENT_METHOD: PaymentMethod = {
  cardBrand: 'VISA',
  lastFour: '4242',
  expiryMonth: 9,
  expiryYear: 2027,
  nameOnCard: 'Nick Barattini',
}
