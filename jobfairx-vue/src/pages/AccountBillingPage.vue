<!--
  AccountBillingPage
  ------------------
  Port of account-billing.html with full TypeScript strict mode support.
  Renders tabs (Account/Billing) with inline edit sections for:
    - Account info (First/Last/Company/JobTitle/Email/Phone)
    - Billing company info
    - Billing address with country/state dropdowns
    - Payment method (card display + card edit form)

  All interactivity:
    - Tab switching between Account and Billing
    - Inline edit mode with save/cancel
    - Toast notifications for save feedback
    - Payment method brand auto-detection
    - State/country dropdown population
    - Feedback modal (emoji selector + followups + textarea)
-->

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

// ═══ Types ═══
type AccountTab = 'account' | 'billing'
type FeedbackRating = 'amazing' | 'good' | 'okay' | 'poor' | 'terrible' | null

interface AccountFormData {
  firstName: string
  lastName: string
  companyName: string
  jobTitle: string
  email: string
  phone: string
}

interface BillingFormData {
  billingCompany: string
  billingEmail: string
  addrStreet: string
  addrCity: string
  addrZip: string
  addrCountry: string
  addrState: string
}

interface PaymentFormData {
  cardNumber: string
  expiration: string
  cvc: string
  nameOnCard: string
  country: string
  state: string
  zip: string
}

interface PaymentDisplay {
  brand: string
  last4: string
  expiry: string
  nameOnCard: string
}

interface FeedbackState {
  experience: FeedbackRating
  followups: Record<string, string>
  text: string
}

// ═══ State: Tabs ═══
const activeTab = ref<AccountTab>('account')

// ═══ State: Account Section ═══
const accountData = ref<AccountFormData>({
  firstName: 'Sarah',
  lastName: 'Mitchell',
  companyName: 'Acme Healthcare',
  jobTitle: 'Talent Acquisition Manager',
  email: 'admin@acmehealthcare.com',
  phone: '(555) 123-4567',
})

const accountSnapshot = ref<AccountFormData | null>(null)
const accountEditing = ref(false)

// ═══ State: Billing Section ═══
const billingData = ref<BillingFormData>({
  billingCompany: 'Acme Healthcare',
  billingEmail: 'billing@acmehealthcare.com',
  addrStreet: '123 Innovation Blvd, Suite 400',
  addrCity: 'Chicago',
  addrZip: '60601',
  addrCountry: 'US',
  addrState: 'IL',
})

const billingSnapshot = ref<BillingFormData | null>(null)
const billingEditing = ref(false)

// ═══ State: Billing Address Section ═══
const billingAddressSnapshot = ref<BillingFormData | null>(null)
const billingAddressEditing = ref(false)

// ═══ State: Payment Method ═══
const paymentDisplay = ref<PaymentDisplay>({
  brand: 'VISA',
  last4: '4242',
  expiry: '09/2027',
  nameOnCard: 'Nick Barattini',
})

const paymentForm = ref<PaymentFormData>({
  cardNumber: '',
  expiration: '',
  cvc: '',
  nameOnCard: 'Nick Barattini',
  country: 'US',
  state: 'IL',
  zip: '60601',
})

const paymentEditing = ref(false)

// ═══ State: States by Country ═══
const STATES_BY_COUNTRY: Record<string, Array<[string, string]>> = {
  US: [
    ['AL', 'Alabama'],
    ['AK', 'Alaska'],
    ['AZ', 'Arizona'],
    ['AR', 'Arkansas'],
    ['CA', 'California'],
    ['CO', 'Colorado'],
    ['CT', 'Connecticut'],
    ['DE', 'Delaware'],
    ['DC', 'District of Columbia'],
    ['FL', 'Florida'],
    ['GA', 'Georgia'],
    ['HI', 'Hawaii'],
    ['ID', 'Idaho'],
    ['IL', 'Illinois'],
    ['IN', 'Indiana'],
    ['IA', 'Iowa'],
    ['KS', 'Kansas'],
    ['KY', 'Kentucky'],
    ['LA', 'Louisiana'],
    ['ME', 'Maine'],
    ['MD', 'Maryland'],
    ['MA', 'Massachusetts'],
    ['MI', 'Michigan'],
    ['MN', 'Minnesota'],
    ['MS', 'Mississippi'],
    ['MO', 'Missouri'],
    ['MT', 'Montana'],
    ['NE', 'Nebraska'],
    ['NV', 'Nevada'],
    ['NH', 'New Hampshire'],
    ['NJ', 'New Jersey'],
    ['NM', 'New Mexico'],
    ['NY', 'New York'],
    ['NC', 'North Carolina'],
    ['ND', 'North Dakota'],
    ['OH', 'Ohio'],
    ['OK', 'Oklahoma'],
    ['OR', 'Oregon'],
    ['PA', 'Pennsylvania'],
    ['RI', 'Rhode Island'],
    ['SC', 'South Carolina'],
    ['SD', 'South Dakota'],
    ['TN', 'Tennessee'],
    ['TX', 'Texas'],
    ['UT', 'Utah'],
    ['VT', 'Vermont'],
    ['VA', 'Virginia'],
    ['WA', 'Washington'],
    ['WV', 'West Virginia'],
    ['WI', 'Wisconsin'],
    ['WY', 'Wyoming'],
  ],
  CA: [
    ['AB', 'Alberta'],
    ['BC', 'British Columbia'],
    ['MB', 'Manitoba'],
    ['NB', 'New Brunswick'],
    ['NL', 'Newfoundland and Labrador'],
    ['NS', 'Nova Scotia'],
    ['NT', 'Northwest Territories'],
    ['NU', 'Nunavut'],
    ['ON', 'Ontario'],
    ['PE', 'Prince Edward Island'],
    ['QC', 'Quebec'],
    ['SK', 'Saskatchewan'],
    ['YT', 'Yukon'],
  ],
}

