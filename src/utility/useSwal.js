import Swal from "sweetalert2";

/**
 * Simple alert
 * type: "success" | "error" | "warning" | "info" | "question"
 */
export function showAlert({
  title = "",
  text = "",
  icon = "info",
  confirmButtonText = "OK",
}) {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
  });
}

/**
 * Error alert shortcut
 */
export function showError(message, title = "Error") {
  return Swal.fire({
    title,
    text: message,
    icon: "error",
  });
}

/**
 * Success alert shortcut
 */
export function showSuccess(message, title = "Success") {
  return Swal.fire({
    title,
    text: message,
    icon: "success",
  });
}

/**
 * Warning alert shortcut
 */
export function showWarning(message, title = "Warning") {
  return Swal.fire({
    title,
    text: message,
    icon: "warning",
  });
}

/**
 * Confirmation dialog (YES / CANCEL)
 * Returns true or false
 */
export async function showConfirm({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
  icon = "warning",
}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result.isConfirmed;
}
