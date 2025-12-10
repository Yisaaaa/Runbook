import { GalleryVerticalEnd } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "./ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ContinueWith from "./continue-with";
import Link from "next/link";

export default function LoginForm() {
  return (
    <div className="">
      <form>
        <FieldGroup>
          <div className="text-center flex flex-col gap-3 items-center">
            <Link href="/">
              <GalleryVerticalEnd className="w-7 h-7" strokeWidth={2} />
            </Link>
            <h1 className="text-2xl font-semibold">Welcome to Runbook</h1>
            <div className="text-muted-foreground">
              <span>Don't have an account? </span>{" "}
              <Button
                variant="link"
                className="px-1 text-muted-foreground text-base underline-offset-4 underline font-normal hover:text-foreground"
              >
                <Link href={"/signup"}>Sign up</Link>
              </Button>
            </div>
          </div>

          <Field>
            <FieldLabel htmlFor="email" className="text-base">
              Email
            </FieldLabel>
            <Input id="email" type="email" placeholder="bob@example.com" />
          </Field>

          <Field>
            <div className="flex justify-between items-center">
              <FieldLabel className="text-base flex-1" htmlFor="password">
                Password
              </FieldLabel>
              <Button variant="link" className="p-0 text-muted-foreground">
                Forgot your password?
              </Button>
            </div>
            <Input id="password" type="password" placeholder="••••••••" />
          </Field>

          <Field>
            <Button className="">Login</Button>
          </Field>

          <ContinueWith />
        </FieldGroup>
      </form>
    </div>
  );
}
