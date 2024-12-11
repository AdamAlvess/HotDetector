// Initialisation Firebase
try {
    const firebaseConfig = {
      apiKey: "AIzaSyBjnPu49C2CUjxbzMwl-R_YwAh7sQR0a5o",
      authDomain: "detectchaleur.firebaseapp.com",
      databaseURL: "https://detectchaleur-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "detectchaleur",
      storageBucket: "detectchaleur.firebasestorage.app",
      messagingSenderId: "442494253032",
      appId: "1:442494253032:web:fe6d5c4a7cbc5088fa565d"
    };
  
    const app = firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully.");
  
    const db = firebase.database();
    console.log("Database connection established.");
  
    // DOMContentLoaded pour s'assurer que tout est prêt
    document.addEventListener("DOMContentLoaded", function () {
      const canvas = document.getElementById('heatmapCanvas');
      if (!canvas) {
        console.error("Erreur : Canvas introuvable dans le DOM.");
        return;
      }
  
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("Erreur : Impossible d'obtenir le contexte 2D pour le canvas.");
        return;
      }
  
      const img = new Image();
      img.src = './assets/Armoire.png';
  
      img.onload = function () {
        console.log("Image chargée avec succès :", img.src);
  
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Dessiner l'image sur le canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        // Récupérer les données de la matrice
        const ref = db.ref('sensor-data/matrix');
        ref.once('value', snapshot => {
          const data = snapshot.val();
          console.log("Données récupérées depuis Firebase :", data);
  
          if (!data) {
            console.error("Erreur : Aucune donnée trouvée dans 'sensor-data/matrix'.");
            return;
          }
  
          // Diviser l'image en 8x8
          const cellWidth = canvas.width / 8;
          const cellHeight = canvas.height / 8;
  
          // Dessiner les cercles rouges pour chaque cellule de la matrice
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              const temperature = data[i]?.[j];
  
              if (temperature === undefined) {
                console.warn(`Aucune donnée trouvée pour la cellule [${i}][${j}].`);
                continue;
              }
  
              if (temperature > 29.0) {
                const x = j * cellWidth + cellWidth / 2;
                const y = i * cellHeight + cellHeight / 2;
                console.log(`Dessin d'un cercle à [${i}][${j}] (${x}, ${y}) avec température : ${temperature}`);
                ctx.beginPath();
                ctx.arc(x, y, Math.min(cellWidth, cellHeight) / 4, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.closePath();
              }
            }
          }
        }, error => {
          console.error("Erreur lors de la récupération des données Firebase :", error);
        });
      };
  
      img.onerror = function () {
        console.error("Erreur : Impossible de charger l'image :", img.src);
      };
    });
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Firebase :", error);
  }
  