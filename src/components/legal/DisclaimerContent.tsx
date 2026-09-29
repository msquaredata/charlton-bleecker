import { LegalSection } from "@/components/legal/LegalDoc";

const CONTACT = "ContactUs@CharltonBleecker.com";

export function DisclaimerContent() {
  return (
    <>
      <LegalSection title="1. Purpose of this Disclaimer">
        <p>
          This Disclaimer applies to the website of Charlton Bleecker Group LLC
          (&ldquo;Charlton Bleecker,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;), including informational pages, blog posts,
          one-pagers, criteria summaries, and related materials
          (collectively, the &ldquo;Materials&rdquo;).
        </p>
        <p>
          Please also review our <a href="/terms">Terms of Use</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </LegalSection>

      <LegalSection title="2. No offer or solicitation">
        <p>
          The Materials are for informational purposes only. They do not
          constitute an offer to sell, a solicitation of an offer to buy, or a
          recommendation of any security, investment product, or advisory
          service. Any future transaction would be made only pursuant to
          definitive agreements and, where applicable, offering or other legal
          documents.
        </p>
      </LegalSection>

      <LegalSection title="3. Not investment, legal, or tax advice">
        <p>
          Nothing in the Materials is intended as investment, legal, tax,
          accounting, or other professional advice. You should consult your own
          advisors regarding any business, investment, or legal decision.
          Charlton Bleecker is not acting as your broker, dealer, investment
          adviser, or fiduciary solely by virtue of your use of the Site or
          review of the Materials.
        </p>
      </LegalSection>

      <LegalSection title="4. Forward-looking statements">
        <p>
          The Materials may include statements about strategies, criteria,
          markets, or expected outcomes that are forward-looking. Actual results
          may differ materially. Past performance of any person, company, or
          strategy referenced is not indicative of future results. We undertake
          no obligation to update forward-looking statements except as required
          by law.
        </p>
      </LegalSection>

      <LegalSection title="5. No guarantee of transaction">
        <p>
          Submitting a company or contacting us does not create any obligation
          for Charlton Bleecker to evaluate, pursue, negotiate, or complete a
          transaction. We may decline opportunities for any reason or no reason.
          Indicative criteria on the Site are guidelines only and may change.
        </p>
      </LegalSection>

      <LegalSection title="6. Accuracy and completeness">
        <p>
          We strive to keep Materials accurate, but we do not warrant that
          content is complete, current, or error-free. Market conditions,
          regulations, and our focus areas may change without notice. Figures,
          ranges, and examples are illustrative unless expressly stated
          otherwise.
        </p>
      </LegalSection>

      <LegalSection title="7. Third-party information">
        <p>
          Materials may reference third-party data, news, or companies. We do not
          independently verify all third-party information and are not
          responsible for its accuracy. Mentions of other companies do not imply
          endorsement or affiliation unless explicitly stated.
        </p>
      </LegalSection>

      <LegalSection title="8. Confidentiality and non-public information">
        <p>
          Do not rely on the Site as a secure channel for highly sensitive
          information unless we have directed you to do so under an NDA or other
          written agreement. Unsolicited submissions are handled as described in
          our Terms and Privacy Policy and may not receive confidentiality
          treatment until a separate agreement is executed.
        </p>
      </LegalSection>

      <LegalSection title="9. Geographic and regulatory notices">
        <p>
          The Site is intended primarily for audiences in the United States.
          Access from jurisdictions where distribution of such Materials is
          restricted is not authorized. Users are responsible for compliance with
          local laws.
        </p>
      </LegalSection>

      <LegalSection title="10. Limitation">
        <p>
          To the maximum extent permitted by law, Charlton Bleecker disclaims
          liability for decisions made or actions taken in reliance on the
          Materials. Use of the Site and Materials is at your own risk.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
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
