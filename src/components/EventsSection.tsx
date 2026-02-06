
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { events, type Event } from '../data/events';
import { useIsMobile } from '../hooks/useIsMobile';

// --- Types & Constants ---
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const JAPANESE_DAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const JAPANESE_MONTHS = [
  '睦月', '如月', '弥生', '卯月', '皐月', '水无月',
  '文月', '叶月', '长月', '神无月', '霜月', '师走'
];



// --- Helper Functions ---
const parseEventDate = (dateStr: string): Date => {
  // Format: "March 15, 2026"
  const parts = dateStr.replace(',', '').split(' ');
  const monthIndex = MONTHS.indexOf(parts[0]);
  const day = parseInt(parts[1]);
  const year = parseInt(parts[2]);
  
  if (monthIndex === -1 || isNaN(day) || isNaN(year)) {
      // Fallback or error handling
      return new Date();
  }
  return new Date(year, monthIndex, day);
};

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};


// --- Sub-Components ---

// 1. The Coffee Bag Event Card (Refined version of previous design)
const EventCard = ({ event }: { event: Event }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, rotate: 1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
        <div className="bg-[#FFFDF9] relative w-full shadow-2xl rounded-sm overflow-hidden border border-[#EBE8E0]">
            {/* Bag Top Fold */}
            <div className="h-3 bg-[#D8D4C9] w-full shadow-inner opacity-80"></div>
            <div className="h-1 bg-[#C7C3B8] w-full mx-auto mt-[1px]"></div>
            
            <div className="p-8 relative">
                {/* Vertical Type Stamp */}
                <div className="absolute top-6 right-6 flex flex-col items-center justify-center border border-coffee-brown p-2 rounded-sm opacity-60">
                    <span className="text-xs font-['RoobertMedium'] text-coffee-brown uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>
                        {event.type}
                    </span>
                </div>

                {/* Content */}
                <div className="mt-6 text-center border-y-2 border-dotted border-coffee-light py-8">
                    <div className="text-coffee-dark font-['GTAlpinaThin'] text-3xl mb-3 leading-tight">
                        {event.title}
                    </div>
                    
                    <div className="flex flex-col gap-2 items-center justify-center text-coffee-brown text-sm font-['RoobertMedium'] mb-6">
                         <div className="flex items-center gap-2 uppercase tracking-wider">
                            <CalendarIcon size={14} />
                            <span>{event.date}</span>
                         </div>
                         <div className="flex items-center gap-2 uppercase tracking-wider opacity-80">
                            <Clock size={14} />
                            <span>{event.time}</span>
                         </div>
                    </div>

                    <p className="text-coffee-bean text-sm leading-relaxed opacity-80 font-['RoobertRegular'] px-4 mb-6">
                        {event.description}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-coffee-gold font-bold uppercase tracking-widest">
                        <MapPin size={12} />
                        {event.location}
                    </div>
                </div>

                {/* Action */}
                <div className="mt-8 flex justify-center">
                    {event.registrationLink ? (
                        <a 
                            href={event.registrationLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="relative overflow-hidden px-8 py-3 bg-coffee-dark text-coffee-cream font-['RoobertMedium'] text-sm tracking-widest hover:bg-coffee-brown transition-colors duration-300 rounded-sm"
                        >
                            RSVP
                        </a>
                    ) : (
                        <span className="px-8 py-3 border border-coffee-light text-coffee-brown font-['RoobertRegular'] text-sm tracking-widest bg-coffee-cream/30 cursor-default">
                            Open Entry
                        </span>
                    )}
                </div>
            </div>
            
            {/* Bottom Crimp */}
            <div className="h-4 bg-gradient-to-b from-[#EBE8E0] to-[#DDD9CE] border-t border-[#D8D4C9]"></div>
        </div>
    </motion.div>
  );
};

