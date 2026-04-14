import type { UniqueId } from "@/types";

export default function create_uid(): UniqueId {
  const random_number = Math.floor(Math.random() * 1000);
  const uid = Date.now() * random_number;

  return uid;
}
