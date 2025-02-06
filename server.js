const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const HUE_BRIDGE_IP = process.env.HUE_BRIDGE_IP;
const HUE_API_KEY = process.env.HUE_API_KEY;

// Route pour récupérer l'état des lumières
app.get("/hue/lights", async (req, res) => {
  try {
    const response = await axios.get(
      `http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}/lights`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erreur de connexion à Hue" });
  }
});

// Route pour allumer/éteindre une lumière
app.post("/hue/lights/:id", async (req, res) => {
  const lightId = req.params.id;
  const { on } = req.body;
  
  try {
    await axios.put(
      `http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}/lights/${lightId}/state`,
      { on }
    );
    res.json({ success: true, message: `Lumière ${lightId} mise à jour` });
  } catch (error) {
    res.status(500).json({ error: "Impossible de modifier la lumière" });
  }
});

// Route pour changer la couleur (en HSV)
app.post("/hue/lights/:id/color", async (req, res) => {
  const lightId = req.params.id;
  const { hue, sat, bri } = req.body; // Hue: 0-65535, Saturation: 0-254, Brightness: 0-254

  try {
    await axios.put(
      `http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}/lights/${lightId}/state`,
      { hue, sat, bri }
    );
    res.json({ success: true, message: `Couleur de la lumière ${lightId} modifiée` });
  } catch (error) {
    res.status(500).json({ error: "Impossible de changer la couleur" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});
