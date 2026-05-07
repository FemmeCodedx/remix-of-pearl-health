import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const SELLER = "Pearl Heal Health";
const CONTACT = "support@pearlhealth.app";
const EFFECTIVE = "May 7, 2026";

const PrivacyPage = () => {
  return (
    <div className="px-5 pt-6 pb-10 max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground font-body mb-4 hover:text-foreground">
        <ChevronLeft size={16} /> Back
      </Link>
      <h1 className="text-3xl font-display font-bold mb-1">Privacy Notice</h1>
      <p className="text-xs text-muted-foreground mb-6 font-body">Effective {EFFECTIVE}</p>

      <div className="space-y-5 text-sm font-body text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-lg font-display font-semibold mb-2">1. Who we are</h2>
          <p>{SELLER} is the controller of personal data processed through the Service. For privacy questions or to exercise your rights, contact us at <a className="text-primary underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">2. Data we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account data:</strong> name, email, password hash, language preference.</li>
            <li><strong>Health &amp; cycle data:</strong> period dates, symptoms, moods, notes, goals, and other entries you log.</li>
            <li><strong>Usage &amp; device data:</strong> pages visited, features used, device type, browser, approximate location derived from IP, and diagnostic logs.</li>
            <li><strong>Communications:</strong> messages you send to support and notification preferences.</li>
            <li><strong>Subscription data:</strong> plan, status, and billing identifiers (full payment details are handled by Paddle, not stored by us).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">3. How we use your data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide and personalize the Service (contract performance).</li>
            <li>Generate AI insights from data you choose to submit (contract performance / your consent for sensitive health data).</li>
            <li>Authenticate users and prevent fraud or abuse (legitimate interest).</li>
            <li>Improve features, fix bugs, and analyse usage in aggregate (legitimate interest).</li>
            <li>Send service and (with consent) marketing communications.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">4. Sensitive (health) data</h2>
          <p>Cycle, symptom, and mood entries are sensitive personal data. We process it on the basis of your explicit consent (given by entering it into the Service) and only to provide the features you request. You can delete entries at any time.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">5. Sharing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Hosting &amp; backend infrastructure</strong> providers that store and process data on our behalf.</li>
            <li><strong>Paddle</strong>, our Merchant of Record, for sale of subscriptions, subscription management, payment processing, tax compliance, and invoicing.</li>
            <li><strong>AI model providers</strong> for generating insights (data sent for inference is not used by them to train models).</li>
            <li><strong>Professional advisers</strong> (legal, accounting) where necessary.</li>
            <li><strong>Authorities</strong> where required by law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">6. International transfers</h2>
          <p>Some recipients may be located outside your country. Where required, transfers are protected by appropriate safeguards such as Standard Contractual Clauses or adequacy decisions.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">7. Retention</h2>
          <p>We keep account and health data for as long as your account is active. After deletion we remove or anonymise personal data within a reasonable period, except where retention is required by law (e.g. tax records).</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">8. Your rights</h2>
          <p>Subject to local law, you have the right to access, rectify, delete, restrict or object to processing, port your data, and withdraw consent. EU/UK residents may complain to a supervisory authority. We aim to respond within one month.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">9. Security</h2>
          <p>We use appropriate technical and organisational measures including TLS in transit, encryption at rest, role-based access controls, and row-level security on health data.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">10. Cookies</h2>
          <p>We use only essential cookies and local storage required to keep you signed in and remember your preferences. We do not currently use advertising or third-party tracking cookies.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">11. Changes</h2>
          <p>We may update this notice. Material changes will be communicated through the Service.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
