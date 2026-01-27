"use client"
import { useEffect, useState } from 'react';
import SoundButton from '../components/SoundButton';
import { fileService } from '../services/fileService';
import Loading from '@/app/loading';
import { useLazyAudio } from '../hooks/useAudio';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useInfiniteLoader } from '../hooks/useInfiniteLoader';
import { SoundGrid, Head2 } from '../components/Ui';
import SoundCard, { SoundCardSkelton } from '../components/SoundCard';
import { PAGE_SIZE } from '../global';
import { PlusIcon, CodeBracketIcon, ArrowDownOnSquareStackIcon, HeartIcon, ClockIcon, EyeIcon, ShareIcon, FlagIcon, HomeIcon, ChevronRightIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import Button from '../components/form/Button';
import { useModal } from '../hooks/useModal';
import { getR2Url } from '../lib/r2/r2Url';
import { IFile } from '../models/File';
import { toast } from 'react-toastify';
import { userService } from '../services/userService';
import { useFetchLoading } from "../hooks/useFetchLoading";
import { useSession } from 'next-auth/react';
import { Head1, Para, CardSpan } from '../components/Ui';
import Link from 'next/link';
import Tag from '../components/Tag';
import { useRouter } from 'next/navigation';

interface SoundDetailsPageProps {
  id: string;
}

interface IFileWithFav extends IFile {
  isFav: boolean;
}

const SoundDetailsPage = ({ id }: SoundDetailsPageProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.uid;
  const openModal = useModal((s) => s.openModal);

  const router = useRouter();

  const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
  const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);

  const [isLiking, setIsLiking] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const audioUrl = id ? getR2Url(`store/${id}.mp3`) : null;

  const { play, pause, loading, playing } = useLazyAudio(audioUrl ?? "");

  const {
    data: soundRes,
    isLoading: isSoundLoading,
  } = useQuery({
    queryKey: ["sound", id],
    queryFn: () => fileService.getFilesById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const sfxInfo = soundRes?.data ?? null;

  const userSoundStats = [
    { icon: ClockIcon, label: 'Duration', value: sfxInfo?.duration },
    { icon: EyeIcon, label: 'Views', value: sfxInfo?.stats.views },
    { icon: ArrowDownOnSquareStackIcon, label: 'Downloads', value: sfxInfo?.stats.downloads },
    { icon: HeartIcon, label: 'Likes', value: likeCount },
  ]

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRelatedLoading,
  } = useInfiniteQuery({
    queryKey: ["related-sounds", id],
    initialPageParam: 1,
    enabled: !!id && !!sfxInfo,
    queryFn: ({ pageParam }) =>
      fileService.getRelatedFiles(
        id!,
        pageParam,
        PAGE_SIZE,
        {
          title: sfxInfo?.title,
          tags: sfxInfo?.tags,
          category: sfxInfo?.category,
        }
      ),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.pages
        ? lastPage.pagination.page + 1
        : undefined,
    staleTime: 1000 * 60 * 5,
  });

  const relatedSounds =
    data?.pages.flatMap((page) => page.data) ?? [];

  const loadMoreRef = useInfiniteLoader({
    loading: isFetchingNextPage,
    hasMore: !!hasNextPage,
    onLoadMore: fetchNextPage,
  });

  useEffect(() => {
    if (sfxInfo) {
      setIsLiking(sfxInfo.isFav);
      setLikeCount(sfxInfo.stats.likes);
      fileService.increaseViewCount(sfxInfo.s_id);

    }
  }, [sfxInfo]);



  const handleFavToggle = async () => {
    openFetchLoading();

    try {
      const res = await userService.userFavToggle(id);

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
      console.log('something went wrong while liking', error)
    } finally {
      closeFetchLoading();
    }
  }


  if (isSoundLoading) {
    return (
      <Loading />
    )
  }

  return (
    <div className=" min-h-screen text-zinc-200">
      <section >
        {/* breadcrumps */}
        <nav className="flex items-center gap-1.5 text-sm mb-5">
          <Link href='/' className="text-gray-500 dark:text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1">
            <HomeIcon className='size-4' />
          </Link>
          <ChevronRightIcon className="text-gray-600 dark:text-zinc-500 size-3.5" />
          <Link href='##' className="text-gray-500 dark:text-zinc-300 hover:text-blue-400 transition-colors">
            {sfxInfo?.category ? sfxInfo?.category : 'Random'}
          </Link>
          <ChevronRightIcon className="text-gray-600 dark:text-zinc-500 size-3.5" />
          <span className="text-gray-900 dark:text-white truncate max-w-xs">
            {sfxInfo?.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-8 mb-12">
          {/* sound player */}
          <div className="bg-linear-to-br from-white to-gray-100/70 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 flex flex-col gap-5 justify-between min-h-97.5 ring-1 ring-gray-300/80 dark:ring-0 shadow-xl shadow-gray-300/60 dark:shadow-none">
            <div className='flex justify-center items-center flex-1 mt-5 '>
              <div className="scale-220">
                <SoundButton onClick={playing ? pause : play} className={`hue-rotate-${sfxInfo?.btnColor} ${loading ? 'saturate-0 animate-pulse pointer-events-none' : ''} ${playing ? 'btn-animation ' : ''}`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 ">
              <Button variant='outline' onClick={() => handleFavToggle()}>
                {
                  isLiking ? (
                    <HeartIcon className='text-red-500 size-5' />
                  ) : (
                    <HeartOutline className='text-gray-500/80 dark:text-zinc-500 size-5' />
                  )
                }
                Like <span className="hidden sm:inline">Sound</span>
              </Button>
              <Button variant='outline' onClick={() => openModal('ats-modal', { s_id: id, title: sfxInfo?.title, btnColor: sfxInfo?.btnColor })}>
                <PlusIcon className='text-gray-500/80 dark:text-zinc-500 size-5' />
                Soundboard
              </Button>

              <Button variant='outline'>
                <span>
                  <CodeBracketIcon className='text-gray-500/80 dark:text-zinc-500 size-5' />
                </span>
                Embed <span className="hidden sm:inline">Button</span>
              </Button>

              <Button>
                <ArrowDownOnSquareStackIcon className='size-5' />
                Download <span className="hidden sm:inline">Sound</span>
              </Button>

            </div>
          </div>

          {/* sound details */}
          <div className="space-y-6 py-1">
            {/* Title and Uploader */}
            <div>
              <Head1>
                {sfxInfo?.title} | Sound Effect Pro
              </Head1>
              <Para className='space-x-1'>
                <span>by</span>
                <Link href={`/user/${sfxInfo?.user.uid}`} className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium">
                  {sfxInfo?.user.name}
                </Link>
              </Para>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4.5">
              {
                userSoundStats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <stat.icon className="text-gray-400 dark:text-zinc-400/75 size-5" />
                    <Para className='text-sm' paraHighlight>{stat.value}</Para>
                  </div>
                ))
              }
            </div>

            {/* Tags */}
            <div>
              <div className="flex flex-wrap gap-2">
                {
                  sfxInfo?.tags.map((tag: string, index: number) => (
                    <Tag key={index} >
                      {tag}
                    </Tag>
                  ))
                }
              </div>
            </div>

            {/* Description */}
            <div>
              <CardSpan className='text-sm' paraHighlight>Description</CardSpan>
              <Para paraHighlight>
                {sfxInfo?.description}
                {!sfxInfo?.description && ('There is no description available for this sound..')}
              </Para>
            </div>

            <div className="pt-2 flex gap-4">
              <Button
                variant='outline'
                size='sm'
              >
                <ShareIcon className='text-gray-500/80 dark:text-zinc-400/75 size-4' />
                Share Sound
              </Button>

              {
                userId === sfxInfo?.user.uid ? (
                  <>
                    <Button
                      variant='outline'
                      size='sm'
                    >
                      <PencilSquareIcon className='text-gray-500/80 dark:text-zinc-400/75 size-4' />
                      Edit Sound
                    </Button>
                    <Button
                      variant='error'
                      size='sm'
                      onClick={() => openModal('del-sound-modal', {title: sfxInfo?.title, s_id: sfxInfo?.s_id, btnColor: sfxInfo?.btnColor})}
                    >
                      <TrashIcon className='text-error-100 size-4' />
                      Delete Sound
                    </Button>
                  </>
                ) : (
                  <Button
                    variant='error'
                    size='sm'
                  >
                    <FlagIcon className='text-error-100 size-4' />
                    Report Sound
                  </Button>
                )
              }
            </div>
          </div>
        </div>
      </section >
      <section>
        <Head2>Related Sounds</Head2>

        <SoundGrid className='mt-5'>
          {relatedSounds.map((obj: IFileWithFav) => (
            <SoundCard key={obj.s_id} obj={obj} sessionUser={obj.user.uid === userId} />
          ))}
          {
            (isRelatedLoading || isFetchingNextPage) &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SoundCardSkelton key={i} />
            ))
          }
        </SoundGrid>

        {!hasNextPage && relatedSounds.length > 0 && (
          <p className="text-center mt-4 text-gray-500">No more sounds to load</p>
        )}
        <div ref={loadMoreRef} className="h-10" />

      </section>

    </div >



  );
};

export default SoundDetailsPage;