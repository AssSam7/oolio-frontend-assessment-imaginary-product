import { useState } from "react";
import Button from "@/components/ui/Button";
import { useSnackbarStore } from "@/domain/ui/store/snackbar.store";
import type { IconName } from "@/components/common/Icon";

/*
  Social authentication buttons

  This component simulates OAuth login behaviour.
  We show a loading state, trigger snackbars, and return success callback.
*/

interface Props {
  onSocialAuth: (provider: SocialProviderId) => void;
}

type SocialProviderId = "google" | "github" | "microsoft";

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
    id: "microsoft",
    name: "Microsoft",
    icon: "Box",
  },
];

const SocialAuthButtons = ({ onSocialAuth }: Props) => {
  const [loadingProvider, setLoadingProvider] =
    useState<SocialProviderId | null>(null);

  const showSnackbar = useSnackbarStore((s) => s.show);

  /* Handles OAuth simulation */
  const handleSocialAuth = async (provider: SocialProviderId) => {
    setLoadingProvider(provider);

    showSnackbar({
      message: `Redirecting to ${provider} authentication...`,
      variant: "info",
    });

    try {
      // Simulate provider redirect delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Random failure simulation (assessment requirement)
      const isFailure = Math.random() > 0.75;

      if (isFailure) {
        throw new Error("OAuth provider rejected authentication");
      }

      showSnackbar({
        message: `${provider} ogin was successful`,
        variant: "success",
      });

      onSocialAuth(provider);
    } catch {
      showSnackbar({
        message: `Failed to authenticate using ${provider}`,
        variant: "error",
      });
    } finally {
      setLoadingProvider(null);
    }
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
