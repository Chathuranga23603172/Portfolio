import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const DESTINATION_EMAIL = 'chathuranganirmal631@gmail.com';

/**
 * Checks whether EmailJS credentials are fully configured.
 */
export function isEmailConfigured() {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

/**
 * Sends a contact form email via EmailJS directly to chathuranganirmal631@gmail.com.
 *
 * @param {Object} formData
 * @param {string} formData.name - Sender's name
 * @param {string} formData.email - Sender's email
 * @param {string} formData.subject - Message subject
 * @param {string} formData.message - Message body
 */
export async function sendContactEmail({ name, email, subject, message }) {
  if (!isEmailConfigured()) {
    throw new Error(
      'EmailJS credentials are not configured in your .env file yet. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.'
    );
  }

  const templateParams = {
    from_name: name,
    from_email: email,
    reply_to: email,
    subject: subject || `New Portfolio Inquiry from ${name}`,
    message: message,
    to_email: DESTINATION_EMAIL,
    to_name: 'Nirmal Chathuranga',
  };

  const response = await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    templateParams,
    PUBLIC_KEY
  );

  return response;
}
