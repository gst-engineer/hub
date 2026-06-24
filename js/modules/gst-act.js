export class GSTAct {
    constructor(app) {
        this.app = app;
        this.data = null;
    }

    async render() {
        try {
            const response = await fetch('data/acts/gst-2017.json');
            this.data = await response.json();
            return this.buildHTML();
        } catch (error) {
            console.error('Failed to load GST Act:', error);
            return this.getFallbackHTML();
        }
    }

    buildHTML() {
        const sections = this.data.sections || [];
        return `
            <div class="accordion-container">
                ${sections.map((section, index) => `
                    <div class="accordion-band" id="section-${section.id || index}">
                        <div class="band-header" data-target="content-${section.id || index}">
                            <div>
                                <span class="band-number">${section.number || index + 1}</span>
                                <span class="band-title">${section.heading || 'Section'}</span>
                            </div>
                            <span class="chevron">▼</span>
                        </div>
                        <div class="band-content" id="content-${section.id || index}">
                            <div class="section-text">
                                ${this.formatContent(section.content || 'No content available')}
                                ${this.renderReferences(section.references || [])}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    formatContent(content) {
        if (typeof content === 'string') {
            return content.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('');
        }
        return content;
    }

    renderReferences(references) {
        if (!references || references.length === 0) return '';
        return `
            <div style="margin-top: 12px; padding: 12px; background: var(--bg-primary); border-radius: var(--radius-sm);">
                <strong style="font-size: 13px; color: var(--text-muted);">References:</strong>
                ${references.map(ref => `
                    <span class="reference-link" data-ref-type="${ref.type}" data-ref-id="${ref.id}" 
                          onclick="window.app.modal.show('${ref.text}', '<div class=\\'ref-content\\'>Loading reference...</div>')">
                        ${ref.text} <span class="ref-icon">🔗</span>
                    </span>
                `).join(' ')}
            </div>
        `;
    }

    getSearchData() {
        if (!this.data) return [];
        return this.data.sections.map(s => ({
            title: `${s.number || ''}. ${s.heading || ''}`,
            content: s.content || '',
            id: s.id
        }));
    }

    getFallbackHTML() {
        return `
            <div class="accordion-container">
                <div class="accordion-band">
                    <div class="band-header">
                        <span class="band-title">Sample Section 1: Definitions</span>
                        <span class="chevron">▼</span>
                    </div>
                    <div class="band-content open">
                        <div class="section-text">
                            <p>This is a sample section. Please load the actual data from JSON.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
