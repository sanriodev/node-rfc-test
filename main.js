import { reloadIniFile, RfcLoggingLevel, Server } from 'node-rfc';

reloadIniFile();
const serverConfig = {
  clientConnection: {
    user: 'GUPTA',
    passwd: 'GUPTA1',
    ashost: '192.168.0.73',
    sysnr: '00',
    client: '100',
    dest: 'MME',
  },

  serverConnection: {
    //   gwhost: '192.168.0.73', // Gateway host
    //   gwserv: 'sapgw00', // Gateway service
    //    program_id: 'HT1_RFC_EMATRIC_TEST', // Program ID for registration
    dest: 'MME_GATEWAY',
  },

  // SERVER OPTIONS
  serverOptions: {
    logLevel: RfcLoggingLevel.debug,
  },
};
const server = new Server(serverConfig);

// Define server function
function my_stfc_structure(request_context, abap_input) {
  return {
    ECHOSTRUCT: { RFCINT1: 2, RFCINT2: 6, RFCINT4: 16 },
    RESPTEXT: `~~~ Node server here ~~~`,
  };
}

(async () => {
  try {
    // Register my_stfc_structure as ABAP ZRFC_TEST function module
    await server.addFunction('ZRFC_TEST', my_stfc_structure);

    // Start the server
    await server.start();
  } catch (ex) {
    // Catch errors, if any
    console.error(ex);
  }
})();

// Close the server after 10 seconds - not for production!
let seconds = 10;
const tick = setInterval(() => {
  console.log('tick', --seconds);
  if (!seconds > 0) {
    server.stop(() => {
      clearInterval(tick);
      console.log('bye!');
    });
  }
}, 1000);
