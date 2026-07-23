import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthScreen.css';

export function AuthScreen() {
    const { signInWithGoogle, signInWithApple, signInWithEmail, signUpWithEmail } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const run = async (action) => {
        try { setError(''); await action(); }
        catch (err) { setError(err.message.replace('Firebase: ', '')); }
    };

    return <main className="auth-page"><section className="auth-card">
        <span className="auth-kicker">LifeSync</span>
        <h1>{isSignUp ? 'Make your week yours.' : 'Welcome back.'}</h1>
        <p>Sign in to keep your schedule private and synced across devices.</p>
        <button className="auth-provider" onClick={() => run(signInWithGoogle)}>Continue with Google</button>
        <button className="auth-provider" onClick={() => run(signInWithApple)}>Continue with Apple</button>
        <div className="auth-divider">or use email</div>
        <form onSubmit={(event) => { event.preventDefault(); run(() => isSignUp ? signUpWithEmail(email, password) : signInWithEmail(email, password)); }}>
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password (6+ characters)" value={password} onChange={e => setPassword(e.target.value)} minLength="6" required />
            <button className="auth-submit" type="submit">{isSignUp ? 'Create account' : 'Sign in'}</button>
        </form>
        {error && <p className="auth-error">{error}</p>}
        <button className="auth-switch" onClick={() => setIsSignUp(value => !value)}>{isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>
    </section></main>;
}

const DEFAULT_CATEGORIES = ['Personal', 'Work', 'Study'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function Onboarding() {
    const { user, completeOnboarding } = useAuth();
    const [name, setName] = useState(user.displayName || '');
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES.join(', '));
    const [tasks, setTasks] = useState([{ title: '', day: 1, start: '09:00', end: '10:00', category: 'Personal' }]);
    const [error, setError] = useState('');
    const categoryList = categories.split(',').map(value => value.trim()).filter(Boolean);

    const updateTask = (index, field, value) => setTasks(current => current.map((task, i) => i === index ? { ...task, [field]: value } : task));
    const submit = async (event) => {
        event.preventDefault();
        if (!categoryList.length) return setError('Add at least one category.');
        const events = tasks.filter(task => task.title.trim()).map((task, index) => ({ ...task, id: `${Date.now()}-${index}`, title: task.title.trim(), day: Number(task.day), completed: false }));
        try { setError(''); await completeOnboarding({ displayName: name.trim(), categories: categoryList, events }); }
        catch (err) { setError(err.message.replace('Firebase: ', '')); }
    };

    return <main className="auth-page"><section className="onboarding-card">
        <span className="auth-kicker">First-time setup</span><h1>Plan the week around you.</h1>
        <p>Create the categories and starter tasks you actually need. You can edit everything later.</p>
        <form onSubmit={submit}>
            <label>Your name<input value={name} onChange={e => setName(e.target.value)} placeholder="What should we call you?" /></label>
            <label>Categories (comma-separated)<input value={categories} onChange={e => setCategories(e.target.value)} placeholder="Personal, Work, Study" required /></label>
            <div className="onboarding-task-header"><strong>Starter tasks</strong><button type="button" onClick={() => setTasks(current => [...current, { title: '', day: 1, start: '09:00', end: '10:00', category: categoryList[0] || '' }])}>+ Add task</button></div>
            {tasks.map((task, index) => <div className="onboarding-task" key={index}>
                <input value={task.title} onChange={e => updateTask(index, 'title', e.target.value)} placeholder="Task name" />
                <select value={task.day} onChange={e => updateTask(index, 'day', e.target.value)}>{DAYS.map((day, i) => <option key={day} value={i + 1}>{day}</option>)}</select>
                <input type="time" value={task.start} onChange={e => updateTask(index, 'start', e.target.value)} />
                <input type="time" value={task.end} onChange={e => updateTask(index, 'end', e.target.value)} />
                <select value={task.category} onChange={e => updateTask(index, 'category', e.target.value)}>{categoryList.map(category => <option key={category}>{category}</option>)}</select>
                {tasks.length > 1 && <button type="button" onClick={() => setTasks(current => current.filter((_, i) => i !== index))}>Remove</button>}
            </div>)}
            {error && <p className="auth-error">{error}</p>}<button className="auth-submit" type="submit">Start using LifeSync</button>
        </form>
    </section></main>;
}
