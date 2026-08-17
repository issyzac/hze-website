import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useJobApplication } from './useJobApplication';

const insert = vi.fn();
const from = vi.fn(() => ({ insert }));

vi.mock('../lib/supabase', () => ({
    supabase: {
        get from() {
            return from;
        },
    },
}));

const wrapper = ({ children }: { children: ReactNode }) => {
    const client = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    });
    return createElement(QueryClientProvider, { client }, children);
};

const answers = {
    full_name: 'Asha Mwinyi',
    email: 'asha@example.com',
    phone: '+255700000000',
    area: 'Mbezi',
    preferred_location: 'HZE Mbezi',
    experience_level: '1-2 years',
    start_date: 'Immediately',
    notice_period: 'None',
    salary: '600,000',
};

describe('useJobApplication', () => {
    beforeEach(() => {
        insert.mockReset();
        from.mockClear();
        insert.mockResolvedValue({ error: null });
    });

    it('inserts into job_applications and maps answers onto columns', async () => {
        const { result } = renderHook(() => useJobApplication(), { wrapper });

        result.current.mutate({ role: 'Barista', answers });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(from).toHaveBeenCalledWith('job_applications');

        const [rows] = insert.mock.calls[0];
        expect(rows).toHaveLength(1);
        expect(rows[0]).toMatchObject({
            role: 'Barista',
            full_name: 'Asha Mwinyi',
            email: 'asha@example.com',
            phone: '+255700000000',
            // `start_date` / `salary` in the form become these columns
            earliest_start: 'Immediately',
            salary_expectation: '600,000',
        });
        expect(rows[0].answers.raw).toEqual(answers);
    });

    // Regression guard. Chaining .select() makes PostgREST run INSERT ... RETURNING,
    // which needs a SELECT policy; job_applications deliberately has none, so the
    // read-back is refused and Postgres reports it as
    // "new row violates row-level security policy" — as if the insert itself failed.
    // The mock resolves to a plain object with no .select, so a regression throws here.
    it('does not read the row back after inserting', async () => {
        const { result } = renderHook(() => useJobApplication(), { wrapper });

        result.current.mutate({ role: 'Barista', answers });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(insert.mock.results[0].type).toBe('return');
        expect(Object.keys(insert.mock.results[0].value)).not.toContain('select');
    });

    it('surfaces a Supabase error to the caller', async () => {
        insert.mockResolvedValue({ error: { message: 'boom' } });

        const { result } = renderHook(() => useJobApplication(), { wrapper });
        result.current.mutate({ role: 'Barista', answers });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toMatchObject({ message: 'boom' });
    });
});
