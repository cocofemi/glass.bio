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
  Row,
  Column,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface BookingRequestProps {
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

export const GlassBookingEmail = ({
  summary = "Client wants a minimal techno set for a gallery opening.",
  booking = {
    name: "Sarah Jenkins",
    email: "sarah.j@gallery.com",
    phone: "+1 555 019 2834",
    event: "Art Gallery Opening",
    date: "November 12, 2024",
    location: "SoHo, New York",
    budget: "$4,500",
    notes:
      "Venue has a glass ceiling, sound acoustics are bright. Needs minimal setup.",
  },
}: BookingRequestProps) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              bgDark: "#050505",
              glassCard: "rgba(30, 30, 30, 0.4)",
              glassBorder: "rgba(255, 255, 255, 0.15)",
              textMuted: "#888888",
            },
            fontFamily: {
              sans: [
                '"SF Pro Display"',
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Roboto",
                "sans-serif",
              ],
            },
          },
        },
      }}
    >
      <Html>
        <Head />
        <Preview>New Booking: {booking.event}</Preview>
        <Body style={{ backgroundColor: "#050505", margin: 0 }}>
          <Container className="my-[40px] mx-auto p-0 max-w-[600px] font-sans text-white">
            {/* THE GLASS WINDOW CARD */}
            <Section className="bg-glassCard border border-solid border-glassBorder rounded-[24px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {/* 1. Window Bar */}
              <Section className="bg-[rgba(255,255,255,0.03)] border-b border-solid border-glassBorder p-4">
                <Row>
                  <Column align="center">
                    <Text className="m-0 text-textMuted text-[10px] tracking-[2px] uppercase font-medium">
                      request.pdf
                    </Text>
                  </Column>
                  <Column className="w-[80px]">{/* Empty spacer */}</Column>
                </Row>
              </Section>

              {/* 2. Main Content */}
              <Section className="p-8 md:p-10">
                {/* Header */}
                <Section className="mb-10">
                  <Text className="text-textMuted text-lg font-normal m-0 mb-1">
                    New Request
                  </Text>
                  <Heading className="text-[42px] leading-[1.1] font-bold m-0 text-white">
                    {booking.event}
                  </Heading>
                  <Text className="text-[42px] leading-[1.1] font-thin m-0 text-[#444444]">
                    booking request.
                  </Text>
                </Section>

                {/* Summary Box */}
                <Section className="bg-[rgba(0,0,0,0.3)] rounded-xl border border-dashed border-[#333] p-5 mb-8">
                  <Text className="text-gray-400 font-mono text-xs m-0 mb-2">
                    // Summary
                  </Text>
                  <Text className="text-gray-200 text-sm leading-relaxed m-0 font-light">
                    "{summary}"
                  </Text>
                </Section>

                {/* Data Rows */}
                <Section>
                  <Row className="border-b border-solid border-[#222] pb-3 mb-3">
                    <Column className="w-1/3">
                      <Text className="text-textMuted text-xs uppercase tracking-wider font-bold m-0">
                        Client
                      </Text>
                    </Column>
                    <Column>
                      <Text className="text-white text-sm m-0 font-medium">
                        {booking.name}
                      </Text>
                    </Column>
                  </Row>

                  <Row className="border-b border-solid border-[#222] pb-3 mb-3">
                    <Column className="w-1/3">
                      <Text className="text-textMuted text-xs uppercase tracking-wider font-bold m-0">
                        Contact
                      </Text>
                    </Column>
                    <Column>
                      <Text className="text-white text-sm m-0">
                        {booking.email}
                      </Text>
                      <Text className="text-gray-500 text-xs m-0 mt-1">
                        {booking.phone}
                      </Text>
                    </Column>
                  </Row>

                  <Row className="border-b border-solid border-[#222] pb-3 mb-3">
                    <Column className="w-1/3">
                      <Text className="text-textMuted text-xs uppercase tracking-wider font-bold m-0">
                        Date
                      </Text>
                    </Column>
                    <Column>
                      <Text className="text-white text-sm m-0">
                        {booking.date}
                      </Text>
                      <Text className="text-gray-500 text-xs m-0 mt-1">
                        {booking.location}
                      </Text>
                    </Column>
                  </Row>

                  <Row className="pb-3 mb-3">
                    <Column className="w-1/3">
                      <Text className="text-textMuted text-xs uppercase tracking-wider font-bold m-0">
                        Budget
                      </Text>
                    </Column>
                    <Column>
                      <Text className="text-white text-lg m-0 font-light">
                        {booking.budget}
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center">
              <Text className="text-[#333] text-[10px] uppercase tracking-[4px]">
                Glass Morphism UI
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default GlassBookingEmail;
