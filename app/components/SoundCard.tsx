"use client";
import { useState } from "react";
import { Heart, Download, EllipsisVertical } from "lucide-react";
import React from "react";
import Link from "next/link";
import SoundButton from "./SoundButton";
import { useLazyAudio } from './../hooks/useAudio';
import { useNumberAbbreviation } from './../hooks/useNumberAbbreviation'
import { Head3, CardSpan } from "./Ui";
import { IFile } from "../models/File";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useDismiss,
  useInteractions,
  useClick
} from "@floating-ui/react";
import { PlusIcon, CodeBracketIcon, EyeSlashIcon, EyeIcon, PencilSquareIcon, ShareIcon, FlagIcon, TrashIcon, BackspaceIcon, HeartIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import Button from "./form/Button";
import { getR2Url } from "../lib/r2/r2Url";
import Badge from "./Badge";
import { userService } from "../services/userService";
import { useFetchLoading } from "../hooks/useFetchLoading";
import { toast } from "react-toastify";
import { useModal } from "../hooks/useModal";
import { IFileWithFav } from "../services/fileService";



export interface SoundCardProps {
  obj: IFileWithFav,
  sessionUser?: boolean,
  userBoard?: string | null;
}

const SoundCard: React.FC<SoundCardProps> = ({
  obj,
  sessionUser = false,
  userBoard = null,
}) => {

  const { play, pause, loading, playing } =
    useLazyAudio(getR2Url(`store/${obj.s_id}.mp3`));
  const abbriviatedNum = useNumberAbbreviation();

  const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
  const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);

  const openModal = useModal((s) => s.openModal);

  const [openMenu, setOpenMenu] = useState(false);
  const [isLiking, setIsLiking] = useState(obj.isFav);
  const [likeCount, setLikeCount] = useState(obj.stats.likes);

  const { refs, floatingStyles, context } = useFloating({
    open: openMenu,
    onOpenChange: setOpenMenu,
    middleware: [offset(14), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: "bottom-end",
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } =
    useInteractions([click, dismiss]);

  const handleRemoveBoard = async () => {
    if (!userBoard) return;
    openFetchLoading();

    try {
      const res = await userService.userDeleteSoundboard({
        sb_id: userBoard,
        s_id: obj.s_id,
      });

      if (res.success) {
        toast.success("sfx removed, refresh to verify.");

      } else {
        toast.error("Failed to remove sound from soundboard.");
      }
    } catch (error) {
      toast.error("Server or network error.");
    } finally {
      closeFetchLoading();
    }
  }

  const handleFavToggle = async () => {
    openFetchLoading();

    try {
      const res = await userService.userFavToggle(obj.s_id);

      if (res.success) {
        toast.success(res.message);
        setIsLiking(!isLiking);
        if (res.status === "liked") {
          setLikeCount(likeCount + 1);
        } else {
          setLikeCount(likeCount - 1);
        }
      } else {
        toast.error("Failed to update favorite status.");
      }
    } catch (error) {
      toast.error("Server or network error.");
    } finally {
      closeFetchLoading();
    }
  }

  return (
    <div className="bg-linear-to-br from-white  to-gray-100/70 dark:from-zinc-700/75 dark:to-zinc-900 rounded-3xl shadow-lg shadow-gray-300/60 dark:shadow-none p-4 relative group/card ring-1 ring-gray-300/80 dark:ring-0">
      <div className="flex justify-center mb-4">
        <SoundButton onClick={playing ? pause : play} className={`hue-rotate-${obj.btnColor} ${loading ? 'saturate-0 animate-pulse pointer-events-none' : ''} ${playing ? 'btn-animation ' : ''}`} />
      </div>
      <Link href={`/${obj.slug}-${obj.s_id}`} className="  text-gray-900 dark:text-white">
        <Head3 className="truncate capitalize hover:text-blue-400">{obj.title}</Head3>
      </Link>
      <div className="mt-1.5 flex justify-between gap-3 overflow-hidden">
        <CardSpan>{obj.duration}</CardSpan>
        <CardSpan className="block  truncate">
          <Link href={`/user/${obj.user.uid}`} className="group/anker ">by <span className="text-gray-900 dark:text-white group-hover/anker:text-blue-400">{obj.user.name}</span></Link>
        </CardSpan>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3.5 text-xs text-gray-500 dark:text-zinc-300/85">
        <div className="flex gap-3 items-stretch">
          <Button onClick={() => handleFavToggle()} variant="outline" size="auto" className="py-1 px-1.5 rounded-md gap-1">
            {
              isLiking ? (
                <HeartIcon className="size-3.5 text-red-500 fill-red-500" />
              ) : (
                <HeartOutline className="size-3.5" />
              )
            }
            {abbriviatedNum(likeCount)}
          </Button>

          <Button size="auto" className="py-1 px-1.5 rounded-md gap-1">
            <ArrowDownTrayIcon className="size-3.5" /> {abbriviatedNum(obj.stats.downloads)}
          </Button>
        </div>
        <div className="relative inline-block">
          <button
            ref={refs.setReference}
            {...getReferenceProps()}
            className='cursor-pointer hover:text-gray-700 dark:hover:text-white outline-none' >
            <EllipsisVertical size={16} />
          </button>
          {
            openMenu && (
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                className=" z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200/80 rounded-2xl bg-white shadow-lg shadow-gray-200 outline-1 outline-gray-300/70 dark:divide-white/10 dark:bg-zinc-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 overflow-hidden"
              >
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => openModal('ats-modal', { s_id: obj.s_id, title: obj.title, btnColor: obj.btnColor })}
                      className="group flex items-center px-4 py-2 text-sm text-gray-600/90 hover:bg-gray-100 hover:text-gray-900 hover:outline-hidden dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white w-full"
                    >
                      <PlusIcon
                        aria-hidden="true"
                        className="mr-3 size-5  text-gray-400 group-hover:text-gray-500 dark:text-zinc-500 dark:group-hover:text-white"
                      />
                      Add To Soundboard
                    </button>
                  </li>
                  <li>
                    <button
                      className="group flex items-center px-4 py-2 text-sm text-gray-600/90 hover:bg-gray-100 hover:text-gray-900 hover:outline-hidden dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white w-full"
                    >
                      <CodeBracketIcon
                        aria-hidden="true"
                        className="mr-3 size-5  text-gray-400 group-hover:text-gray-500 dark:text-zinc-500 dark:group-hover:text-white"
                      />
                      Embed Button
                    </button>
                  </li>
                  {
                    sessionUser && (
                      <>

                        <li>
                          <button
                            className="group flex items-center px-4 py-2 text-sm text-gray-600/90 hover:bg-gray-100 hover:text-gray-900 hover:outline-hidden dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white w-full"
                          >
                            <PencilSquareIcon
                              aria-hidden="true"
                              className="mr-3 size-5 scale-90  text-gray-400 group-hover:text-gray-500 dark:text-zinc-500 dark:group-hover:text-white"
                            />
                            Edit
                          </button>
                        </li>
                      </>
                    )
                  }
                </ul>
                <ul className="py-1">
                  <li>
                    <button
                      className="group flex items-center px-4 py-2 text-sm text-gray-600/90 hover:bg-gray-100 hover:text-gray-900 hover:outline-hidden dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white w-full"
                    >
                      <Badge variant='secondary' size="auto" className="p-1 size-6 rounded-md mr-3">
                        <ShareIcon
                          aria-hidden="true"
                          className="scale-85 size-4 dark:text-zinc-400/90"
                        />
                      </Badge>
                      Share
                    </button>
                  </li>

                  {
                    userBoard && (
                      <li>
                        <button
                          onClick={() => handleRemoveBoard()}
                          className="group flex items-center px-4 py-2 text-sm text-error-500 hover:bg-gray-100 hover:text-error-600 hover:outline-hidden dark:text-error-400 dark:hover:bg-white/5 dark:hover:text-error-300 w-full"
                        >
                          <Badge variant='error' size="auto" className="p-1 size-6 rounded-md mr-3">
                            <BackspaceIcon
                              aria-hidden="true"
                              className="scale-85 size-4 text-error-500 dark:text-error-300 group-hover:text-error-600 dark:group-hover:text-error-200 "
                            />
                          </Badge>
                          Remove Board
                        </button>
                      </li>
                    )
                  }

                  {
                    sessionUser ? (
                      <li>
                        <button
                          onClick={() => openModal('del-sound-modal', { title: obj?.title, s_id: obj?.s_id, btnColor: obj?.btnColor })}
                          className="group flex items-center px-4 py-2 text-sm text-error-500 hover:bg-gray-100 hover:text-error-600 hover:outline-hidden dark:text-error-400 dark:hover:bg-white/5 dark:hover:text-error-300 w-full"
                        >
                          <Badge variant='error' size="auto" className="p-1 size-6 rounded-md mr-3">
                            <TrashIcon
                              aria-hidden="true"
                              className="scale-85 size-4 text-error-500 dark:text-error-300 group-hover:text-error-600 dark:group-hover:text-error-200 "
                            />
                          </Badge>
                          Delete
                        </button>
                      </li>
                    ) : (
                      <li>
                        <button
                          className="group flex items-center px-4 py-2 text-sm text-error-500 hover:bg-gray-100 hover:text-error-600 hover:outline-hidden dark:text-error-400 dark:hover:bg-white/5 dark:hover:text-error-300 w-full"
                        >
                          <Badge variant='error' size="auto" className="p-1 size-6 rounded-md mr-3">
                            <FlagIcon
                              aria-hidden="true"
                              className="scale-85 size-4 text-error-500 dark:text-error-300 group-hover:text-error-600 dark:group-hover:text-error-200 "
                            />
                          </Badge>
                          Report
                        </button>
                      </li>
                    )
                  }
                </ul>
              </div>
            )
          }

        </div>
      </div>
    </div>
  );
};



export function SoundCardSkelton() {
  return (
    <div className="bg-gradient-to-br from-white  to-gray-100/70 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl shadow-lg shadow-gray-300/60 dark:shadow-none p-4 relative group ring-1 ring-gray-300/80 dark:ring-0 ">
      <div className="flex justify-center mb-4">
        <div className="size-21 bg-zinc-700 rounded-full animate-pulse"></div>
      </div>
      <div className="bg-zinc-700 h-5 w-full rounded-lg animate-pulse">
      </div>
      <div className="mt-1.5 bg-zinc-700 h-4 w-full rounded-lg animate-pulse">
      </div>

      <div className="mt-3.5 bg-zinc-700 h-6 w-full rounded-lg animate-pulse">
      </div>
    </div>
  );
}


export default SoundCard;
