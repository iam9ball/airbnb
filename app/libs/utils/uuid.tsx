import { v4 as uuidv4 } from "uuid";

export default function UniqueToken() {
  const newUUid = uuidv4();
  const token = newUUid.replace(/-/g, "").substring(0, 6);
  return token;
}
