export class FUTModule {
    constructor(app) {
        this.app = app;
        this.tools = [];
    }

    async render() {
        try {
            const response = await fetch('data/tools/fut-tools.json');
            const data = await response.json();
            this.tools = data.tools || [];
            return this.buildHTML();
        } catch (error) {
            console.error('Failed to load tools:', error);
            return this.getFallbackHTML();
        }
    }

    buildHTML() {
        return `
            <div style="margin-bottom: 16px; padding: 12px; background: var(--bg-primary); border-radius: var(--radius-sm);">
                <p style="font-size: 14px; color: var(--text-secondary);">
                    🛠️ Frequently used tools and utilities for GST compliance
                </p>
            </div>
            <div class="tools-grid">
                ${this.tools.map(tool => `
                    <div class="tool-card" data-tool="${tool.id}">
                        <span class="tool-icon">${tool.icon || '🛠️'}</span>
                        <h4>${tool.name || 'Tool'}</h4>
                        <p>${tool.description || 'No description available'}</p>
                        ${tool.isInternal ? `
                            <button onclick="window.open('${tool.path}', '_blank')">
                                🚀 Launch Tool
                            </button>
                        ` : tool.url ? `
                            <a href="${tool.url}" target="_blank">🔗 Open Tool</a>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    getFallbackHTML() {
        return `
            <div class="tools-grid">
                <div class="tool-card">
                    <span class="tool-icon">📄</span>
                    <h4>PDF Merger</h4>
                    <p>Merge multiple PDF files into one</p>
                    <button onclick="window.open('/modules/pdf-tools/merger.html', '_blank')">🚀 Launch Tool</button>
                </div>
                <div class="tool-card">
                    <span class="tool-icon">✂️</span>
                    <h4>PDF Splitter</h4>
                    <p>Split PDF into multiple files</p>
                    <button onclick="window.open('/modules/pdf-tools/splitter.html', '_blank')">🚀 Launch Tool</button>
                </div>
                <div class="tool-card">
                    <span class="tool-icon">🧮</span>
                    <h4>GST Calculator</h4>
                    <p>Calculate GST for any amount</p>
                    <a href="https://www.cbic.gov.in/gst-calculator" target="_blank">🔗 Open Tool</a>
                </div>
            </div>
        `;
    }
}
