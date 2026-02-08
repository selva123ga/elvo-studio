<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Editor Dashboard | Elvo Studio</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
* { box-sizing: border-box; font-family: Inter, Arial, sans-serif; }

body {
  margin: 0;
  background: radial-gradient(circle at top, #111, #000);
  color: #fff;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.btn {
  background: linear-gradient(135deg,#7c3aed,#9333ea);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
}

.section { padding: 40px; }

.card {
  background: linear-gradient(180deg,#121212,#0a0a0a);
  border-radius: 18px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,.6);
}

.project {
  padding: 14px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.project:last-child { border-bottom: none; }

.small { color: #aaa; font-size: 14px; }

a.upload {
  display: inline-block;
  margin-top: 10px;
  text-decoration: none;
}
</style>
</head>

<body>

<header class="nav">
  <h2>🎧 Editor Dashboard</h2>
  <button class="btn" onclick="logout()">Logout</button>
</header>

<section class="section">
  <div class="card">
    <h3>Your Assigned Projects</h3>
    <div id="projects">Loading...</div>
  </div>
</section>

<script type="module">
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection, query, where, getDocs,
  doc, updateDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const projectsBox = document.getElementById("projects");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  loadProjects(user.uid);
});

async function loadProjects(editorId) {
  const q = query(
    collection(db, "projects"),
    where("editorId", "==", editorId)
  );

  const snap = await getDocs(q);
  projectsBox.innerHTML = "";

  if (snap.empty) {
    projectsBox.innerHTML = "<p class='small'>No projects assigned yet.</p>";
    return;
  }

  snap.forEach(d => {
    const p = d.data();
    projectsBox.innerHTML += `
      <div class="project">
        🎬 <b>${p.title}</b><br>
        <span class="small">Status: ${p.status}</span><br>

        <a class="btn upload"
           href="${p.uploadLink || '#'}"
           target="_blank">
           Upload Final Video
        </a>

        <br><br>
        <button class="btn" onclick="markDone('${d.id}')">
          Mark as Completed
        </button>
      </div>
    `;
  });
}

window.markDone = async (projectId) => {
  await updateDoc(doc(db, "projects", projectId), {
    status: "completed"
  });
  alert("Project marked as completed!");
  location.reload();
};

window.logout = async () => {
  await signOut(auth);
  location.href = "login.html";
};
</script>

</body>
</html>

