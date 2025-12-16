import { GalleryVerticalEnd } from "lucide-react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import ContinueWith from "./continue-with";

export default function SignupForm() {
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
              <span>Already have an account? </span>{" "}
              <Button
                asChild
                variant="link"
                className="px-1 text-muted-foreground text-base underline-offset-4 underline font-normal hover:text-foreground"
              >
                <Link href="/auth/login">Sign in</Link>
              </Button>
            </div>
          </div>

          <Field>
            <FieldLabel htmlFor="email" className="text-base">
              Username
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="username"
                type="text"
                placeholder="bobmartin"
              />
              <InputGroupAddon>@</InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="email" className="text-base">
              Email
            </FieldLabel>
            <Input id="email" type="email" placeholder="bob@example.com" />
          </Field>

          <Field>
            <FieldLabel className="text-base flex-1" htmlFor="password">
              Password
            </FieldLabel>
            <Input id="password" type="password" placeholder="••••••••" />
            <FieldDescription>
              Must be at least 8 characters long
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel className="text-base flex-1" htmlFor="confirmPassword">
              Confirm password
            </FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
            />
            <FieldDescription>Please confirm your password</FieldDescription>
          </Field>

          <Field>
            <Button className="">Create account</Button>
          </Field>

          <ContinueWith />
        </FieldGroup>
      </form>
    </div>
  );
}
