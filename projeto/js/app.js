// Elementos DOM
const homeBtn = document.getElementById('home-btn');
const infoBtn = document.getElementById('info-btn');
const themeBtn = document.getElementById('theme-btn');
const installButton = document.getElementById('install-button');
const infoPage = document.getElementById('info-page');
const content = document.querySelector('.content');
const confirmationModal = document.getElementById('confirmation-modal');
const pokemonName = document.getElementById('pokemon-name');
const confirmChoice = document.getElementById('confirm-choice');
const cancelChoice = document.getElementById('cancel-choice');
const backToHome = document.getElementById('back-to-home');
const body = document.body;

// Variáveis para controle de estado
let deferredPrompt;
let selectedPokemon = '';

// Inicialização da aplicação
function initApp() {
    setupNavigation();
    setupPokemonInteractions();
    setupPWA();
    setupThemeChanger();
}

// Configuração da navegação
function setupNavigation() {
    homeBtn.addEventListener('click', () => {
        infoPage.style.display = 'none';
        content.style.display = 'flex';
    });

    infoBtn.addEventListener('click', () => {
        content.style.display = 'none';
        infoPage.style.display = 'block';
    });

    backToHome.addEventListener('click', () => {
        infoPage.style.display = 'none';
        content.style.display = 'flex';
    });
}

// Configuração das interações com Pokémon
function setupPokemonInteractions() {
    document.querySelectorAll('.pk, .pk2, .pk3').forEach(pokemon => {
        pokemon.addEventListener('click', (e) => {
            e.preventDefault();
            selectedPokemon = e.currentTarget.getAttribute('data-pokemon');
            pokemonName.textContent = selectedPokemon;
            confirmationModal.style.display = 'flex';
        });
    });

    confirmChoice.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        alert(`Parabéns! Você escolheu ${selectedPokemon} como seu Pokémon inicial!`);
        window.open(`https://pokemondb.net/pokedex/${selectedPokemon.toLowerCase()}`, '_blank');
    });

    cancelChoice.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
    });
}

// Configuração do PWA
function setupPWA() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installButton.style.display = 'block';
    });

    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                installButton.style.display = 'none';
            }
            deferredPrompt = null;
        }
    });

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Configuração do trocador de temas
function setupThemeChanger() {
    themeBtn.addEventListener('click', () => {
        const themes = [
            '048dc3426e3c4560aaf659643560856f.png',
            'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/80ff523f-ff84-457c-a9ac-81a2d7f99b4d/d6vq7j5-8c8c9a9a-5e5d-4c9b-8c8c-9a9a5e5d4c9b.jpg'
        ];
        const currentBg = body.style.backgroundImage;
        const currentIndex = themes.findIndex(theme => currentBg.includes(theme));
        const nextIndex = (currentIndex + 1) % themes.length;
        body.style.backgroundImage = `url(${themes[nextIndex]})`;
    });
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initApp);


// No final do arquivo app.js, adicione:
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const isGuest = urlParams.get('guest');
    
    if (isGuest === 'true') {
        // Simular login como visitante
        document.body.classList.add('user-logged-in');
        // Você pode adicionar mais lógica para modo visitante aqui
    }
}

// E modifique a inicialização:
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    checkURLParams();
});