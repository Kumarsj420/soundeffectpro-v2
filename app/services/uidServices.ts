import axiosInstance from "../lib/axiosInstance";

export const uidService = {
  updateUid: async ({
    oldUid,
    newUid,
  }: {
    oldUid: string;
    newUid: string;
  }) => {
    const res = await axiosInstance.patch("/api/uid", {
      oldUid,
      newUid,
    });
    return res.data;
  },

  deleteUserByUid: async (uid: string) => {
    const res = await axiosInstance.delete("/api/uid", {
      data: { uid },
    });
    return res.data;
  },
};
