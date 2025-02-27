async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function register(username, password) {
    try {
        const hashedPassword = await hashPassword(password);

        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password: hashedPassword }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            return true;
        } else {
            const errorData = await response.json();
            console.error('Registration error:', errorData.message);
            return false;
        }
    } catch (error) {
        console.error('Registration error:', error);
        return false;
    }
}

async function login(username, password) {
    try {
        const hashedPassword = await hashPassword(password);

        const response = await fetch('/assets/data/registers.txt');
        const data = await response.text();
        const users = data.split('\n').filter(line => line.trim() !== '');

        return users.some(user => {
            const [storedUsername, storedHashedPassword] = user.split(':');
            return storedUsername === username && storedHashedPassword === hashedPassword;
        });
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}