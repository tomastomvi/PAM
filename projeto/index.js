// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc2Cp2vWmrWRz24Ab_81iNiH8FA9Ti7Zg",
  authDomain: "calco-ba4b3.firebaseapp.com",
  projectId: "calco-ba4b3",
  storageBucket: "calco-ba4b3.firebasestorage.app",
  messagingSenderId: "604462263549",
  appId: "1:604462263549:web:d325fb6fbaa82c7fe32294",
  measurementId: "G-9MXT9CX96N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log('Firebase inicializado:', app);

class FirebaseService {
  #auth;

  constructor(app) {
    this.#auth = getAuth(app);
  }

  // Criar novo usuário
  async criarUsuario(email, senha) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.#auth, email, senha);
      const user = userCredential.user;
      console.log('Usuário criado com sucesso:', user);
      return user;
    } catch (error) {
      console.error('Erro ao criar usuário:', error.code, error.message);
      throw error;
    }
  }

  // Fazer login
  async fazerLogin(email, senha) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.#auth, email, senha);
      const user = userCredential.user;
      console.log('Usuário logado com sucesso:', user);
      return user;
    } catch (error) {
      console.error('Erro ao fazer login:', error.code, error.message);
      throw error;
    }
  }

  // Fazer logout
  async fazerLogout() {
    try {
      await signOut(this.#auth);
      console.log('Usuário deslogado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  // Observar mudanças de autenticação
  observarAuthState(callback) {
    return onAuthStateChanged(this.#auth, callback);
  }

  // Método para obter a instância do auth
  getAuth() {
    return this.#auth;
  }

  // Verificar se usuário está logado
  getUsuarioAtual() {
    return this.#auth.currentUser;
  }
}

// Cria e exporta uma instância única do serviço
const firebaseServiceInstance = new FirebaseService(app);

// Exportações
export { FirebaseService, firebaseServiceInstance };