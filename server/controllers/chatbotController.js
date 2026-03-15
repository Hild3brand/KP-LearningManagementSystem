import { buildChatRequest } from "../services/requestBuilder.js";
import { callHyperClova } from "../services/hyperclovaClient.js";
import { processClovaResponse } from "../services/responseProcessor.js";
import { logMetric } from "../utils/logger.js";

export const chat = async (req, res, next) => {
  const start = Date.now();

  try {

    if (!req.body || !req.body.message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const message = req.body.message;

    const payload = buildChatRequest(message);

    const clovaResponse = await callHyperClova(payload);

    const result = processClovaResponse(clovaResponse);

    const end = Date.now();

    logMetric(message, result.message, end - start);

    res.json(result);

  } catch (error) {
    next(error);
  }
};
