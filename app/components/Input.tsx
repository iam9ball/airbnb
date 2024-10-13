"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";
import {
  LoginFieldValues,
  RegisterFieldValues,
  VerifyFieldValues,
} from "@/schema";

type DescriptionFieldValues = {
  title: string;
  description: string;
};

type PriceFieldValues = { price: number };

export type RegisterType = RegisterFieldValues &
  VerifyFieldValues &
  LoginFieldValues &
  DescriptionFieldValues &
  PriceFieldValues;

interface InputProps {
  id:
    | "name"
    | "email"
    | "password"
    | "confirmPassword"
    | "token"
    | "title"
    | "description"
    | "price";
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<RegisterType>;
  errors: FieldErrors;
}
export default function Input({
  id,
  type = "text",
  label,
  disabled,
  formatPrice,
  required,
  register,
  errors,
}: InputProps) {
  const errorMessage = errors[id]?.message as string | undefined;
  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="text-neutral-200 absolute  top-5 left-2"
        />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=" "
        type={type}
        className={`peer w-full p-2 pt-3 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed 
    ${formatPrice ? "pl-9" : "pl-4"}
    ${errors[id] ? "border-rose-500" : "border-neutral-300"}
    ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
    `}
      />
      <label
        className={`absolute text-md duration-150 transform -translate-y-3 top-3 z-10 origin-[0] 
            ${formatPrice ? "left-9" : "left-4"}
            peer-placeholder-shown:scale-100
            peer-placeholder-shown:translate-y-0
            peer-focus:scale-75
            peer-focus:-translate-y-4
            ${errors[id] ? "text-rose-500" : "text-zinc-400"}`}
      >
        {errorMessage || label}
      </label>
    </div>
  );
}
