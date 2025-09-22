import rateLimit from "../config/upstash.js";

const rateLimiter = async (_, res, next) => {
  try {
    const { success } = await rateLimit.limit("my-rate-limit");

    if (!success)
      return res.status(429).json({
        message: "Please try again later",
      });

    next();
  } catch (error) {
    console.log("Rate limit error", error);
  }
};

export default rateLimiter;
