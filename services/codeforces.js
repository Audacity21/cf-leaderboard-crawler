const axios = require('axios');

async function getUserStatus(codeforcesId) {
    try {
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${codeforcesId}`);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching user status:', error);
        return [];
    }
}

module.exports = { getUserStatus };
