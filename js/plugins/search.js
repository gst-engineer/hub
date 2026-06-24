export class Search {
    constructor(app) {
        this.app = app;
        this.index = {};
        this.currentHighlights = [];
    }

    indexModule(moduleId, data) {
        this.index[moduleId] = data;
    }

    searchInModule(moduleId, query) {
        this.clearHighlights();
        const data = this.index[moduleId];
        if (!data) return [];

        const results = [];
        const searchTerms = query.toLowerCase().split(' ');
        
        data.forEach(item => {
            const text = (item.title + ' ' + item.content).toLowerCase();
            const match = searchTerms.every(term => text.includes(term));
            if (match) {
                results.push(item);
            }
        });

        this.highlightResults(results, query);
        return results;
    }

    globalSearch(query) {
        if (!query || query.length < 2) {
            this.clearHighlights();
            return;
        }

        let allResults = [];
        Object.keys(this.index).forEach(moduleId => {
            const results = this.searchInModule(moduleId, query);
            results.forEach(r => r.module = moduleId);
            allResults = allResults.concat(results);
        });

        if (allResults.length > 0) {
            this.showSearchResults(allResults);
        }
    }

    highlightResults(results, query) {
        const content = document.getElementById('moduleContent');
        let html = content.innerHTML;
        const terms = query.split(' ').filter(t => t.length > 1);
        
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            html = html.replace(regex, '<span class="search-highlight">$1</span>');
        });

        content.innerHTML = html;
    }

    clearHighlights() {
        const content = document.getElementById('moduleContent');
        if (content) {
            // Remove highlight spans
            content.innerHTML = content.innerHTML.replace(/<span class="search-highlight">(.*?)<\/span>/g, '$1');
        }
    }

    showSearchResults(results) {
        // Show results in a modal or dropdown
        const modal = this.app.modal;
        const resultHtml = results.map(r => `
            <div style="padding:12px;border-bottom:1px solid var(--border-color);">
                <strong>${r.title}</strong>
                <div style="font-size:13px;color:var(--text-muted);margin-top:4px;">
                    ${r.content.substring(0, 150)}${r.content.length > 150 ? '...' : ''}
                </div>
                ${r.module ? `<div style="font-size:12px;color:var(--primary);margin-top:4px;">📂 ${r.module}</div>` : ''}
            </div>
        `).join('');

        modal.show('🔍 Search Results', 
            results.length > 0 ? resultHtml : '<p style="color:var(--text-muted);text-align:center;">No results found</p>'
        );
    }
}
