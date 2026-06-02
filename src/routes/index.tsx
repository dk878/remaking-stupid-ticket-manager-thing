import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreateTicketDialog } from '@/components/tickets/create-ticket-dialog'
import { TicketCard, type Ticket } from '@/components/tickets/ticket-card'


export function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const carouselRef = useRef<HTMLDivElement>(null)
  const activeTicket = tickets[activeIndex] ?? tickets[0]
  const canAct = tickets.length > 0

  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await fetch('/api/tickets')
        if (!response.ok) throw new Error('Could not load tickets')
        const data = await response.json()
        setTickets(data)
      } catch (_error) {
        setError('Tickets could not be loaded from the database.')
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [])

  useEffect(() => {
    if (activeIndex >= tickets.length) setActiveIndex(0)
  }, [activeIndex, tickets.length])

  function scrollToTicket(index: number) {
    const card = carouselRef.current?.querySelector<HTMLElement>(`[data-ticket-index="${index}"]`)
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    setActiveIndex(index)
  }

  function handleCarouselScroll() {
    const carousel = carouselRef.current
    if (!carousel) return

    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    Array.from(carousel.querySelectorAll<HTMLElement>('[data-ticket-index]')).forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const distance = Math.abs(carouselCenter - cardCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = Number(card.dataset.ticketIndex || 0)
      }
    })

    setActiveIndex(closestIndex)
  }

  async function createTicket(ticket: Omit<Ticket, 'id'>) {
    setError('')
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    })

    if (!response.ok) {
      setError('Ticket could not be saved to the database.')
      return
    }

    const savedTicket = await response.json()
    setTickets((currentTickets) => [savedTicket, ...currentTickets])
    setActiveIndex(0)
    carouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }

  async function updateTicket(id: number, ticket: Omit<Ticket, 'id'>) {
    setError('')
    const response = await fetch(`/api/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    })

    if (!response.ok) {
      setError('Ticket could not be updated in the database.')
      return
    }

    const updatedTicket = await response.json()
    setTickets((currentTickets) => currentTickets.map((currentTicket) => (
      currentTicket.id === id ? updatedTicket : currentTicket
    )))
  }

  async function deleteTicket(id: number) {
    setError('')
    const response = await fetch(`/api/tickets/${id}`, { method: 'DELETE' })

    if (!response.ok) {
      setError('Ticket could not be deleted from the database.')
      return
    }

    setTickets((currentTickets) => {
      const nextTickets = currentTickets.filter((ticket) => ticket.id !== id)
      setActiveIndex((currentIndex) => Math.min(currentIndex, Math.max(nextTickets.length - 1, 0)))
      return nextTickets
    })
  }

  return (
    <main className="min-h-svh bg-white text-zinc-950">
      <header className="bg-[#c3211d] text-white">
        <div className="mx-auto flex min-h-[212px] max-w-[520px] flex-col px-6 pb-0 pt-8">
          <div className="mt-12 grid grid-cols-3 items-center">
            <button aria-label="Close" className="relative h-11 w-11">
              <span className="absolute left-1/2 top-1/2 h-[3px] w-10 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white" />
              <span className="absolute left-1/2 top-1/2 h-[3px] w-10 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
            </button>
            <h1 className="whitespace-nowrap text-center text-3xl font-bold">My Tickets</h1>
            <div />
          </div>
          <nav className="mt-auto grid grid-cols-2 text-center text-lg uppercase tracking-wide">
            <button className="pb-6 pt-14 font-extrabold">My Tickets</button>
            <button className="pb-6 pt-14 text-white/55">Extras</button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-[620px] overflow-hidden pt-4">
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[8vw] pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading && <div className="w-full py-20 text-center text-zinc-500">Loading tickets...</div>}
          {!loading && tickets.length === 0 && (
            <div className="w-full rounded-[18px] border border-dashed border-zinc-300 bg-zinc-50 px-8 py-20 text-center text-zinc-500">
              No tickets yet. Create one to store it in the database.
            </div>
          )}
          {tickets.map((ticket, index) => (
            <div
              key={ticket.id}
              data-ticket-index={index}
              className="snap-center text-left"
              onClick={() => scrollToTicket(index)}
            >
              <TicketCard ticket={ticket} onUpdate={updateTicket} onDelete={deleteTicket} />
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-center gap-4">
          {tickets.slice(0, 4).map((ticket, index) => (
            <button
              key={ticket.id}
              aria-label={`View ticket ${index + 1}`}
              onClick={() => scrollToTicket(index)}
              className={`h-3 w-3 rounded-full ${activeIndex === index ? 'bg-slate-600' : 'bg-slate-300'}`}
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 px-8">
          <Button disabled={!canAct} className="h-14 rounded-md bg-slate-200 text-lg font-bold text-slate-400 hover:bg-slate-200 disabled:opacity-100">
            Transfer
          </Button>
          <Button disabled={!canAct} className="h-14 rounded-md bg-slate-200 text-lg font-bold text-slate-400 hover:bg-slate-200 disabled:opacity-100">
            Sell
          </Button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 px-8 pb-12">
          <CreateTicketDialog onCreate={createTicket} />
          {error && <p className="text-center text-sm font-medium text-[#c3211d]">{error}</p>}
          {activeTicket && <p className="text-center text-sm text-zinc-500">Selected: {activeTicket.section}, Row {activeTicket.row}, Seat {activeTicket.seat}</p>}
        </div>
      </section>
    </main>
  )
}
