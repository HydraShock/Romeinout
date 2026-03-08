const { app, initializeServer } = require('../server/index');

module.exports = async (req, res) => {
  try {
    await initializeServer();
    return app(req, res);
  } catch (error) {
    console.error('Errore inizializzazione API:', error.message);
    return res.status(500).json({ message: 'Errore interno server.' });
  }
};
