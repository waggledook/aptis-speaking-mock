// src/data/prompts.js

// Part 1: Personal questions (four questions)
export const generalPart1 = {
  instructionText:
    "Part One – In this part, I am going to ask you three short questions about yourself and your interests. You will have 30 seconds to reply to each question.\n\nBegin speaking when you hear this sound.",
  questions: [
    "What’s your favourite time of year?",
    "Where do you usually meet your friends?",
    "Please describe your favourite film."
  ]
};

// Part 2: Three short speaking tasks
export const generalPart2 = {
  image: '/images/library.jpg',
  instructionText:
    "Part Two – In this part, I'm going to ask you to describe a picture. Then I will ask you two questions about it. You will have 45 seconds for each response.\n\n" +
    "Begin speaking when you hear this sound.",
  questions: [
    "Describe the photograph.",
    "Do people in your country use libraries often?",
    "Why is reading important for people of all ages?"
  ]
};

// Part 3: Reuse Advanced Part 1 prompts
export const generalPart3 = {
  images: [
    '/images/part-3-first.jpg',
    '/images/part-3-second.jpg'
  ],
  questions: [
    'Tell me what you can see in the two photographs.',
    'What are the benefits of each way of travelling?',
    'Which way do you normally prefer to travel?'
  ]
};

export const generalPart4 = {
  // full exam instructions, verbatim
  instructionText: 
    `Part Four – In this part, I'm going to show you a picture and ask you three questions. You will have one minute to think about your answers before you start speaking. You will have two minutes to answer all three questions.\n\n` +
    `Begin speaking when you hear this sound. Look at the photograph.`,

  // your new image (drop celebration.jpg into public/images/)
  image: '/images/celebration.jpg',

  // your custom questions
  questions: [
    'Tell me about a celebration you enjoyed recently.',
    'What made it special for you?',
    'Do you think traditional celebrations are becoming less important nowadays?'
  ]
};

  