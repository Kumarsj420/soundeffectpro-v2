export function generateUID(length = 5) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let uid = "";
  for (let i = 0; i < length; i++) {
    uid += chars[Math.floor(Math.random() * chars.length)];
  }
  return uid;
}
