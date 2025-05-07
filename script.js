import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDepprbeNpba8COCLSkAH0xXA3nIqvlUHg",
  authDomain: "painel-gabrieltec-6420b.firebaseapp.com",
  projectId: "painel-gabrieltec-6420b",
  storageBucket: "painel-gabrieltec-6420b.firebasestorage.app",
  messagingSenderId: "919129799689",
  appId: "1:919129799689:web:b8a3fb4049cd201e7a0cd8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Função para cadastrar pedidos
document.getElementById("pedidoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const cpf = document.getElementById("cpf").value;
  const status = document.getElementById("status").value;
  const dataEntrega = document.getElementById("dataEntrega").value;
  const observacoes = document.getElementById("observacoes").value;

  // Adicionar o pedido no Firestore
  await addDoc(collection(db, "pedidos"), {
    titulo,
    cpf,
    status,
    dataEntrega,
    observacoes
  });

  // Limpar o formulário após salvar
  document.getElementById("pedidoForm").reset();
  alert("Pedido cadastrado com sucesso!");
  listarPedidos();
});

// Função para listar pedidos
async function listarPedidos() {
  const pedidosRef = collection(db, "pedidos");
  const querySnapshot = await getDocs(pedidosRef);
  const pedidoLista = document.getElementById("pedidoLista");
  pedidoLista.innerHTML = ""; // Limpar a lista atual

  querySnapshot.forEach((doc) => {
    const pedido = doc.data();
    const pedidoElement = document.createElement("div");
    pedidoElement.classList.add("p-4", "bg-gray-800", "rounded-lg");

    pedidoElement.innerHTML = `
      <h3 class="font-bold">${pedido.titulo}</h3>
      <p>CPF: ${pedido.cpf}</p>
      <p>Status: ${pedido.status}</p>
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
    const pedidoRef = doc(db, "pedidos", pedidoId);
    await updateDoc(pedidoRef, {
      status: novoStatus
    });

    alert("Status atualizado!");
    listarPedidos(); // Atualiza a lista de pedidos
  }
}

// Carregar pedidos ao acessar o painel admin
listarPedidos();
