import { db } from "@/server/db";

async function main() {
  // Create a test user as author
  const user = await db.user.findFirst({
    where: {
      email: "himarpl@upi.edu",
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
}

main()
  .then(() => {
    console.log("done");
    void db.$disconnect();
  })
  .catch((e) => {
    console.log(e);
    void db.$disconnect();
  });
