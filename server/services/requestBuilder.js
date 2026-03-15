export const buildChatRequest = (userMessage) => {
  const zeroShotPrompt = `
    ROLE:
    You are an AI Korean language tutor.

    LEARNING STATE:
    Bloom Level: Remembering
    Topic: {topic}

    INSTRUCTION:
    Ask the student to recall information related to the topic.
    Do not give hints or examples unless the student fails.

    STUDENT MESSAGE:
    {student_query}
  `;

  const fewShotPrompt = `
    ROLE:
    You are a Korean language tutor.

    LEARNING STATE:
    Bloom Level: Understanding

    EXAMPLES:
    Sentence: 저는 물을 마십니다
    Meaning: I drink water

    Sentence: 저는 밥을 먹습니다
    Meaning: I eat rice

    TASK:
    Explain the meaning of the following sentence.

    Student message:
    {student_query}
  `;

  const chainOfThoughtPrompt = `
    ROLE:
    You are an AI Korean tutor.

    LEARNING STATE:
    Bloom Level: Applying
    Topic: {topic}

    INSTRUCTION:
    Guide the student step by step.

    Steps:
    1 Identify key vocabulary
    2 Choose grammar structure
    3 Construct the sentence

    Student request:
    {student_query}
  `;

  const directionalStimulusPrompt = `
    ROLE:
    You are a Korean tutor.

    LEARNING STATE:
    Remedial Mode

    INSTRUCTION:
    Give directional hints instead of the answer.

    Topic: {topic}
    Student failed question:
    {student_query}
  `;

  return {
    messages: [
      {
        role: "system",
        content: `You are a Korean language tutor.`
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    maxTokens: 200,
    temperature: 0.5,
    topP: 0.8
  };
};