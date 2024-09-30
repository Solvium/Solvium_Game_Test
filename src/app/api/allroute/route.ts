import { telegramClient } from "@/app/clients/TelegramApiClient";
import { InlineKeyboardMarkup } from "@grammyjs/types";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { username: _username, id, type, data, message } = await req.json();

    const username = _username ?? message.chat.username;
    if (!username) return NextResponse.json("error", { status: 404 });

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (message) {
      if (user) {
        console.log(user);
        await replyStart(message, user);
        return NextResponse.json(user);
      }
      if (message.text?.startsWith("/start")) {
        const id = message.text.split("/start ");

        if (id.length > 1) {
          if (!user) {
            const user = await prisma.user.create({
              data: {
                referralCount: 0,
                isPremium: message.from.is_premium ? true : false,
                name: `${message.chat.first_name} ${message.chat.last_name}`,
                referredBy: id[1],
                username: message.chat.username!,
                totalPoints: 0,
              },
            });
            await replyStart(message, user);
            return NextResponse.json(user);
          }
        } else {
          const user = await prisma.user.create({
            data: {
              referralCount: 0,
              referredBy: "null",
              name: `${message.chat.last_name} ${message.chat.first_name}`,
              username: message.chat.username!,
              totalPoints: 0,
            },
          });
          await replyStart(message, user);

          return NextResponse.json(user);
        }
      }

      await replyStart(message, user);

      return NextResponse.json(user);
    }

    // if (type == "reg4tasks") {
    //   const isCreated = await getUserTasks(data);
    //   console.log(isCreated);
    //   !isCreated && (await registerForTasks(data));
    // }

    // if (type == "completetasks") {
    //   await completeTasks(data);

    //   const res = await prisma.user.update({
    //     where: {
    //       username,
    //     },

    //     data: {
    //       totalPoints: (user?.totalPoints ?? 0) + data.task.points,
    //     },
    //   });
    // }

    return NextResponse.json("user");
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const username = searchParams.get("username");
  const userId = searchParams.get("id");

  try {
    if (type == "getUser") {
      if (username) {
        let user = await prisma.user.findUnique({
          where: {
            username: username,
          },
        });
        // if (user) {
        //   function isDateGreater(d1: Date, d2: Date, days: number) {
        //     d1 = new Date(d1);
        //     return (
        //       Number(new Date(d2)) > d1.setDate(d1.getDate() + (days || 0))
        //     );
        //   }

        //   const lastClaim = new Date(user?.lastClaim ?? Date.now());

        //   if (isDateGreater(lastClaim, new Date(Date.now()), 1)) {
        //     user = await prisma.user.update({
        //       where: {
        //         username: user.username,
        //       },
        //       data: {
        //         claimCount: 0,
        //       },
        //     });
        //   }

        // } else {
        //   return NextResponse.json("User Not Found", { status: 404 });
        // }
        return NextResponse.json(user);
      } else {
        return NextResponse.json("No username passed", { status: 500 });
      }
    }

    if (type == "leaderboard") {
      const users = await prisma.user.findMany({
        orderBy: { totalPoints: "desc" },
      });
      if (users) {
        return NextResponse.json(users);
      } else {
        return NextResponse.json("User Not Found", { status: 404 });
      }
    }

    if (type == "addTasksInfo") {
      const categories = [
        { name: "X Birb and Partners Tasks" },
        { name: "Telegram Birb and Partners Tasks" },
        { name: "DeFi Tasks" },
        { name: "Referral Points" },
      ];

      // Insert categories into the database
      await prisma.category.createMany({
        data: categories,
        skipDuplicates: true, // Skip if the category already exists
      });

      console.log("Categories inserted successfully.");

      // Define tasks with category references
      const tasks = [
        { name: "Follow", points: 20000, isCompleted: false, categoryId: 1 },
        { name: "Like", points: 15000, isCompleted: false, categoryId: 1 },
        { name: "Repost", points: 20000, isCompleted: false, categoryId: 1 },
        {
          name: "Subscribe to Birb Telegram Channel",
          points: 20000,
          isCompleted: false,
          categoryId: 2,
        },
        {
          name: "Join Birb Telegram Group",
          points: 20000,
          isCompleted: false,
          categoryId: 2,
        },
        {
          name: "Hold a minimum bal of 10 billion Birb tokens",
          points: 10000000,
          isCompleted: false,
          categoryId: 3,
        },
        {
          name: "Hold a minimum balance of 100,000,000 points",
          points: 500000,
          isCompleted: false,
          categoryId: 3,
        },
        {
          name: "Provide liquidity Birb/TON on stonfi",
          points: 10000000,
          isCompleted: false,
          categoryId: 3,
        },
        {
          name: "Provide liquidity Birb/TON on Dedust",
          points: 10000000,
          isCompleted: false,
          categoryId: 3,
        },
        {
          name: "Stake Birb token",
          points: 10000000,
          isCompleted: false,
          categoryId: 3,
        },
        {
          name: "Telegram premium users",
          points: 200000,
          isCompleted: false,
          categoryId: 4,
        },
        {
          name: "Telegram users",
          points: 100000,
          isCompleted: false,
          categoryId: 4,
        },
      ];

      // Insert tasks into the database
      await prisma.task.createMany({
        data: tasks,
        skipDuplicates: true,
      });

      if (tasks) {
        return NextResponse.json(tasks);
      } else {
        return NextResponse.json("User Not Found", { status: 404 });
      }
    }

    if (type == "getTasksInfo") {
      const tasks = await prisma.task.findMany({
        orderBy: {
          categoryId: "asc",
        },
        include: {
          category: true,
        },
      });
      if (tasks) {
        return NextResponse.json(tasks);
      } else {
        return NextResponse.json("User Not Found", { status: 404 });
      }
    }

    // if (type == "allusertasks") {
    //   console.log(userId);
    //   const data = await getAllUserTasks({ userId });
    //   return NextResponse.json(data);
    // }

    return NextResponse.json("users");
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" });
  }

  // async function main() {
  //   // Create a new user
  //   const user = await prisma.user.create({
  //     data: {
  //       username: "john_doe",
  //       referralCount: 0,
  //       totalPoints: 0,
  //     },
  //   });

  //   // Create a new task
  //   const task = await prisma.task.create({
  //     data: {
  //       name: "Follow the project on social media",
  //       points: 10,
  //     },
  //   });

  //   // User completes the task
  //   await prisma.userCompletedTasks.create({
  //     data: {
  //       userId: user.id,
  //       taskId: task.id,
  //     },
  //   });

  //   // Update task completion status and referred count
  //   await prisma.task.update({
  //     where: { id: task.id },
  //     data: {
  //       isCompleted: true,
  //       referredCount: { increment: 1 },
  //     },
  //   });

  //   // Update user total points
  //   const userWithTasks = await prisma.user.findUnique({
  //     where: { id: user.id },
  //     include: { completedTasks: true },
  //   });

  //   const totalPoints = userWithTasks?.completedTasks.reduce(
  //     (sum: any, task: any) => sum + task.points,
  //     0
  //   );

  //   await prisma.user.update({
  //     where: { id: user.id },
  //     data: {
  //       totalPoints,
  //     },
  //   });

  //   console.log("User with tasks:", userWithTasks);
  // }

  // main()
  //   .catch((e) => {
  //     throw e;
  //   })
  //   .finally(async () => {
  //     await prisma.$disconnect();
  //   });
}

