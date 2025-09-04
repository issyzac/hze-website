import { motion } from 'framer-motion';
import { useContactForm } from '../hooks/useContactForm';

export default function ContactUs() {
  const { register, onSubmit, errors, isValid, mutation } = useContactForm();

  return (
    <section id="contact" className="py-16 px-4 bg-[#F7F3ED]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-['GTAlpinaThin'] text-coffee-dark mb-6">
            Contact Us
          </h2>
          <p className="text-lg text-coffee-brown font-['RoobertRegular'] mb-8">
            Get in touch with Harakati za Enzi Roastery
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-coffee-brown/20 shadow-lg p-8">
            <p className="text-coffee-dark leading-relaxed mb-8 font-['RoobertRegular'] text-center">
              Have questions about our coffee or want to place a custom order?
              We'd love to hear from you!
            </p>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullname" className="block text-sm font-['RoobertMedium'] text-coffee-brown mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullname"
                  {...register('fullname')}
                  className={`w-full px-4 py-3 rounded-xl border font-['RoobertRegular'] focus:outline-none focus:ring-2 focus:ring-coffee-gold transition-colors ${
                    errors.fullname
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-coffee-brown/20 focus:border-coffee-gold'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullname && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
                )}
              </div>

              {/* Email and Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-['RoobertMedium'] text-coffee-brown mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 rounded-xl border font-['RoobertRegular'] focus:outline-none focus:ring-2 focus:ring-coffee-gold transition-colors ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-coffee-brown/20 focus:border-coffee-gold'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-['RoobertMedium'] text-coffee-brown mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className={`w-full px-4 py-3 rounded-xl border font-['RoobertRegular'] focus:outline-none focus:ring-2 focus:ring-coffee-gold transition-colors ${
                      errors.phone
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-coffee-brown/20 focus:border-coffee-gold'
                    }`}
                    placeholder="+255 712 345 678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-['RoobertMedium'] text-coffee-brown mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border font-['RoobertRegular'] focus:outline-none focus:ring-2 focus:ring-coffee-gold transition-colors resize-vertical ${
                    errors.message
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-coffee-brown/20 focus:border-coffee-gold'
                  }`}
                  placeholder="Tell us about your coffee preferences, custom order, or any questions you have..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={mutation.isPending || !isValid}
                className={`w-full py-4 px-6 rounded-xl font-['RoobertMedium'] text-white shadow-sm transition-all duration-200 ${
                  mutation.isPending || !isValid
                    ? 'bg-coffee-brown/60 cursor-not-allowed'
                    : 'bg-coffee-brown hover:bg-coffee-bean hover:shadow-md active:shadow-none'
                }`}
                whileHover={!mutation.isPending && isValid ? { y: -1 } : {}}
                whileTap={!mutation.isPending && isValid ? { scale: 0.98 } : {}}
              >
                {mutation.isPending ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
