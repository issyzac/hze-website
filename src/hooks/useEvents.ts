
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { type Event } from '../data/events';

// Map DB snake_case to frontend camelCase
const mapEventFromDB = (dbEvent: any): Event => {
    // Manually parse YYYY-MM-DD to avoid timezone issues
    // dbEvent.date is expected to be "2026-02-14"
    const [year, month, day] = dbEvent.date.split('-').map(Number);

    // Create date object (Middle of day to be safe, but we really just want the string)
    // Actually, let's just construct the string directly to match exactly what the UI parser expects: "Month DD, YYYY"
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dateStr = `${monthNames[month - 1]} ${day}, ${year}`;

    return {
        id: dbEvent.id,
        title: dbEvent.title,
        date: dateStr,
        time: dbEvent.time,
        description: dbEvent.description,
        location: dbEvent.location,
        type: dbEvent.type,
        registrationLink: dbEvent.registration_link
    };
};

export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            console.log('Fetching events from Supabase...');
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            if (error) {
                console.error('Error fetching events:', error);
                throw error;
            }

            console.log('Events fetched raw:', data);

            if (!data || data.length === 0) {
                console.warn('No events found in database. Check RLS policies if data exists.');
                return [];
            }

            const mapped = data.map(mapEventFromDB);
            console.log('Events mapped:', mapped);
            return mapped;
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};
