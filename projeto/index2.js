  // Elementos DOM
        const homeBtn = document.getElementById('home-btn');
        const infoBtn = document.getElementById('info-btn');
        const themeBtn = document.getElementById('theme-btn');
        const installButton = document.getElementById('install-button');
        const infoPage = document.getElementById('info-page');
        const content = document.querySelector('.content');
        const confirmationModal = document.getElementById('confirmation-modal');
        const modalText = document.getElementById('modal-text');
        const pokemonName = document.getElementById('pokemon-name');
        const confirmChoice = document.getElementById('confirm-choice');
        const cancelChoice = document.getElementById('cancel-choice');
        const body = document.body;

        // Variáveis para controle de estado
        let deferredPrompt;
        let selectedPokemon = '';

        // Navegação entre páginas
        homeBtn.addEventListener('click', () => {
            infoPage.style.display = 'none';
            content.style.display = 'flex';
        });

        infoBtn.addEventListener('click', () => {
            content.style.display = 'none';
            infoPage.style.display = 'block';
        });

        // Alterar tema
        themeBtn.addEventListener('click', () => {
            const themes = [
                '048dc3426e3c4560aaf659643560856f.png',
                'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/80ff523f-ff84-457c-a9ac-81a2d7f99b4d/d6vq7j5-8c8c9a9a-5e5d-4c9b-8c8c-9a9a5e5d4c9b.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzgwZmY1MjNmLWZmODQtNDU3Yy1hOWFjLTgxYTJkN2Y5OWI0ZFwvZDZ2cTdqNS04YzhjOWE5YS01ZTVkLTRjOWItOGM4Yy05YTlhNWU1ZDRjOWIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.7oPqYp9vT4j7Z4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q'
            ];
            const currentBg = body.style.backgroundImage;
            const currentIndex = themes.findIndex(theme => currentBg.includes(theme));
            const nextIndex = (currentIndex + 1) % themes.length;
            body.style.backgroundImage = `url(${themes[nextIndex]})`;
        });

        // Interação com os Pokémon
        document.querySelectorAll('.pk, .pk2, .pk3').forEach(pokemon => {
            pokemon.addEventListener('click', (e) => {
                e.preventDefault();
                const pokemonElement = e.currentTarget;
                selectedPokemon = pokemonElement.querySelector('img').alt;
                pokemonName.textContent = selectedPokemon;
                confirmationModal.style.display = 'flex';
            });
        });

        // Confirmação de escolha
        confirmChoice.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
            alert(`Parabéns! Você escolheu ${selectedPokemon} como seu Pokémon inicial!`);
            // Redirecionar para a página do Pokémon
            window.open(`https://pokemondb.net/pokedex/${selectedPokemon.toLowerCase()}`, '_blank');
        });

        cancelChoice.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });

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