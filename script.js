import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  // ... sua config aqui
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listarPedidos() {
  const pedidosRef = collection(db, "pedidos");
  const snapshot = await getDocs(pedidosRef);
  const listaPedidos = document.getElementById("listaPedidos");
  listaPedidos.innerHTML = "";

  snapshot.forEach((docItem) => {
    const pedido = docItem.data();
    const div = document.createElement("div");
    div.className = "bg-gray-800 p-4 rounded-lg mb-4";

    let corStatus = "text-green-500";
    if (pedido.status === "Desenvolvendo") corStatus = "text-yellow-500";
    if (pedido.status === "Finalizado") corStatus = "text-red-500";

    div.innerHTML = `
      <p class="font-bold">${pedido.descricao}</p>
      <p>CPF: ${pedido.cpf}</p>
      <p>Status: <span class="${corStatus}">${pedido.status}</span></p>
      ${pedido.nota ? `<p class="text-sm mt-1 text-white/80 italic">Nota: ${pedido.nota}</p>` : ""}
      <button onclick="editarStatus('${docItem.id}', '${pedido.status}')" class="bg-blue-600 text-white px-3 py-1 mt-2 rounded hover:bg-blue-700">Alterar Status</button>
      <button onclick="abrirModalNota('${docItem.id}', ${JSON.stringify(pedido.nota || "")})" class="bg-yellow-500 text-white px-3 py-1 mt-2 ml-2 rounded hover:bg-yellow-600">Editar Nota</button>
    `;
    listaPedidos.appendChild(div);
  });
}

listarPedidos();

window.editarStatus = async function (id, statusAtual) {
  let novoStatus = prompt("Digite o novo status:", statusAtual);
  if (novoStatus) {
    const pedidoRef = doc(db, "pedidos", id);
    await updateDoc(pedidoRef, { status: novoStatus });
    listarPedidos();
  }
};

// --- Funções para editar nota com modal ---
let notaPedidoId = null;

window.abrirModalNota = function (id, notaAtual) {
  notaPedidoId = id;
  document.getElementById("notaTexto").value = notaAtual || "";
  document.getElementById("modalNota").classList.remove("hidden");
};

document.getElementById("cancelarNota").addEventListener("click", () => {
  document.getElementById("modalNota").classList.add("hidden");
  notaPedidoId = null;
});

document.getElementById("salvarNota").addEventListener("click", async () => {
  const novaNota = document.getElementById("notaTexto").value;
  if (notaPedidoId && novaNota !== null) {
    const pedidoRef = doc(db, "pedidos", notaPedidoId);
    await updateDoc(pedidoRef, { nota: novaNota });
    document.getElementById("modalNota").classList.add("hidden");
    notaPedidoId = null;
    listarPedidos();
    alert("Nota salva com sucesso!");
  }
});
