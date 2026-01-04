"use client";
import { useState } from "react";
import { Search, LogIn, Upload, Menu as MenuIcon, User } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from "next/link";
import Logo from "./Logo";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Button from "./Button";
import { UserIcon, ArrowUpOnSquareStackIcon, HeartIcon, CloudArrowUpIcon, CogIcon, CursorArrowRippleIcon } from "@heroicons/react/24/solid";
import Loading from "../loading";
import {
    useFloating,
    offset,
    flip,
    shift,
    autoUpdate,
    useDismiss,
    useInteractions,
    useTransitionStyles
} from "@floating-ui/react";

interface Sound {
    id: number;
    title: string;
    duration: string;
    likes: number;
    downloads: number;
    tag: string;
}

const mockSounds: Sound[] = [
    { id: 1, title: "Meme Sound Effect", duration: "0:12", likes: 120, downloads: 80, tag: "Meme" },
    { id: 2, title: "Anime Wow Sound", duration: "0:08", likes: 95, downloads: 150, tag: "Anime" },
    { id: 3, title: "Epic Gaming Horn", duration: "0:20", likes: 210, downloads: 300, tag: "Gaming" },
    { id: 4, title: "Cartoon Boing", duration: "0:05", likes: 70, downloads: 50, tag: "Cartoon" },
    { id: 5, title: "Laugh Track", duration: "0:15", likes: 180, downloads: 250, tag: "Comedy" },
];


const getInitials = (name: string): string => {
    return name
        .split(' ')
        .slice(0, 1)
        .map(word => word.charAt(0).toUpperCase())
        .join('');
};


