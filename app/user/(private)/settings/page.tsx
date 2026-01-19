'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import Label from '@/app/components/form/Label';
import Input from '@/app/components/form/Input';
import Button from '@/app/components/form/Button';
import { Para, Head2 } from '@/app/components/Ui';
import Toggle from '@/app/components/form/Toggle';
import { useSession } from 'next-auth/react';
import { UserIcon, TrashIcon } from '@heroicons/react/24/solid';
import getInitials from '@/app/hooks/getInitials';
import CustomImg from '@/app/components/CustomImg';
import { Select, Option } from '@/app/components/form/Select';
import { useModal } from '@/app/hooks/useModal';
import { useDebounce } from '@/app/hooks/useDebounce';
import { userService } from '@/app/services/userService';
import { userNameSchema, uidSchema } from '@/app/lib/validators/userSettings.schema';
import { signOut } from 'next-auth/react';
import { IUser } from '@/app/models/User';
import { useFetchLoading } from '@/app/hooks/useFetchLoading';
import { r2Service } from '@/app/services/r2Service';
import { toast } from 'react-toastify';
import { getR2KeyFromUrl } from '@/app/lib/r2Url';
import { uidService } from '@/app/services/uidServices';
import { nameService } from '@/app/services/nameServie';
import { useTheme, useCookies, useNSFW } from '@/app/context/preferences-context';
import { useLang } from '@/app/context/LanguageContext';
import { useT } from '@/app/hooks/useT';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export default function Example() {

  const LANGUAGE_LABELS = {
    en: "English",
    hi: "हिंदी",
    fr: "Français",
    zh: "中文",
    ar: "العربية",
    de: "Deutsch",
    es: "Español",
    pt: "Português",
    ur: "اردو"
  };


  const { data: session } = useSession();
  const name = session?.user.name ?? null;
  const image = session?.user.image ?? null;
  const uid = session?.user.uid ?? null;
  const t = useT();

  const [theme, setTheme] = useTheme();
  const [nsfw, setNsfw] = useNSFW();
  const [cookies, setCookies] = useCookies();
  const { lang, setLang } = useLang();


  const openModal = useModal((s) => s.openModal);

  const openFetchLoading = useFetchLoading((s) => s.openFetchLoading);
  const closeFetchLoading = useFetchLoading((s) => s.closeFetchLoading);

  const [inpName, setInpName] = useState('');
  const [inpEmail, setInpEmail] = useState('');

  const [nameError, setNameError] = useState<string | null>(null);
  const [nameTouched, setNameTouched] = useState(false);
  const originalUID = session?.user.uid ?? "";
  const [inpUID, setInpUID] = useState(originalUID);
  const [uidTouched, setUidTouched] = useState(false);
  const [uidStatus, setUidStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const [uidError, setUidError] = useState<string | null>(null);
  const debouncedUID = useDebounce(inpUID, 500);

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const effectiveImage = useMemo(() => {
    if (isImageDeleted) return null;
    if (previewImage) return previewImage;
    return session?.user?.image ?? null;
  }, [isImageDeleted, previewImage, session?.user?.image]);


  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    const objectUrl = URL.createObjectURL(file);

    setSelectedImageFile(file);
    setPreviewImage(objectUrl);
    setIsImageDeleted(false);
  };

  const handleDeleteImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setSelectedImageFile(null);
    setPreviewImage(null);
    setIsImageDeleted(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);


  useEffect(() => {
    if (!uidTouched) return;

    const result = uidSchema.safeParse(inpUID);

    if (!result.success) {
      setUidError(result.error.issues[0].message);
      setUidStatus("idle");
    } else {
      setUidError(null);
    }
  }, [inpUID, uidTouched]);


  useEffect(() => {
    if (!nameTouched) return;

    const result = userNameSchema.safeParse(inpName);

    if (!result.success) {
      setNameError(result.error.issues[0].message);
    } else {
      setNameError(null)
    }

  }, [inpName]);



  useEffect(() => {
    if (!uidTouched) return;
    if (uidError) return;
    if (!debouncedUID) return;
    if (debouncedUID === originalUID) {
      setUidStatus("idle");
      return;
    }

    const check = async () => {
      setUidStatus("checking");
      try {
        const data = await userService.checkUID(debouncedUID);
        setUidStatus(data.available ? "available" : "taken");
      } catch {
        setUidStatus("idle");
      }
    };

    check();
  }, [debouncedUID, uidTouched, uidError, originalUID]);



  useEffect(() => {
    if (session?.user?.name) {
      setInpName(session.user.name)
    }

    if (session?.user?.email) {
      setInpEmail(session.user.email)
    }

    if (session?.user?.uid) {
      setInpUID(session.user.uid)
    }

  }, [session]);


  if (!uid) return;

  const handleSaveProfile = async () => {
    openFetchLoading();
    try {

      if (uid === inpUID && name === inpName && !selectedImageFile) return

      let finalImageUrl: string | null | undefined = undefined;

      const previousImageKey = getR2KeyFromUrl(image);

      if (isImageDeleted) {
        finalImageUrl = null;

        if (previousImageKey) {
          const res = await r2Service.delete({ key: previousImageKey });
          if (res.success) {
            console.log('old image deleted');
          }
        }
      } else if (selectedImageFile) {
        const uploadRes = await r2Service.upload({
          file: selectedImageFile,
          folder: "avatars",
        });

        finalImageUrl = uploadRes.url;

        if (previousImageKey) {
          await r2Service.delete({ key: previousImageKey });
        }
      }

      if (inpName !== name) {
        await nameService.updateName({
          uid,
          name: inpName,
        });
      }

      const payload: Partial<IUser> & { uid: string } = {
        uid,
      };

      if (finalImageUrl !== undefined) {
        payload.image = finalImageUrl;
      }

      const hasName = Boolean(inpName && inpName.trim().length >= 2);
      const hasUID = Boolean(inpUID && inpUID.trim().length >= 2);

      const hasImageOrInitials =
        Boolean(finalImageUrl) ||
        Boolean(session?.user?.image && !isImageDeleted) ||
        Boolean(hasName);

      if (hasName && hasUID && hasImageOrInitials) {
        payload.isProfileCompleted = true;
      }

      await userService.updateUser(payload);

      if (inpUID !== uid) {
        await uidService.updateUid({
          oldUid: uid,
          newUid: inpUID,
        });
      }

      toast.success("Profile updated successfully");
      toast.info("Log in again to see updates immediately");

      setTimeout(() => {
        signOut();
      }, 3000);

    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Server or Network error");
    } finally {
      closeFetchLoading();
    }
  };

  type UserUpdatePayload = {
    uid: string;
  } & Partial<{
    'preference.theme': string;
    'preference.nsfw': boolean;
    'preference.cookies': boolean;
    'preference.language': IUser['preference']['language'];
  }>;


  const handleSavePreference = async () => {

    openFetchLoading();

    try {
      const payload: UserUpdatePayload = { uid };

      payload['preference.language'] = lang;

      payload['preference.theme'] = theme;

      payload['preference.nsfw'] = nsfw;

      payload['preference.cookies'] = cookies;

      const res = await userService.updateUser(payload);

      if (res.success) {
        toast.success('Preferences updated successfully');
        toast.info('Login again to see updates');

        setTimeout(() => {
          signOut();
        }, 3000)
      }

    } catch (err) {
      console.log('something went wrong', err);
      toast.error('Server or network error')
    } finally {
      closeFetchLoading()
    }

  }

  return (
    <>
      <main>
        <h1 className="sr-only">Account Settings</h1>
        <div className="divide-y divide-white/10">
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 pb-10 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <Head2 className="text-base/7 font-semibold text-white">Personal Information</Head2>
              <Para className="mt-1 text-sm/6">Use a permanent address where you can receive mail.</Para>
            </div>

            <form className="md:col-span-2">

              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full flex items-center gap-x-8">
                  {effectiveImage ? (
                    <CustomImg
                      alt={name ?? 'your image'}
                      src={effectiveImage}
                      width={100}
                      height={100}
                      className="flex-none bg-gray-100 dark:bg-zinc-800 object-cover outline -outline-offset-1 outline-white/10"
                      wrapperClassName="size-25 ring-1 ring-offset-3 ring-gray-500/95 dark:ring-zinc-600/90 dark:ring-offset-zinc-900 rounded-lg"
                    />
                  ) : name ? (
                    <div className="size-25 flex-none rounded-lg bg-linear-to-b from-blue-50 to-blue-300 ring-1 ring-offset-3 ring-blue-300/75 flex items-center justify-center dark:ring-offset-zinc-900 transition-colors duration-200">
                      <span className="text-blue-500 text-3xl font-bold">
                        {getInitials(name)}
                      </span>
                    </div>
                  ) : (
                    <div className="size-25 flex-none rounded-lg bg-linear-to-b from-blue-50 to-blue-300 ring-1 ring-offset-3 ring-blue-300/75 flex items-center justify-center dark:ring-offset-zinc-900 transition-colors duration-200">
                      <UserIcon className="size-18 text-blue-500" />
                    </div>
                  )}

                  <div>
                    {effectiveImage ? (
                      <div className="flex items-center gap-3.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAvatarClick}
                        >
                          Change avatar
                        </Button>

                        <Button
                          type="button"
                          variant="error"
                          size="sm"
                          onClick={handleDeleteImage}
                        >
                          <TrashIcon className="size-4" />
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAvatarClick}
                      >
                        Add avatar
                      </Button>
                    )}

                    <Para className="text-xs mt-2.5">
                      JPG, GIF or PNG. 1MB max.
                    </Para>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/png,image/jpeg,image/gif"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="col-span-full">
                  <Label htmlFor="first-name" required>
                    Name
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="first-name"
                      name="first-name"
                      type="text"
                      value={inpName}
                      onChange={(e) => {
                        if (!nameTouched) setNameTouched(true);
                        setInpName(e.target.value)
                      }}
                      autoComplete="given-name"
                      error={nameTouched ? nameError ?? undefined : undefined}
                      success={nameTouched && !nameError && inpName.length >= 2}
                    />
                  </div>
                </div>


                <div className="col-span-full">
                  <Label htmlFor="email">
                    Email address
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={inpEmail}
                      disabled
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <Label htmlFor="username">
                    Unique Id
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="janesmith"
                      value={inpUID}
                      onChange={(e) => {
                        if (!uidTouched) setUidTouched(true);
                        setInpUID(e.target.value);
                      }}
                      error={
                        uidTouched
                          ? uidError || (uidStatus === "taken" ? "This username is already taken" : undefined)
                          : undefined
                      }
                      success={uidTouched && !uidError && uidStatus === "available"}
                      loading={{ isLoading: uidStatus === 'checking' ? true : false, message: 'Checking uid availability...' }}
                    />
                  </div>
                </div>

              </div>

              <div className="mt-8 flex">
                <Button type='button' size='sm' onClick={() => handleSaveProfile()}>Save Changes</Button>
              </div>
            </form>
          </div>


          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <Head2>{t('preferences')} </Head2>
              <Para className="mt-1 text-sm/6">
                Log out from your account?
              </Para>
            </div>

            <div className="md:col-span-2">
              <div className='sm:max-w-xl space-y-3'>
                <div>
                  <Label>Language</Label>

                  <Select wrapperClassName='mt-2' value={lang} onChange={(val: any) => setLang(val)} >
                    {
                      Object.entries(LANGUAGE_LABELS).map(([key, val]) => (
                        <Option key={key} value={key}>{val}</Option>
                      ))
                    }
                  </Select>
                </div>
                <div className='mt-7 space-y-2'>
                  <div className='flex justify-between items-center'>
                    <Label htmlFor='setting-theme' className='font-bold'>
                      Dark Theme
                    </Label>
                    <Toggle id='setting-theme' checked={theme === 'dark' ? true : false} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
                  </div>
                  <div className='flex justify-between items-center'  >
                    <Label htmlFor='u-nsfw' className='font-bold'>
                      Show NSFW
                    </Label>
                    <Toggle id='u-nsfw' checked={nsfw} onChange={() => setNsfw(!nsfw)} />
                  </div>
                  <div className='flex justify-between items-center'>
                    <Label htmlFor='cookies' className='font-bold'>
                      Accept Cookies
                    </Label>
                    <Toggle id='cookies' checked={cookies} onChange={() => setCookies(!cookies)} />
                  </div>
                </div>

                <Button className='mt-5' size='sm' onClick={() => handleSavePreference()}>Save Preferences</Button>
              </div>
            </div>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <Head2>Session </Head2>
              <Para className="mt-1 text-sm/6">
                Log out from your account?
              </Para>
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                className='mt-5'
                size='sm'
                onClick={() => signOut()}
              >
                Log out
              </Button>
            </div>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <Head2>Delete account</Head2>
              <Para className="mt-1 text-sm/6">
                No longer want to use our service? You can delete your account here. This action is not reversible.
                All information related to this account will be deleted permanently.
              </Para>
            </div>

            <div className="flex items-start md:col-span-2">
              <Button
                type="button"
                variant='error'
                onClick={() => openModal('del-acc-modal', { id: 1 })}
                size='sm'
              >
                Yes, delete my account
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
