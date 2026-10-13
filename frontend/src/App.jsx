import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [comparison, setComparison] = useState(null);

  function handleResumeChange(event) {
    const file = event.target.files?.[0] ?? null;
    setError('');
    setComparison(null);

    if (file && (file.type !== 'application/pdf' || file.size > MAX_FILE_SIZE)) {
      setResume(null);
      event.target.value = '';
      setError(
        file.type !== 'application/pdf'
          ? 'Choose a PDF file to continue.'
          : 'The PDF must be 10 MB or smaller.',
      );
      return;
    }

    setResume(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setComparison(null);

    if (!resume) {
      setError('Select a resume PDF before submitting.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Add the job description you want to compare against.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription.trim());
    setStatus('submitting');

    try {
      const response = await fetch(`${API_BASE_URL}/api/comparisons`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'The comparison could not be submitted.');
      }

      setComparison(result.comparison);
      setStatus('success');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'The server could not be reached. Please try again.',
      );
      setStatus('idle');
    }
  }

  return (
    <main className="page-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="/" aria-label="0 to Shipped home">
          <span className="brand-mark" aria-hidden="true">0s</span>
          <span>0 to Shipped</span>
        </a>
        <span className="topbar-note">RESUME WORKSPACE</span>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span /> YOUR NEXT ROLE STARTS HERE</div>
        <h1>Make your next move<br />with <span>confidence.</span></h1>
        <p className="hero-copy">
          Bring your resume and a job description together. We’ll get them ready
          for a thoughtful match.
        </p>
      </section>

      <section className="workspace" aria-labelledby="workspace-title">
        <div className="section-heading">
          <div>
            <p className="step-label">01 <span>·</span> YOUR MATERIALS</p>
            <h2 id="workspace-title">Set up your comparison</h2>
          </div>
          <span className="private-note">MONGO STORAGE</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field-column">
              <label className="field-label" htmlFor="resume">YOUR RESUME</label>
              <label className={`upload-card${resume ? ' has-file' : ''}`} htmlFor="resume">
                <span className="upload-icon"><FileIcon /></span>
                <span className="upload-copy">
                  <strong>{resume ? resume.name : 'Choose your resume PDF'}</strong>
                  <span>{resume ? formatFileSize(resume.size) : 'PDF format · up to 10 MB'}</span>
                </span>
                <span className="browse-button">{resume ? 'CHANGE' : 'BROWSE FILES'}</span>
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleResumeChange}
                />
              </label>

              <label className="field-label job-label" htmlFor="jobDescription">
                JOB DESCRIPTION
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                placeholder="Paste the role requirements, responsibilities, and skills..."
                value={jobDescription}
                maxLength={20000}
                onChange={(event) => {
                  setJobDescription(event.target.value);
                  setError('');
                  setComparison(null);
                }}
                rows={8}
                required
              />
              <div className="character-count">{jobDescription.length.toLocaleString()} / 20,000</div>
            </div>

            <aside className="preview-card" aria-label="What happens next">
              <span className="preview-kicker">WHAT HAPPENS NEXT</span>
              <div className="preview-illustration" aria-hidden="true">
                <div className="document document-back" />
                <div className="document document-front">
                  <span /><span /><span /><span />
                </div>
                <span className="spark spark-one">✳</span>
                <span className="spark spark-two">✦</span>
                <span className="match-dot">↗</span>
              </div>
              <h3>A better fit starts with context.</h3>
              <p>
                Your resume and role details will be saved together, ready for
                AI-powered comparison when it’s available.
              </p>
              <div className="preview-divider" />
              <div className="privacy-row"><FileIcon /> Saved with your comparison record</div>
            </aside>
          </div>

          {error && <p className="notice error-notice" role="alert">{error}</p>}
          {comparison && (
            <div className="notice success-notice" role="status">
              <span className="success-check">✓</span>
              <span>
                <strong>Your materials are ready.</strong>
                <span>
                  AI comparison isn’t available yet. Your request has been saved
                  as <code>{comparison.id}</code>.
                </span>
              </span>
            </div>
          )}

          <div className="form-footer">
            <p><span className="required-star">*</span> Both materials are required to continue.</p>
            <button
              className="submit-button"
              type="submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'SAVING YOUR MATERIALS…' : 'PREPARE MY COMPARISON'}
              {status !== 'submitting' && <span aria-hidden="true">↗</span>}
            </button>
          </div>
        </form>
      </section>

      <footer className="page-footer">
        <span>Thoughtful tools for the next step.</span>
        <span>0 TO SHIPPED <span className="footer-dot">·</span> 2026</span>
      </footer>
    </main>
  );
}

function formatFileSize(bytes) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3.75h6.2l4.8 4.8v11.7H7a2 2 0 0 1-2-2v-12a2.5 2.5 0 0 1 2-2.5Z" />
      <path d="M13 4v5h5M8 13h6M8 16h6" />
    </svg>
  );
}
