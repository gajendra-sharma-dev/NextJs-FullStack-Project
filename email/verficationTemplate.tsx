import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

// Verify button ka link yahan change karo
const VERIFY_URL = "https://yourapp.com/verify";

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Verification Code</title>
      </Head>

      {/* Inbox me preview text */}
      <Preview>Here is your verification code: {otp}</Preview>

      <Body style={body}>
        <Container style={container}>
          {/* Heading me username */}
          <Heading style={heading}>Hello {username},</Heading>

          {/* Text */}
          <Text style={text}>
            Thank you for registering. Please use the verification code below
            to complete your sign-up. This code is valid for 10 minutes.
          </Text>

          {/* OTP */}
          <Section style={otpBox}>
            <Text style={otpText}>{otp}</Text>
          </Section>

          {/* Verify button */}
          <Section style={buttonWrap}>
            <Button href={VERIFY_URL} style={button}>
              Verify account
            </Button>
          </Section>

          <Text style={footer}>
            If you did not request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Preview ke liye (npx email dev)
VerificationEmail.PreviewProps = {
  username: "Rahul",
  otp: "482916",
} as VerificationEmailProps;

const body: React.CSSProperties = {
  backgroundColor: "#f4f6f8",
  fontFamily: "Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "24px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "480px",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "8px",
};

const heading: React.CSSProperties = {
  fontSize: "22px",
  color: "#1a1a1a",
  margin: "0 0 16px",
};

const text: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#444444",
  margin: "0 0 24px",
};

const otpBox: React.CSSProperties = {
  backgroundColor: "#f0f3f7",
  borderRadius: "6px",
  padding: "16px",
  textAlign: "center",
  margin: "0 0 24px",
};

const otpText: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "8px",
  color: "#1a1a1a",
  margin: 0,
};

const buttonWrap: React.CSSProperties = {
  textAlign: "center",
  margin: "0 0 24px",
};

const button: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 600,
  padding: "12px 28px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
};

const footer: React.CSSProperties = {
  fontSize: "13px",
  color: "#888888",
  margin: 0,
};