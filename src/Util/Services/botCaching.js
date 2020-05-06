/*
Discord Extreme List - Discord's unbiased list.

Copyright (C) 2020 Cairo Mitchell-Acason, John Burke, Advaith Jagathesan

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const app = require("../../../app.js");
const prefix = "bots";

async function getBot(id) {
    const bot = await global.redis.hget(prefix, id);
    return JSON.parse(bot);
}

async function getAllBots() {
    const bots = await global.redis.hvals(prefix);
    return bots.map(JSON.parse);
}

async function updateBot(id) {
    const data = await app.db.collection("bots").findOne({ id: id });
    if (!data) return;
    await global.redis.hmset(prefix, id, JSON.stringify(data));
}

async function uploadBots() {
    const botsDB = await app.db.collection("bots").find().toArray();
    if (botsDB.length < 1) return;
    await global.redis.hmset(prefix, ...botsDB.map(bot => [bot.id, JSON.stringify(bot)]));
}

setInterval(async () => {
    await uploadBots();
}, 900000);

module.exports = {
    getBot, getAllBots, updateBot, uploadBots
};