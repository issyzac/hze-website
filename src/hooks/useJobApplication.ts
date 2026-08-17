import { useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import {
    flattenAnswers,
    progressStats,
    type Answers,
} from '../data/careers';

export interface ApplicationPayload {
    role: string;
    answers: Answers;
}

const str = (value: unknown) => (typeof value === 'string' ? value : null);

export const useJobApplication = () => {
    const mutation = useMutation({
        mutationFn: async ({ role, answers }: ApplicationPayload) => {
            const stats = progressStats(answers);

            const dbData = {
                role,
                full_name: str(answers.full_name),
                email: str(answers.email),
                phone: str(answers.phone),
                area: str(answers.area),
                preferred_location: str(answers.preferred_location),
                experience_level: str(answers.experience_level),
                earliest_start: str(answers.start_date),
                notice_period: str(answers.notice_period),
                salary_expectation: str(answers.salary),
                completion_percent: stats.percent,
                answers: {
                    raw: answers,
                    readable: flattenAnswers(answers),
                },
            };

            // No .select() here. Chaining it makes PostgREST issue an
            // INSERT ... RETURNING, which needs a SELECT policy — and this table
            // deliberately has none (applicants may submit, nobody anonymous may
            // read applications back). With RLS on, that read-back is refused and
            // Postgres reports it as "new row violates row-level security policy",
            // which looks like the insert failed when in fact only the return did.
            const { error } = await supabase
                .from('job_applications')
                .insert([dbData]);

            if (error) throw error;
            return true;
        },
    });

    return mutation;
};
