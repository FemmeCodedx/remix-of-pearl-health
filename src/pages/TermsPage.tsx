import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const SELLER = "Pearl Health";
const CONTACT = "support@pearlhealth.app";
const EFFECTIVE = "May 7, 2026";

const TermsPage = () => {
  return (
    <div className="px-5 pt-6 pb-10 max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground font-body mb-4 hover:text-foreground">
        <ChevronLeft size={16} /> Back
      </Link>
      <h1 className="text-3xl font-display font-bold mb-1">Terms & Conditions</h1>
      <p className="text-xs text-muted-foreground mb-6 font-body">Effective {EFFECTIVE}</p>

      <div className="space-y-5 text-sm font-body text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-lg font-display font-semibold mb-2">1. Who we are</h2>
          <p>These Terms govern your use of {SELLER} (the "Service"), a cycle tracking, education, and AI wellness insights application. By creating an account or otherwise using the Service you agree to these Terms. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">2. The Service</h2>
          <p>{SELLER} provides menstrual cycle tracking, hormone education content, lifestyle and nutrition guidance, AI-generated wellness insights (Ruby tier), and community features. Features available depend on your subscription plan.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">3. Eligibility & account</h2>
          <p>You must be of legal age in your jurisdiction (or have parental consent) to use the Service. You are responsible for keeping your login credentials confidential and for all activity under your account. You agree to provide accurate information and keep it up to date.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">4. Acceptable use</h2>
          <p>You must not misuse the Service. You agree not to: (a) use it for any unlawful purpose, fraud, or spam; (b) infringe any intellectual property or privacy rights; (c) attempt to interfere with the Service's security, including by introducing malware, probing, scanning, or scraping; (d) reverse engineer, resell, or redistribute any part of the Service; or (e) circumvent technical limits or access controls.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">5. Intellectual property</h2>
          <p>{SELLER} and its licensors retain all rights, title, and interest in the Service, including all software, content, branding, and documentation. We grant you a limited, non-exclusive, non-transferable right to use the Service in accordance with your plan and these Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">6. AI features &amp; medical disclaimer</h2>
          <p>The Service may include AI-generated content, including symptom and cycle insights. AI outputs may be inaccurate, incomplete, or out of date. Outputs are provided for general wellness and educational purposes only and are <strong>not medical advice, diagnosis, or treatment</strong>. Always consult a qualified healthcare professional before making decisions about your health.</p>
          <p className="mt-2">You are responsible for the prompts and information you submit, for verifying the accuracy of outputs, and for ensuring you have the rights to any content you input. You must not use AI features to generate illegal content, harassment, deepfakes, malware, or to attempt to jailbreak the system. We may filter, refuse, or remove outputs and may suspend accounts that misuse AI features.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">7. Service availability</h2>
          <p>We work hard to keep the Service running, but we do not guarantee that it will be uninterrupted, secure, or error-free. To the fullest extent permitted by law we disclaim all implied warranties, including merchantability and fitness for a particular purpose.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">8. Payment, subscriptions &amp; refunds</h2>
          <p>Paid plans are billed on a recurring basis until cancelled. Payment, billing, tax, cancellation and refund mechanics are handled by our reseller — see Paddle's Buyer Terms at <a className="text-primary underline" href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer">paddle.com/legal/checkout-buyer-terms</a> and our <Link to="/legal/refund" className="text-primary underline">Refund Policy</Link>.</p>
          <p className="mt-2"><strong>Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.</strong></p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">9. Suspension &amp; termination</h2>
          <p>We may suspend or terminate your access for material breach of these Terms, non-payment, security or fraud risk, or repeated or serious policy violations. You may cancel your account at any time. On termination your right to use the Service ends; we may delete your data after a reasonable retention period.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">10. Liability</h2>
          <p>To the fullest extent permitted by law, our aggregate liability arising out of or relating to the Service is capped at the fees you paid us in the 12 months preceding the claim. We are not liable for indirect, consequential, or special damages, including loss of profits, data, or goodwill. Nothing in these Terms excludes liability for fraud, death, or personal injury where it cannot be excluded by law.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">11. Governing law</h2>
          <p>These Terms are governed by the laws of the seller's jurisdiction. Disputes will be resolved by the competent courts of that jurisdiction, unless mandatory consumer law provides otherwise.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">12. Changes</h2>
          <p>We may update these Terms from time to time. Material changes will be communicated through the Service. Continued use after changes take effect means you accept the updated Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">13. Contact</h2>
          <p>Questions about these Terms? Email <a className="text-primary underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
