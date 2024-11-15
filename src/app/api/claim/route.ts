import { telegramClient } from "../../clients/TelegramApiClient";
import { InlineKeyboardMarkup } from "@grammyjs/types";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { username, type } = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (type == "claim welcome") {
      if (!user?.isOfficial) {
        const res = await prisma.user.update({
          where: {
            username,
          },

          data: {
            totalPoints: (user?.totalPoints ?? 0) + 5500,
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
                totalPoints:
                  invitor.totalPoints + (user.isPremium ? 200000 : 100000),
              },
            });
          }
        }
        return NextResponse.json(res);
      } else {
        return NextResponse.json("Unknown Error", { status: 500 });
      }
    }

    if (type == "daily claim") {
      const lastClaim = new Date(user?.lastClaim ?? Date.now());
      const nextClaim = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

      console.log(user);
      if (new Date(Date.now()) > lastClaim) {
        let day = ((user?.claimCount ?? 0) + 1) * 2;
        day = day - 2;

        const res = await prisma.user.update({
          where: {
            username,
          },

          data: {
            totalPoints: (user?.totalPoints ?? 0) + 500 * (day <= 0 ? 1 : day),
            lastClaim: nextClaim,
            claimCount: (user?.claimCount ?? 0) + 1,
          },
        });

        return NextResponse.json(res);
      }
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

  try {
    return NextResponse.json("users");
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
