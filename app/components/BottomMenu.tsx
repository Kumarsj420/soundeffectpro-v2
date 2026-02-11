"use client"
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { HomeIcon, RectangleGroupIcon, UserIcon } from "@heroicons/react/24/solid";
import { ImUpload2 } from "react-icons/im";
import { IconType } from "react-icons";

type MNavProp = {
    href: string
    children: React.ReactNode
    icon: IconType
    iconSize: string
}

function MenuNav({ href, children, icon: Icon, iconSize }: MNavProp) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link href={href} className={`group ${isActive ? 'active' : ''}`}>
            <div className="py-1.5 flex flex-col gap-1 items-center group-[.active]:bg-blue-500">
                <div className="flex size-7 sm:size-8 justify-center items-center">
                    <Icon className="size-5 sm:size-6" />
                </div>
                <span className="text-xs text-white font-light">{children}</span>
            </div>
        </Link>
    )
}


export default function BottomMenu() {
    const { data: session } = useSession();

    const user = session?.user?.uid;
    return (
        <div className="fixed bottom-0 left-0 w-full bg-zinc-800 z-99  border-t border-t-zinc-700 lg:hidden">
            <div className="max-w-7xl ">
                <div className="grid w-full grid-cols-4 divide-x divide-zinc-700">
                    <MenuNav href='/' icon={HomeIcon} iconSize="size-5 sm:size-6">Home</MenuNav>
                    <MenuNav href='/soundboard' icon={RectangleGroupIcon} iconSize="size-6 sm:size-7">Soundboard</MenuNav>
                    {
                        user ? (
                            <MenuNav href='/user' icon={UserIcon} iconSize="size-6 sm:size-7">Profile</MenuNav>
                        ) : (
                            <MenuNav href='/login' icon={UserIcon} iconSize="size-6 sm:size-7">Login</MenuNav>
                        )
                    }
                    <MenuNav href='/upload' icon={ImUpload2} iconSize="size-5 sm:size-6">Upload</MenuNav>
                </div>
            </div>
        </div>
    )
}