import { Component } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default class AppErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="error-page">
          <section className="error-panel">
            <span className="error-symbol"><AlertTriangle size={22} /></span>
            <p className="eyebrow">Workspace interruption</p>
            <h1>We couldn’t load this view.</h1>
            <p className="muted-text">Your session and saved records are still available. Try this view again or return to the overview.</p>
            <div className="error-actions">
              <Button onClick={() => this.setState({ failed: false })}>Try again</Button>
              <Link className="btn-secondary" to="/dashboard">Go to overview</Link>
            </div>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
