import { useSearchParams } from "@solidjs/router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { Show, lazy } from "solid-js";
import Button from "~/components/Button";
import Dialog from "~/components/base/Dialog";
import DialogButton from "~/components/base/DialogButton";
import LoginDialog from "./dialogs/LoginDialog";
import RegisterDialog from "./dialogs/RegisterDialog";

const ActivateDialog = lazy(() => import("./dialogs/ActivateDialog"));

export default function UserBar() {
  const queryClient = useQueryClient();

  const userData = createQuery(() => ({
    queryKey: ["myData"],
    skip: true,
    async queryFn() {
      return null;
      const json = await (
        await fetch("http://localhost/vx/node2/getmy", {
          credentials: "include",
          mode: "cors",
        })
      ).json();
      if (json.status === 401) {
        return null;
      }
      if (json.status === 200) {
        return json;
      }
      throw new Error("Could not load user data");
    },
  }));

  const logout = createMutation(() => ({
    async mutationFn() {
      const response = await fetch("http://localhost/vx/user/logout", {
        credentials: "include",
        method: "POST",
        mode: "cors",
      });
      const json = await response.json();
      if (json.status !== 200) {
        throw new Error("Could not logout");
      }
    },
    onSuccess() {
      queryClient.setQueryData(["myData"], null);
    },
  }));

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <Show when={searchParams.id != null && searchParams.key != null}>
        <Dialog open>
          <ActivateDialog
            id={searchParams!.id!}
            key={searchParams!.key!}
            close={() => {
              setSearchParams({ key: null, id: null });
            }}
          />
        </Dialog>
      </Show>
      <Show when={userData.data === null}>
        <DialogButton
          label="Create Account"
          dialog={RegisterDialog}
          class="hover:bg-primary hover:text-white"
        />
        <DialogButton
          label="Login"
          dialog={LoginDialog}
          class="hover:bg-primary hover:text-white"
        />
      </Show>
      <Show when={userData.data != null}>
        <Button label="My Game" class="hover:bg-primary hover:text-white" />
        <Button label="New Post" class="hover:bg-primary hover:text-white" />
        <Button
          label="Logout"
          onClick={logout.mutate}
          class="hover:bg-primary hover:text-white"
        />
      </Show>
    </>
  );
}
