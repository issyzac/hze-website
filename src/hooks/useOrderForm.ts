import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import { OrderSchema, type OrderType } from '../data/contact';

export const useOrderForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<OrderType>({
        resolver: zodResolver(OrderSchema),
        mode: 'onChange',
    });

    const mutation = useMutation({
        mutationFn: async (data: OrderType) => {
            const orderData = {
                productName: data.productId,
                quantity: data.quantity,
                fullName: data.fullName,
                email: data.email || '', 
                phone: data.phone || '',
                note: data.note || '',
                timestamp: new Date().toISOString(),
            };
            const response = await axios.post('https://loyaserver.enzi.coffee/api/orders/', orderData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        },
        onSuccess: () => {
            toast.success('🎉 Thank you for your order! We\'ll send you a confirmation email shortly.', {
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
            console.error('Order submission error:', error);
            toast.error('Sorry, there was an error processing your order. Please try again or contact us directly.', {
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

    const onSubmit = handleSubmit((data: OrderType) => {
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