const stateOptions = ref<Array<[string, string]>>([])

// ═══ State: Feedback Modal ═══
const feedbackModal = ref(false)
const feedbackState = ref<FeedbackState>({
  experience: null,
  followups: {},
  text: '',
})
const feedbackTextCount = ref(0)

// ═══ State: Toast ═══
const toastMessage = ref('')
const toastVisible = ref(false)

// ═══ Computed: Country label for address display ═══
const countryLabel = computed<string>(() => {
  if (billingData.value.addrCountry === 'US') return 'United States'
  if (billingData.value.addrCountry === 'CA') return 'Canada'
  return billingData.value.addrCountry
})

// ═══ Computed: State label for address display ═══
const stateLabel = computed<string>(() => {
  if (!STATES_BY_COUNTRY[billingData.value.addrCountry]) return billingData.value.addrState
  const found = STATES_BY_COUNTRY[billingData.value.addrCountry]?.find((s) => s[0] === billingData.value.addrState)
  return found?.[1] ?? billingData.value.addrState
})

// ═══ Computed: Card brand badge color ═══
const cardBadgeClass = computed<string>(() => {
  const brand = paymentDisplay.value.brand.toLowerCase()
  if (brand === 'mastercard') return 'bg-[#fff4f0] text-[#c4183c]'
  if (brand === 'amex') return 'bg-[#eef4ff] text-brand-blue'
  if (brand === 'discover') return 'bg-[#fff7e6] text-[#b8651c]'
  return 'bg-[#f0f5ff] text-brand-blue'
})

// ═══ Helper: Detect card brand from first digit ═══
const detectBrand = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s+/g, '')
  if (!cleaned) return 'Visa'
  const first = cleaned.charAt(0)
  if (first === '4') return 'Visa'
  if (first === '5' || first === '2') return 'Mastercard'
  if (first === '3') return 'Amex'
  if (first === '6') return 'Discover'
  return 'Visa'
}

// ═══ Helper: Populate state options based on selected country ═══
const populateStates = (country: string, preserveState?: string): void => {
  const states = STATES_BY_COUNTRY[country] ?? []
  stateOptions.value = states
  if (preserveState) {
    // Verify the state exists in the new country
    if (states.some((s) => s[0] === preserveState)) {
      billingData.value.addrState = preserveState
    } else if (states.length > 0) {
      // Fallback to first state if preserved state doesn't exist
      billingData.value.addrState = states[0]?.[0] ?? ''
    }
  } else if (states.length > 0 && !states.some((s) => s[0] === billingData.value.addrState)) {
    billingData.value.addrState = states[0]?.[0] ?? ''
  }
}

// ═══ Helper: Show toast notification ═══
const showToast = (message: string): void => {
  toastMessage.value = message
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 2400)
}

// ═══ Account Tab: Start Edit ═══
const startAccountEdit = (): void => {
  accountSnapshot.value = JSON.parse(JSON.stringify(accountData.value))
  accountEditing.value = true
}

// ═══ Account Tab: Cancel Edit ═══
const cancelAccountEdit = (): void => {
  if (accountSnapshot.value) {
    accountData.value = accountSnapshot.value
  }
  accountEditing.value = false
}

// ═══ Account Tab: Save Edit ═══
const saveAccountEdit = (): void => {
  accountEditing.value = false
  showToast('Account updated')
}

