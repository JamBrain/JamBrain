import { createForm } from "@tanstack/solid-form";
import { createMutation } from "@tanstack/solid-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { encodeBody } from "~/lib/fetch";

const registerVariables = z.object({
  name: z.string().min(1),
  pw: z.string().min(1),
});

export default function ActivateDialog(props: {
  close: () => void;
  id: string;
  key: string;
}) {
  const activate = createMutation(() => ({
    async mutationFn(variables: z.infer<typeof registerVariables>) {
      const response = await fetch("http://localhost/vx/user/activate", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: encodeBody({
          id: props.id,
          key: props.key,
          ...variables,
        }),
      });
      const json = await response.json();

      if (json.status !== 200) {
        throw new Error("Activation failed");
      }
    },
    onSuccess() {
      props.close();
    },
  }));

  const form = createForm(() => ({
    defaultValues: {
      name: "",
      pw: "",
    },
    onSubmit: async ({ value }) => activate.mutate(value),
    validatorAdapter: zodValidator,
    validators: {
      onChange: registerVariables,
    },
  }));

  return (
    <>
      <header class="bg-gray px-4 py-2 text-white">
        <h1 class="font-header">Register</h1>
      </header>
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        class="bg-gray-light"
      >
        <div>
          <form.Field
            name="name"
            children={(field) => {
              return (
                <>
                  <input
                    id={field().name}
                    name={field().name}
                    value={field().state.value}
                    onBlur={field().handleBlur}
                    onInput={(e) => field().handleChange(e.target.value)}
                    class="p-2"
                  />
                </>
              );
            }}
          />
          <form.Field
            name="pw"
            children={(field) => (
              <>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().state.value}
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
                  class="border border-white text-white"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={props.close}
                  disabled={state().isSubmitting}
                  class="text-white"
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
