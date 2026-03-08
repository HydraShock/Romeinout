const { app, initializeServer } = require('../server/index');

module.exports = async (req, res) => {
  try {
    await initializeServer();
    return app(req, res);
  } catch (error) {
    console.error('Errore inizializzazione API:', error && error.stack ? error.stack : error.message);
    const exposeDetails = String(process.env.API_DEBUG_ERRORS || '').trim().toLowerCase() === 'true';
    return res.status(500).json({
      message: 'Errore interno server.',
      ...(exposeDetails ? { detail: String(error && error.message ? error.message : error) } : {}),
    });
  }
};