export default function Navbar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Sound[]>([]);

    const handleSearch = (value: string) => {
        setQuery(value);
        if (value.trim().length > 0) {
            const filtered = mockSounds.filter((sound) =>
                sound.title.toLowerCase().includes(value.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    };

    const { data: session, status } = useSession();
    const [openMenu, setOpenMenu] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: openMenu,
        onOpenChange: setOpenMenu,
        middleware: [offset(14), flip(), shift()],
        whileElementsMounted: autoUpdate,
        placement: "bottom-end",
    })

    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } =
        useInteractions([dismiss]);

        

    if (status === 'loading') {
        return <Loading />;
    }

    return (
        <header className="sticky top-0 z-50 bg-white border-gray-300 dark:bg-zinc-950 border-b dark:border-zinc-800">
            <div className="flex items-center justify-between py-3 px-5 sm:px-7 max-w-7xl m-auto">
                {/* Logo */}
                <Link href='/' className="text-xl font-bold">
                    <Logo />
                </Link>

                {/* Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search sounds.."
                        className="w-full rounded-l-lg bg-gray-50 dark:bg-zinc-800 px-4 py-2 text-sm focus:outline-none ring-[0.1em] ring-inset ring-gray-300 dark:ring-zinc-600/80 focus:ring-blue-400 focus:ring-[0.12em] placeholder:text-gray-500/85 dark:placeholder:text-zinc-400/90 text-gray-900 dark:text-white"
                    />
                    <button className="px-3 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-r-lg cursor-pointer">
                        <Search size={18} />
                    </button>

                    {results.length > 0 && (
                        <ul className="absolute top-full mt-1 w-full bg-white dark:bg-zinc-800 border border-gray-300/80 dark:border-zinc-700 rounded-lg shadow-lg dark:shadow-none shadow-gray-300/80 max-h-56 overflow-y-auto z-50">
                            {results.map((sound) => (
                                <li
                                    key={sound.id}
                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer text-sm"
                                    onClick={() => {
                                        alert(`Play: ${sound.title}`);
                                        setQuery("");
                                        setResults([]);
                                    }}
                                >
                                    <div className="flex justify-between">
                                        <span>{sound.title}</span>
                                        <span className="text-gray-400 dark:text-zinc-400">{sound.duration}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="md:flex items-stretch gap-4 hidden">
                    <Link href='/upload'>
                        <button className="p-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg cursor-pointer">
                            <Upload size={18} />
                        </button>
                    </Link>


                    {
                        status === 'authenticated' ? (
                            <>
                                

                                <button className="group" ref={refs.setReference} onClick={() => setOpenMenu(!openMenu)} {...getReferenceProps()}>
                                    {
                                        session?.user.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name ?? 'user'}
                                                width={28}
                                                height={28}
                                                className="size-7 rounded-full ring-1 ring-offset-2 dark:ring-offset-zinc-900 ring-gray-500/95 group-hover:ring-gray-200/70"
                                            ></Image>
                                        ) : session?.user.name ? (
                                            <div className="size-7 bg-linear-to-b from-blue-50 to-blue-300 ring-1 ring-offset-2 rounded-full ring-blue-300/75 group-hover:from-white group-hover:to-blue-200 flex items-center justify-center dark:ring-offset-zinc-900 group-hover:ring-blue-200 transition-colors duration-200">
                                                <span className="text-blue-500">{getInitials(session.user.name)}</span>
                                            </div>
                                        ) : (
                                            <div className="size-7 bg-linear-to-b from-blue-50 to-blue-300 ring-1 ring-offset-2 rounded-full ring-blue-300/75 group-hover:from-white group-hover:to-blue-200 flex items-center justify-center dark:ring-offset-zinc-900 group-hover:ring-blue-200 transition-colors duration-200">
                                                <UserIcon className="size-5 text-blue-500" />
                                            </div>
                                        )
                                    }
                                </button>

                                {
                                    openMenu && (
                                        <div
                                            ref={refs.setFloating}
                                            style={floatingStyles}
                                            {...getFloatingProps()}
                                            className={`w-screen max-w-61 origin-top-right rounded-2xl bg-white shadow-lg shadow-gray-200 outline-1 outline-gray-300/70  dark:divide-white/10 dark:bg-zinc-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 overflow-hidden `}
                                        >
                                            <div className="py-2 px-3">
                                                <div className="bg-white dark:bg-zinc-900 ring-[0.1em] ring-gray-200 dark:ring-0 dark:bg-gradient-to-b dark:from-zinc-600/80 dark:to-zinc-800 rounded-xl relative z-10 dark:after:absolute dark:after:inset-0.5 dark:after:-z-10  dark:dark:after:bg-zinc-900 dark:after:rounded-[inherit] shadow-lg shadow-gray-300/70 dark:shadow-none px-4 py-3 flex gap-3 items-stretch">
                                                    <div>
                                                        {
                                                            session?.user.image ? (
                                                                <Image
                                                                    src={session.user.image}
                                                                    alt={session.user.name ?? 'user'}
                                                                    width={28}
                                                                    height={28}
                                                                    className="size-7 rounded-full ring-1 ring-offset-2 dark:ring-offset-zinc-900 ring-gray-500/95 "
                                                                ></Image>
                                                            ) : session?.user.name ? (
                                                                <div className="size-7 bg-linear-to-b from-blue-50 to-blue-300 ring-1 ring-offset-2 rounded-full ring-blue-300/75  flex items-center justify-center dark:ring-offset-zinc-900 transition-colors duration-200">
                                                                    <span className="text-blue-500">{getInitials(session.user.name)}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="size-7 bg-linear-to-b from-blue-50 to-blue-300 ring-1 ring-offset-2 rounded-full ring-blue-300/75  flex items-center justify-center dark:ring-offset-zinc-900 transition-colors duration-200">
                                                                    <UserIcon className="size-5 text-blue-500" />
                                                                </div>
                                                            )
                                                        }

                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <span className="truncate block text-sm font-bold">{session?.user.name ?? 'Anonymous'}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-zinc-400 block -translate-y-[1px]">Id: <span className="font-semibold">{session?.user.uid}</span></span>
                                                    </div>
                                                </div>

                                                <div className="mt-2 px-1 space-y-0.5">
                                                    <Link href='/user' className="group flex items-center px-4 py-2 text-sm text-gray-600/90  dark:text-zinc-300 dark:data-focus:bg-white/5 dark:data-focus:text-white w-full hover:bg-zinc-700/90 rounded-lg gap-3">
                                                        <UserIcon className="size-5 text-zinc-400/75" />
                                                        Your Profile
                                                    </Link>
                                                    <Link href='/user/uploads' className="group flex items-center px-4 py-2 text-sm text-gray-600/90  dark:text-zinc-300 dark:data-focus:bg-white/5 dark:data-focus:text-white w-full hover:bg-zinc-700/90 rounded-lg gap-3">
                                                        <ArrowUpOnSquareStackIcon className="size-5 text-zinc-400/75" />
                                                        Your Uploads
                                                    </Link>
                                                    <Link href='/user/likes' className="group flex items-center px-4 py-2 text-sm text-gray-600/90  dark:text-zinc-300 dark:data-focus:bg-white/5 dark:data-focus:text-white w-full hover:bg-zinc-700/90 rounded-lg gap-3">
                                                        <HeartIcon className="size-5 text-zinc-400/75" />
                                                        Your Likes
                                                    </Link>
                                                    <Link href='/user/soundboards' className="group flex items-center px-4 py-2 text-sm text-gray-600/90  dark:text-zinc-300 dark:data-focus:bg-white/5 dark:data-focus:text-white w-full hover:bg-zinc-700/90 rounded-lg gap-3">
                                                        <CloudArrowUpIcon className="size-5 text-zinc-400/75" />
                                                        Your Soundboards
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="mt-1 border-t outline-gray-300/70 dark:border-white/10 grid grid-cols-2 divide-x divide-white/10">
                                                <Link href='/user/settings' className="px-3 py-2.5 flex justify-center items-center gap-2 dark:bg-zinc-900/75 hover:bg-zinc-900 text-sm font-semibold">
                                                    <CogIcon className="size-5 text-zinc-400/75" />
                                                    Settings
                                                </Link>
                                                <button onClick={() => signOut()} className="px-3 py-2.5 flex justify-center items-center gap-2 dark:bg-zinc-900/75 hover:bg-zinc-900 text-sm font-semibold">
                                                    <CursorArrowRippleIcon className="size-5 text-zinc-400/75 scale-90" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }

                            </>
                        ) : (
                            <Link href='/login' className="flex">
                                <Button variant="outline" size="auto" className="px-2">
                                    <UserIcon className="size-5" />
                                </Button>
                            </Link>
                        )
                    }


                    <Menu as="div" className="relative inline-block">
                        <MenuButton className="flex items-center rounded-full text-gray-500/75 hover:text-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-zinc-400 dark:hover:text-zinc-300 dark:focus-visible:outline-indigo-500">
                            <span className="sr-only">Open options</span>
                            <MenuIcon size={27} />
                        </MenuButton>

                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-gray-300 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-zinc-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                        >
                            <div className="py-1">
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 data-focus:outline-hidden dark:text-zinc-300 dark:data-focus:bg-white/5 dark:data-focus:text-white"
                                    >
                                        Account settings
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 data-focus:outline-hidden dark:text-zinc-300 dark:data-focus:bg-white/5 dark:data-focus:text-white"
                                    >
                                        Support
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 data-focus:outline-hidden dark:text-zinc-300 dark:data-focus:bg-white/5 dark:data-focus:text-white"
                                    >
                                        License
                                    </a>
                                </MenuItem>
                                <form action="#" method="POST">
                                    <MenuItem>
                                        <button
                                            type="submit"
                                            className="block w-full px-4 py-2 text-left text-sm text-zinc-700 data-focus:bg-zinc-100 data-focus:text-zinc-900 data-focus:outline-hidden dark:text-zinc-300 dark:data-focus:bg-white/5 dark:data-focus:text-white"
                                        >
                                            Sign out
                                        </button>
                                    </MenuItem>
                                </form>
                            </div>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </header>
    );
}
