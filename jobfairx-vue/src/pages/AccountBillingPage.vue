<!--
  AccountBillingPage
  ------------------
  Account & Billing settings page with two tabs: Account and Billing.
  Manages user personal info, company info, billing address, and payment method.

  Source: account-billing.html (852 lines)
-->
<script setup lang="ts">
import { ref } from 'vue'
import Tabs from '@/components/base/Tabs.vue'
import PersonalInfoCard from '@/components/account-billing/PersonalInfoCard.vue'
import CompanyInfoCard from '@/components/account-billing/CompanyInfoCard.vue'
import BillingAddressCard from '@/components/account-billing/BillingAddressCard.vue'
import PaymentMethodCard from '@/components/account-billing/PaymentMethodCard.vue'
import UpdatePaymentMethodModal from '@/components/account-billing/modals/UpdatePaymentMethodModal.vue'

import {
  MOCK_PERSONAL_INFO,
  MOCK_COMPANY_INFO,
  MOCK_BILLING_ADDRESS,
  MOCK_PAYMENT_METHOD,
} from '@/data/account-billing-mock'
import type {
  AccountTab,
  AccountTabDef,
  PersonalInfo,
  CompanyInfo,
  BillingAddress,
  PaymentMethod,
} from '@/types/account'

const activeTab = ref<AccountTab>('account')

// Tabs base component expects { key, label, count }. Account/Billing don't have
// counts, so we pass 0 — the Pill will render but visually carries no meaning here.
const tabs: readonly { key: AccountTabDef['key']; label: string; count: number }[] = [
  { key: 'account', label: 'Account', count: 0 },
  { key: 'billing', label: 'Billing', count: 0 },
]

// State for account tab
const personalInfo = ref<PersonalInfo>(MOCK_PERSONAL_INFO)

// State for billing tab
const companyInfo = ref<CompanyInfo>(MOCK_COMPANY_INFO)
const billingAddress = ref<BillingAddress>(MOCK_BILLING_ADDRESS)
const paymentMethod = ref<PaymentMethod>(MOCK_PAYMENT_METHOD)

// Handlers for personal info
const handlePersonalInfoSave = (data: PersonalInfo): void => {
  personalInfo.value = data
  // TODO: Call API to save
}

// Handlers for company info
const handleCompanyInfoSave = (data: CompanyInfo): void => {
  companyInfo.value = data
  // TODO: Call API to save
}

// Handlers for billing address
const handleBillingAddressSave = (data: BillingAddress): void => {
  billingAddress.value = data
  // TODO: Call API to save
}

// Handlers for payment method
const handlePaymentMethodSave = (data: PaymentMethod): void => {
  paymentMethod.value = data
  // TODO: Call API to save
}
</script>

<template>
  <main class="container-page max-w-4xl mx-auto pb-16">
    <!-- Back Link -->
    <a
      href="/"
      class="inline-flex items-center gap-1.5 text-base font-semibold text-brand-blue hover:underline mb-7"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
        <path d="M15 19l-7-7 7-7" />
      </svg>
      Back to dashboard
    </a>

    <!-- Page Title -->
    <h1 class="text-4xl font-bold text-text-primary mb-6">Account &amp; Billing</h1>

    <!-- Tabs -->
    <Tabs
      :tabs="tabs"
      v-model:active="activeTab"
      class="mb-8"
    />

    <!-- Account Tab -->
    <div v-if="activeTab === 'account'" class="space-y-6">
      <PersonalInfoCard
        :data="personalInfo"
        @save="handlePersonalInfoSave"
      />
    </div>

    <!-- Billing Tab -->
    <div v-else class="space-y-6">
      <CompanyInfoCard
        :data="companyInfo"
        @save="handleCompanyInfoSave"
      />
      <BillingAddressCard
        :data="billingAddress"
        @save="handleBillingAddressSave"
      />
      <PaymentMethodCard
        :data="paymentMethod"
        @save="handlePaymentMethodSave"
      />
    </div>

    <!-- Modals -->
    <UpdatePaymentMethodModal />
  </main>
</template>
