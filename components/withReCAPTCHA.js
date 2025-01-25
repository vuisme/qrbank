import { GoogleReCaptchaProvider, useGoogleReCaptcha } from '@google-recaptcha/react';
import { useState, useEffect } from 'react';

const withReCAPTCHA = (WrappedComponent, action) => {
  const RecaptchaHOC = (props) => {
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const { executeRecaptcha } = useGoogleReCaptcha();

    useEffect(() => {
      const handleReCaptcha = async () => {
        if (executeRecaptcha) {
          const token = await executeRecaptcha(action); // Truyền action vào
          setRecaptchaToken(token);
        }
      };
      handleReCaptcha();
    }, [executeRecaptcha]);

    return (
      <WrappedComponent
        {...props}
        recaptchaToken={recaptchaToken}
        setRecaptchaToken={setRecaptchaToken}
      />
    );
  };

  return (props) => (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      language="vi"
    >
      <RecaptchaHOC {...props} />
    </GoogleReCaptchaProvider>
  );
};

export default withReCAPTCHA;