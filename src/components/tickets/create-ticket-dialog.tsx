import { FormEvent, useState } from 'react'
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

export function CreateTicketDialog({ onCreate }: { onCreate: (ticket: Omit<Ticket, 'id'>) => void }) {
  const [open, setOpen] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    onCreate({
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
    event.currentTarget.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-none bg-[#cb0101] px-6 text-base font-bold text-white hover:bg-[#a80000]">
          <span className="mr-2 text-2xl leading-none">+</span>
          Create Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[420px] overflow-hidden rounded-[18px] border-none bg-[#111] p-0 text-white shadow-2xl sm:rounded-[18px] [&>button]:text-white">
        <DialogHeader className="bg-[#cb0101] px-6 py-5 text-left text-white">
          <DialogTitle className="text-2xl font-bold text-white">Create Ticket</DialogTitle>
          <DialogDescription className="text-white/80">
            Add a mobile ticket to this rebuilt manager. No Zynapse backend is used.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="event">Event name</Label>
            <Input id="event" name="event" defaultValue="2025-26 Stanley Cup Final: Home Game 2" className={fieldClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date & time</Label>
              <Input id="date" name="date" defaultValue="Thu • Jun 04, 2026 • 8:00 PM" className={fieldClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" name="venue" defaultValue="Lenovo Center" className={fieldClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input id="section" name="section" defaultValue="VVBAR" className={fieldClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="row">Row</Label>
              <Input id="row" name="row" defaultValue="SRO" className={fieldClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seat">Seat</Label>
              <Input id="seat" name="seat" defaultValue="31" className={fieldClass} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Ticket type</Label>
            <Input id="type" name="type" defaultValue="Adult" placeholder="Adult" className={fieldClass} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Ticket image URL</Label>
            <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/event-image.jpg" className={fieldClass} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Internal notes" className={fieldClass} />
          </div>
          <DialogFooter className="gap-3 pt-2 sm:gap-3">
            <Button type="button" variant="outline" className="rounded-none border-white/10 bg-[#111] text-white hover:bg-zinc-900 hover:text-white" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-none bg-[#cb0101] text-white hover:bg-[#a80000]">
              Save Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
