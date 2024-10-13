"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import Heading from "../Heading";
import Input, { RegisterType } from "../Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useVerificationModal from "@/app/hooks/useVerificationModal";
import useUnverifiedUser from "@/app/hooks/useUnverifiedUser";
import axios from "axios";
import toast from "react-hot-toast";
import useLoginModal from "@/app/hooks/useLoginModal";
import resendMail from "@/app/actions/resendMail";
import { VerifyEmailSchema } from "@/schema";

export default function VerificationModal() {
  const [isLoading, setIsLoading] = useState(false);
  const verificationModal = useVerificationModal();
  const unverifiedUser = useUnverifiedUser();
  const loginModal = useLoginModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      token: "",
      email: unverifiedUser.user,
    },
  });

  const onSubmit: SubmitHandler<RegisterType> = (data: RegisterType) => {
    setIsLoading(true);
    console.log("Form submitted", data);

    axios
      .post("/api/auth/emailverification", {
        ...data,
        email: unverifiedUser.user,
      })
      .then((response) => {
        setIsLoading(false);
        if (response?.status === 200) {
          verificationModal.onClose();
          toast.success("Email verification successful");
          unverifiedUser.deleteUser();
          loginModal.onOpen();
        }
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response?.status === 404 || error.response?.status === 401) {
          toast.error("Invalid email or verification code");
        } else if (error.response?.status === 500) {
          toast.error("An error occurred, please try later");
        } else {
          toast.error("An unexpected error occurred");
        }
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Verify your email"
        subtitle="Please check your inbox for the verification code."
      />
      <Input
        id="token"
        label="Verification Code"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div className="">Click here to </div>
          <div
            onClick={() => {
              resendMail(unverifiedUser.user).then((data) => {
                if (data.success) {
                  toast.success("Verification code resent successfully");
                } else if (data.error) {
                  toast.error("Failed to send verification code");
                }
              });
            }}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Resend verification code
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={verificationModal.isOpen}
      title="Verify your email"
      actionlabel="Verify"
      onClose={verificationModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}
