import { useState } from "react";
import Button from "@/components/ui/Button";

import type { IconName } from "@/components/common/Icon";
import { supabase } from "@/lib/supabase";

/*
  Social authentication buttons

  This component simulates OAuth login behaviour.
  We show a loading state, trigger snackbars, and return success callback.
*/

type SocialProviderId = "google" | "github" | "azure";

interface SocialProvider {
  id: SocialProviderId;
  name: string;
  icon: IconName;
}

const socialProviders: SocialProvider[] = [
  {
    id: "google",
    name: "Google",
    icon: "Chrome",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "Github",
  },
  {
    id: "azure",
    name: "Microsoft",
    icon: "Box",
  },
];

const SocialAuthButtons = () => {
  const [loadingProvider, setLoadingProvider] =
    useState<SocialProviderId | null>(null);

  /* Handles OAuth simulation */
  const handleSocialAuth = async (provider: SocialProviderId) => {
    setLoadingProvider(provider);

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + "/user-authentication",
      },
    });
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>

        <div className="relative flex justify-center text-xs md:text-sm">
          <span className="px-2 md:px-3 bg-card text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Provider Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
        {socialProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            onClick={() => handleSocialAuth(provider.id)}
            loading={loadingProvider === provider.id}
            disabled={loadingProvider !== null}
            iconName={provider.icon}
            iconPosition="left"
            className="w-full"
          >
            {provider.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialAuthButtons;
