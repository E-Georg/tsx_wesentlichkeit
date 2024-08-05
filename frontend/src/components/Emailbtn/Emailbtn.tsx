import React from 'react';

interface EmailButtonProps {
  email: string;
  subject: string;
  body: string;
}

const EmailButton: React.FC<EmailButtonProps> = ({ email, subject, body }) => {
  const handleClick = () => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <button onClick={handleClick}>
      E-Mail senden
    </button>
  );
};

export default EmailButton;
