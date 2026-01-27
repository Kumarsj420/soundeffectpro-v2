"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CustomImg from "./CustomImg";
import {
  UserIcon,
  EnvelopeIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  PlusIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";

import { Head1 } from "./Ui";
import Button from "./form/Button";
import Loading from "../loading";
import getInitials from "../hooks/getInitials";
import { userService } from "../services/userService";
import { IUser } from "../models/User";
import { useModal } from "../hooks/useModal";


type Props = {
  variant: "private" | "public";
  uid?: string;
};

export default function UserHeader({ variant, uid }: Props) {
  const { data: session, status } = useSession();

  const openModal = useModal((s) => s.openModal);

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(variant === "public");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (variant === "private" && session?.user) {
      setUser(session.user as IUser);
    }
  }, [variant, session]);


  useEffect(() => {
    if (variant === "public" && uid) {
      setLoading(true);
      userService
        .getUserByUID(uid)
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [variant, uid]);


  if (variant === "private" && status === "loading") {
    return <Loading />;
  }

  if (loading) {
    return <Loading />;
  }

  if (!user || error) {
    return (
      <div className="p-6 rounded-xl border text-red-500">
        Failed to load user
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-zinc-900/80 backdrop-blur-sm border border-gray-300 dark:border-zinc-800 rounded-2xl p-8 shadow-lg dark:shadow-none shadow-gray-300/80">
      <div className="flex gap-6">
        {/* Avatar */}
        {user.image ? (
          <CustomImg
            src={user.image}
            alt={user.name ?? "user"}
            width={56}
            height={56}
            wrapperClassName="size-14 rounded-full ring-[0.12em] ring-offset-6 dark:ring-offset-zinc-900 ring-gray-500/95"
          />
        ) : user.name ? (
          <div className="size-14 bg-linear-to-b from-blue-50 to-blue-300 ring-[0.12em] ring-offset-6 rounded-full ring-blue-300/75 flex items-center justify-center dark:ring-offset-zinc-900">
            <span className="text-blue-500 text-2xl font-bold">
              {getInitials(user.name)}
            </span>
          </div>
        ) : (
          <div className="size-14 bg-linear-to-b from-blue-50 to-blue-300 ring-[0.12em] ring-offset-6 rounded-full ring-blue-300/75 flex items-center justify-center dark:ring-offset-zinc-900">
            <UserIcon className="size-5 text-blue-500" />
          </div>
        )}

        <div className="flex-1 overflow-hidden space-y-1.5">
          <Head1 className="text-xl sm:text-2xl truncate">
            {user.name ?? "Anonymous"}
          </Head1>

          {variant === "private" && user.email && (
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="size-4 dark:text-zinc-500" />
              <span className="dark:text-zinc-400 text-sm">
                {user.email}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <IdentificationIcon className="size-4 dark:text-zinc-500" />
            <span className="dark:text-zinc-400 text-sm">
              {user.uid}
            </span>
          </div>

          {variant === "private" && user.emailVerified && (
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="size-4 dark:text-zinc-500" />
              <span className="dark:text-zinc-400 text-sm">
                {new Date(user.emailVerified).toDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="w-32 space-y-4">
          {variant === "private" && (
            <Button size="sm" className="w-full" onClick={() => openModal('create-soundboard-modal')}>
              <PlusIcon className="size-4" />
              Soundboard
            </Button>
          )}

          <Button size="sm" className="w-full" variant="outline">
            <ShareIcon className="size-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
