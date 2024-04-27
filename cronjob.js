const mongoose = require('mongoose');
const cron = require('node-cron');
const { getUserStatus } = require('./services/codeforces');
const User = require('./models/User');
const users = require('./users');

async function processUserStatus(codeforcesId) {
  const userStatus = await getUserStatus(codeforcesId);

  // Assuming userStatus is an array of solved problems with contestId, index, and name
  const solvedProblems = userStatus
    .filter((submission) => submission.verdict === 'OK')
    .map((submission) => ({
      contestId: submission.problem.contestId,
      index: submission.problem.index,
      name: submission.problem.name,
    }));

  // Fetch the existing user
  let user = await User.findOne({ codeforcesId });

  if (!user) {
    // If user does not exist, create a new one
    user = new User({ codeforcesId, solvedProblems, lastUpdated: new Date() });
    await user.save();
  } else {
    // Check for duplicates before updating
    const uniqueSolvedProblems = solvedProblems.filter((problem) => {
      return !user.solvedProblems.some(
        (existingProblem) =>
          existingProblem.contestId === problem.contestId &&
          existingProblem.index === problem.index
      );
    });

    // Add unique solved problems to the existing solved problems
    user.solvedProblems.push(...uniqueSolvedProblems);

    // Update lastUpdated time
    user.lastUpdated = new Date();

    // Save the updated user
    await user.save();
  }
}

async function run() {
  console.log('Running cron job...');

  for (const user of users) {
    // Random delay between 2-9 seconds
    const delay = Math.floor(Math.random() * 8) + 2;
    await new Promise((resolve) => setTimeout(resolve, delay * 1000));
    await processUserStatus(user);
    console.log(`Processed user: ${user}`);
  }
  console.log('Cron job completed.');
}

run();
