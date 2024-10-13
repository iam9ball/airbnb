"use client";

import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useLayoutEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input, { RegisterType } from "../Input";
import toast from "react-hot-toast";
import Button from "../Button";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { Login } from "@/app/actions/login";
import { User } from "@prisma/client";
import useCurrentUser from "@/app/hooks/useCurrentUser";
import { useSession } from "next-auth/react";
import { ProviderLogin } from "@/app/actions/providerLogin";
import { LoginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginModal() {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const currentUser = useCurrentUser();
  useLayoutEffect(() => {
    if (session.status === "authenticated" && !currentUser.isUser) {
      const user = session.data?.user as User;
      currentUser.setUser(user);
    }
    if (session.status === "unauthenticated" && currentUser.isUser) {
      currentUser.deleteUser();
    }
  }, [session.status, currentUser, session.data?.user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(LoginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterType> = (data: RegisterType) => {
    setIsLoading(true);
    Login(data).then((data) => {
      setIsLoading(false);
      if (data?.success) {
        window.location.reload();
        toast.success("Logged in successfully");
      }

      if (data?.error) {
        toast.error(data.error);
      }
    });
  };
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login into your account" />

      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() =>
          ProviderLogin("google").then((data) => {
            if (data?.error) {
              toast.error(data.error);
            }
          })
        }
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() =>
          ProviderLogin("github").then((data) => {
            if (data?.error) {
              toast.error(data.error);
            }
          })
        }
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div className="">Dont have an account?</div>
          <div
            onClick={() => {
              loginModal.onClose();
              registerModal.onOpen();
            }}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Sign up
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      onOpen
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionlabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}
