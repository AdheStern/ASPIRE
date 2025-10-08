import { toast } from "sonner";

export function showFormSuccess(values: unknown) {
  toast(
    `<pre class="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
      <code class="text-white">${JSON.stringify(values, null, 2)}</code>
    </pre>`
  );
}

export function showFormError(error: unknown) {
  console.error("Form submission error", error);
  toast.error("Failed to submit the form. Please try again.");
}
