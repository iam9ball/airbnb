'use client'
import Image from "next/image"
export default function Avatar() {
  return (
    <Image 
    className="rounded-full"
    width="30"
    height="30"
    alt="Avatar"
    src="/images/placeholder.jpg"
    />
  )
}
