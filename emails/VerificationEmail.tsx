import {
  Html,
  Head,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
 otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
      </Head>

      <Preview>Here's your verification code: {otp}</Preview>

      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>

        <Row>
          <Text>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </Text>
        </Row>

        <Row>
          <Text>{otp}</Text>
        </Row>

        <Row>
          <Button
            href="https://yourwebsite.com"
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '5px',
              textDecoration: 'none',
            }}
          >
            Verify Account
          </Button>
        </Row>
      </Section>
    </Html>
  );
}