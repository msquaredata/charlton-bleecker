import { forwardRef } from "react";

type FormSubmitFeedbackProps = {
  error?: string | null;
  success?: string | null;
  theme?: "light" | "dark";
  className?: string;
};

const FormSubmitFeedback = forwardRef<HTMLDivElement, FormSubmitFeedbackProps>(
  function FormSubmitFeedback(
    { error, success, theme = "light", className = "" },
    ref,
  ) {
    const successClass =
      theme === "dark"
        ? "text-sm text-green-300"
        : "text-sm text-green-700";

    return (
      <div ref={ref} className={className}>
        {success ? (
          <p className={successClass} role="status">
            {success}
          </p>
        ) : null}
        {error ? (
          theme === "dark" ? (
            <div
              role="alert"
              className="rounded-md border border-red-400/60 bg-red-950/40 px-4 py-3 text-sm text-white"
            >
              {error}
            </div>
          ) : (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )
        ) : null}
      </div>
    );
  },
);

export default FormSubmitFeedback;
