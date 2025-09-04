import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import { SubscriptionSchema, type SubscriptionType } from '../data/contact';

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
            const subscriptionData = {
                cupsRange: data.cupsRange,
                brewMethod: data.brewMethod,
                grindPref: data.grindPref,
                schedule: data.schedule,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone || '', 
                calculatedCupsPerDay: data.cupsRange === "Others" && data.customCups
                    ? data.customCups
                    : data.cupsRange === "1 to 2" ? 1.5
                    : data.cupsRange === "2 to 4" ? 3
                    : data.cupsRange === "5 - 7" ? 6
                    : 2,
                timestamp: new Date().toISOString(),
            };

            console.log('Subscription Data:', subscriptionData);

            const response = await axios.post('http://127.0.0.1:5001/api/subscriptions/', subscriptionData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
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
