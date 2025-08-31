// URL base de la API (ajústala si corres la API en otro puerto/host)
const BASE = "http://127.0.0.1:8000";

/**
 * Envía un POST con cuerpo JSON y devuelve un objeto con {ok, status, json}.
 * Nota: No establecemos Content-Type para evitar preflight CORS en servidores simples.
 */
async function postJson(url, data) {
    const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data)
    });
    // Leemos como texto primero para poder manejar casos en los que la respuesta no sea JSON válido
    const text = await res.text();
    let json = null;
    try {
        json = text ? JSON.parse(text) : null;
    } catch {
        json = { parseError: true, raw: text };
    }
    return { ok: res.ok, status: res.status, json };
}

/**
 * Realiza un GET y trata de parsear la respuesta como JSON de forma segura.
 */
async function getJson(url) {
    const res = await fetch(url, { method: 'GET', mode: 'cors' });
    const text = await res.text();
    let json = null;
    try {
        json = text ? JSON.parse(text) : null;
    } catch {
        json = { parseError: true, raw: text };
    }
    return { ok: res.ok, status: res.status, json };
}

// Maneja clic en Login: valida campos mínimos, hace POST y muestra el resultado
document.getElementById('boton').addEventListener('click', async () => {
    const identifier = document.getElementById('mail').value.trim();
    const password = document.getElementById('contrasena').value;
    if (!identifier || !password) {
        printOutput('Validación Login', { error: 'Identificador y contraseña requeridos.' });
        return;
    }
    try {
        const res = await postJson(`${BASE}/login`, { identifier, password });
        printOutput(`POST ${BASE}/login (status ${res.status})`, res.json ?? { empty: true });
    } catch (err) {
        printOutput('POST /login - Error de red', { error: String(err) });
    }
});

// Maneja clic en Registro: valida campos, hace POST y muestra el resultado
document.getElementById('btn-register').addEventListener('click', async () => {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    if (!username || !email || !password) {
        printOutput('Validación Registro', { error: 'Username, email y contraseña requeridos.' });
        return;
    }
    try {
        const res = await postJson(`${BASE}/register`, { username, email, password });
        printOutput(`POST ${BASE}/register (status ${res.status})`, res.json ?? { empty: true });
    } catch (err) {
        printOutput('POST /register - Error de red', { error: String(err) });
    }
});