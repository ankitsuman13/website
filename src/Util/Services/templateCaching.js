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
const prefix = "templates";

async function getTemplate(id) {
    const template = await global.redis.hget(prefix, id);
    return JSON.parse(template);
}

async function getAllTemplates() {
    const servers = await global.redis.hvals(prefix);
    return servers.map(JSON.parse);
}

async function updateTemplate(id) {
    const data = await app.db.collection("templates").findOne({ id: id });
    if (!data) return;
    await global.redis.hmset(id, JSON.stringify(data));
}

async function uploadTemplates() {
    const templates = await app.db.collection("templates").find().toArray();
    if (templates.length < 1) return;
    await global.redis.hmset(prefix, ...templates.map(t => [t.id, JSON.stringify(t)]));
}

setInterval(async () => {
    await uploadTemplates();
}, 900000);

module.exports = {
    getTemplate, getAllTemplates, updateTemplate, uploadTemplates
};