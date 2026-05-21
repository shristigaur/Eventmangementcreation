const startServer = async () => {
  try {
    await import('./backend/src/server.js');
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();