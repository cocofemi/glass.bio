import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Link,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface ProfessionalBookingProps {
  summary?: string;
  booking?: {
    name: string;
    email: string;
    phone: string;
    event: string;
    date: string;
    location: string;
    budget: string;
    notes: string;
  };
}

export const ProfessionalBookingEmail = ({
  summary = "We are looking for a jazz quartet for our annual gala dinner.",
  booking = {
    name: "James Wilson",
    email: "j.wilson@corporate-events.com",
    phone: "+1 (555) 123-4567",
    event: "Annual Corporate Gala",
    date: "December 15, 2024",
    location: "Grand Hyatt, San Francisco",
    budget: "$5,000 - $7,000",
    notes:
      "Black tie event. Setup needs to be completed by 4 PM. Performance starts at 7 PM.",
  },
}: ProfessionalBookingProps) => {
  const previewText = `New Enquiry: ${booking.event} - ${booking.date}`;

  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#0f172a", // Slate 900
              brandAccent: "#2563eb", // Blue 600
              textMain: "#334155", // Slate 700
              textMuted: "#64748b", // Slate 500
              border: "#e2e8f0", // Slate 200
            },
          },
        },
      }}
    >
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Container className="my-[40px] mx-auto p-0 max-w-[600px] w-full">
            {/* Top Branding / Status Bar */}
            <Section className="bg-white rounded-t-lg border-b border-solid border-border p-6">
              <Row>
                <Column>
                  <Text className="m-0 text-brand font-bold text-lg tracking-tight">
                    BOOKINGS<span className="text-brandAccent">.</span>
                  </Text>
                </Column>
                <Column align="right">
                  <span className="bg-blue-50 text-brandAccent text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wide">
                    New Enquiry
                  </span>
                </Column>
              </Row>
            </Section>

            {/* Main Content Area */}
            <Section className="bg-white p-8 border-x border-solid border-border">
              <Heading className="text-2xl font-bold text-brand m-0 mb-2">
                {booking.event}
              </Heading>
              <Text className="text-textMuted text-sm m-0 mb-6">
                Request ID: #BK-{Math.floor(Math.random() * 10000)} •{" "}
                {booking.date}
              </Text>

              {/* Summary Box */}
              <Section className="bg-gray-50 rounded-lg p-5 border border-solid border-border mb-8">
                <Text className="text-xs font-bold text-textMuted uppercase tracking-wider mb-2">
                  Enquiry Summary
                </Text>
                <Text className="text-textMain text-sm leading-relaxed m-0">
                  {summary}
                </Text>
              </Section>

              <Hr className="border-border my-6" />

              {/* Details Grid */}
              <Section>
                <Row className="mb-4">
                  <Column className="w-[140px] align-top">
                    <Text className="text-textMuted text-xs font-bold uppercase m-0">
                      Client
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-brand text-sm font-semibold m-0">
                      {booking.name}
                    </Text>
                    <Link
                      href={`mailto:${booking.email}`}
                      className="text-brandAccent text-sm underline block mt-1"
                    >
                      {booking.email}
                    </Link>
                  </Column>
                </Row>

                <Row className="mb-4">
                  <Column className="w-[140px] align-top">
                    <Text className="text-textMuted text-xs font-bold uppercase m-0">
                      Phone
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-textMain text-sm m-0">
                      {booking.phone}
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-4">
                  <Column className="w-[140px] align-top">
                    <Text className="text-textMuted text-xs font-bold uppercase m-0">
                      Location
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-textMain text-sm m-0">
                      {booking.location}
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-4">
                  <Column className="w-[140px] align-top">
                    <Text className="text-textMuted text-xs font-bold uppercase m-0">
                      Budget
                    </Text>
                  </Column>
                  <Column>
                    <span className="bg-green-50 text-green-700 text-sm font-semibold px-2 py-1 rounded border border-green-100">
                      {booking.budget}
                    </span>
                  </Column>
                </Row>

                <Row className="mb-2">
                  <Column className="w-[140px] align-top">
                    <Text className="text-textMuted text-xs font-bold uppercase m-0">
                      Notes
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-textMain text-sm italic m-0">
                      "{booking.notes}"
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Action Area */}
            <Section className="bg-gray-50 rounded-b-lg border-t border-x border-b border-solid border-border p-6 text-center">
              <Row>
                <Column align="center">
                  <Button
                    className="bg-white text-brand border border-solid border-border text-sm font-semibold px-6 py-3 rounded-lg mr-3 hover:bg-gray-100"
                    href={`mailto:${booking.email}`}
                  >
                    View Details
                  </Button>
                  <Button
                    className="bg-brandAccent text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-blue-700"
                    href={`mailto:${booking.email}?subject=Re: ${booking.event}`}
                  >
                    Reply to Client
                  </Button>
                </Column>
              </Row>
              <Text className="text-textMuted text-xs mt-6 mb-0">
                You have 24 hours to respond to this priority request.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center">
              <Text className="text-gray-400 text-xs m-0">
                © 2024 YourCompany Inc. All rights reserved.
              </Text>
              <Text className="text-gray-400 text-xs m-0 mt-2">
                123 Business Ave, Suite 100, New York, NY 10012
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default ProfessionalBookingEmail;
