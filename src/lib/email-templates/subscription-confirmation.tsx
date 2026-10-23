import * as React from 'react'
import { Body, Container, Head, Html, Img, Preview, Section, Text } from '@react-email/components'
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
          <Img src={LOGO} width="120" height="24" alt="Thynk" style={logo} />
          <Section style={card}>
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
          </Section>
          <Text style={tagline}>Thynk it. Build it. Run it.</Text>
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

// 2026 brand (23/10/2026): soft sky background, white card, ink text, the wordmark on top, the square dot in lake.
// Commissioner where the mail app has it, Arial otherwise. The logo is served from the live site.
const LOGO = 'https://thynkagency.gr/email/thynk-email-logo.png'
const FONT = "Commissioner, Arial, 'Helvetica Neue', Helvetica, sans-serif"
const body = { backgroundColor: '#eef5f8', color: '#14262e', fontFamily: FONT, margin: '0', padding: '0' }
const container = { padding: '32px 20px', maxWidth: '560px' }
const logo = { display: 'block', margin: '0 0 20px' }
const card = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px 28px 8px', border: '1px solid #d6e5ea' }
const paragraph = { color: '#14262e', fontSize: '15px', lineHeight: '24px', margin: '0 0 20px' }
const dot = { backgroundColor: '#1d5866', display: 'inline-block', width: '8px', height: '8px', marginRight: '6px' }
const tagline = { color: '#4f626a', fontSize: '13px', lineHeight: '20px', margin: '16px 0 0' }