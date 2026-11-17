(function () {
  const PYTHON_FILES = [
    "py/validators.py",
    "py/extractors.py",
    "py/geodiversity.py",
    "py/regularity.py",
    "py/article_sampling.py",
    "py/evidence.py",
    "py/rules_scopus.py",
    "py/report.py",
    "py/audit_core.py"
  ];

  async function loadPythonEngine(onStatus) {
    const status = typeof onStatus === "function" ? onStatus : () => {};
    try {
      status("Loading Pyodide runtime", "The Python audit engine is being loaded from the browser.");
      await ensurePyodideScript();
      if (!window.loadPyodide) throw new Error("Pyodide loader is unavailable.");
      const pyodide = await window.loadPyodide();
      pyodide.FS.mkdirTree("/scopus");
      for (const path of PYTHON_FILES) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Cannot load ${path}`);
        const code = await response.text();
        pyodide.FS.writeFile(`/scopus/${path.split("/").pop()}`, code);
      }
      await pyodide.runPythonAsync("import sys\nsys.path.insert(0, '/scopus')\nfrom audit_core import run_audit_json, extract_evidence_json, generate_report_json");
      status("Python engine ready", "Pyodide loaded successfully.");
      return {
        ready: true,
        pyodide,
        runAudit: (payload) => JSON.parse(pyodide.globals.get("run_audit_json")(JSON.stringify(payload))),
        extractEvidence: (payload) => JSON.parse(pyodide.globals.get("extract_evidence_json")(JSON.stringify(payload))),
        generateReport: (payload) => JSON.parse(pyodide.globals.get("generate_report_json")(JSON.stringify(payload)))
      };
    } catch (error) {
      status("JavaScript fallback active", "Pyodide could not be loaded. The browser fallback audit engine is active.", true);
      return { ready: false, error };
    }
  }

  function ensurePyodideScript() {
    if (window.loadPyodide) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Pyodide script failed to load."));
      document.head.appendChild(script);
    });
  }

  window.ScopusPyodide = { loadPythonEngine };
})();
