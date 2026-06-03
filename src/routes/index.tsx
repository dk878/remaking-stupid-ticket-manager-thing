import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreateTicketDialog } from '@/components/tickets/create-ticket-dialog'
import { TicketCard, type Ticket } from '@/components/tickets/ticket-card'
import { apiUrl } from '@/lib/api'

export function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
const canAct = tickets.length > 0

  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await fetch(apiUrl('/api/tickets'))
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
    const response = await fetch(apiUrl('/api/tickets'), {
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
    const response = await fetch(apiUrl(`/api/tickets/${id}`), {
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
    const response = await fetch(apiUrl(`/api/tickets/${id}`), { method: 'DELETE' })

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
    <main className="mx-auto min-h-[844px] w-full max-w-[390px] bg-white pb-[300px] text-zinc-950">
      <header className="bg-[#cb0101] text-white">
        <div className="mx-auto flex min-h-[106px] max-w-[520px] flex-col px-6 pb-0 pt-6 sm:min-h-[106px] sm:pt-8">
          <div className="mt-8 grid grid-cols-3 items-center sm:mt-12">
            <button aria-label="Close" className="relative h-11 w-11" style={{ transform: 'translate(-15px, 30px)' }}>
              <span className="absolute left-1/2 top-1/2 h-[3px] w-[25px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white" />
              <span className="absolute left-1/2 top-1/2 h-[3px] w-[25px] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
            </button>
            <h1 className="whitespace-nowrap text-center font-medium mt-[40px] translate-y-[15px]" style={{ fontSize: '19px' }}>My Tickets</h1>
            <div />
          </div>
          <nav className="mt-auto grid grid-cols-2 text-center text-base uppercase tracking-wide sm:text-lg">
            <button onClick={() => setCreateOpen(true)} className="pb-[21px] pt-8 font-extrabold sm:pb-[29px] sm:pt-14" style={{ fontSize: '12.5px', transform: 'translate(-13.5px, 7px)' }}>MY TICKETS</button>
            <button className="pb-[21px] pt-8 text-white/55 sm:pb-[29px] sm:pt-14" style={{ fontSize: '12.5px', transform: 'translate(16.5px, 10px)' }}>EXTRAS</button>
          </nav>
        </div>
      </header>

      <div className="flex justify-end">
        <div style={{ width: 195, height: 3, backgroundColor: '#cb0101' }} />
      </div>

      <section className="mx-auto max-w-[620px] overflow-hidden pt-[1px]">
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
              <TicketCard ticket={ticket} onUpdate={updateTicket} onDelete={deleteTicket} longLabels sectionLabelTranslateX={0} labelsTranslateY={-10} valuesTranslateY={-8} seatValueTranslateX={1.5} sectionValueTranslateX={-2.5} eventNameTranslateY={-20} viewTicketOverlayUrl="https://cdn.pixabay.com/animation/2023/10/08/03/19/03-19-26-213_512.gif" redHeaderHeight={115} imageHeight={173} cardHeight={490} bottomLineTranslateY={-72} notesTranslateY={-46} viewTicketTranslateY={-46} ticketDetailsTranslateY={-46} />
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-center gap-[15px]">
          {tickets.slice(0, 4).map((ticket, index) => (
            <button
              key={ticket.id}
              aria-label={`View ticket ${index + 1}`}
              onClick={() => scrollToTicket(index)}
              className={`h-2 w-2 rounded-full ${activeIndex === index ? 'bg-slate-600' : 'bg-slate-300'}`}
            />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 px-6 sm:mt-8 sm:gap-5 sm:px-8 -translate-y-[8px]">
          <Button disabled={!canAct} className="rounded-md text-base text-slate-400 disabled:opacity-100 sm:text-lg" style={{ backgroundColor: 'rgba(225, 229, 232)', color: '#b0b2b6', height: '40px', fontSize: '13px', fontWeight: 500 }}>
            Transfer
          </Button>
          <Button disabled={!canAct} className="rounded-md text-base text-slate-400 disabled:opacity-100 sm:text-lg" style={{ backgroundColor: 'rgba(225, 229, 232)', color: '#b0b2b6', height: '40px', fontSize: '13px', fontWeight: 500 }}>
            Sell
          </Button>
        </div>

        <div className="mt-5 flex flex-col items-center gap-3 px-6 pb-10 sm:mt-8 sm:px-8 sm:pb-12">
          <CreateTicketDialog onCreate={createTicket} open={createOpen} onOpenChange={setCreateOpen} />
          {error && <p className="text-center text-sm font-medium text-[#cb0101]">{error}</p>}
        </div>
      </section>
    </main>
  )
}
