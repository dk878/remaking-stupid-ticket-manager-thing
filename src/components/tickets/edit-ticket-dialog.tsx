import { FormEvent, MouseEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Ticket } from './ticket-card'

const fieldClass = 'border-white/10 bg-[#111] text-white placeholder:text-zinc-500 focus-visible:ring-white/30'

type TicketFormValues = Omit<Ticket, 'id'>

type EditTicketDialogProps = {
  ticket: Ticket
  onUpdate: (id: number, ticket: TicketFormValues) => void | Promise<void>
  onDelete: (id: number) => void | Promise<void>
}

export function EditTicketDialog({ ticket, onUpdate, onDelete }: EditTicketDialogProps) {
  const [open, setOpen] = useState(false)

  function stopCardClick(event: MouseEvent) {
    event.stopPropagation()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    await onUpdate(ticket.id, {
      event: String(form.get('event') || 'New Event'),
      date: String(form.get('date') || 'Fri • Jun 05, 2026 • 8:00 PM'),
      venue: String(form.get('venue') || 'Lenovo Center'),
      section: String(form.get('section') || 'TBD'),
      row: String(form.get('row') || 'TBD'),
      seat: String(form.get('seat') || '1'),
      type: String(form.get('type') || 'Adult'),
      notes: String(form.get('notes') || ''),
      imageUrl: String(form.get('imageUrl') || ''),
    })
    setOpen(false)
  }

  async function handleDelete() {
    await onDelete(ticket.id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="absolute right-3 top-3 z-10 grid h-[20px] w-[20px] place-items-center rounded-full border-2 border-solid !border-white bg-transparent text-sm font-normal leading-none !text-white shadow-none hover:bg-white/10"
          aria-label="Edit ticket information"
          onClick={stopCardClick}
        >
          i
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[420px] overflow-hidden rounded-[18px] border-none bg-[#111] p-0 text-white shadow-2xl sm:rounded-[18px] [&>button]:text-white"
        onClick={stopCardClick}
      >
        <DialogHeader className="bg-[#cb0101] px-6 py-5 text-left text-white">
          <DialogTitle className="text-2xl font-bold text-white">Edit Ticket</DialogTitle>
          <DialogDescription className="text-white/80">
            Update this ticket or remove it from the database.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor={`event-${ticket.id}`}>Event name</Label>
            <Input id={`event-${ticket.id}`} name="event" defaultValue={ticket.event} className={fieldClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`date-${ticket.id}`}>Date & time</Label>
              <Input id={`date-${ticket.id}`} name="date" defaultValue={ticket.date} className={fieldClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`venue-${ticket.id}`}>Venue</Label>
              <Input id={`venue-${ticket.id}`} name="venue" defaultValue={ticket.venue} className={fieldClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`section-${ticket.id}`}>Section</Label>
              <Input id={`section-${ticket.id}`} name="section" defaultValue={ticket.section} className={fieldClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`row-${ticket.id}`}>Row</Label>
              <Input id={`row-${ticket.id}`} name="row" defaultValue={ticket.row} className={fieldClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`seat-${ticket.id}`}>Seat</Label>
              <Input id={`seat-${ticket.id}`} name="seat" defaultValue={ticket.seat} className={fieldClass} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`type-${ticket.id}`}>Ticket type</Label>
            <Input id={`type-${ticket.id}`} name="type" defaultValue={ticket.type} className={fieldClass} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`imageUrl-${ticket.id}`}>Ticket image URL</Label>
            <Input id={`imageUrl-${ticket.id}`} name="imageUrl" defaultValue={ticket.imageUrl} placeholder="https://example.com/event-image.jpg" className={fieldClass} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`notes-${ticket.id}`}>Notes</Label>
            <Textarea id={`notes-${ticket.id}`} name="notes" defaultValue={ticket.notes} placeholder="Internal notes" className={fieldClass} />
          </div>
          <DialogFooter className="flex-col gap-3 pt-2 sm:flex-row sm:justify-between sm:gap-3">
            <Button type="button" className="rounded-none bg-red-700 text-white hover:bg-red-800" onClick={handleDelete}>
              Delete
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="rounded-none border-white/10 bg-[#111] text-white hover:bg-zinc-900 hover:text-white" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-none bg-[#cb0101] text-white hover:bg-[#a80000]">
                Save Ticket
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
