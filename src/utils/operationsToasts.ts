import { toast } from "sonner";
import { TOASTSTYLES } from "./toastsCSSUtils";

export const operationSuccess = (msg: string) => {
  toast.success(msg, {
    position: "top-right",
    style: TOASTSTYLES.SUCCESS,
  });
};

export const operationInfo = (msg: string) => {
  toast.success(msg, {
    position: "top-right",
    style: TOASTSTYLES.INFO,
  });
};

export const operationError = (msg: string) => {
  toast.success(msg, {
    position: "top-right",
    style: TOASTSTYLES.ERROR,
  });
};

export const operationWarning = (msg: string) => {
  toast.success(msg, {
    position: "top-right",
    style: TOASTSTYLES.WARNING,
  });
};

export const operationLoading = (msg: string) => {
  toast.success(msg, {
    position: "top-right",
    style: TOASTSTYLES.LOADING,
  });
};
