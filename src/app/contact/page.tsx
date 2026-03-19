import { Metadata } from 'next';
import { ContactClient } from '@/components/layout/ContactClient';

export const metadata: Metadata = {
  title: 'Connect | NILXNJXN',
  description:
    'Direct connection with the source. Reach out for collaborations, inquiries, or to join the journey.',
};

export default function ContactPage() {
  return <ContactClient />;
}
