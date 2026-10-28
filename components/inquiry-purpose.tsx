import { purposeOptions } from "@/lib/tracking-config";
import "./inquiry-purpose.css";

/** The general and legacy forms also accept video-service inquiries. */
export function InquiryPurpose() {
  return (
    <fieldset
      className="inquiry-purpose"
      role="radiogroup"
      aria-required="true"
    >
      <legend>
        사용 목적 <span aria-hidden="true">*</span>
      </legend>
      <div>
        {purposeOptions.map(([value, label]) => (
          <label key={value}>
            <input type="radio" name="purpose" value={value} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
