import React from 'react';

const UNLOCK_KEY = 'flight-site-unlocked';

async function sha256(text) {
  const encoded = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export default function PasswordGate({ children }) {
  const [isUnlocked, setIsUnlocked] = React.useState(() => {
    return localStorage.getItem(UNLOCK_KEY) === 'true';
  });

  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isChecking, setIsChecking] = React.useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setIsChecking(true);

    try {
      const expectedHash = process.env.REACT_APP_SITE_PASSWORD_HASH;

      if (!expectedHash) {
        setError('Password is not configured yet.');
        return;
      }

      const enteredHash = await sha256(password);

      if (enteredHash === expectedHash) {
        localStorage.setItem(UNLOCK_KEY, 'true');
        setIsUnlocked(true);
      } else {
        setError('Wrong password. Try again.');
        setPassword('');
      }
    } finally {
      setIsChecking(false);
    }
  }

  if (isUnlocked) {
    return children;
  }

  return (
    <div className="password-gate">
      <div className="password-card">
        <div className="password-orbit">
          <span>✦</span>
        </div>

        <p className="eyebrow">Private Trip Portal</p>
        <h1>Enter the password</h1>
        <p className="subtitle">
          This little corner of the internet is password protected.
        </p>

        <form onSubmit={handleSubmit} className="password-form">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoFocus
          />

          <button type="submit" disabled={isChecking || !password}>
            {isChecking ? 'Checking...' : 'Unlock'}
          </button>
        </form>

        {error && <p className="password-error">{error}</p>}
      </div>

      <style>{css}</style>
    </div>
  );
}

const css = `
.password-gate {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(120, 119, 255, 0.28), transparent 34%),
    radial-gradient(circle at bottom right, rgba(0, 212, 255, 0.22), transparent 36%),
    #070b16;
  color: white;
}

.password-card {
  width: min(100%, 430px);
  padding: 34px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(12, 18, 34, 0.72);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(18px);
  text-align: center;
}

.password-orbit {
  width: 66px;
  height: 66px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(125, 95, 255, 0.95), rgba(0, 200, 255, 0.9));
  box-shadow: 0 0 40px rgba(72, 156, 255, 0.45);
  font-size: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}

.password-card h1 {
  margin: 0;
  font-size: clamp(30px, 8vw, 44px);
  letter-spacing: -0.04em;
}

.subtitle {
  margin: 12px auto 26px;
  max-width: 330px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
}

.password-form {
  display: grid;
  gap: 12px;
}

.password-form input {
  width: 100%;
  box-sizing: border-box;
  padding: 15px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: white;
  outline: none;
  font-size: 16px;
}

.password-form input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.password-form input:focus {
  border-color: rgba(120, 190, 255, 0.85);
  box-shadow: 0 0 0 4px rgba(75, 156, 255, 0.14);
}

.password-form button {
  border: 0;
  padding: 15px 18px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 800;
  color: #07101f;
  background: linear-gradient(135deg, #ffffff, #95ddff);
}

.password-form button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.password-error {
  margin: 14px 0 0;
  color: #ff9da7;
  font-size: 14px;
}
`;