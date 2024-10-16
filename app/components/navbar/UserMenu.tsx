"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useCurrentUser from "@/app/hooks/useCurrentUser";
import logOut from "@/app/actions/logOut";
import toast from "react-hot-toast";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useCurrentUser();
  const rentModal = useRentModal();
  const router = useRouter();

  const toggleIsOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser.isUser) {
      return loginModal.onOpen();
    }
    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Airbnb your home
        </div>
        <div
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-sm transition"
          onClick={toggleIsOpen}
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser.isUser ? (
              <>
                <MenuItem
                  label="My trips"
                  onClick={() => router.push("/trips")}
                />
                <MenuItem
                  label="My favorites"
                  onClick={() => router.push("/favorites")}
                />
                <MenuItem
                  label="My reservations"
                  onClick={() => router.push("/reservations")}
                />
                <MenuItem
                  label="My properties"
                  onClick={() => router.push("/properties")}
                />
                <MenuItem label="Airbnb my home" onClick={rentModal.onOpen} />
                <hr />
                <MenuItem
                  label="Logout"
                  onClick={() =>
                    logOut().then((data) => {
                      if (data.success) {
                        window.location.reload();
                        toast.success("Logged out successfully");
                        toggleIsOpen();
                      } else if (data.error) {
                        toast.error(data.error);
                      }
                    })
                  }
                />
              </>
            ) : (
              <>
                <MenuItem
                  label="Login"
                  onClick={() => {
                    loginModal.onOpen();
                    setIsOpen(!isOpen);
                  }}
                />
                <MenuItem
                  label="Sign up"
                  onClick={() => {
                    registerModal.onOpen();
                    setIsOpen(!isOpen);
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
