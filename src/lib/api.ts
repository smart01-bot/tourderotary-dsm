// ── Typed backend fetch wrapper ────────────────────────────────────────────
// All calls to PayMe Africa, Textify, Resend, frame generation go through here.
// No raw fetch() calls in components — import from this file only.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

// ── Generic fetcher ────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { data: null, error: body?.message ?? `HTTP ${res.status}` }
    }

    const data: T = await res.json()
    return { data, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error'
    return { data: null, error: message }
  }
}

// ── Payments — PayMe Africa ────────────────────────────────────────────────
export interface InitiatePaymentPayload {
  registrationId: string
  amountTSh: number
  phone: string
  description: string
}

export interface InitiatePaymentResponse {
  checkoutUrl: string
  transactionRef: string
}

export const paymentsApi = {
  initiate: (payload: InitiatePaymentPayload) =>
    apiFetch<InitiatePaymentResponse>('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verify: (transactionRef: string) =>
    apiFetch<{ status: 'completed' | 'pending' | 'failed' }>(
      `/payments/verify/${transactionRef}`
    ),
}

// ── SMS — Textify Africa ───────────────────────────────────────────────────
export interface SendSmsPayload {
  to: string | string[]
  message: string
  templateId?: string
  variables?: Record<string, string>
}

export const smsApi = {
  send: (payload: SendSmsPayload) =>
    apiFetch<{ messageId: string }>('/comms/sms', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

// ── Email — Resend ─────────────────────────────────────────────────────────
export interface SendEmailPayload {
  to: string | string[]
  templateId: string
  variables: Record<string, string>
}

export const emailApi = {
  send: (payload: SendEmailPayload) =>
    apiFetch<{ emailId: string }>('/comms/email', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

// ── Frame generator ────────────────────────────────────────────────────────
export interface GenerateFramePayload {
  userId: string
  activity: string
  name: string
  photoBase64?: string
}

export interface GenerateFrameResponse {
  frameUrl: string
  thumbnailUrl: string
}

export const frameApi = {
  generate: (payload: GenerateFramePayload) =>
    apiFetch<GenerateFrameResponse>('/collectibles/frame', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

// ── Collectibles ───────────────────────────────────────────────────────────
export const collectiblesApi = {
  issue: (userId: string, badgeId: string) =>
    apiFetch<{ success: boolean }>('/collectibles/issue', {
      method: 'POST',
      body: JSON.stringify({ userId, badgeId }),
    }),
}

// ── Newsletter signup ──────────────────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string, name?: string) =>
    apiFetch<{ success: boolean }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    }),
}
