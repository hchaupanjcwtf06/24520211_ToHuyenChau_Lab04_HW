import { SituationshipAnalyzer } from './components/SituationshipAnalyzer';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Lab 03 Bonus Exercise</h1>
        <p className="subtitle">
          Finite State Machine &amp; Asymmetric Effort Reducer (Wendy Thảo)
        </p>
      </header>

      <main>
        <SituationshipAnalyzer />
      </main>

      <footer className="footer">
        <p>UIT - Web Development Course &bull; Creative State Machine Project</p>
      </footer>
    </div>
  );
}