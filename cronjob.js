const cron = require('node-cron');
const { getUserStatus } = require('./services/codeforces');
const User = require('./models/User');
const users = require('./users');


// Function to process user status and store solved problems
async function processUserStatus(codeforcesId) {
    const userStatus = await getUserStatus(codeforcesId);
    const solvedProblems = userStatus
        .filter(submission => submission.verdict === 'OK')
        .map(submission => submission.problem.name);

    // Update or create user in MongoDB
    await User.findOneAndUpdate({ codeforcesId }, { $addToSet: { solvedProblems } }, { upsert: true });
}

// Define cron job
cron.schedule('* */30 * * *', async () => {
    console.log('Running cron job...');
    for (const user of users) {
        // Random delay between 2-9 seconds
        const delay = Math.floor(Math.random() * 8) + 2;
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
        await processUserStatus(user);
        console.log(`Processed user: ${user}`);
    }
    console.log('Cron job completed.');
});

console.log('Cron job scheduled.');
