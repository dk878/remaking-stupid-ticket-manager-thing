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
  detailsPath?: string
  notesTranslateY?: number
  viewTicketTranslateY?: number
  ticketDetailsTranslateY?: number
  sectionRowSeatTranslateY?: number
  labelsTranslateY?: number
  valuesFontSize?: number
  longLabels?: boolean
  bottomLineTranslateY?: number
}

export function TicketCard({ ticket, onUpdate, onDelete, detailsPath = '/ticket-details', notesTranslateY = 0, viewTicketTranslateY = 0, ticketDetailsTranslateY = 0, sectionRowSeatTranslateY = 0, labelsTranslateY = 0, valuesFontSize = 19.6, longLabels = false, bottomLineTranslateY = 0 }: TicketCardProps) {
  return (
    <article className="relative h-[555px] w-[330px] shrink-0 overflow-hidden rounded-[18px] bg-white shadow-[0_3px_3px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
      <EditTicketDialog ticket={ticket} onUpdate={onUpdate} onDelete={onDelete} />
      <section className="h-[130px] bg-[#cb0101] px-8 pb-[27px] pt-[15px] text-white">
        <div className="mx-auto h-[19px] w-[55px] overflow-hidden text-center text-[13.5px] font-light leading-none">
          {ticket.type}
        </div>
        <div className="mt-[21px] grid grid-cols-3 gap-6 text-center" style={sectionRowSeatTranslateY !== 0 ? { transform: `translateY(${sectionRowSeatTranslateY}px)` } : undefined}>
          <div className="-translate-x-[5px]">
            <p className="-translate-x-[7px] text-[13.5px] font-light" style={{ transform: `translateX(-7px) translateY(${3 + labelsTranslateY}px)` }}>{longLabels ? 'Section' : 'SEC'}</p>
            <p className="mt-[-4px] -translate-x-[6.5px] font-bold tracking-tight" style={{ fontSize: `${valuesFontSize}px` }}>{ticket.section}</p>
          </div>
          <div>
            <p className="text-[13.5px] font-light" style={{ transform: `translateY(${3 + labelsTranslateY}px)` }}>{longLabels ? 'Row' : 'ROW'}</p>
            <p className="mt-[-4px] font-bold tracking-tight" style={{ fontSize: `${valuesFontSize}px` }}>{ticket.row}</p>
          </div>
          <div className="translate-x-[4px]">
            <p className="text-[13.5px] font-light" style={{ transform: `translateX(7px) translateY(${3 + labelsTranslateY}px)` }}>{longLabels ? 'Seat' : 'SEAT'}</p>
            <p className="mt-[-4px] translate-x-[6.5px] font-bold tracking-tight" style={{ fontSize: `${valuesFontSize}px` }}>{ticket.seat}</p>
          </div>
        </div>
      </section>

      <section className="relative h-[194px] w-[330px] overflow-hidden bg-black text-white">
        {ticket.imageUrl ? (
          <img src={ticket.imageUrl} alt="Ticket event" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <TeamArt />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
        <div className="absolute inset-x-[10px] top-[116px] text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          <h2 className="text-[18px] font-light leading-tight">{ ticket.event}</h2>
        </div>
        <div className="absolute inset-x-1 bottom-[10px] text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          <p className="text-[13.5px] font-light">
            {ticket.date.split(' • ').map((part, i, arr) => (
              <span key={i} className={i === arr.length - 1 ? '-translate-x-[1px] inline-block' : '-translate-x-[5px] inline-block'}>
                {part}{i < arr.length - 1 ? <span style={{ padding: '0 5px', marginLeft: i === arr.length - 2 ? '4px' : '0' }}>•</span> : ''}
              </span>
            ))}
            <span style={{ padding: '0 5px' }}>•</span>{ticket.venue}
          </p>
        </div>
      </section>

      <section className="px-6 pb-10 pt-[95px] text-center sm:px-8 sm:pb-16 sm:pt-24">
        <div className="mx-auto mb-3 h-[19px] w-[280px] overflow-hidden text-center text-[13.5px] font-light leading-none text-zinc-950" style={notesTranslateY !== 0 ? { transform: `translateY(${notesTranslateY}px)` } : undefined}>
          {ticket.notes}
        </div>
        <Button asChild className="h-[39px] w-[280px] rounded-none bg-[#cb0101] text-[13.5px] font-normal text-white hover:bg-[#a80000]" style={viewTicketTranslateY !== 0 ? { transform: `translateY(${viewTicketTranslateY}px)` } : undefined}>
          <Link to={`/tickets/${ticket.id}` as string} onClick={(event) => event.stopPropagation()}>
            <img src="https://cdn.discordapp.com/attachments/1108078293900599358/1511439503447822547/gfbdncmnvb.jpg?ex=6a20753a&is=6a1f23ba&hm=9d473c4464c1171026ab0f66be854401eceadb14e3e37cace6ddb7d852e9dfc3&animated=true" alt="barcode" className="h-5 w-auto translate-x-[3px]" />
            <span className="ml-2 font-semibold">View Ticket</span>
          </Link>
        </Button>
        <Link to={detailsPath as string} onClick={(event) => event.stopPropagation()} className="mt-[16px] block text-[14px] font-semibold text-[#cb0101]" style={ticketDetailsTranslateY !== 0 ? { transform: `translateY(${ticketDetailsTranslateY}px)` } : undefined}>Ticket Details</Link>
      </section>
      <div className="mt-[31px] h-[1px] w-full bg-[#cb0101]" style={bottomLineTranslateY !== 0 ? { transform: `translateY(${bottomLineTranslateY}px)` } : undefined} />
    </article>
  )
}
