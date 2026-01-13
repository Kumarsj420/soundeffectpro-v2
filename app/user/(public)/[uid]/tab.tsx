"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  ArrowUpOnSquareStackIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/solid";
import Tabs from "../../../components/Tabs";

export default function PublicTab({ uid }: { uid: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      id: "Uploads",
      label: "Uploads",
      icon: ArrowUpOnSquareStackIcon,
      path: `/user/${uid}`,
    },
    {
      id: "Soundboards",
      label: "Soundboards",
      icon: RectangleGroupIcon,
      path: `/user/${uid}/soundboards`,
    },
  ];
const activeTab =
  [...tabs]
    .sort((a, b) => b.path.length - a.path.length)
    .find(tab => pathname.startsWith(tab.path))?.id ?? "Uploads";


  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => {
        const tab = tabs.find(t => t.id === id);
        if (tab) router.push(tab.path);
      }}
    />
  );
}
