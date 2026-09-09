"use client";

import * as React from "react";

/**
 * Custom hook managing the state and actions of the newsletter subscription form.
 */
export function useNewsletterLogic() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      // Reset the subscription status indicator after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return {
    email,
    setEmail,
    subscribed,
    handleSubscribe,
  };
}
