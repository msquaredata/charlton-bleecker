import { LegalSection } from "@/components/legal/LegalDoc";

const CONTACT = "ContactUs@CharltonBleecker.com";

export function PrivacyContent() {
  return (
    <>
      <LegalSection title="1. Overview">
        <p>
          Charlton Bleecker Group LLC (&ldquo;Charlton Bleecker,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your
          privacy. This Privacy Policy explains how we collect, use, disclose,
          and protect information in connection with{" "}
          <a href="https://www.charltonbleecker.com">
            www.charltonbleecker.com
          </a>{" "}
          and related online forms and communications (the &ldquo;Site&rdquo;).
        </p>
        <p>
          By using the Site or submitting information to us, you acknowledge this
          Policy. For terms governing Site use, see our{" "}
          <a href="/terms">Terms of Use</a>. Investment-related notices appear in
          our <a href="/disclaimer">Disclaimer</a>.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>
          <strong>Information you provide.</strong> When you contact us or submit
          a company through our forms, we may collect:
        </p>
        <ul>
          <li>
            Contact details (name, email address, phone number, role/title);
          </li>
          <li>
            Company and representation details (business name, website,
            industry, headquarters city/state, ownership, year founded);
          </li>
          <li>
            Transaction and business profile information (transition goals and
            timing, revenue ranges, EBITDA margins, leverage, key assets,
            challenges, notable customers, and related narrative fields); and
          </li>
          <li>
            Any other information you choose to include in free-text fields or
            email.
          </li>
        </ul>
        <p>
          <strong>Information collected automatically.</strong> Like most
          websites, we and our providers may collect technical data such as IP
          address, browser type, device information, approximate location derived
          from IP, pages viewed, referring URLs, and timestamps. We may use this
          for security, rate limiting, diagnostics, and improving the Site.
        </p>
        <p>
          <strong>Cookies and similar technologies.</strong> The Site and
          embedded tools (for example, security widgets) may use cookies or local
          storage as needed to operate forms, prevent abuse, and remember
          preferences. You can control cookies through your browser settings;
          disabling some cookies may affect Site functionality.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use information">
        <p>We use information to:</p>
        <ul>
          <li>respond to inquiries and evaluate potential investment or partnership opportunities;</li>
          <li>operate, secure, and improve the Site and our intake processes;</li>
          <li>prevent spam, fraud, and abuse (including bot detection and rate limiting);</li>
          <li>send transactional messages related to your submission (for example, a confirmation email);</li>
          <li>comply with legal obligations and enforce our Terms; and</li>
          <li>
            communicate with you about Charlton Bleecker when you have requested
            contact or where permitted by law.
          </li>
        </ul>
        <p>
          We do not sell your personal information. We do not use Site form
          submissions for third-party advertising.
        </p>
      </LegalSection>

      <LegalSection title="4. How we share information">
        <p>We may share information with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> that help us operate the Site and
            process submissions, which may include hosting providers, customer
            relationship management (CRM) platforms (such as HubSpot), email
            delivery services, security/bot-protection providers, and analytics
            or infrastructure vendors under appropriate contractual safeguards;
          </li>
          <li>
            <strong>Professional advisors</strong> (legal, accounting, or other
            advisors) as needed for a potential transaction or our operations;
          </li>
          <li>
            <strong>Affiliates and deal team members</strong> involved in
            evaluating opportunities; and
          </li>
          <li>
            <strong>Authorities or other parties</strong> when required by law,
            legal process, or to protect rights, safety, or security.
          </li>
        </ul>
        <p>
          If we are involved in a reorganization, financing, or sale of assets,
          information may be transferred as part of that transaction, subject to
          customary confidentiality protections.
        </p>
      </LegalSection>

      <LegalSection title="5. Retention">
        <p>
          We retain personal and business information for as long as needed to
          fulfill the purposes described in this Policy, including evaluating
          opportunities, maintaining business records, resolving disputes, and
          meeting legal, tax, or accounting requirements. Retention periods vary
          depending on the nature of the information and our relationship with
          you.
        </p>
      </LegalSection>

      <LegalSection title="6. Security">
        <p>
          We use administrative, technical, and organizational measures designed
          to protect information we maintain. No method of transmission or
          storage is completely secure; we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="7. Your choices and rights">
        <p>
          Depending on where you live, you may have rights to access, correct,
          update, or delete certain personal information, or to object to or
          restrict certain processing. To make a request, email{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. We may need to verify your
          identity before fulfilling a request.
        </p>
        <p>
          You may unsubscribe from optional marketing emails using the
          instructions in those messages. Transactional messages related to a
          submission may still be sent when appropriate.
        </p>
      </LegalSection>

      <LegalSection title="8. International visitors">
        <p>
          The Site is operated from the United States. If you access the Site
          from outside the U.S., you understand that your information may be
          processed in the United States and other countries that may have
          different data-protection rules than your jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          The Site is not intended for children under 16. We do not knowingly
          collect personal information from children. If you believe a child has
          provided information to us, contact us and we will take appropriate
          steps to delete it.
        </p>
      </LegalSection>

      <LegalSection title="10. Third-party sites">
        <p>
          The Site may link to third-party websites or services. Their privacy
          practices are governed by their own policies. We encourage you to
          review those policies before providing personal information.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to this Policy">
        <p>
          We may update this Privacy Policy from time to time. The
          &ldquo;Last updated&rdquo; date reflects the latest revision.
          Material changes will apply going forward; continued use of the Site
          after an update constitutes acceptance of the revised Policy where
          permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          For privacy questions or requests:
          <br />
          Charlton Bleecker Group LLC
          <br />
          Email:{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
        </p>
      </LegalSection>
    </>
  );
}
