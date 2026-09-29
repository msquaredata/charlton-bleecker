import { LegalSection } from "@/components/legal/LegalDoc";

const CONTACT = "ContactUs@CharltonBleecker.com";
const SITE = "https://www.charltonbleecker.com";

export function TermsContent() {
  return (
    <>
      <LegalSection title="1. Agreement to these Terms">
        <p>
          These Terms of Use (the &ldquo;Terms&rdquo;) govern your access to and
          use of the website operated by Charlton Bleecker Group LLC
          (&ldquo;Charlton Bleecker,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) at{" "}
          <a href={SITE}>{SITE.replace("https://", "")}</a> and any related
          pages, forms, or materials we make available through the site
          (collectively, the &ldquo;Site&rdquo;).
        </p>
        <p>
          By accessing or using the Site, you agree to these Terms and our{" "}
          <a href="/privacy">Privacy Policy</a>. If you do not agree, do not use
          the Site.
        </p>
      </LegalSection>

      <LegalSection title="2. Who we are">
        <p>
          Charlton Bleecker Group LLC is a private holding company focused on
          acquiring and growing enduring B2B businesses. The Site provides
          information about our firm, investment criteria, team, and process, and
          allows prospective sellers, advisors, and other parties to contact us
          or submit company information for evaluation.
        </p>
        <p>
          Nothing on the Site creates a client, advisory, brokerage, or fiduciary
          relationship between you and Charlton Bleecker merely because you
          visit the Site or send us information.
        </p>
      </LegalSection>

      <LegalSection title="3. Informational use only">
        <p>
          Content on the Site—including blog posts, one-pagers, criteria
          summaries, and process descriptions—is provided for general
          informational purposes. It is not investment, legal, tax, accounting,
          or other professional advice. Please also read our{" "}
          <a href="/disclaimer">Disclaimer</a>.
        </p>
      </LegalSection>

      <LegalSection title="4. Eligibility">
        <p>
          You may use the Site only if you can form a binding contract with us
          and only in compliance with these Terms and applicable law. The Site
          is not directed to children under 16, and we do not knowingly collect
          personal information from children.
        </p>
      </LegalSection>

      <LegalSection title="5. Submissions and communications">
        <p>
          If you use our contact form, company submission form, email, or other
          channels to send information (including business, financial, or
          personal information), you represent that:
        </p>
        <ul>
          <li>the information is accurate and complete to the best of your knowledge;</li>
          <li>you have authority to share it (including on behalf of a company);</li>
          <li>
            you are not violating any confidentiality, contractual, or legal
            obligation by sharing it; and
          </li>
          <li>
            you understand that submitting information does not obligate us to
            respond, pursue a transaction, or keep materials confidential unless
            we have agreed otherwise in a separate written agreement (such as an
            NDA).
          </li>
        </ul>
        <p>
          We may evaluate, store, and share submissions with our team and
          service providers as described in our{" "}
          <a href="/privacy">Privacy Policy</a>. Do not submit information through
          the Site that you are not authorized to disclose.
        </p>
      </LegalSection>

      <LegalSection title="6. Confidentiality">
        <p>
          Ordinary website browsing and unsolicited submissions are not
          automatically covered by a non-disclosure agreement. If you need
          confidentiality protections, request or execute our NDA (or another
          written agreement) before sharing sensitive materials. Once an NDA is
          in place, that agreement—not these Terms—controls confidentiality for
          covered information.
        </p>
      </LegalSection>

      <LegalSection title="7. Intellectual property">
        <p>
          The Site and its content—including text, graphics, logos, layout, and
          design—are owned by Charlton Bleecker or its licensors and are
          protected by intellectual property laws. You may view and temporarily
          download materials for your personal, non-commercial evaluation of
          Charlton Bleecker. You may not copy, modify, distribute, sell, or
          create derivative works from Site content without our prior written
          consent, except as allowed by law.
        </p>
      </LegalSection>

      <LegalSection title="8. Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>use the Site for any unlawful purpose;</li>
          <li>
            attempt to gain unauthorized access to our systems, forms, or data;
          </li>
          <li>
            interfere with the Site&apos;s operation, including through malware,
            scraping that overloads systems, or circumventing security or rate
            limits;
          </li>
          <li>
            submit false, misleading, defamatory, or infringing content; or
          </li>
          <li>
            use automated means to submit spam or abuse our contact or intake
            forms.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Third-party links and tools">
        <p>
          The Site may link to third-party websites or services (for example,
          LinkedIn, scheduling tools, or document downloads). We do not control
          and are not responsible for third-party content, policies, or
          practices. Your use of third-party services is at your own risk and
          subject to their terms.
        </p>
      </LegalSection>

      <LegalSection title="10. Disclaimers of warranties">
        <p>
          THE SITE AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND
          &ldquo;AS AVAILABLE.&rdquo; TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE
          DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
          WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF
          HARMFUL COMPONENTS.
        </p>
      </LegalSection>

      <LegalSection title="11. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHARLTON BLEECKER AND ITS
          MEMBERS, MANAGERS, OFFICERS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE
          FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR BUSINESS
          OPPORTUNITY, ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR
          RELIANCE ON ITS CONTENT, WHETHER BASED IN CONTRACT, TORT, OR ANY OTHER
          THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH
          DAMAGES.
        </p>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ANY
          CLAIM ARISING OUT OF OR RELATING TO THE SITE WILL NOT EXCEED ONE
          HUNDRED U.S. DOLLARS (US $100).
        </p>
      </LegalSection>

      <LegalSection title="12. Indemnification">
        <p>
          You agree to defend, indemnify, and hold harmless Charlton Bleecker and
          its members, managers, officers, employees, and agents from and against
          any claims, damages, losses, and expenses (including reasonable
          attorneys&apos; fees) arising out of or related to your misuse of the
          Site, your submissions, or your violation of these Terms or applicable
          law.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes to the Site or Terms">
        <p>
          We may update the Site or these Terms from time to time. The
          &ldquo;Last updated&rdquo; date at the top of this page indicates when
          these Terms were last revised. Continued use of the Site after changes
          become effective constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="14. Governing law">
        <p>
          These Terms are governed by the laws of the State of Delaware,
          excluding conflict-of-law rules. Exclusive venue for disputes arising
          out of these Terms or the Site will lie in the state or federal courts
          located in Delaware, unless applicable law requires otherwise.
        </p>
      </LegalSection>

      <LegalSection title="15. Contact">
        <p>
          Charlton Bleecker Group LLC
          <br />
          Email:{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
        </p>
      </LegalSection>
    </>
  );
}
