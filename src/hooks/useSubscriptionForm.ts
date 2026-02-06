import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { SubscriptionSchema, type SubscriptionType } from '../data/contact';
import { supabase } from '../lib/supabase';

export const useSubscriptionForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<SubscriptionType>({
        resolver: zodResolver(SubscriptionSchema),
        mode: 'onChange',
    });

    const mutation = useMutation({
        mutationFn: async (data: SubscriptionType) => {
            // Map frontend camelCase to DB snake_case
            const dbData = {
                cups_range: data.cupsRange,
                custom_cups: data.customCups,
                brew_method: data.brewMethod,
                grind_pref: data.grindPref,
                coffee_product: data.coffeeProduct,
                schedule: data.schedule,
                recommended_size: data.recommendedSize,
                calculated_price: data.calculatedPrice,
                full_name: data.fullName,
                email: data.email,
                phone: data.phone || null,
            };

            console.log('Submitting to Supabase:', dbData);

            const { data: result, error } = await supabase
                .from('subscriptions')
                .insert([dbData])
                .select();

            if (error) {
                throw error;
            }

            return result;
        },
        onSuccess: () => {
            toast.success('🎉 Thank you for subscribing! Your coffee subscription has been created successfully. We\'ll send you a confirmation email shortly.', {
                duration: 10000,
                position: "top-center",
                style: {
                    background: '#2C1810',
                    color: '#F5F5DC',
                    border: '1px solid #8B4513',
                    fontSize: '14px',
                    lineHeight: '1.4',
                },
            });
            reset();
        },
        onError: (error: any) => {
            console.error('Subscription submission error:', error);
            toast.error('Sorry, there was an error creating your subscription. Please try again or contact us directly.', {
                duration: 8000,
                position: "top-center",
                style: {
                    background: '#8B4513',
                    color: '#F5F5DC',
                    border: '1px solid #2C1810',
                },
            });
        },
    });

    const onSubmit = handleSubmit((data: SubscriptionType) => {
        mutation.mutate(data);
    });

    return {
        mutation,
        register,
        onSubmit,
        errors,
        isValid,
        setValue,
        watch,
        reset,
    };
};