// ═══ Billing Tab: Company Info - Start Edit ═══
const startBillingEdit = (): void => {
  billingSnapshot.value = JSON.parse(JSON.stringify(billingData.value))
  billingEditing.value = true
}

// ═══ Billing Tab: Company Info - Cancel Edit ═══
const cancelBillingEdit = (): void => {
  if (billingSnapshot.value) {
    billingData.value = {
      ...billingData.value,
      billingCompany: billingSnapshot.value.billingCompany,
      billingEmail: billingSnapshot.value.billingEmail,
    }
  }
  billingEditing.value = false
}

// ═══ Billing Tab: Company Info - Save Edit ═══
const saveBillingEdit = (): void => {
  billingEditing.value = false
  showToast('Company information updated')
}

// ═══ Billing Tab: Address - Start Edit ═══
const startAddressEdit = (): void => {
  billingAddressSnapshot.value = JSON.parse(JSON.stringify(billingData.value))
  billingAddressEditing.value = true
  // Populate state options for current country
  populateStates(billingData.value.addrCountry, billingData.value.addrState)
}

// ═══ Billing Tab: Address - Cancel Edit ═══
const cancelAddressEdit = (): void => {
  if (billingAddressSnapshot.value) {
    Object.assign(billingData.value, billingAddressSnapshot.value)
  }
  billingAddressEditing.value = false
}

// ═══ Billing Tab: Address - Save Edit ═══
const saveAddressEdit = (): void => {
  billingAddressEditing.value = false
  showToast('Billing address updated')
}

// ═══ Billing Tab: Address Country Changed ═══
const onAddressCountryChange = (country: string): void => {
  billingData.value.addrCountry = country
  populateStates(country)
}

// ═══ Billing Tab: Payment - Start Edit ═══
const startPaymentEdit = (): void => {
  paymentForm.value.cardNumber = ''
  paymentForm.value.expiration = ''
  paymentForm.value.cvc = ''
  paymentForm.value.nameOnCard = paymentDisplay.value.nameOnCard
  paymentForm.value.country = 'US'
  paymentForm.value.state = 'IL'
  paymentForm.value.zip = paymentDisplay.value.brand === 'VISA' ? '60601' : paymentForm.value.zip
  paymentEditing.value = true
  // Populate state options for payment form
  populatePaymentStates('US', 'IL')
}

// ═══ Billing Tab: Payment - Cancel Edit ═══
const cancelPaymentEdit = (): void => {
  paymentEditing.value = false
}

// ═══ Billing Tab: Payment - Populate states for payment form ═══
const populatePaymentStates = (country: string, preserveState?: string): void => {
  const states = STATES_BY_COUNTRY[country] ?? []
  stateOptions.value = states
  if (preserveState && states.some((s) => s[0] === preserveState)) {
    paymentForm.value.state = preserveState
  } else if (states.length > 0) {
    paymentForm.value.state = states[0]?.[0] ?? ''
  }
}

// ═══ Billing Tab: Payment - Country Changed ═══
const onPaymentCountryChange = (country: string): void => {
  paymentForm.value.country = country
  populatePaymentStates(country)
}

// ═══ Billing Tab: Payment - Format expiration input ═══
const onPaymentExpInput = (e: Event): void => {
  const target = e.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '').slice(0, 4)
  if (value.length >= 3) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  target.value = value
  paymentForm.value.expiration = value
}

// ═══ Billing Tab: Payment - Save Edit ═══
const savePaymentEdit = (): void => {
  const cardNumber = paymentForm.value.cardNumber.replace(/\s+/g, '')
  const exp = paymentForm.value.expiration.trim()
  const name = paymentForm.value.nameOnCard

  // Parse last 4 from card number
  const last4 = cardNumber.length >= 4 ? cardNumber.slice(-4) : paymentDisplay.value.last4

  // Parse MM/YY → MM/20YY for display
  let expDisplay = paymentDisplay.value.expiry
  const m = exp.match(/^(\d{2})\/(\d{2})$/)
  if (m) {
    expDisplay = m[1] + '/20' + m[2]
  }

  // Auto-detect brand
  const brand = cardNumber ? detectBrand(cardNumber) : paymentDisplay.value.brand
  const brandFormatted = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()

  // Update display
  paymentDisplay.value.nameOnCard = name
  paymentDisplay.value.last4 = last4
  paymentDisplay.value.expiry = expDisplay
  paymentDisplay.value.brand = brandFormatted.toUpperCase()

  paymentEditing.value = false
  showToast('Payment method updated')
}

