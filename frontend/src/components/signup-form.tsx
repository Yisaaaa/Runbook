import { GalleryVerticalEnd } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "./ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";

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
                variant="link"
                className="px-1 text-muted-foreground text-base underline-offset-4 underline font-normal hover:text-foreground"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>

          <Field>
            <FieldLabel htmlFor="email" className="text-base">
              Name
            </FieldLabel>
            <Input id="name" type="text" placeholder="Bob Martin" />
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

          <FieldSeparator>Or</FieldSeparator>

          <Field>
            <Button variant="outline" className="py-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
