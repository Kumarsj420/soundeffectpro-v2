"use client";
import { useState } from "react";
import { Search, LogIn, Upload, Menu as MenuIcon, User } from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from "next/link";
import Logo from "./Logo";

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

// user profile button

interface ProfileButtonProps {
    userName?: string;
    userImage?: string;
    href?: string;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
    userName = 'User',
    userImage,
    href = '/profile',
    size = 'md',
    onClick,
    className = ''
}) => {
    const [imageError, setImageError] = useState(false);

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .slice(0, 1)
            .map(word => word.charAt(0).toUpperCase())
            .join('');
    };

    // Size configurations
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    const buttonContent = (
        <button
            onClick={onClick}
            className={`
        ${sizeClasses[size]}
        rounded-full 
        flex 
        items-center 
        justify-center
        active:scale-95
        cursor-pointer
        group
        ${className}
      `}
            title={userName}
        >
            <div className="p-1.5 rounded-full ring-[0.11em] ring-zinc-600 ring-offset-2 ring-offset-zinc-950 ring-inset group-hover:ring-zinc-400 aspect-square">
                {userImage && !imageError ? (
                    <img
                        src={userImage}
                        alt={userName}
                        className="w-full h-full object-cover rounded-full group-hover:brightness-110 transition duration-200"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-semibold rounded-full text-sm p-2.5">
                        {getInitials(userName)}
                    </div>
                )}
            </div>
        </button>
    );

    // If href is provided, wrap in Link
    if (href && !onClick) {
        return <Link href={href}>{buttonContent}</Link>;
    }

    // Otherwise return just the button
    return buttonContent;
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

    const [user, setUser] = useState({
        name: 'John Doe',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    });

    return (
        <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
            <div className="flex items-center justify-between px-4 py-3 max-w-7xl m-auto">
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
                        className="w-full rounded-l-lg bg-zinc-800 px-4 py-2 text-sm focus:outline-none ring-[0.1em] ring-inset ring-zinc-700 focus:ring-blue-400 focus:ring-[0.12em]"
                    />
                    <button className="px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-r-lg cursor-pointer">
                        <Search size={18} />
                    </button>

                    {results.length > 0 && (
                        <ul className="absolute top-full mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-56 overflow-y-auto z-50">
                            {results.map((sound) => (
                                <li
                                    key={sound.id}
                                    className="px-4 py-2 hover:bg-zinc-700 cursor-pointer text-sm"
                                    onClick={() => {
                                        alert(`Play: ${sound.title}`);
                                        setQuery("");
                                        setResults([]);
                                    }}
                                >
                                    <div className="flex justify-between">
                                        <span>{sound.title}</span>
                                        <span className="text-zinc-400">{sound.duration}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Link href='/upload'>
                        <button className="p-2 bg-blue-500 hover:bg-blue-400 rounded-lg cursor-pointer">
                            <Upload size={18} />
                        </button>
                    </Link>
                    <Link href='/login'>
                        <button className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg cursor-pointer">
                            <LogIn size={18} />
                        </button>
                    </Link>
                    <ProfileButton
                        userName={user.name}
                        userImage={user.image}
                        href="/profile"
                    />
                    <Menu as="div" className="relative inline-block">
                        <MenuButton className="flex items-center rounded-full text-zinc-400 hover:text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-zinc-400 dark:hover:text-zinc-300 dark:focus-visible:outline-indigo-500">
                            <span className="sr-only">Open options</span>
                            <MenuIcon size={27} />
                        </MenuButton>

                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-zinc-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
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