// ═══ Tab Switching ═══
const switchTab = (tab: AccountTab): void => {
  // Exit any in-progress edits
  if (accountEditing.value) {
    cancelAccountEdit()
  }
  if (billingEditing.value) {
    cancelBillingEdit()
  }
  if (billingAddressEditing.value) {
    cancelAddressEdit()
  }
  if (paymentEditing.value) {
    cancelPaymentEdit()
  }
  activeTab.value = tab
}

// ═══ Feedback Modal: Close ═══
const closeFeedbackModal = (): void => {
  feedbackModal.value = false
  document.body.style.overflow = ''
  feedbackState.value = { experience: null, followups: {}, text: '' }
  feedbackTextCount.value = 0
}

// ═══ Feedback Modal: Select experience ═══
const selectExperience = (value: FeedbackRating): void => {
  feedbackState.value.experience = value
}

// ═══ Feedback Modal: Select followup ═══
const selectFollowup = (group: string, value: string): void => {
  if (feedbackState.value.followups[group] === value) {
    delete feedbackState.value.followups[group]
  } else {
    feedbackState.value.followups[group] = value
  }
}

// ═══ Feedback Modal: Update character count ═══
const onFeedbackTextInput = (): void => {
  feedbackTextCount.value = feedbackState.value.text.length
}

// ═══ Feedback Modal: Submit ═══
const submitFeedback = (): void => {
  if (!feedbackState.value.experience) return
  console.log('Feedback submitted:', JSON.parse(JSON.stringify(feedbackState.value)))
  closeFeedbackModal()
  showToast('Thanks for your feedback!')
}

// ═══ Computed: Feedback submit button disabled ═══
const feedbackSubmitDisabled = computed<boolean>(() => !feedbackState.value.experience)

// ═══ Computed: Show feedback followups ═══
const showFeedbackFollowups = computed<boolean>(() => feedbackState.value.experience !== null)

// ═══ Lifecycle: Initialize state dropdown on mount ═══
onMounted(() => {
  populateStates(billingData.value.addrCountry, billingData.value.addrState)
})
</script>

