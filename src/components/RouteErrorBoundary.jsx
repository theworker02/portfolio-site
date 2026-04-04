import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch() {
    // Intentionally quiet in the UI to avoid noisy console output in production.
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const routeName = this.props.routeName || 'route';

    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6">
        <div className="page-orb left-[8%] top-[18%]" />
        <div className="page-orb right-[10%] top-[42%]" />

        <div className="surface-panel relative w-full max-w-2xl rounded-[36px] px-8 py-10 text-center">
          <span className="eyebrow">Route Error</span>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Something interrupted this route.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[var(--secondary-muted)]">
            The {routeName.toLowerCase()} hit an unexpected error. You can head back to the
            homepage, open the project archive, or refresh the route and try again.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/" className="button-primary min-w-[160px]">
              Back Home
            </Link>
            <Link to="/projects" className="button-secondary min-w-[160px]">
              Browse Projects
            </Link>
            <button
              type="button"
              className="button-secondary min-w-[160px]"
              onClick={() => window.location.reload()}
            >
              Refresh Route
            </button>
          </div>
        </div>
      </div>
    );
  }
}
