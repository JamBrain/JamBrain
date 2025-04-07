import { createForm } from "@tanstack/solid-form";
import { createMutation } from "@tanstack/solid-query";
import { z } from "zod";
import { encodeBody } from "~/lib/fetch";

const registerVariables = z.object({
  mail: z.string().email().min(1),
  invite: z.string().min(1),
});

export default function RegisterDialog(props: { close: () => void }) {
  const register = createMutation(() => ({
    async mutationFn(variables: z.infer<typeof registerVariables>) {
      const response = await fetch("http://localhost/vx/user/create", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeBody(variables),
        method: "POST",
      });

      const json = await response.json();

      if (json.status !== 200) {
        throw new Error("Registration failed");
      }
    },
    onSuccess() {
      props.close();
    },
  }));

  const form = createForm(() => ({
    defaultValues: {
      mail: "",
      invite: "",
    },
    onSubmit: ({ value }) => register.mutate(value),
    validators: {
      onChange: registerVariables,
    },
  }));

  return (
    <>
      <header class="bg-neutral-800 px-4 py-2 text-neutral-50">
        <h1 class="font-header">Create Account</h1>
      </header>
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        class="bg-neutral-500"
      >
        <div class="flex flex-col gap-2 p-2">
          <form.Field
            name="mail"
            children={(field) => {
              return (
                <>
                  <input
                    id={field().name}
                    name={field().name}
                    value={field().state.value}
                    placeholder="E-mail address"
                    onBlur={field().handleBlur}
                    onInput={(e) => field().handleChange(e.target.value)}
                    class="p-2"
                  />
                </>
              );
            }}
          />
          <form.Field
            name="invite"
            children={(field) => (
              <>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().state.value}
                  placeholder="Invite code (required)"
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.target.value)}
                  class="p-2"
                />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
          children={(state) => {
            return (
              <div class="flex justify-center gap-2 p-2">
                <button
                  type="submit"
                  disabled={state().isSubmitting}
                  class="border border-neutral-50 text-neutral-50"
                >
                  Send Activation E-mail
                </button>
                <button
                  type="button"
                  onClick={props.close}
                  disabled={state().isSubmitting}
                  class="text-neutral-50"
                >
                  Cancel
                </button>
              </div>
            );
          }}
        />
      </form>
    </>
  );
}