const replyStart = async (message: any, user: any) => {
  const reply_markup: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        {
          text: "Launch WebApp",
          web_app: {
            url:
              process.env.NODE_ENV == "production"
                ? `https://birb-task.vercel.app/`
                : "https://gn5dcg8d-3000.uks1.devtunnels.ms/",
          },
        },
      ],
    ],
  };

  await telegramClient.sendMessage(
    message.chat.id,
    `*Welcome to Birb Tasks\\!*
Start earning Birb Points Now🚀`,
    reply_markup
  );
};

// const completeTasks = async (data: any) => {
//   const { userId, task } = data;
//   try {
//     await prisma.userTask.update({
//       where: {
//         userId_taskId: {
//           userId: userId,
//           taskId: task.id,
//         },
//       },
//       data: {
//         isCompleted: true,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const registerForTasks = async (data: any) => {
//   const { userId, task } = data;

//   try {
//     await prisma.userTask.create({
//       data: {
//         userId: userId,
//         taskId: task.id,
//         isCompleted: false,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getUserTasks = async (data: any) => {
//   const { userId, task } = data;
//   try {
//     return await prisma.userTask.findUnique({
//       where: {
//         userId_taskId: {
//           userId: userId,
//           taskId: task.id,
//         },
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

// const getAllUserTasks = async (data: any) => {
//   const { userId } = data;
//   try {
//     return await prisma.userTask.findMany({
//       where: {
//         userId: Number(userId),
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };
