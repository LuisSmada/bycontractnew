import { PasswordInput } from "@/components/custom/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useChangePasswordMutation } from "@/src/store/api/usersApiSlice";
import { operationSuccess } from "@/src/utils/operationsToasts";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface IChangePasswordDialog {
  isPasswordModalOpen: boolean;
  setIsPasswordModalOpen: (v: boolean) => void;
}

const passwordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Veuillez saisir votre ancien mot de passe."),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les nouveaux mots de passe ne se correspondent pas.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const ChangePasswordDialog: FC<IChangePasswordDialog> = ({
  isPasswordModalOpen,
  setIsPasswordModalOpen,
}) => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    reset: resetPwd,
    formState: { errors: pwdErrors, isSubmitting: isChangingPassword },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitPassword = async (data: PasswordFormValues) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();
      operationSuccess("Votre mot de passe a été modifié avec succès.");
      resetPwd();
      setIsPasswordModalOpen(false);
    } catch (error) {
      responseErrorApi(error);
    }
  };

  const isProcessing = isChangingPassword || isLoading;

  const getErrorClass = (hasError: boolean) =>
    hasError ? "border-red-500 focus-visible:ring-red-500" : "";

  return (
    <Dialog
      open={isPasswordModalOpen}
      onOpenChange={(open) => {
        setIsPasswordModalOpen(open);
        if (!open) {
          resetPwd(); // On nettoie si l'utilisateur clique en dehors
        }
      }}
    >
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Changer le mot de passe</DialogTitle>
          <DialogDescription>
            Veuillez saisir votre ancien mot de passe, puis définir le nouveau.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmitPwd(onSubmitPassword)}
          id="password-form"
          className="space-y-4 py-4"
        >
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="oldPassword">Ancien mot de passe</Label>
            </div>
            <PasswordInput
              id="oldPassword"
              disabled={isProcessing}
              className={cn(
                "input-form",
                getErrorClass(!!pwdErrors.oldPassword),
              )}
              {...registerPwd("oldPassword")}
            />
            {pwdErrors.oldPassword && (
              <p className="text-[10px] text-red-500 mt-1">
                {pwdErrors.oldPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            </div>
            <PasswordInput
              id="newPassword"
              disabled={isProcessing}
              className={cn(
                "input-form",
                getErrorClass(!!pwdErrors.newPassword),
              )}
              {...registerPwd("newPassword")}
            />
            {pwdErrors.newPassword && (
              <p className="text-[10px] text-red-500 mt-1">
                {pwdErrors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            </div>
            <PasswordInput
              id="confirmPassword"
              disabled={isProcessing}
              className={cn(
                "input-form",
                getErrorClass(!!pwdErrors.confirmPassword),
              )}
              {...registerPwd("confirmPassword")}
            />
            {pwdErrors.confirmPassword && (
              <p className="text-[10px] text-red-500 mt-1">
                {pwdErrors.confirmPassword.message}
              </p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isProcessing}
            onClick={() => {
              resetPwd();
              setIsPasswordModalOpen(false);
            }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            form="password-form"
            className="primary-button"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Spinner className="size-4" /> Mise à jour ...{" "}
              </>
            ) : (
              "Mettre à jour"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
