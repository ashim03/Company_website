import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions — CodAstra Labs",
  description:
    "Terms and Conditions governing use of the CodAstraLabs website, its services, and communications.",
};

const sections = [
  {
    heading: "1. Agreement to these Terms",
    body: [
      "These Terms and Conditions govern your access to and use of the CodAstraLabs website, the services we offer (digital marketing, creative design, web and software development, IT solutions, and professional classes and training), and any enquiry, consultation, or engagement you make through this website.",
      "By browsing this website, submitting an enquiry form, contacting us, enrolling in a class, or engaging us for services, you agree to these Terms on behalf of yourself and the organization you represent.",
      "If you do not agree to these Terms, you must not use this website or our services.",
    ],
  },
  {
    heading: "2. Services and scope",
    body: [
      "CodAstra Labs provides digital solutions including websites, web apps, mobile apps, custom software, SaaS, and automation; digital marketing and social media management; graphic design and creative services; IT and digital solutions; and professional classes and practical training.",
      "Service-specific details, deliverables, timelines, and fees are agreed in writing on a per-engagement basis. Nothing on this website constitutes a binding offer unless confirmed in a signed statement of work or written quotation.",
      "We do not guarantee specific outcomes such as ranking positions, user counts, sales, admissions, or visa results. Marketing and training results depend on factors outside our control.",
    ],
  },
  {
    heading: "3. Eligibility and authority",
    body: [
      "You must be at least 18 years old or have the legal authority to use this website and our services on behalf of your organization.",
      "By placing an enquiry or entering an agreement, you confirm you are authorised to represent the business or institution you name.",
    ],
  },
  {
    heading: "4. Enquiries and communications",
    body: [
      "When you submit a contact or enquiry form, we collect the details you provide so our team can respond. Submitting an enquiry does not create a contract or obligation on either side.",
      "You must provide accurate and current contact information. We may use the contact details you supply to respond to your enquiry and, with your consent, to share relevant updates about our services.",
      "Where you contact us by phone or WhatsApp, standard messaging rates may apply and are your responsibility.",
    ],
  },
  {
    heading: "5. Quotes, agreements, and payment",
    body: [
      "Any estimate, quotation, or proposal we share is an invitation to discuss work, not a binding agreement. Work begins only after both parties accept a written statement of work.",
      "Payment terms, milestone schedules, revisions, and acceptance criteria are described in each written agreement and may be revised only with the written consent of both parties.",
      "Fees, taxes, and statutory obligations must be validated with qualified professionals where they apply to your business or project.",
    ],
  },
  {
    heading: "6. Intellectual property",
    body: [
      "Unless a written agreement states otherwise, CodAstraLabs retains ownership of the code, designs, methodologies, frameworks, templates, and internal tooling we use to deliver services.",
      "Upon final payment, you receive the rights set out in your written agreement for the custom deliverables commissioned for you. Third-party tools, libraries, and licensed content remain subject to their own licences.",
      "You may not resell, redistribute, or reverse-engineer our work beyond what your written agreement permits.",
    ],
  },
  {
    heading: "7. Your responsibilities",
    body: [
      "You agree to provide accurate information, respond promptly to questions, and supply approved content, feedback, and materials needed to complete the work.",
      "You are responsible for protecting your accounts, passwords, and data, and for ensuring you have the right to provide any content, images, or customer data you share with us.",
      "Delays in approvals, content, or payments may change agreed timelines; we will communicate any impact on delivery.",
    ],
  },
  {
    heading: "8. Acceptable use",
    body: [
      "You must not use this website, our forms, or our services for unlawful activity, fraud, harassment, spam, phishing, credential sharing, malware distribution, or attempts to compromise our systems.",
      "You must not overload, probe, scan, attack, disrupt, or abuse the website, its APIs, or its underlying infrastructure.",
    ],
  },
  {
    heading: "9. Third-party services",
    body: [
      "We may use third-party infrastructure and tools such as hosting, email, storage, analytics, payment, and communication providers to run this website and deliver services.",
      "These providers have their own terms and privacy practices. We are not responsible for the availability or behaviour of third-party services outside our control.",
    ],
  },
  {
    heading: "10. Availability and changes",
    body: [
      "This website and our services are provided on an operational best-effort basis. Temporary interruptions may occur due to maintenance, deployments, hosting issues, internet outages, third-party outages, or security events.",
      "We may add, remove, suspend, or redesign features or pages on this website as needed for security, compliance, performance, or product direction.",
    ],
  },
  {
    heading: "11. Disclaimers",
    body: [
      "This website and its content are provided without warranties of uninterrupted availability, error-free behaviour, or fitness for a particular purpose, to the maximum extent permitted by applicable law.",
      "Where we mention tools, classes, or platforms, we aim to keep information current, but we do not warrant that every detail is verified before you act on it.",
    ],
  },
  {
    heading: "12. Limitation of liability",
    body: [
      "To the maximum extent permitted by applicable law, CodAstraLabs will not be liable for indirect, incidental, special, consequential, punitive, or business-loss damages, including lost profits, lost opportunities, or reputational harm arising from your use of this website or our services.",
      "Except where applicable law requires otherwise, our aggregate liability for claims related to any engagement is limited to the amount you paid for the affected engagement.",
    ],
  },
  {
    heading: "13. Governing law and disputes",
    body: [
      "These Terms are intended to be governed by the laws applicable in Nepal, unless a mandatory law requires a different approach.",
      "The parties should first attempt to resolve disputes through good-faith communication. If unresolved, disputes may be handled through competent courts or authorities in Nepal, subject to applicable law.",
    ],
  },
  {
    heading: "14. Updates to these Terms",
    body: [
      "We may update these Terms from time to time. The effective date is updated whenever material changes are made.",
      "Continued use of this website or our services after updated Terms are published means you accept the updated Terms.",
    ],
  },
  {
    heading: "15. Contact",
    body: [
      "For questions about these Terms, contact CodAstraLabs at support.codastralabs@gmail.com or 9851405271.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and Conditions"
      effectiveDate="April 30, 2026"
      relatedHref="/privacy"
      relatedLabel="Privacy Policy"
      intro="Terms and Conditions governing access to the CodAstraLabs website, our services, and communications."
      sections={sections}
    />
  );
}