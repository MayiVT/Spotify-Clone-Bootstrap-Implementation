const http = require('http');
const fs = require('fs');
const path = require('path');

const registersFilePath = path.join(__dirname, 'assets/data/registers.txt');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/register') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { username, password } = JSON.parse(body);

            const hashedPassword = hashPassword(password);

            const newUser = `${username}:${hashedPassword}\n`;
            fs.appendFile(registersFilePath, newUser, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Server error' }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Registration successful' }));
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not found' }));
    }
});

function hashPassword(password) {
    return password;
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});