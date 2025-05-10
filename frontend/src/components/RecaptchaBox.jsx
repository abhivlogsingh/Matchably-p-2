import React, { useRef, forwardRef, useImperativeHandle } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RecaptchaBox = forwardRef(({ onTokenChange }, ref) => {
  const recaptchaRef = useRef();

  useImperativeHandle(ref, () => ({
    resetCaptcha: () => recaptchaRef.current?.reset(),
  }));

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      onChange={(token) => onTokenChange(token)}
    />
  );
});

export default RecaptchaBox;
