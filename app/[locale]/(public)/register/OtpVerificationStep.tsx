"use client";

import { FC, SyntheticEvent, useEffect, useState } from "react";
import { ArrowLeft, MailCheck, RotateCcw } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useResendOtpMutation,
  useVerifyRegistrationMutation,
} from "@/src/store/api/authApiSlice";
import { operationError, operationSuccess } from "@/src/utils/operationsToasts";

interface IOtpVerificationStep {
  email: string;
  onBack: () => void;
}

const RESEND_COOLDOWN = 60;

export const OtpVerificationStep: FC<IOtpVerificationStep> = ({
  email,
  onBack,
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);

  const [verifyRegistration, { isLoading: isVerifying }] =
    useVerifyRegistrationMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Décompte de 60 secondes (setState dans le callback d'intervalle = OK pour le linter)
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const submitOtp = async (code: string) => {
    if (code.length !== 6 || isVerifying) return;

    try {
      await verifyRegistration({ email, otp: code }).unwrap();
      operationSuccess("Compte vérifié ! Bienvenue sur BYCONTRACT.");
      router.push("/fr/dashboard"); // adapte selon ta locale / route
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Code invalide ou expiré.";
      operationError(message);
      setOtp(""); // Vide les cases pour ressaisir immédiatement
    }
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    submitOtp(otp);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      submitOtp(value);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    try {
      await resendOtp({ email }).unwrap();
      setCountdown(RESEND_COOLDOWN);
      setOtp("");
      operationSuccess("Un nouveau code vient d'être envoyé.");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Impossible de renvoyer le code pour le moment.";
      operationError(message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl   p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4">
          <MailCheck className="w-6 h-6 text-ui-brand" />
        </div>
        <h2 className="text-xl font-bold text-ui-text">Vérifiez votre email</h2>
        <p className="text-sm text-ui-textSubtle mt-1.5 leading-relaxed">
          Nous avons envoyé un code à 6 chiffres à{" "}
          <span className="font-semibold text-ui-text">{email}</span>.
        </p>
      </div>

      {/* Formulaire OTP */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={handleOtpChange}
            disabled={isVerifying}
            autoFocus
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="input-form w-11 h-12 text-lg font-bold rounded-xl border border-slate-200 bg-slate-50/50 focus-visible:ring-transparent"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="submit"
          disabled={otp.length !== 6 || isVerifying}
          className="w-full primary-button h-11 text-sm font-bold flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <Spinner className="size-4 text-white" />
              Vérification...
            </>
          ) : (
            "Valider mon compte"
          )}
        </Button>
      </form>

      {/* Renvoi + Retour */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-3">
        <div className="text-xs text-ui-textSubtle flex items-center gap-1.5">
          <span>Vous n&apos;avez pas reçu le code ?</span>
          {countdown > 0 ? (
            <span className="font-semibold text-ui-textSubtle tabular-nums">
              Renvoyer dans {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-ui-brand hover:text-ui-brandHover inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isResending ? (
                <Spinner className="size-3" />
              ) : (
                <RotateCcw className="w-3 h-3" />
              )}
              Renvoyer le code
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onBack}
          disabled={isVerifying}
          className="text-xs font-medium text-ui-textSubtle hover:text-ui-text inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Modifier l&apos;adresse email
        </button>
      </div>
    </div>
  );
};
