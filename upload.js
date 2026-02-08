<script type="module">
import { storage } from "./firebase.js";
import { ref, uploadBytesResumable } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

window.uploadFiles = (files, path) => {
  [...files].forEach(file => {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", snap => {
      const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
      document.getElementById("progress").value = progress;
    });
  });
};
</script>
