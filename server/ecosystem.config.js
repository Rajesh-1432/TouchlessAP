module.exports = {
    apps: [
      {
        name: 'TouchlessAP',
        script: 'demo.js', 
        env: {
          NODE_ENV: 'production',
          MONGODB_URI: 'mongodb://localhost:27017/', 
        },
      },
    ],
  };
  