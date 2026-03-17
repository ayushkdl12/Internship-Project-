"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Clock, Calendar, CheckCircle, Trash2, Loader2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export default function SlotManagementPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");

  useEffect(() => {
    fetchSlots();
  }, [session]);

  const fetchSlots = async () => {
    try {
      const res = await fetch("/api/interviews/slots");
      if (res.ok) {
        const data = await res.json();
        setSlots(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newStartTime || !newEndTime) return;

    setCreating(true);
    try {
      const start = new Date(`${newDate}T${newStartTime}`);
      const end = new Date(`${newDate}T${newEndTime}`);

      const res = await fetch("/api/interviews/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime: start, endTime: end }),
      });

      if (res.ok) {
        fetchSlots();
        setNewStartTime("");
        setNewEndTime("");
      }
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center">
       <Loader2 className="w-8 h-8 animate-spin text-primary" />
     </div>
  );

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-muted/5 p-4 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="rounded-xl">
              <Link href="/dashboard/organization"><ArrowLeft className="w-4 h-4 mr-1" /> Dashboard</Link>
            </Button>
            <h1 className="text-2xl font-bold">Manage Interview Slots</h1>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 shadow-card border-0 h-fit sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">Create New Slot</CardTitle>
              <CardDescription>Add availability for student interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSlot} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" id="date" value={newDate} onChange={e => setNewDate(e.target.value)} required className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="start">Start Time</Label>
                    <Input type="time" id="start" value={newStartTime} onChange={e => setNewStartTime(e.target.value)} required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">End Time</Label>
                    <Input type="time" id="end" value={newEndTime} onChange={e => setNewEndTime(e.target.value)} required className="rounded-xl" />
                  </div>
                </div>
                <Button type="submit" disabled={creating} className="w-full h-11 gradient-primary text-white border-0 shadow-glow btn-hover font-bold rounded-xl mt-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-2" /> Add Slot</>}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-lg">Your Availability</h2>
            </div>
            
            {slots.length === 0 ? (
               <Card className="border-dashed border-2 bg-transparent shadow-none">
                 <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
                   <Info className="w-12 h-12 text-muted-foreground opacity-50" />
                   <p className="font-medium text-muted-foreground">No slots created yet</p>
                   <p className="text-xs text-muted-foreground max-w-[200px]">Create slots on the left to allow students to book interviews.</p>
                 </CardContent>
               </Card>
            ) : (
              <div className="space-y-3">
                {slots.map((slot) => {
                  const date = new Date(slot.startTime);
                  return (
                    <Card key={slot.id} className="shadow-card border-0 overflow-hidden">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                            <span className="text-[10px] font-bold uppercase">{date.toLocaleDateString(undefined, { month: 'short' })}</span>
                            <span className="text-xl font-black leading-none">{date.getDate()}</span>
                          </div>
                          <div>
                            <p className="font-bold">{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <div className="flex items-center gap-2 mt-1">
                               {slot.isBooked ? (
                                 <Badge className="bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-0">Booked</Badge>
                               ) : (
                                 <Badge variant="outline" className="text-[10px] uppercase font-bold px-2 py-0 border-primary/30 text-primary">Available</Badge>
                               )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl" disabled={slot.isBooked}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
