"use client";

import { GalleryVerticalEnd } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import ContinueWith from "./continue-with";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useForm } from "react-hook-form";
import { signupSchema, signupSchemaType } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupForm() {
  const signup = useAuthStore((state) => state.signup);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),
  });

  const handleSignup = () => {};

  return (
    <div>
      <form onSubmit={handleSubmit(handleSignup)}>
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
                {...register("username")}
              />
              <InputGroupAddon>@</InputGroupAddon>
            </InputGroup>
            {errors.username && (
              <FieldError>{errors.username.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="email" className="text-base">
              Email
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="bob@example.com"
              {...register("email")}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel className="text-base flex-1" htmlFor="password">
              Password
            </FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
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
              {...register("confirmPassword")}
            />
            <FieldDescription>Please confirm your password</FieldDescription>
            {!errors.password && errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>

          <Field>
            <Button type="submit">Create account</Button>
          </Field>

          <ContinueWith />
        </FieldGroup>
      </form>
    </div>
  );
}
