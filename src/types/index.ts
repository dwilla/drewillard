export type Concert = {
  id: string
  title: string
  description: string | null
  date: string
  venue: string
  price_in_cents: number
  total_tickets: number
  available_tickets: number
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  full_name: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export type Ticket = {
  id: string
  concert_id: string
  user_id: string
  purchase_date: string
  status: 'active' | 'used' | 'cancelled'
  ticket_number: string
  price_paid_in_cents: number
}
