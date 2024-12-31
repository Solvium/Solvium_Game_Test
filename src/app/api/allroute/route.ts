import { getCurrentYear, getISOWeekNumber } from "@/app/utils/utils";
import { telegramClient } from "../../clients/TelegramApiClient";
import { InlineKeyboardMarkup } from "@grammyjs/types";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const {
      username: _username,
      id,
      type,
      data,
      message,
      userMultipler,
    } = await req.json();

    const username = _username ?? message.chat.username;
    if (!username) {
      replyNoUsername(message, null);
      return NextResponse.json("error", { status: 404 });
    }

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

        console.log(message);
        console.log(id);

        if (id.length > 1) {
          if (!user) {
            const user = await prisma.user.create({
              data: {
                referralCount: 0,
                isPremium: message.from.is_premium ? true : false,
                name: `${message.chat.first_name ?? ""} ${
                  message.chat.last_name ?? ""
                }`,
                referredBy: id[1],
                chatId: message.from.id?.toString(),
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
              name: `${message.chat.last_name ?? ""} ${
                message.chat.first_name ?? ""
              }`,
              chatId: message.from.id?.toString(),
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

    if (type == "reg4tasks") {
      const isCreated = await getUserTasks(data);
      console.log(isCreated);
      !isCreated && (await registerForTasks(data));
    }

    if (type == "completetasks") {
      if (!user?.isOfficial) {
        const res = await prisma.user.update({
          where: {
            username,
          },

          data: {
            isOfficial: true,
          },
        });

        if (user?.referredBy) {
          const invitor = await prisma.user.findUnique({
            where: {
              username: user.referredBy,
            },
          });

          if (invitor) {
            await prisma.user.update({
              where: {
                username: invitor.username,
              },
              data: {
                referralCount: invitor.referralCount + 1,
                totalPoints: invitor.totalPoints + 100,
              },
            });
          }
        }
        return NextResponse.json(res);
      }

      await completeTasks(data);

      const np = data.task.points * (userMultipler > 0 ? userMultipler : 1);

      await addLeaderboard(user, np);
    }

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
      const tasks = [
        {
          name: "Follow X",
          points: 40,
          isCompleted: false,
          link: "https://x.com/Solvium_game",
        },
        {
          name: "Subscribe to Youtube",
          points: 40,
          isCompleted: false,
          link: "https://www.youtube.com/@solvium_puzzle",
        },
        {
          name: "Follow Facebook",
          points: 40,
          isCompleted: false,
          link: "https://www.facebook.com/profile.php?id=61566560151625&mibextid=LQQJ4d",
        },

        {
          name: "Join Solvium Telegram Group",
          points: 40,
          isCompleted: false,
          link: "https://t.me/solvium_puzzle",
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
      const tasks = await prisma.task.findMany({});
      if (tasks) {
        return NextResponse.json(tasks);
      } else {
        return NextResponse.json("User Not Found", { status: 404 });
      }
    }

    if (type == "allusertasks") {
      console.log(userId);
      const data = await getAllUserTasks({ userId });
      return NextResponse.json(data);
    }

    return NextResponse.json("users");
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" });
  }
}

const replyNoUsername = async (message: any, user: any) => {
  await telegramClient.sendMessage(
    message.chat.id,
    `*Welcome to Solvium Task/Game Bot\\!*
Start earning Solvium Points Now🚀 while enjoying our game

Kindly add a Username to your telegram account and try again\\!`
  );
};

const replyStart = async (message: any, user: any) => {
  const reply_markup: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        {
          text: "Launch WebApp",
          web_app: {
            url:
              process.env.NODE_ENV == "production"
                ? process.env.PROD_URL ?? ""
                : process.env.TEST_URL ?? "",
          },
        },
      ],
    ],
  };

  await telegramClient.sendMessage(
    message.chat.id,
    `*Welcome to Solvium Task/Game Bot\\!*
Start earning Solvium Points Now🚀 while enjoying our game`,
    reply_markup
  );
};

const completeTasks = async (data: any) => {
  const { userId, task } = data;
  try {
    await prisma.userTask.update({
      where: {
        userId_taskId: {
          userId: userId,
          taskId: task.id,
        },
      },
      data: {
        isCompleted: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const registerForTasks = async (data: any) => {
  const { userId, task } = data;

  try {
    await prisma.userTask.create({
      data: {
        userId: userId,
        taskId: task.id,
        isCompleted: false,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserTasks = async (data: any) => {
  const { userId, task } = data;
  try {
    return await prisma.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: userId,
          taskId: task.id,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllUserTasks = async (data: any) => {
  const { userId } = data;
  try {
    return await prisma.userTask.findMany({
      where: {
        userId: Number(userId),
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const addLeaderboard = async (user: any, np: number) => {
  const userId = user.id;
  const points = np;
  try {
    if (!userId || points === undefined) {
      return NextResponse.json(
        { error: "User ID and points are required" },
        { status: 400 }
      );
    }

    const currentWeek = getISOWeekNumber(new Date());
    const currentYear = getCurrentYear();

    // Update weekly score and user's points in a transaction
    const updatedScore = await prisma.$transaction(async (prisma) => {
      // Update or create weekly score
      const weeklyScore = await prisma.weeklyScore.upsert({
        where: {
          userId_weekNumber_year: {
            userId: Number(userId),
            weekNumber: currentWeek,
            year: currentYear,
          },
        },
        update: {
          points: {
            increment: Number(points),
          },
        },
        create: {
          userId: Number(userId),
          weekNumber: currentWeek,
          year: currentYear,
          points: Number(points),
        },
      });

      // Update user's weekly and total points
      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          weeklyPoints: {
            increment: Number(points),
          },
          totalPoints: {
            increment: Number(points),
          },
        },
      });

      return { weeklyScore, updatedUser };
    });

    NextResponse.json(updatedScore, { status: 200 });
  } catch (error) {
    console.error("Error adding weekly points:", error);
    NextResponse.json(
      { error: "Failed to add weekly points kk" },
      { status: 500 }
    );
  }
};
