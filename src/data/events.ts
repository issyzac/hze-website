export interface Event {
    id: string;
    title: string; // The "roast" name or event name
    date: string;
    time: string;
    description: string;
    location: string;
    type: 'tasting' | 'workshop' | 'gathering';
    registrationLink?: string; // If present, the card is clickable/has a button
}

export const events: Event[] = [
    {
        id: '1',
        title: 'Sip and Paint',
        date: 'February 14, 2026',
        time: '2:00 PM - 5:00 PM',
        description: 'Unleash your inner artist while enjoying our finest selection of brews. A perfect blend of creativity and relaxation.',
        location: 'HZE Mbezi',
        type: 'gathering',
        registrationLink: 'https://forms.gle/LfzsSktYhZfRtNMw8'
    },
    {
        id: '2',
        title: 'Book Swap Event',
        date: 'February 21, 2026',
        time: '10:00 AM - 1:00 PM',
        description: 'Bring a book, take a book. Join fellow book lovers for a morning of literary exchange and community conversation.',
        location: 'HZE Mbezi',
        type: 'gathering'
    },
    {
        id: '3',
        title: 'Brew Better at Home',
        date: 'February 28, 2026',
        time: '1:45 PM - 4:00 PM',
        description: 'Elevate your morning ritual. Learn expert techniques for pour-over, french press, and troubleshooting your home brew.',
        location: 'HZE Mbezi',
        type: 'workshop',
        registrationLink: 'https://forms.gle/j6XEQ9fqP8mP244h6'
    }
];
