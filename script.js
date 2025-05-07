// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDepprbeNpba8COCLSkAH0xXA3nIqvlUHg",
  authDomain: "painel-gabrieltec-6420b.firebaseapp.com",
  projectId: "painel-gabrieltec-6420b",
  storageBucket: "painel-gabrieltec-6420b.firebasestorage.app",
  messagingSenderId: "919129799689",
  appId: "1:919129799689:web:b8a3fb4049cd201e7a0cd8"
};

// Inicializando o Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Função para Login Admin
document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
  e.preventDefault(); // Evita o reload da página ao submeter o formulário de login

  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  // Realiza o login do admin
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('Admin logado com sucesso:', user);

      // Ocultar a tela de login e mostrar o painel de administração
      document.getElementById("login").classList.add("hidden");
      document.getElementById("adminPanel").classList.remove("hidden");

      listarPedidos(); // Carregar os pedidos ao fazer login
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert('Erro ao fazer login: ' + errorMessage); // Mostra o erro se falhar
    });
});

// Função para listar pedidos do banco
async function listarPedidos() {
  const pedidosRef = db.collection("pedidos");
  const querySnapshot = await pedidosRef.get();
  const pedidoLista = document.getElementById("pedidoLista");
  pedidoLista.innerHTML = ""; // Limpar a lista antes de adicionar os novos pedidos

  querySnapshot.forEach((doc) => {
    const pedido = doc.data();
    const pedidoElement = document.createElement("div");
    pedidoElement.classList.add("p-4", "bg-gray-800", "rounded-lg");

    // Definir a cor do status
    let statusColor;
    switch (pedido.status) {
      case 'Em Aberto':
        statusColor = 'text-green-500'; // Verde
        break;
      case 'Em Teste':
        statusColor = 'text-orange-500'; // Laranja
        break;
      case 'Entregue':
        statusColor = 'text-red-500'; // Vermelho
        break;
      default:
        statusColor = 'text-gray-400'; // Cor padrão para outros status
        break;
    }

    pedidoElement.innerHTML = `
      <h3 class="font-bold">${pedido.titulo}</h3>
      <p>CPF: ${pedido.cpf}</p>
      <p>Status: <span class="${statusColor}">${pedido.status}</span></p>
      <p>Data de Entrega: ${pedido.dataEntrega}</p>
      <p>Observações: ${pedido.observacoes}</p>
      <button onclick="editarStatus('${doc.id}')" class="btn-blue mt-2">Alterar Status</button>
    `;

    pedidoLista.appendChild(pedidoElement);
  });
}


// Função para editar o status de um pedido
async function editarStatus(pedidoId) {
  const novoStatus = prompt("Digite o novo status (Ex: Em aberto, Finalizado, etc.):");

  if (novoStatus) {
    const pedidoRef = db.collection("pedidos").doc(pedidoId);
    await pedidoRef.update({
      status: novoStatus
    });

    alert("Status atualizado!");
    listarPedidos(); // Atualiza a lista de pedidos
  }
  document.addEventListener("DOMContentLoaded", () => {
  // Código do Firebase e login aqui

  // Função para login do Admin
  document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    // Realiza o login do admin
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Admin logado com sucesso:', user);

        // Esconder a tela de login e mostrar o painel de administração
        document.getElementById("login").classList.add("hidden");
        document.getElementById("adminPanel").classList.remove("hidden");

        listarPedidos(); // Carregar os pedidos ao fazer login
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert('Erro ao fazer login: ' + errorMessage); // Exibe o erro se falhar
      });
  });
});

}