// 2. Empty State Card
const EmptyState = ({ date }: { date: Date }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 border border-dashed border-coffee-light/30 rounded-lg bg-[#FAF8F5]"
    >
        <div className="w-16 h-16 rounded-full bg-coffee-cream flex items-center justify-center mb-4 opacity-50">
           <span className="text-2xl">☕</span>
        </div>
        <h3 className="text-xl font-['GTAlpinaThin'] text-coffee-dark mb-2">No Scheduled Roasts</h3>
        <p className="text-coffee-brown/70 font-['RoobertRegular'] text-sm max-w-xs">
            We are taking a break to source the finest beans on {MONTHS[date.getMonth()]} {date.getDate()}, {date.getFullYear()}.
        </p>
    </motion.div>
);

// --- Main Component ---
const EventsSection = () => {
    const isMobile = useIsMobile();
    
    // Determine initial date based on first event or today
    const firstEventDate = events.length > 0 ? parseEventDate(events[0].date) : new Date();
    // Default to viewing the month of the first event if it's in the future, otherwise today
    const initialViewDate = firstEventDate > new Date() ? firstEventDate : new Date();

    const [viewDate, setViewDate] = useState(initialViewDate);
    // Select the first event's date initially if available
    const [selectedDate, setSelectedDate] = useState<Date>(
        events.length > 0 ? parseEventDate(events[0].date) : new Date()
    );

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    
    // Derived state for calendar grid
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Prepare events mapping
    const eventsByDate = useMemo(() => {
        const map = new Map<string, Event[]>();
        events.forEach(e => {
            const d = parseEventDate(e.date);
            const key = d.toDateString();
            const existing = map.get(key) || [];
            map.set(key, [...existing, e]);
        });
        return map;
    }, []);

    const handlePrevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(newDate);
        
        if (isMobile) {
            setTimeout(() => {
                const element = document.getElementById('event-details-view');
                if (element) {
                    const offset = 80; // Offset for sticky header
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    };

    const selectedEvents = eventsByDate.get(selectedDate.toDateString()) || [];

    return (
        <section className="py-12 md:py-24 bg-[#F9F7F2] relative overflow-hidden" id="events">
             {/* Decorative Background Elements */}
             <div className="absolute top-0 left-0 w-64 h-64 bg-coffee-cream rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-coffee-brown rounded-full blur-3xl opacity-5 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl text-coffee-dark mb-4 font-['GTAlpinaThin']">
                        Events Calendar
                    </h2>
                    <p className="text-coffee-brown max-w-2xl mx-auto font-['RoobertRegular'] tracking-wide">
                        Join our community gatherings.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* LEFT: Calendar Widget */}
                    <div className="lg:col-span-7">
                        <div className="bg-white/80 backdrop-blur-sm rounded-none p-8 md:p-12 shadow-sm border border-[#EBE8E0]">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-3xl text-coffee-dark font-['GTAlpinaThin']">
                                        {MONTHS[currentMonth]} <span className="text-coffee-gold ml-2">{currentYear}</span>
                                    </h3>
                                    <span className="text-sm font-['RoobertRegular'] text-coffee-brown opacity-60 tracking-[0.2em] uppercase">
                                        {JAPANESE_MONTHS[currentMonth]}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handlePrevMonth} className="p-2 hover:bg-coffee-cream rounded-full transition-colors text-coffee-brown">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button onClick={handleNextMonth} className="p-2 hover:bg-coffee-cream rounded-full transition-colors text-coffee-brown">
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 mb-4">
                                {DAYS.map((day, i) => (
                                    <div key={day} className="text-center py-2">
                                        <div className="text-xs font-bold text-coffee-brown uppercase tracking-wider">{day}</div>
                                        <div className="text-[10px] text-coffee-brown/50">{JAPANESE_DAYS[i]}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square"></div>
                                ))}
                                
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const date = new Date(currentYear, currentMonth, day);
                                    const dateKey = date.toDateString();
                                    const hasEvents = eventsByDate.has(dateKey);
                                    const isSelected = isSameDay(date, selectedDate);
                                    
                                    return (
                                        <motion.button
                                            key={day}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDateClick(day)}
                                            className={`
                                                relative aspect-square flex flex-col items-center justify-center rounded-full transition-all duration-300 isolate
                                                ${isSelected 
                                                    ? 'bg-coffee-dark text-white shadow-md' 
                                                    : 'text-coffee-dark hover:bg-coffee-cream/30'
                                                }
                                            `}
                                        >
                                            {/* Coffee Bean Visual for Event Days */}
                                            {hasEvents && !isSelected && (
                                                <div className="absolute inset-0 flex items-center justify-center -z-10">
                                                    {/* Oval bean shape */}
                                                    <div className="w-[85%] h-[65%] bg-[#D2B48C]/40 rounded-[50%] -rotate-12 border border-[#8B4513]/10" />
                                                </div>
                                            )}

                                            <span className={`text-lg font-['RoobertMedium'] z-10 ${isSelected ? 'text-white' : ''}`}>
                                                {day}
                                            </span>
                                            
                                            {/* Subtile Dots - kept for density indication but made smaller */}
                                            {hasEvents && (
                                                <div className="absolute bottom-2 flex gap-0.5 z-10">
                                                     {eventsByDate.get(dateKey)?.map((_, idx) => (
                                                        <span 
                                                            key={idx} 
                                                            className={`w-1 h-1 rounded-full ${isSelected ? 'bg-coffee-gold' : 'bg-coffee-brown/60'}`}
                                                        />
                                                     ))}
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Selected Event Details */}
                    <div 
                        id="event-details-view"
                        className="lg:col-span-5 flex flex-col justify-center min-h-[500px]"
                    >
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedDate.toDateString() + (selectedEvents.length ? 'has' : 'empty')}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <div className="mb-6 flex items-center justify-between border-b border-coffee-brown/20 pb-4">
                                     <h4 className="text-xl font-['RoobertMedium'] text-coffee-dark">
                                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                     </h4>
                                     <span className="text-coffee-gold text-sm font-bold uppercase tracking-wider">
                                         {selectedEvents.length} Event{selectedEvents.length !== 1 ? 's' : ''}
                                     </span>
                                </div>

                                {selectedEvents.length > 0 ? (
                                    <div className="flex flex-col gap-8">
                                        {selectedEvents.map(event => (
                                            <EventCard key={event.id} event={event} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState date={selectedDate} />
                                )}
                            </motion.div>
                         </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default EventsSection;
