import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { EditTicketDialog } from './edit-ticket-dialog'

export type Ticket = {
  id: number
  event: string
  date: string
  venue: string
  section: string
  row: string
  seat: string
  type: string
  notes: string
  imageUrl: string
}

function BarcodeIcon() {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center" aria-hidden="true">
      <span className="absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-white" />
      <span className="absolute right-0 top-0 h-2 w-2 border-r-2 border-t-2 border-white" />
      <span className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-white" />
      <span className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-white" />
      <span className="flex h-5 items-end gap-[2px]">
        {[8, 16, 11, 18, 14, 9].map((height, index) => (
          <span key={index} className="w-[2px] bg-white" style={{ height }} />
        ))}
      </span>
    </span>
  )
}

function TeamArt() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="absolute left-1/2 top-1/2 h-56 w-[34rem] -translate-x-1/2 -translate-y-1/2 -rotate-[14deg] rounded-[100%] border-[18px] border-zinc-200/90 bg-gradient-to-br from-zinc-950 via-zinc-900 to-red-950 shadow-inner" />
      <div className="absolute left-1/2 top-1/2 h-36 w-[24rem] -translate-x-[47%] -translate-y-[46%] -rotate-[14deg] rounded-[100%] border-[16px] border-zinc-700 bg-gradient-to-br from-red-900 via-red-700 to-zinc-950" />
      <div className="absolute left-1/2 top-1/2 h-20 w-48 -translate-x-[55%] -translate-y-[28%] -rotate-[18deg] rounded-[100%] bg-zinc-950" />
      <div className="absolute left-[18%] top-[18%] h-10 w-[70%] -rotate-[14deg] rounded-full bg-white/80 blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" />
    </div>
  )
}

type TicketCardProps = {
  ticket: Ticket
  onUpdate: (id: number, ticket: Omit<Ticket, 'id'>) => void | Promise<void>
  onDelete: (id: number) => void | Promise<void>
}

export function TicketCard({ ticket, onUpdate, onDelete }: TicketCardProps) {
  return (
    <article className="w-[84vw] max-w-[430px] shrink-0 overflow-hidden rounded-[18px] bg-white shadow-[0_3px_16px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
      <section className="bg-[#c3211d] px-8 pb-8 pt-7 text-white">
        <div className="relative text-center text-lg font-light">
          {ticket.type}
          <EditTicketDialog ticket={ticket} onUpdate={onUpdate} onDelete={onDelete} />
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-lg font-light">Section</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{ticket.section}</p>
          </div>
          <div>
            <p className="text-lg font-light">Row</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{ticket.row}</p>
          </div>
          <div>
            <p className="text-lg font-light">Seat</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{ticket.seat}</p>
          </div>
        </div>
      </section>

      <section className="relative h-56 overflow-hidden bg-black text-white">
        {ticket.imageUrl ? (
          <img src={ticket.imageUrl} alt="Ticket event" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <TeamArt />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
        <div className="absolute inset-x-5 bottom-5 text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          <h2 className="text-2xl font-light leading-tight">{ticket.event}</h2>
          <p className="mt-3 text-lg font-light">{ticket.date} • {ticket.venue}</p>
        </div>
      </section>

      <section className="px-8 pb-16 pt-24 text-center">
        <Button asChild className="h-14 w-full rounded-none bg-[#c3211d] text-lg font-semibold text-white hover:bg-[#aa1d19]">
          <Link to={`/tickets/${ticket.id}` as string} onClick={(event) => event.stopPropagation()}>
            <BarcodeIcon />
            <span className="ml-4">View Ticket</span>
          </Link>
        </Button>
        <button className="mt-8 text-lg font-bold text-[#c3211d]">Ticket Details</button>
      </section>
    </article>
  )
}
