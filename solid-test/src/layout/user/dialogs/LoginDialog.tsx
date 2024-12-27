import { createForm } from "@tanstack/solid-form";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { encodeBody } from "~/lib/fetch";

const loginVariables = z.object({
  login: z.string().min(1),
  pw: z.string().min(1),
});

export default function LoginDialog(props: { close: () => void }) {
  const queryClient = useQueryClient();

  const login = createMutation(() => ({
    async mutationFn(variables: z.infer<typeof loginVariables>) {
      const response = await fetch("http://localhost/vx/user/login", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        credentials: "include",
        body: encodeBody(variables),
      });
      const json = await response.json();

      if (json.status !== 200) {
        throw new Error(json.message ?? json.response);
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["myData"] });
      props.close();
    },
  }));

  const form = createForm(() => ({
    defaultValues: {
      login: "TODO",
      pw: "Password",
    },
    onSubmit: ({ value }) => login.mutate(value),
    validatorAdapter: zodValidator,
    validators: {
      onChange: loginVariables,
    },
  }));

  return (
    <>
      <header class="bg-gray px-4 py-2 text-white">
        <h1 class="font-header">Log in</h1>
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
        <div class="flex flex-col gap-2 p-2">
          <form.Field
            name="login"
            children={(field) => {
              return (
                <>
                  <input
                    id={field().name}
                    name={field().name}
                    value={field().state.value}
                    placeholder="Name, account name, or e-mail"
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
                  placeholder="Password"
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
                  Log In
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
