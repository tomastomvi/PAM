// Sistema de Login
class LoginSystem {
  constructor(firebaseService) {
    this.firebaseService = firebaseService;
    this.init();
  }

  init() {
    this.createLoginModal();
    this.setupEventListeners();
    this.checkAuthState();
  }

  createLoginModal() {
    const modalHTML = `
      <div id="login-modal" class="modal">
        <div class="modal-content">
          <div class="login-container">
            <h2>Pokémon Login</h2>
            <form id="login-form">
              <div class="input-group">
                <label for="email">Email:</label>
                <input type="email" id="email" required>
              </div>
              <div class="input-group">
                <label for="password">Senha:</label>
                <input type="password" id="password" required>
              </div>
              <button type="submit" class="login-btn">Entrar</button>
            </form>
            <div class="login-options">
              <button id="show-register" class="switch-btn">Criar Conta</button>
              <button id="guest-btn" class="guest-btn">Entrar como Visitante</button>
            </div>
            <div id="login-message" class="message"></div>
          </div>

          <div class="register-container" style="display: none;">
            <h2>Criar Conta</h2>
            <form id="register-form">
              <div class="input-group">
                <label for="reg-email">Email:</label>
                <input type="email" id="reg-email" required>
              </div>
              <div class="input-group">
                <label for="reg-password">Senha:</label>
                <input type="password" id="reg-password" required minlength="6">
              </div>
              <div class="input-group">
                <label for="reg-confirm-password">Confirmar Senha:</label>
                <input type="password" id="reg-confirm-password" required>
              </div>
              <button type="submit" class="register-btn">Criar Conta</button>
            </form>
            <div class="register-options">
              <button id="show-login" class="switch-btn">Já tenho conta</button>
            </div>
            <div id="register-message" class="message"></div>
          </div>
        </div>
      </div>

      <div id="user-bar" class="user-bar" style="display: none;">
        <span id="user-email"></span>
        <button id="logout-btn" class="logout-btn">Sair</button>
      </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', modalHTML);
  }

  setupEventListeners() {
    // Forms
    document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));
    
    // Botões de alternância
    document.getElementById('show-register').addEventListener('click', () => this.showRegister());
    document.getElementById('show-login').addEventListener('click', () => this.showLogin());
    document.getElementById('guest-btn').addEventListener('click', () => this.enterAsGuest());
    document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());

    // Fechar modal clicando fora
    document.getElementById('login-modal').addEventListener('click', (e) => {
      if (e.target.id === 'login-modal') {
        this.closeModal();
      }
    });
  }

  showLogin() {
    document.querySelector('.login-container').style.display = 'block';
    document.querySelector('.register-container').style.display = 'none';
  }

  showRegister() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.register-container').style.display = 'block';
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('login-message');

    try {
      messageEl.textContent = 'Entrando...';
      messageEl.className = 'message info';
      
      await this.firebaseService.fazerLogin(email, password);
      this.closeModal();
      this.showUserBar(email);
      
    } catch (error) {
      messageEl.textContent = this.getErrorMessage(error.code);
      messageEl.className = 'message error';
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const messageEl = document.getElementById('register-message');

    if (password !== confirmPassword) {
      messageEl.textContent = 'As senhas não coincidem!';
      messageEl.className = 'message error';
      return;
    }

    if (password.length < 6) {
      messageEl.textContent = 'A senha deve ter pelo menos 6 caracteres!';
      messageEl.className = 'message error';
      return;
    }

    try {
      messageEl.textContent = 'Criando conta...';
      messageEl.className = 'message info';
      
      await this.firebaseService.criarUsuario(email, password);
      messageEl.textContent = 'Conta criada com sucesso! Redirecionando...';
      messageEl.className = 'message success';
      
      setTimeout(() => {
        this.closeModal();
        this.showUserBar(email);
      }, 2000);
      
    } catch (error) {
      messageEl.textContent = this.getErrorMessage(error.code);
      messageEl.className = 'message error';
    }
  }

  async handleLogout() {
    try {
      await this.firebaseService.fazerLogout();
      this.hideUserBar();
      this.showModal();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  enterAsGuest() {
    this.closeModal();
    this.showUserBar('Visitante');
  }

  checkAuthState() {
    this.firebaseService.observarAuthState((user) => {
      if (user) {
        this.closeModal();
        this.showUserBar(user.email);
      } else {
        this.showModal();
        this.hideUserBar();
      }
    });
  }

  showModal() {
    document.getElementById('login-modal').style.display = 'flex';
  }

  closeModal() {
    document.getElementById('login-modal').style.display = 'none';
    this.clearForms();
  }

  showUserBar(email) {
    document.getElementById('user-email').textContent = `Bem-vindo, ${email}`;
    document.getElementById('user-bar').style.display = 'flex';
  }

  hideUserBar() {
    document.getElementById('user-bar').style.display = 'none';
  }

  clearForms() {
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    document.getElementById('login-message').textContent = '';
    document.getElementById('register-message').textContent = '';
  }

  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/invalid-email': 'Email inválido!',
      'auth/user-disabled': 'Esta conta foi desativada!',
      'auth/user-not-found': 'Usuário não encontrado!',
      'auth/wrong-password': 'Senha incorreta!',
      'auth/email-already-in-use': 'Este email já está em uso!',
      'auth/weak-password': 'A senha é muito fraca!',
      'auth/network-request-failed': 'Erro de conexão!'
    };
    
    return errorMessages[errorCode] || 'Erro desconhecido!';
  }
}

// Inicializar sistema de login quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new LoginSystem(firebaseServiceInstance);
});