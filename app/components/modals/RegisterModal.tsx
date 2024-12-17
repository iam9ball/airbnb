"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input, { RegisterType } from "../Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { RegisterSchema } from "@/schema";
import useVerificationModal from "@/app/hooks/useVerificationModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useUnverifiedUser from "@/app/hooks/useUnverifiedUser";
import { signIn } from "next-auth/react";
export default function RegisterModal() {
  const registerModal = useRegisterModal();
  const verificationModal = useVerificationModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const unverifiedUser = useUnverifiedUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterType> = (data: RegisterType) => {
    setIsLoading(true);

    axios
      .post("/api/auth/register", data)
      .then((response) => {
        setIsLoading(false);

        if (response.status === 200) {
          registerModal.onClose();
          verificationModal.onOpen();
          unverifiedUser.setUser(response.data.email);
          toast.success("Verification email sent");
        }
      })
      .catch((error) => {
        setIsLoading(false);

        if (error.response) {
          if (error.response.status === 400) {
            toast.error("Email already exist");
          } else if (error.response.status === 500) {
            toast.error("An error occurred. Please try again later.");
          } else {
            toast.error("An unexpected error occurred. Please try again.");
          }
        } else if (error.request) {
          toast.error(" Please check your internet connection.");
        } else {
          toast.error("An error occurred while sending the request.");
        }

        console.error("Registration error:", error);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Airbnb" subtitle="Create an account" />

      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
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
      <Input
        id="confirmPassword"
        label="Confirm password"
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
         signIn("google", {
          redirectTo: "/"
         })
          
        }
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() =>
         signIn("github", {
          redirectTo: "/"
         })
          
        }
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div className="">Already have an account?</div>
          <div
            onClick={() => {
              registerModal.onClose();
              loginModal.onOpen();
            }}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      onOpen
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionlabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}
