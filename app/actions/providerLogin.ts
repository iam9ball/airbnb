// "use server";

// import { signIn } from "next-auth/react";

// export const ProviderLogin = async (provider: string) => {
//   try {
//     const callbackUrl = `${window.location.origin}/?auth=success`;
//     await signIn(provider, {
//       callbackUrl: callbackUrl || undefined,
//     });
//   } catch (error) {
//     console.error("Sign-in error:", error);
//     return { error: "Something went wrong" };
//   }
// };
