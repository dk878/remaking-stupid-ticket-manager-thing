import { useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import type { Ticket } from '@/components/tickets/ticket-card'
import { apiUrl } from '@/lib/api'

const barcodeImageUrl = 'https://cdn.discordapp.com/attachments/1108078293900599358/1433266913814778027/sUhSGAAAABklEQVQDANS0T8Yh3dcAAAAAElFTkSuQmCC.png?ex=6a1edb15&is=6a1d8995&hm=98ac2b158f00910c892e0809526fd786631f93c78025bd5c251c8c393ddb4b3e&animated=true'

function BarcodePanel() {
  return (
    <section className="mx-auto mt-6 w-[75vw] max-w-[390px] rounded-2xl bg-white p-3 text-zinc-950 shadow-2xl">
      <div className="h-[88px] overflow-hidden">
        <img src={barcodeImageUrl} alt="Ticket barcode" className="h-full w-full object-fill" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 px-5 pb-1 text-base font-bold sm:text-lg">
        <span className="whitespace-nowrap">Screenshots won't get you in.</span>
        <RefreshCw className="h-7 w-7 shrink-0" />
      </div>
    </section>
  )
}

function FallbackBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[62rem] -translate-x-1/2 -translate-y-1/2 -rotate-[15deg] rounded-[100%] border-[34px] border-zinc-200/70 bg-gradient-to-br from-zinc-950 via-zinc-900 to-red-950" />
      <div className="absolute left-1/2 top-1/2 h-[24rem] w-[44rem] -translate-x-[47%] -translate-y-[44%] -rotate-[15deg] rounded-[100%] border-[28px] border-zinc-700 bg-gradient-to-br from-red-900 via-red-700 to-zinc-950" />
      <div className="absolute left-1/2 top-1/2 h-32 w-72 -translate-x-[55%] -translate-y-[20%] -rotate-[18deg] rounded-[100%] bg-zinc-950" />
    </div>
  )
}

export function TicketDetailPage() {
  const { ticketId } = useParams({ strict: false })
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTicket() {
      try {
        const response = await fetch(apiUrl(`/api/tickets/${ticketId}`))
        if (!response.ok) throw new Error('Could not load ticket')
        setTicket(await response.json())
      } catch (_error) {
        setError('Ticket could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    loadTicket()
  }, [ticketId])

  if (loading) return <main className="grid min-h-svh place-items-center bg-[#202932] text-white">Loading ticket...</main>

  if (error || !ticket) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#202932] px-6 text-center text-white">
        <div>
          <p className="text-xl font-bold">{error || 'Ticket not found.'}</p>
          <Link to="/" className="mt-6 inline-block text-white/70 underline">Back to tickets</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#202932] text-white">
      <header className="relative z-10 bg-[#202932] px-6 pb-7 pt-8">
        <div className="mx-auto max-w-[520px]">
          <div className="grid grid-cols-[64px_1fr] items-end gap-4 pt-16">
            <Link to="/" aria-label="Back to tickets" className="relative h-8 w-8">
              <span className="absolute left-1/2 top-1/2 h-[2px] w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white" />
              <span className="absolute left-1/2 top-1/2 h-[2px] w-8 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-normal leading-tight">{ticket.event}</h1>
              <p className="truncate text-base text-white/90">{ticket.date} - {ticket.venue}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="relative min-h-[calc(100svh-148px)] px-6 pb-28 pt-[42px] text-center">
        {ticket.imageUrl ? (
          <img src={ticket.imageUrl} alt="Ticket background" className="absolute inset-0 h-full w-full scale-[2.31] object-cover" />
        ) : (
          <FallbackBackground />
        )}
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto max-w-[520px]">
          <h2 className="mt-[21px] text-xl font-normal">{ticket.type}</h2>
          <div className="mt-[43px] mx-auto grid w-fit grid-cols-3 gap-10">
            <div>
              <p className="text-base font-light">Section</p>
              <p className="mt-2 text-[26px] font-medium">{ticket.section}</p>
            </div>
            <div>
              <p className="text-base font-light">Row</p>
              <p className="mt-2 text-[26px] font-medium">{ticket.row}</p>
            </div>
            <div>
              <p className="text-base font-light">Seat</p>
              <p className="mt-2 text-[26px] font-medium">{ticket.seat}</p>
            </div>
          </div>
          <BarcodePanel />
          <button className="mt-20 rounded-md border border-white/20 bg-zinc-950/85 px-10 py-5 text-2xl font-bold shadow-xl">
            <span className="mr-4">💳</span>Add to Apple Wallet
          </button>
        </div>
      </section>

      <footer className="absolute inset-x-0 bottom-0 z-10 bg-[#25313b] px-8 py-7 text-center text-2xl text-white/70">
        <div className="mx-auto flex max-w-[260px] items-center justify-between">
          <ChevronLeft className="h-10 w-10 opacity-40" />
          <span>1 of 1</span>
          <ChevronRight className="h-10 w-10" />
        </div>
      </footer>
    </main>
  )
}
