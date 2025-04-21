// src/data/prompts.js
const prompts = {
    part1: {
      images: [
        '/images/market.jpg',
        '/images/supermarket.jpg'
      ],
      questions: [
        'Tell me what you see in the pictures',
      'What are the advantages of shopping in both places?',
      'Which place would you prefer to shop at?'
      ]
    },

    part2: {
        instructionText:
          "Part Two – In this part I'm going to ask you three questions. You will have one minute to think about your answers and you can take notes if you wish. After that, you will have two minutes to talk.",
        questions: [
          "Tell me about a teacher who had a big influence on you.",
      "What made their teaching style effective or memorable?",
      "Do you think that schools nowadays teach enough practical skills for adult life?"
        ]
      },
      part3: {
        instructionsText:
          `Part Three – You are going to speak on a topic for one and a half minutes. You can see the topic on the screen and two lists of points – for and against – related to the topic. Choose two items from each list and give a balanced argument to represent both sides of the topic. You have one minute to prepare your argument. You will then have one and a half minutes to speak.\n\n` +
          `Begin speaking when you hear this sound.\n\n` +
          `After you finish speaking you will be asked an additional question about the topic and asked to speak for 45 seconds.\n\n` +
          `You now have one minute to think about your answers. You can make notes if you wish.`,
        topic: 'Remote work is better than office work.',
        forPoints: [
          'Better work‑life balance',
          'Saves commuting time and money',
          'Reduces workplace distractions'
        ],
        againstPoints: [
          'Can feel isolating',
          'Hurts teamwork and collaboration',
          'Not suitable for all jobs'
        ],
        followUpText:
          'You will now be asked an additional question. You have 45 seconds to speak.\n\n' +
          'People are less productive when they work from home. What is your response to this statement?'
      }
  };
  
  export default prompts;
  