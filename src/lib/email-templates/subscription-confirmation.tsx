import * as React from 'react'
import { Body, Container, Head, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props { lang?: string }

function SubscriptionConfirmation({ lang }: Props) {
  const greek = lang === 'el'
  return (
    <Html lang={greek ? 'el' : 'en'} dir="ltr">
      <Head />
      <Preview>{greek ? 'Η εγγραφή σας επιβεβαιώθηκε' : 'Your subscription is confirmed'}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={paragraph}>{greek
            ? 'Ευχαριστούμε για την εγγραφή σας στις ενημερώσεις της Thynk. Με αυτό το email επιβεβαιώνουμε ότι η διεύθυνσή σας καταχωρήθηκε.'
            : 'Thank you for subscribing to Thynk updates. This email confirms that your address has been registered.'}</Text>
          <Text style={paragraph}>{greek
            ? 'Αν δεν κάνατε εσείς αυτή την εγγραφή, μπορείτε να τη διαγράψετε από τον σύνδεσμο στο τέλος του email.'
            : 'If you did not sign up yourself, you can remove the subscription with the link at the bottom of this email.'}</Text>
          <Text style={paragraph}>{greek
            ? 'Για οτιδήποτε, απαντήστε σε αυτό το email ή γράψτε μας στο hello@thynkagency.gr.'
            : 'For anything else, reply to this email or write to us at hello@thynkagency.gr.'}</Text>
          <Text style={paragraph}>
            <span aria-hidden="true" style={dot} />{' '}
            {greek ? 'Η ομάδα της Thynk · thynkagency.gr' : 'The Thynk team · thynkagency.gr'}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SubscriptionConfirmation,
  subject: ({ lang }) => lang === 'el' ? 'Η εγγραφή σας επιβεβαιώθηκε' : 'Your subscription is confirmed',
  displayName: 'Subscription confirmation',
  previewData: { lang: 'el' },
} satisfies TemplateEntry

const body = { backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px' }
const paragraph = { color: '#000000', fontSize: '15px', lineHeight: '24px', margin: '0 0 20px' }
const dot = { backgroundColor: '#ff6a1a', display: 'inline-block', width: '8px', height: '8px', marginRight: '6px' }