<template>
  <div>
    <!-- Back Link -->
    <a href="/" class="inline-flex items-center gap-1.5 text-base font-bold text-brand-blue no-underline mb-7 hover:underline cursor-pointer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to dashboard
    </a>

    <!-- Page Title -->
    <h1 class="text-[32px] font-bold text-text-primary mb-6">Account & Billing</h1>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-border-strong mb-7">
      <button
        type="button"
        class="inline-flex items-center gap-2 py-3 px-[18px] text-md font-bold text-text-secondary border-b-2 border-transparent transition-all cursor-pointer"
        :class="activeTab === 'account' && 'text-brand-blue border-brand-blue'"
        @click="switchTab('account')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[18px] h-[18px]">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Account
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 py-3 px-[18px] text-md font-bold text-text-secondary border-b-2 border-transparent transition-all cursor-pointer"
        :class="activeTab === 'billing' && 'text-brand-blue border-brand-blue'"
        @click="switchTab('billing')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[18px] h-[18px]">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
        Billing
      </button>
    </div>

    <!-- ═══ ACCOUNT TAB ═══ -->
    <div v-if="activeTab === 'account'" class="space-y-[22px]">
      <!-- Account Section: Your Information -->
      <div class="bg-white border border-border-strong rounded-lg">
        <div class="flex items-center justify-between py-7 px-9">
          <h2 class="text-[22px] font-bold text-text-primary">Your information</h2>
          <button
            v-if="!accountEditing"
            type="button"
            class="w-[42px] h-[42px] flex items-center justify-center rounded border-none bg-transparent cursor-pointer text-brand-blue transition-colors hover:bg-[#f0f5ff]"
            @click="startAccountEdit"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        </div>

        <div class="h-px bg-[#e0e0e0] mx-9" />

        <div class="py-[26px] px-9">
          <div class="grid grid-cols-2 gap-x-7 gap-y-[22px]">
            <!-- First Name -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">First Name</label>
              <div v-if="!accountEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ accountData.firstName }}
              </div>
              <input v-else v-model="accountData.firstName" type="text" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Last Name</label>
              <div v-if="!accountEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ accountData.lastName }}
              </div>
              <input v-else v-model="accountData.lastName" type="text" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- Company Name -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Company Name</label>
              <div v-if="!accountEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ accountData.companyName }}
              </div>
              <input v-else v-model="accountData.companyName" type="text" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- Job Title -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Job Title</label>
              <div v-if="!accountEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ accountData.jobTitle }}
              </div>
              <input v-else v-model="accountData.jobTitle" type="text" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Email</label>
              <div v-if="!accountEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ accountData.email }}
              </div>
              <input v-else v-model="accountData.email" type="email" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Phone</label>
              <div v-if="!accountEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ accountData.phone }}
              </div>
              <input v-else v-model="accountData.phone" type="tel" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>
          </div>

          <!-- Edit Actions -->
          <div v-if="accountEditing" class="flex justify-end gap-3 mt-7 pt-[22px] border-t border-border-default">
            <button type="button" class="px-[22px] py-2.5 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer transition-all hover:bg-[#f6f5f3] hover:border-text-primary" @click="cancelAccountEdit">
              Cancel
            </button>
            <button type="button" class="px-6 py-2.5 rounded border-none bg-brand-blue text-white text-base font-bold cursor-pointer transition-colors hover:bg-brand-blue-dark" @click="saveAccountEdit">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ BILLING TAB ═══ -->
    <div v-if="activeTab === 'billing'" class="space-y-[22px]">
      <!-- Company Information Section -->
      <div class="bg-white border border-border-strong rounded-lg">
        <div class="flex items-center justify-between py-7 px-9">
          <h2 class="text-[22px] font-bold text-text-primary">Company information</h2>
          <button
            v-if="!billingEditing"
            type="button"
            class="w-[42px] h-[42px] flex items-center justify-center rounded border-none bg-transparent cursor-pointer text-brand-blue transition-colors hover:bg-[#f0f5ff]"
            @click="startBillingEdit"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        </div>

        <div class="h-px bg-[#e0e0e0] mx-9" />

        <div class="py-[26px] px-9">
          <div class="grid grid-cols-1 gap-y-[22px]">
            <!-- Company Name -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Company Name</label>
              <div v-if="!billingEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ billingData.billingCompany }}
              </div>
              <input v-else v-model="billingData.billingCompany" type="text" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- Billing Email -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Billing Email</label>
              <div v-if="!billingEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ billingData.billingEmail }}
              </div>
              <input v-else v-model="billingData.billingEmail" type="email" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>
          </div>

          <!-- Edit Actions -->
          <div v-if="billingEditing" class="flex justify-end gap-3 mt-7 pt-[22px] border-t border-border-default">
            <button type="button" class="px-[22px] py-2.5 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer transition-all hover:bg-[#f6f5f3] hover:border-text-primary" @click="cancelBillingEdit">
              Cancel
            </button>
            <button type="button" class="px-6 py-2.5 rounded border-none bg-brand-blue text-white text-base font-bold cursor-pointer transition-colors hover:bg-brand-blue-dark" @click="saveBillingEdit">
              Save
            </button>
          </div>
        </div>
      </div>

      <!-- Billing Address Section -->
      <div class="bg-white border border-border-strong rounded-lg">
        <div class="flex items-center justify-between py-7 px-9">
          <h2 class="text-[22px] font-bold text-text-primary">Billing address</h2>
          <button
            v-if="!billingAddressEditing"
            type="button"
            class="w-[42px] h-[42px] flex items-center justify-center rounded border-none bg-transparent cursor-pointer text-brand-blue transition-colors hover:bg-[#f0f5ff]"
            @click="startAddressEdit"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        </div>

        <div class="h-px bg-[#e0e0e0] mx-9" />

        <div class="py-[26px] px-9">
          <div class="grid grid-cols-2 gap-x-7 gap-y-[22px]">
            <!-- Street Address (full width) -->
            <div class="col-span-2">
              <label class="block text-base font-bold text-text-secondary mb-1.5">Street Address</label>
              <div v-if="!billingAddressEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ billingData.addrStreet }}
              </div>
              <input v-else v-model="billingData.addrStreet" type="text" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- City -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">City</label>
              <div v-if="!billingAddressEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ billingData.addrCity }}
              </div>
              <input v-else v-model="billingData.addrCity" type="text" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- ZIP Code -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">ZIP Code</label>
              <div v-if="!billingAddressEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ billingData.addrZip }}
              </div>
              <input v-else v-model="billingData.addrZip" type="text" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- Country -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Country</label>
              <div v-if="!billingAddressEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ countryLabel }}
              </div>
              <select v-else v-model="billingData.addrCountry" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none cursor-pointer transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" @change="onAddressCountryChange(billingData.addrCountry)">
                <option value="US">United States</option>
                <option value="CA">Canada</option>
              </select>
            </div>

            <!-- State -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">State</label>
              <div v-if="!billingAddressEditing" class="text-lg font-normal text-text-primary min-h-6">
                {{ stateLabel }}
              </div>
              <select v-else v-model="billingData.addrState" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none cursor-pointer transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]">
                <option v-for="state in stateOptions" :key="state[0]" :value="state[0]">
                  {{ state[1] }}
                </option>
              </select>
            </div>
          </div>

          <!-- Edit Actions -->
          <div v-if="billingAddressEditing" class="flex justify-end gap-3 mt-7 pt-[22px] border-t border-border-default">
            <button type="button" class="px-[22px] py-2.5 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer transition-all hover:bg-[#f6f5f3] hover:border-text-primary" @click="cancelAddressEdit">
              Cancel
            </button>
            <button type="button" class="px-6 py-2.5 rounded border-none bg-brand-blue text-white text-base font-bold cursor-pointer transition-colors hover:bg-brand-blue-dark" @click="saveAddressEdit">
              Save
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Method Section -->
      <div class="bg-white border border-border-strong rounded-lg">
        <div class="flex items-center justify-between py-7 px-9">
          <h2 class="text-[22px] font-bold text-text-primary">Payment method</h2>
          <button
            v-if="!paymentEditing"
            type="button"
            class="w-[42px] h-[42px] flex items-center justify-center rounded border-none bg-transparent cursor-pointer text-brand-blue transition-colors hover:bg-[#f0f5ff]"
            @click="startPaymentEdit"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        </div>

        <div class="h-px bg-[#e0e0e0] mx-9" />

        <div class="py-[26px] px-9">
          <!-- Payment Display Mode -->
          <div v-if="!paymentEditing" class="flex items-center gap-[18px]">
            <span :class="['inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-xs font-bold', cardBadgeClass]">
              {{ paymentDisplay.brand }}
            </span>
            <div>
              <div class="text-lg font-medium text-text-primary tracking-[0.5px]">
                •••• •••• •••• {{ paymentDisplay.last4 }}
              </div>
              <div class="text-sm text-text-tertiary mt-0.5">
                Expires {{ paymentDisplay.expiry }} · {{ paymentDisplay.nameOnCard }}
              </div>
            </div>
          </div>

          <!-- Payment Edit Mode -->
          <div v-if="paymentEditing" class="grid grid-cols-2 gap-x-7 gap-y-[22px]">
            <!-- Card Number (full width) -->
            <div class="col-span-2">
              <label class="block text-base font-bold text-text-secondary mb-1.5">Card Number</label>
              <input v-model="paymentForm.cardNumber" type="text" inputmode="numeric" autocomplete="off" placeholder="1234 5678 9012 3456" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- Expiration -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Expiration</label>
              <input v-model="paymentForm.expiration" type="text" inputmode="numeric" autocomplete="off" placeholder="MM/YY" maxlength="5" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" @input="onPaymentExpInput" />
            </div>

            <!-- CVC -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Security Code</label>
              <input v-model="paymentForm.cvc" type="text" inputmode="numeric" autocomplete="off" placeholder="CVC" maxlength="4" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- Name on Card (full width) -->
            <div class="col-span-2">
              <label class="block text-base font-bold text-text-secondary mb-1.5">Name on Card</label>
              <input v-model="paymentForm.nameOnCard" type="text" autocomplete="off" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>

            <!-- Country -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">Country</label>
              <select v-model="paymentForm.country" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none cursor-pointer transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" @change="onPaymentCountryChange(paymentForm.country)">
                <option value="US">United States</option>
                <option value="CA">Canada</option>
              </select>
            </div>

            <!-- State -->
            <div>
              <label class="block text-base font-bold text-text-secondary mb-1.5">State</label>
              <select v-model="paymentForm.state" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none cursor-pointer transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]">
                <option v-for="state in stateOptions" :key="state[0]" :value="state[0]">
                  {{ state[1] }}
                </option>
              </select>
            </div>

            <!-- ZIP Code (full width) -->
            <div class="col-span-2">
              <label class="block text-base font-bold text-text-secondary mb-1.5">ZIP Code</label>
              <input v-model="paymentForm.zip" type="text" autocomplete="off" class="w-full px-[14px] py-[11px] text-lg font-normal text-text-primary border border-border-strong rounded bg-white outline-none transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]" />
            </div>
          </div>

          <!-- Edit Actions -->
          <div v-if="paymentEditing" class="flex justify-end gap-3 mt-7 pt-[22px] border-t border-border-default">
            <button type="button" class="px-[22px] py-2.5 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer transition-all hover:bg-[#f6f5f3] hover:border-text-primary" @click="cancelPaymentEdit">
              Cancel
            </button>
            <button type="button" class="px-6 py-2.5 rounded border-none bg-brand-blue text-white text-base font-bold cursor-pointer transition-colors hover:bg-brand-blue-dark" @click="savePaymentEdit">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ TOAST NOTIFICATION ═══ -->
    <Teleport to="body">
      <div
        v-if="toastVisible"
        class="fixed bottom-7 left-1/2 -translate-x-1/2 px-6 py-3 rounded text-white text-base font-bold bg-text-primary shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[10000] transition-opacity"
      >
        {{ toastMessage }}
      </div>
    </Teleport>

    <!-- ═══ FEEDBACK MODAL ═══ -->
    <Teleport to="body">
      <div
        v-if="feedbackModal"
        class="fixed inset-0 flex items-start justify-center bg-black/50 z-[2000] pt-[5vh] px-5 overflow-y-auto"
        @click.self="closeFeedbackModal"
      >
        <div class="bg-white rounded-lg py-9 px-10 max-w-[680px] w-full relative shadow-modal">
          <!-- Close Button -->
          <button
            type="button"
            class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-none border-none text-text-tertiary text-2xl cursor-pointer transition-colors hover:text-text-primary"
            @click="closeFeedbackModal"
          >
            ×
          </button>

          <!-- Title -->
          <h2 class="text-2xl font-bold text-text-primary mb-1.5">Give Feedback</h2>
          <p class="text-md text-text-tertiary mb-7">Help us make JobFairX better for you</p>

          <!-- Experience Section -->
          <div class="mb-7">
            <div class="text-lg font-bold text-text-primary mb-[14px]">
              How's your experience?
              <span class="text-[#dc2626]">*</span>
            </div>
            <div class="flex gap-2.5 justify-between">
              <button
                v-for="(emoji, rating) in { amazing: '😊', good: '🙂', okay: '😐', poor: '😞', terrible: '😠' }"
                :key="rating"
                type="button"
                class="flex flex-col items-center gap-2 flex-1 py-4 px-2 rounded-lg border-2 bg-white transition-all cursor-pointer"
                :class="
                  feedbackState.experience === rating
                    ? 'border-brand-blue bg-[#f0f5ff]'
                    : 'border-[#e5e7eb] hover:border-brand-blue hover:bg-[#f5f9ff]'
                "
                @click="selectExperience(rating as FeedbackRating)"
              >
                <span class="text-2xl leading-none">{{ emoji }}</span>
                <span class="text-[13px] font-bold" :class="feedbackState.experience === rating ? 'text-brand-blue' : 'text-text-secondary'">
                  {{ rating.charAt(0).toUpperCase() + rating.slice(1) }}
                </span>
              </button>
            </div>
          </div>

          <!-- Followups Section -->
          <div v-if="showFeedbackFollowups" class="mb-7">
            <div class="text-lg font-bold text-text-primary mb-[14px]">
              A few quick follow-ups
              <span class="text-[#9ca3af] text-base font-normal">(optional)</span>
            </div>

            <!-- Setup -->
            <div class="flex items-center justify-between gap-5 py-[18px] px-[22px] bg-[#f8fafc] border border-[#e5e7eb] rounded-lg mb-3">
              <div class="flex-1 min-w-0">
                <div class="text-md font-bold text-text-primary mb-1">How easy was it to get started?</div>
                <div class="text-sm text-text-tertiary">Signing up, adding jobs, going live</div>
              </div>
              <div class="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  class="py-2 px-[14px] rounded-full border border-border-strong bg-white text-sm font-bold text-text-primary cursor-pointer transition-all"
                  :class="feedbackState.followups.setup === 'great' && 'border-brand-blue bg-[#f0f5ff] text-brand-blue'"
                  @click="selectFollowup('setup', 'great')"
                >
                  👍 Great
                </button>
                <button
                  type="button"
                  class="py-2 px-[14px] rounded-full border border-border-strong bg-white text-sm font-bold text-text-primary cursor-pointer transition-all"
                  :class="feedbackState.followups.setup === 'okay' && 'border-brand-blue bg-[#f0f5ff] text-brand-blue'"
                  @click="selectFollowup('setup', 'okay')"
                >
                  👌 Okay
                </button>
                <button
                  type="button"
                  class="py-2 px-[14px] rounded-full border border-border-strong bg-white text-sm font-bold text-text-primary cursor-pointer transition-all"
                  :class="feedbackState.followups.setup === 'needs-work' && 'border-brand-blue bg-[#f0f5ff] text-brand-blue'"
                  @click="selectFollowup('setup', 'needs-work')"
                >
                  👎 Needs work
                </button>
              </div>
            </div>

            <!-- Candidates -->
            <div class="flex items-center justify-between gap-5 py-[18px] px-[22px] bg-[#f8fafc] border border-[#e5e7eb] rounded-lg mb-3">
              <div class="flex-1 min-w-0">
                <div class="text-md font-bold text-text-primary mb-1">Quality of candidates you met?</div>
                <div class="text-sm text-text-tertiary">Fit, relevance, and engagement of the applicants</div>
              </div>
              <div class="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  class="py-2 px-[14px] rounded-full border border-border-strong bg-white text-sm font-bold text-text-primary cursor-pointer transition-all"
                  :class="feedbackState.followups.candidates === 'great' && 'border-brand-blue bg-[#f0f5ff] text-brand-blue'"
                  @click="selectFollowup('candidates', 'great')"
                >
                  👍 Great
                </button>
                <button
                  type="button"
                  class="py-2 px-[14px] rounded-full border border-border-strong bg-white text-sm font-bold text-text-primary cursor-pointer transition-all"
                  :class="feedbackState.followups.candidates === 'okay' && 'border-brand-blue bg-[#f0f5ff] text-brand-blue'"
                  @click="selectFollowup('candidates', 'okay')"
                >
                  👌 Okay
                </button>
                <button
                  type="button"
                  class="py-2 px-[14px] rounded-full border border-border-strong bg-white text-sm font-bold text-text-primary cursor-pointer transition-all"
                  :class="feedbackState.followups.candidates === 'needs-work' && 'border-brand-blue bg-[#f0f5ff] text-brand-blue'"
                  @click="selectFollowup('candidates', 'needs-work')"
                >
                  👎 Needs work
                </button>
              </div>
            </div>

            <!-- Interview Experience -->
            <div class="flex items-center justify-between gap-5 py-[18px] px-[22px] bg-[#f8fafc] border border-[#e5e7eb] rounded-lg">
              <div class="flex-1 min-w-0">
                <div class="text-md font-bold text-text-primary mb-1">How was the interview experience?</div>
                <div class="text-sm text-text-tertiary">Video, audio, scheduling, reliability during interviews</div>
              </div>
              <div class="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  class="py-2 px-[14px] rounded-full border border-border-strong bg-white text-sm font-bold text-text-primary cursor-pointer transition-all"
                  :class="feedbackState.followups.interview === 'great' && 'border-brand-blue bg-[#f0f5ff] text-brand-blue'"
                  @click="selectFollowup('interview', 'great')"
                >
                  👍 Great
                </button>
                <button
                  type="button"
                  class="py-2 px-[14px] rounded-full border border-border-strong bg-white text-sm font-bold text-text-primary cursor-pointer transition-all"
                  :class="feedbackState.followups.interview === 'okay' && 'border-brand-blue bg-[#f0f5ff] text-brand-blue'"
                  @click="selectFollowup('interview', 'okay')"
                >
                  👌 Okay
                </button>
                <button
                  type="button"
                  class="py-2 px-[14px] rounded-full border border-border-strong bg-white text-sm font-bold text-text-primary cursor-pointer transition-all"
                  :class="feedbackState.followups.interview === 'needs-work' && 'border-brand-blue bg-[#f0f5ff] text-brand-blue'"
                  @click="selectFollowup('interview', 'needs-work')"
                >
                  👎 Needs work
                </button>
              </div>
            </div>
          </div>

          <!-- Additional Feedback Section -->
          <div class="mb-7">
            <div class="text-lg font-bold text-text-primary mb-[14px]">
              Anything else?
              <span class="text-[#9ca3af] text-base font-normal">(optional)</span>
            </div>
            <div class="relative">
              <textarea
                v-model="feedbackState.text"
                maxlength="500"
                placeholder="Tell us more about your experience..."
                class="w-full min-h-24 py-[14px] px-4 text-md font-normal text-text-primary border border-border-strong rounded-md outline-none resize-vertical transition-all focus:border-brand-blue focus:ring-2 focus:ring-[rgba(0,68,179,0.15)]"
                @input="onFeedbackTextInput"
              />
              <div class="absolute bottom-3 right-4 text-xs text-[#9ca3af] pointer-events-none bg-white px-1">
                {{ feedbackTextCount }}/500
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" class="px-6 py-3 rounded border border-border-strong bg-white text-text-primary text-base font-bold cursor-pointer transition-all hover:bg-[#f6f5f3] hover:border-text-primary" @click="closeFeedbackModal">
              Cancel
            </button>
            <button
              type="button"
              class="px-7 py-3 rounded border-none text-white text-base font-bold cursor-pointer transition-colors disabled:bg-[#cbd5e1] disabled:cursor-not-allowed"
              :class="!feedbackSubmitDisabled && 'bg-brand-blue hover:bg-brand-blue-dark'"
              :disabled="feedbackSubmitDisabled"
              @click="submitFeedback"
            >
              Submit feedback
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
