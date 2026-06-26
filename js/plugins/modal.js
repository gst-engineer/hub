export class Modal {
    constructor() {
        this.container = document.getElementById('modalContainer');
        this.isOpen = false;
        this.setupContainer();
    }

    setupContainer() {
        this.container.innerHTML = `
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal-box">
                    <div class="modal-header">
                        <h3 id="modalTitle">Modal Title</h3>
                        <button class="modal-close-btn" id="modalCloseBtn">✕</button>
                    </div>
                    <div class="modal-body" id="modalBody">
                        Modal content
                    </div>
                    <div class="modal-footer" id="modalFooter">
                        <button class="btn btn-secondary" id="modalCancelBtn">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modalCloseBtn').addEventListener('click', () => this.close());
        document.getElementById('modalCancelBtn').addEventListener('click', () => this.close());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    show(title, content, footer = null) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        
        if (footer) {
            document.getElementById('modalFooter').innerHTML = footer;
        } else {
            document.getElementById('modalFooter').innerHTML = `
                <button class="btn btn-secondary" id="modalCancelBtn">Close</button>
            `;
            document.getElementById('modalCancelBtn').addEventListener('click', () => this.close());
        }

        document.getElementById('modalOverlay').classList.add('open');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        document.getElementById('modalOverlay').classList.remove('open');
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    isOpen() {
        return this.isOpen;
    }

    // ✅ UPDATED: Show FULL reference in modal with proper formatting
    showReference(refType, refId, refText) {
        const referenceData = this.findReference(refType, refId);
        
        if (referenceData) {
            // Format the full content with proper line breaks and sub-sections
            const formattedContent = this.formatFullContent(referenceData.content);
            
            this.show(
                `📎 ${refText}`,
                `
                    <div class="ref-content">
                        <!-- Header with metadata -->
                        <div style="margin-bottom: 16px; padding: 12px 16px; background: var(--bg-primary); border-radius: var(--radius-sm); border-left: 4px solid var(--primary);">
                            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                                <div>
                                    <strong style="font-size: 14px;">📌 ${refType === 'section' ? 'Section' : 'Rule'}</strong>
                                    <span style="margin-left: 12px; font-size: 14px; color: var(--text-secondary);">
                                        ${referenceData.number || ''}
                                    </span>
                                </div>
                                <div style="font-size: 13px; color: var(--text-muted);">
                                    📂 ${referenceData.moduleName || referenceData.moduleId || 'Unknown'}
                                </div>
                            </div>
                            ${referenceData.heading ? `<div style="margin-top: 4px; font-weight: 600; font-size: 16px; color: var(--text-primary);">${referenceData.heading}</div>` : ''}
                        </div>
                        
                        <!-- Full Content -->
                        <div class="ref-full-content">
                            ${formattedContent}
                        </div>
                        
                        <!-- Show references within this reference -->
                        ${referenceData.references && referenceData.references.length > 0 ? `
                            <div style="margin-top: 16px; padding: 12px; background: var(--bg-primary); border-radius: var(--radius-sm);">
                                <strong style="font-size: 13px; color: var(--text-muted);">🔗 References in this ${refType === 'section' ? 'Section' : 'Rule'}:</strong>
                                ${referenceData.references.map(ref => `
                                    <span class="reference-link" 
                                          style="margin-left: 8px;"
                                          onclick="window.app.modal.showReference('${ref.type}', '${ref.id}', '${ref.text}')">
                                        ${ref.text} <span class="ref-icon">🔗</span>
                                    </span>
                                `).join(' ')}
                            </div>
                        ` : ''}
                    </div>
                `,
                `
                    <button class="btn btn-primary" onclick="window.app.openFullReference('${refType}', '${refId}')">
                        📖 View in ${referenceData.moduleName || 'Module'}
                    </button>
                    <button class="btn btn-secondary" id="modalCancelBtn">Close</button>
                `
            );
            document.getElementById('modalCancelBtn').addEventListener('click', () => this.close());
        } else {
            this.show(
                '❌ Reference Not Found',
                `
                    <div style="padding: 40px 20px; text-align: center; color: var(--text-muted);">
                        <span style="font-size: 64px; display: block; margin-bottom: 16px;">🔍</span>
                        <h3 style="font-family: var(--font-primary); color: var(--text-secondary);">Reference Not Found</h3>
                        <p style="margin-top: 8px;">Could not find: <strong>${refText}</strong></p>
                        <p style="font-size: 13px; margin-top: 4px;">Type: ${refType}, ID: ${refId}</p>
                    </div>
                `
            );
        }
    }

    // ✅ NEW: Format full content with proper structure
    formatFullContent(content) {
        if (!content) return '<p>No content available</p>';
        
        if (typeof content === 'string') {
            // Split by new lines
            const lines = content.split('\n');
            let html = '';
            let inSubSection = false;
            
            for (let line of lines) {
                line = line.trim();
                if (!line) continue;
                
                // Check for sub-section patterns like (a), (b), (c) or (1), (2), (3)
                if (/^\([a-z]\)/.test(line) || /^\(\d+\)/.test(line)) {
                    // This is a sub-section
                    html += `<div class="ref-sub-section">${line}</div>`;
                } else if (/^\([a-z]\)/.test(line) || /^\(\d+\)/.test(line)) {
                    html += `<div class="ref-clause">${line}</div>`;
                } else if (line.startsWith('Explanation') || line.startsWith('Provided')) {
                    // Special paragraphs
                    html += `<div class="ref-special">${line}</div>`;
                } else {
                    // Regular paragraph
                    html += `<p>${line}</p>`;
                }
            }
            
            return html;
        }
        
        return `<p>${content}</p>`;
    }

    // ✅ UPDATED: Find reference and include ALL data
    findReference(refType, refId) {
        if (!window.app) return null;
        
        const moduleInstances = window.app.moduleInstances || {};
        
        for (const [moduleId, instance] of Object.entries(moduleInstances)) {
            if (instance.data) {
                let items = [];
                let moduleName = '';
                
                // Determine which module and get its items
                if (moduleId === 'gst-act' || moduleId === 'cgst-act') {
                    items = instance.data.sections || [];
                    moduleName = instance.data.title || 'GST Act, 2017';
                } else if (moduleId === 'igst-act') {
                    items = instance.data.sections || [];
                    moduleName = instance.data.title || 'IGST Act, 2017';
                } else if (moduleId === 'gst-rules') {
                    items = instance.data.rules || [];
                    moduleName = instance.data.title || 'GST Rules, 2017';
                } else if (moduleId === 'important') {
                    items = instance.data.items || [];
                    moduleName = 'Important Sections & Rules';
                } else if (moduleId === 'customs-act') {
                    items = instance.data.sections || [];
                    moduleName = instance.data.title || 'Customs Act, 1962';
                } else if (moduleId === 'utgst-act') {
                    items = instance.data.sections || [];
                    moduleName = instance.data.title || 'UTGST Act, 2017';
                } else {
                    // Generic fallback
                    items = instance.data.sections || instance.data.rules || instance.data.items || [];
                    moduleName = instance.data.title || moduleId;
                }
                
                // Search for the item
                const found = items.find(item => item.id === refId);
                if (found) {
                    return {
                        content: found.content || 'No content available',
                        heading: found.heading || found.title || 'Untitled',
                        number: found.number || '',
                        references: found.references || [],
                        moduleId: moduleId,
                        moduleName: moduleName
                    };
                }
            }
        }
        return null;
    }

    // ✅ NEW: Format content with better readability
    formatContent(content) {
        if (typeof content === 'string') {
            return content.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('');
        }
        return content || 'No content available';
    }
}
