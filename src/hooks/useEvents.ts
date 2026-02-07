
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { type Event } from '../data/events';

// Map DB snake_case to frontend camelCase
const mapEventFromDB = (dbEvent: any): Event => {
    // Handle both "2026-02-14" and "2026-02-14T14:00:00" formats
    let dateStrRaw = dbEvent.date;
    if (dateStrRaw && dateStrRaw.includes('T')) {
        dateStrRaw = dateStrRaw.split('T')[0];
    }

    // Now convert YYYY-MM-DD to "Month DD, YYYY"
    const [year, month, day] = dateStrRaw.split('-').map((val: string) => parseInt(val, 10));

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Safety check
    if (!year || !month || !day || month < 1 || month > 12) {
        console.warn('Invalid date format from DB:', dbEvent.date);
        return {
            id: dbEvent.id,
            title: dbEvent.title,
            date: 'Invalid Date',
            time: dbEvent.time,
            description: dbEvent.description,
            location: dbEvent.location,
            type: dbEvent.type,
            registrationLink: dbEvent.registration_link
        };
    }

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
