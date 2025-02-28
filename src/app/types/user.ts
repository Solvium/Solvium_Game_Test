interface UserProfile {
  id: number;
  username: string;
  name: string;
  wallet: string;
  referredBy: string | null;
  chain: string | null;
  level: number;
  difficulty: number;
  puzzleCount: number;
  referralCount: number;
  chatId: string;
  spinCount: number;
  claimCount: number;
  totalPoints: number;
  isOfficial: boolean;
  isMining: boolean;
  isPremium: boolean;
  lastClaim: string | Date; // ISO timestamp format
  weeklyPoints: number;
}

// For stricter type checking with string dates:
type UserProfileStrict = Omit<UserProfile, "lastClaim"> & {
  lastClaim: Date;
};

// Optional: Type for API response wrapper
interface ApiUserResponse {
  data: UserProfile;
  timestamp: number;
  status: "success" | "error";
}
