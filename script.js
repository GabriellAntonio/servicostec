import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDepprbeNpba8COCLSkAH0xXA3nIqvlUHg",
  authDomain: "painel-gabrieltec-6420b.firebaseapp.com",
  projectId: "painel-gabrieltec-6420b",
  storageBucket: "painel-gabrieltec-6420b.appspot.com",
  messagingSenderId: "919129799689",
  appId: "1:919129799689:web:b8a3fb4049cd201e7a0cd8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Admin Login
document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("login").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
  } catch (error) {
    alert("Erro no login do admin: " + error.message);
  }
});

// Cliente Login
document.getElementById("clientLoginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const cpf = document.getElementById("clientCPF").value;
  try {
    const q = query(collection(db, "pedidos"), where("cpf", "==", cpf));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      alert("Nenhum pedido encontrado para este CPF.");
    } else {
      document.getElementById("login").classList.add("hidden");
      document.getElementById("clientPanel").classList.remove("hidden");
      const lista = document.getElementById("pedidoLista");
      snapshot.forEach(doc => {
        const data = doc.data();
        const card = document.createElement("div");
        card.className = "bg-gray-800 p-4 rounded border border-gray-700";
        card.innerHTML = `
          <h3 class="text-lg font-bold mb-1">${data.titulo}</h3>
          <p><strong>Status:</strong> ${data.status}</p>
          <p><strong>Entrega:</strong> ${data.dataEntrega || "-"}</p>
          <p><strong>Obs.:</strong> ${data.observacoes || "-"}</p>
          ${data.arquivo ? `<a href="${data.arquivo}" target="_blank" class="text-blue-400 underline">Ver arquivo</a>` : ""}
        `;
        lista.appendChild(card);
      });
    }
  } catch (error) {
    alert("Erro ao buscar pedidos: " + error.message);
  }
});

// Cadastrar pedido
document.getElementById("pedidoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const cpf = document.getElementById("cpf").value;
  const status = document.getElementById("status").value;
  const dataEntrega = document.getElementById("dataEntrega").value;
  const observacoes = document.getElementById("observacoes").value;
  const arquivo = document.getElementById("arquivo").files[0];

  let url = "";
  if (arquivo) {
    const storageRef = ref(storage, `arquivos/${Date.now()}-${arquivo.name}`);
    const snapshot = await uploadBytes(storageRef, arquivo);
    url = await getDownloadURL(snapshot.ref);
  }

  await addDoc(collection(db, "pedidos"), {
    titulo,
    cpf,
    status,
    dataEntrega,
    observacoes,
    arquivo: url || null,
    criadoEm: new Date()
  });

  alert("Pedido cadastrado com sucesso!");
  document.getElementById("pedidoForm").reset();
});
