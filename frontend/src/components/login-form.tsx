"use client";

import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ContinueWith from "./continue-with";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginSchemaType } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (loginUserData: loginSchemaType) => {
    try {
      setIsLoading(true);
      console.log("Loggin in...");
      await login(loginUserData);
      toast.success("Signed in successfully");
      router.replace("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <Input
              id="email"
              type="email"
              placeholder="bob@example.com"
              {...register("email")}
            />
            {errors.email && (
              <FieldError className="text-destructive">
                {errors.email.message}
              </FieldError>
            )}
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
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <FieldError className="text-destructive">
                {errors.password.message}
              </FieldError>
            )}
          </Field>

          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p>Signing in...</p>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </Field>

          <ContinueWith />
        </FieldGroup>
      </form>
    </div>
  );
}
