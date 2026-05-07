import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CONTACT = "support@pearlhealth.app";
const EFFECTIVE = "May 7, 2026";

const RefundPage = () => {
  return (
    <div className="px-5 pt-6 pb-10 max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground font-body mb-4 hover:text-foreground">
        <ChevronLeft size={16} /> Back
      </Link>
      <h1 className="text-3xl font-display font-bold mb-1">Refund Policy</h1>
      <p className="text-xs text-muted-foreground mb-6 font-body">Effective {EFFECTIVE}</p>

      <div className="space-y-5 text-sm font-body text-foreground/90 leading-relaxed">
        <section>
          <h2 className="text-lg font-display font-semibold mb-2">30-day money-back guarantee</h2>
          <p>We want you to love Pearl Femme. If you're not satisfied with your purchase, you can request a full refund within <strong>30 days</strong> of your order date — no hard questions asked.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">How to request a refund</h2>
          <p>Refunds are processed by our payment provider, Paddle, who acts as the Merchant of Record for all our orders. You can:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Visit <a className="text-primary underline" href="https://paddle.net" target="_blank" rel="noopener noreferrer">paddle.net</a> and find your order using the email address used at checkout, or</li>
            <li>Email us at <a className="text-primary underline" href={`mailto:${CONTACT}`}>{CONTACT}</a> and we'll help arrange the refund.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">After 30 days</h2>
          <p>You can cancel your subscription at any time to stop future renewals. Refunds outside the 30-day window are reviewed on a case-by-case basis.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold mb-2">Questions</h2>
          <p>See also our <Link to="/legal/terms" className="text-primary underline">Terms</Link> and <Link to="/legal/privacy" className="text-primary underline">Privacy Notice</Link>.</p>
        </section>
      </div>
    </div>
  );
};

export default RefundPage;
