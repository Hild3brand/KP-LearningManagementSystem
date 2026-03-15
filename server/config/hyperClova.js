export const hyperclovaConfig = {
  url: process.env.CLOVA_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CLOVA_API_KEY}`,
  },
};