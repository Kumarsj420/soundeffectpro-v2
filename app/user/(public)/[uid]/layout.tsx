import UserHeader from "../../../components/UserHeader";
import PublicTab from "./tab";
import { requireAuth } from "@/app/lib/getSession";
import { redirect } from "next/navigation";

export default async function PublicUserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { uid: string };
}) {
  const session = await requireAuth();

  if (session?.user.uid === params.uid) redirect('/user');

  return (
    <div>
      <UserHeader variant="public" uid={params.uid} />
      <PublicTab uid={params.uid} />
      <div className="mt-7">{children}</div>
    </div>
  );
}
