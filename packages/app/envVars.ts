import z from "zod";

const addressValidator = z.custom<`0x${string}`>((val) => {
  if (typeof val === "string" && val.startsWith("0x")) {
    return true;
  }
  throw new Error("Contract address must start with 0x");
}, "Contract address must start with 0x");

const envSchema = z.object({
  NEXT_PUBLIC_CONTRACT_GREETER_ADDRESS: addressValidator,
  NEXT_PUBLIC_CONTRACT_LIBRARY_ADDRESS: addressValidator,
  NEXT_PUBLIC_CHAIN_ID: z.coerce.number().default(31337),
  NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID: z.string(),
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional().default(""),
});

export const envClientSchema = envSchema.parse({
  NEXT_PUBLIC_CONTRACT_GREETER_ADDRESS:
    process.env.NEXT_PUBLIC_CONTRACT_GREETER_ADDRESS,
  NEXT_PUBLIC_CONTRACT_LIBRARY_ADDRESS:
    process.env.NEXT_PUBLIC_CONTRACT_LIBRARY_ADDRESS,
  NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
  NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID:
    process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID,
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
});
