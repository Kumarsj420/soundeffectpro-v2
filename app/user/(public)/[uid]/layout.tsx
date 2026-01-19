import UserHeader from "../../../components/UserHeader";
import PublicTab from "./tab";
import { requireAuth } from "@/app/lib/getSession";
import { redirect } from "next/navigation";

export default async function PublicUserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ uid: string }>;
}) {
  const session = await requireAuth();
  const { uid } = await params

  if (session?.user.uid === uid) redirect('/user');

  return (
    <div>
      <UserHeader variant="public" uid={uid} />
      <PublicTab uid={uid} />
      <div className="mt-7">{children}</div>
    </div>
  );
}
