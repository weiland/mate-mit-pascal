export interface Message {
  id: string;
  when: string;
  where: string;
  name: string;
  extra: string;
}

// const kv = await Deno.openKv();
// https://github.com/denoland/examples/blob/main/with-oak-deno-kv/db.ts

export async function createMeeting() {
}
