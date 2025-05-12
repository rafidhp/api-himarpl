import { db } from "@/server/db";

async function main() {}

main()
  .then(() => {
    console.log("done");
    void db.$disconnect();
  })
  .catch((e) => {
    console.log(e);
    void db.$disconnect();
  });
