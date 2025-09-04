import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ContactSchema, type ContactType } from '../data/contact';

export const useContactForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<ContactType>({
        resolver: zodResolver(ContactSchema),
        mode: 'onChange',
    });

    const mutation = useMutation({
        mutationFn: async (data: ContactType) => {
            const formData = new FormData();
            formData.append('EMAIL', data.email);
            formData.append('FNAME', data.fullname.split(' ')[0] || '');
            formData.append('LNAME', data.fullname.split(' ').slice(1).join(' ') || '');
            if (data.phone?.trim()) {
                formData.append('PHONE', data.phone);
            }
            formData.append('MMERGE7', data.message);

            // Bot protection field
            formData.append('b_6d45594e855931070e1320f13_1db2d3d921', '');

            await fetch('https://gmail.us2.list-manage.com/subscribe/post?u=6d45594e855931070e1320f13&id=1db2d3d921&f_id=00a8aee0f0', {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            // Since we're using no-cors mode, we can't check the response
            // We'll assume success if no error is thrown
            return { success: true };
        },
        onSuccess: () => {
            toast.success('Thank you for your message! We\'ll get back to you soon.', {
                duration: 8000,
                position: "top-center",
                style: {
                    background: '#2C1810',
                    color: '#F5F5DC',
                    border: '1px solid #8B4513',
                },
            });
            reset();
        },
        onError: () => {
            toast.error('Sorry, there was an error sending your message. Please try again.', {
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

    const onSubmit = handleSubmit((data: ContactType) => {
        mutation.mutate(data);
    });

    return {
        mutation,
        register,
        onSubmit,
        errors,
        isValid
    };
};
