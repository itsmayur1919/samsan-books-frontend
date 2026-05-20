import { state } from './state.js';

export function setActiveView(viewId) {

    state.currentView = viewId;

    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    document.getElementById(viewId)?.classList.add('active');

    document.querySelectorAll('.nav button').forEach(button => {

        button.classList.remove('active');

        if (button.dataset.view === viewId) {
            button.classList.add('active');
        }
    });
}

export function initializeRouter() {

    document.addEventListener('click', (event) => {

        const button = event.target.closest('[data-view]');

        if (!button) return;

        const viewId = button.dataset.view;

        setActiveView(viewId);
    });
}