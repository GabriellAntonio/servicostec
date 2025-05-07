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

// Função para login do admin
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Admin logado com sucesso:', user);

        document.getElementById("login").classList.add("hidden");
        document.getElementById("adminPanel").classList.remove("hidden");

        listarPedidos();
      })
      .catch((error) => {
        alert('Erro ao fazer login: ' + error.message);
      });
  });
});

// Função para listar os pedidos
async function listarPedidos() {
  const pedidosRef = db.collection("pedidos");
  const querySnapshot = await pedidosRef.get();
  const pedidoLista = document.getElementById("pedidoLista");
  pedidoLista.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const pedido = doc.data();
    const pedidoElement = document.createElement("div");
    pedidoElement.classList.add("p-4", "bg-gray-800", "rounded-lg", "mb-4");

    // Cor dinâmica do status
    let statusColorClass;
    switch (pedido.status.toLowerCase()) {
      case 'em aberto':
        statusColorClass = 'text-green-400';
        break;
      case 'em teste':
        statusColorClass = 'text-yellow-400';
        break;
      case 'entregue':
        statusColorClass = 'text-red-400';
        break;
      default:
        statusColorClass = 'text-gray-400';
        break;
    }

    pedidoElement.innerHTML = `
      <h3 class="font-bold text-white">${pedido.titulo}</h3>
      <p class="text-white">CPF: ${pedido.cpf}</p>
      <p class="text-white">Status: <span class="${statusColorClass} font-semibold">${pedido.status}</span></p>
      <p class="text-white">Data de Entrega: ${pedido.dataEntrega}</p>
      <p class="text-white">Observações: ${pedido.observacoes}</p>
      <button onclick="editarStatus('${doc.id}')" class="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Alterar Status</button>
    `;

    pedidoLista.appendChild(pedidoElement);
  });
}

// Função para editar o status
async function editarStatus(pedidoId) {
  const novoStatus = prompt("Digite o novo status (Ex: Em Aberto, Em Teste, Entregue):");

  if (novoStatus) {
    const pedidoRef = db.collection("pedidos").doc(pedidoId);
    await pedidoRef.update({ status: novoStatus });

    alert("Status atualizado!");
    listarPedidos();
  }
}
