import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — CodAstra Labs",
  description:
    "How CodAstraLabs collects, uses, stores, protects, shares, and deletes information through its website and services.",
};

const sections = [
  {
    heading: "1. Overview",
    body: [
      "This Privacy Policy explains how CodAstraLabs collects, uses, stores, protects, shares, and deletes information through this website and the services we provide.",
      "These services include digital marketing, creative design, web and software development, IT solutions, and professional classes and training. We also operate platforms such as BridgeLabs for education consultancies, their staff, teachers, and students.",
      "This Policy should be read together with our Terms and Conditions.",
    ],
  },
  {
    heading: "2. Who controls the data",
    body: [
      "For the data you enter or upload into our projects, platforms, or /enquiry workflows, your business or institution normally remains responsible for its records.",
      "CodAstraLabs operates as the service provider and processes information to provide hosting, authentication, storage, email, notifications, messaging, support, security, billing, and product operations.",
      "For platform administration, product security, subscription management, legal acceptance, and direct support communications, CodAstraLabs may act as an independent controller where applicable.",
    ],
  },
  {
    heading: "3. Information we collect",
    body: [
      "Enquiry and contact data: the name, email address, phone number, and message you submit through our contact forms or contact channels.",
      "Client and engagement data: company details, project briefs, content you share for delivery, and records related to the work we perform.",
      "User and account data: names, emails, phone numbers, roles, permissions, passwords in hashed form, login events, MFA or OTP events, profile details, session data, and access status where accounts are involved.",
      "Student and lead data (where platforms such as BridgeLabs are used): names, emails, phone numbers, addresses, preferred countries, education details, notes, applications, documents, meetings, messages, classes, invoices, payment receipts, and related workflow records.",
      "Uploaded files: verification documents, student documents, profile images, payment receipts, QR images, message attachments, templates, and other files users upload.",
      "Technical data: IP address, device and browser information, timestamps, page context, error logs, audit logs, security events, notification permissions, and usage activity needed to operate and protect the website.",
    ],
  },
  {
    heading: "4. How we use information",
    body: [
      "To respond to enquiries, prepare quotations, deliver services, and manage client and student relationships.",
      "To create and manage accounts, projects, classes, tasks, messages, meetings, invoices, and notifications.",
      "To verify registrations, subscription requests, payment receipts, and access to the platforms we operate.",
      "To send operational emails, setup links, password reset OTPs, MFA OTPs, service updates, reminders, meeting updates, and system alerts.",
      "To secure our website and platforms, detect abuse, investigate unauthorized access, enforce roles and permissions, keep audit trails, debug errors, and improve reliability.",
      "To comply with legal, accounting, tax, security, dispute, fraud-prevention, and administrative obligations.",
    ],
  },
  {
    heading: "5. Legal basis and consent",
    body: [
      "Our website and platforms may involve personal information protected under Nepal's Privacy Act, 2075 (2018), the Electronic Transactions Act, and other applicable laws.",
      "You are responsible for collecting any required consent before submitting personal information about third parties, such as students, staff, leads, or customers, to our website, forms, or platforms.",
      "By submitting information, you confirm you have the authority to provide it and agree to this Privacy Policy and our Terms.",
    ],
  },
  {
    heading: "6. Sharing and processors",
    body: [
      "We do not sell personal information.",
      "Information may be shared with infrastructure, hosting, storage, email, notification, analytics, security, and support providers only as needed to operate our website and services.",
      "Information may be shared with your business or institution and authorized staff according to the roles and permissions of the relevant engagement.",
      "Information may be disclosed if required by law, legal process, court order, government authority, security investigation, fraud prevention, or to protect the rights and safety of users, clients, students, CodAstraLabs, or the public.",
    ],
  },
  {
    heading: "7. Access controls and isolation",
    body: [
      "Where we operate multi-tenant platforms, users should only access records belonging to their own organization, project, or tenant.",
      "Role-based and module-based access controls limit which users can access features such as leads, students, documents, projects, classes, tasks, messages, invoices, reports, analytics, audit logs, and search.",
      "Customers using our software products use their own logins and should not access other tenants or super admin resources.",
    ],
  },
  {
    heading: "8. Data retention",
    body: [
      "Records are retained while an engagement or account is active, or as needed for service delivery, billing, support, security, legal, audit, or dispute purposes.",
      "You may request deletion of certain records in line with your agreement with us. Some minimal analytics, audit, invoice, legal, or security records may be retained where reasonably necessary, including in backups, for a limited time after deletion from active systems.",
    ],
  },
  {
    heading: "9. Security",
    body: [
      "We use authentication, role permissions, tenant checks, password hashing, httpOnly cookies, token and session controls, audit trails, rate limiting, and file validation controls to reduce risk.",
      "No online system is perfectly secure. You must protect your passwords, devices, OTPs, reset links, and staff access, and report any suspected unauthorized access.",
    ],
  },
  {
    heading: "10. Uploaded files and sensitive documents",
    body: [
      "You may upload sensitive documents such as identity documents, education files, payment receipts, or verification documents. Only upload what is necessary, accurate, authorized, and legally permitted.",
      "Where you request documents from third parties, you are responsible for explaining why they are requested, who can access them, how they are used, and when they may be deleted.",
    ],
  },
  {
    heading: "11. Emails, WhatsApp, messages, and notifications",
    body: [
      "We may generate email messages, setup links, OTPs, announcements, reminders, WhatsApp-ready messages, meeting links, and browser or mobile notifications to deliver our services.",
      "You are responsible for checking recipient details and message content before sending through external channels such as WhatsApp or email.",
      "You can control browser notification permissions through your device or browser settings.",
    ],
  },
  {
    heading: "12. Your rights and requests",
    body: [
      "Depending on applicable law, you may request access, correction, deletion, restriction, or information about how your personal data is used.",
      "Where your data sits inside a platform your organization controls, start by contacting that organization, and we will assist with reasonable data requests where technically and legally possible.",
    ],
  },
  {
    heading: "13. International processing",
    body: [
      "We may use cloud hosting, storage, email, and other providers that process information outside Nepal.",
      "By using our website or services, you acknowledge that data may be transferred, stored, or processed in locations where service providers operate, subject to reasonable security and operational safeguards.",
    ],
  },
  {
    heading: "14. Children's data",
    body: [
      "Where our work involves data about minors or dependent students, you must ensure you have the appropriate authority and consent, and follow applicable guardian and privacy requirements.",
    ],
  },
  {
    heading: "15. Changes to this Policy",
    body: [
      "We may update this Privacy Policy to reflect legal, technical, operational, or product changes.",
      "The effective date is updated for material changes. Continued use of our website or services after updates means the updated Policy applies.",
    ],
  },
  {
    heading: "16. Contact",
    body: [
      "For privacy questions or requests, contact CodAstraLabs at support.codastralabs@gmail.com or 9851405271.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate="April 30, 2026"
      relatedHref="/terms"
      relatedLabel="Terms and Conditions"
      intro="How CodAstraLabs collects, uses, stores, protects, shares, and deletes information through its website and services."
      sections={sections}
    />
  );
}