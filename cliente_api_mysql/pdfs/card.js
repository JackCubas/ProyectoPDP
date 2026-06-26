(() => {
  // ../node_modules/@web-eid/web-eid-library/models/Action.js
  var Action;
  (function(Action2) {
    Action2["WARNING"] = "web-eid:warning";
    Action2["STATUS"] = "web-eid:status";
    Action2["STATUS_ACK"] = "web-eid:status-ack";
    Action2["STATUS_SUCCESS"] = "web-eid:status-success";
    Action2["STATUS_FAILURE"] = "web-eid:status-failure";
    Action2["AUTHENTICATE"] = "web-eid:authenticate";
    Action2["AUTHENTICATE_ACK"] = "web-eid:authenticate-ack";
    Action2["AUTHENTICATE_SUCCESS"] = "web-eid:authenticate-success";
    Action2["AUTHENTICATE_FAILURE"] = "web-eid:authenticate-failure";
    Action2["GET_SIGNING_CERTIFICATE"] = "web-eid:get-signing-certificate";
    Action2["GET_SIGNING_CERTIFICATE_ACK"] = "web-eid:get-signing-certificate-ack";
    Action2["GET_SIGNING_CERTIFICATE_SUCCESS"] = "web-eid:get-signing-certificate-success";
    Action2["GET_SIGNING_CERTIFICATE_FAILURE"] = "web-eid:get-signing-certificate-failure";
    Action2["SIGN"] = "web-eid:sign";
    Action2["SIGN_ACK"] = "web-eid:sign-ack";
    Action2["SIGN_SUCCESS"] = "web-eid:sign-success";
    Action2["SIGN_FAILURE"] = "web-eid:sign-failure";
  })(Action || (Action = {}));
  var Action_default = Action;

  // ../node_modules/@web-eid/web-eid-library/errors/ErrorCode.js
  var ErrorCode;
  (function(ErrorCode2) {
    ErrorCode2["ERR_WEBEID_ACTION_TIMEOUT"] = "ERR_WEBEID_ACTION_TIMEOUT";
    ErrorCode2["ERR_WEBEID_USER_TIMEOUT"] = "ERR_WEBEID_USER_TIMEOUT";
    ErrorCode2["ERR_WEBEID_VERSION_MISMATCH"] = "ERR_WEBEID_VERSION_MISMATCH";
    ErrorCode2["ERR_WEBEID_VERSION_INVALID"] = "ERR_WEBEID_VERSION_INVALID";
    ErrorCode2["ERR_WEBEID_EXTENSION_UNAVAILABLE"] = "ERR_WEBEID_EXTENSION_UNAVAILABLE";
    ErrorCode2["ERR_WEBEID_NATIVE_UNAVAILABLE"] = "ERR_WEBEID_NATIVE_UNAVAILABLE";
    ErrorCode2["ERR_WEBEID_UNKNOWN_ERROR"] = "ERR_WEBEID_UNKNOWN_ERROR";
    ErrorCode2["ERR_WEBEID_CONTEXT_INSECURE"] = "ERR_WEBEID_CONTEXT_INSECURE";
    ErrorCode2["ERR_WEBEID_USER_CANCELLED"] = "ERR_WEBEID_USER_CANCELLED";
    ErrorCode2["ERR_WEBEID_NATIVE_INVALID_ARGUMENT"] = "ERR_WEBEID_NATIVE_INVALID_ARGUMENT";
    ErrorCode2["ERR_WEBEID_NATIVE_FATAL"] = "ERR_WEBEID_NATIVE_FATAL";
    ErrorCode2["ERR_WEBEID_ACTION_PENDING"] = "ERR_WEBEID_ACTION_PENDING";
    ErrorCode2["ERR_WEBEID_MISSING_PARAMETER"] = "ERR_WEBEID_MISSING_PARAMETER";
  })(ErrorCode || (ErrorCode = {}));
  var ErrorCode_default = ErrorCode;

  // ../node_modules/@web-eid/web-eid-library/errors/MissingParameterError.js
  var MissingParameterError = class extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_MISSING_PARAMETER;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/ActionPendingError.js
  var ActionPendingError = class extends Error {
    constructor(message = "same action for Web-eID browser extension is already pending") {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_ACTION_PENDING;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/ActionTimeoutError.js
  var ActionTimeoutError = class extends Error {
    constructor(message = "extension message timeout") {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_ACTION_TIMEOUT;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/ContextInsecureError.js
  var SECURE_CONTEXTS_INFO_URL = "https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts";
  var ContextInsecureError = class extends Error {
    constructor(message = "Secure context required, see " + SECURE_CONTEXTS_INFO_URL) {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_CONTEXT_INSECURE;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/ExtensionUnavailableError.js
  var ExtensionUnavailableError = class extends Error {
    constructor(message = "Web-eID extension is not available") {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_EXTENSION_UNAVAILABLE;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/config.js
  var config_default = Object.freeze({
    VERSION: "2.0.2",
    EXTENSION_HANDSHAKE_TIMEOUT: 1e3,
    NATIVE_APP_HANDSHAKE_TIMEOUT: 5 * 1e3,
    DEFAULT_USER_INTERACTION_TIMEOUT: 2 * 60 * 1e3,
    MAX_EXTENSION_LOAD_DELAY: 1e3
    // 1 second
  });

  // ../node_modules/@web-eid/web-eid-library/errors/NativeFatalError.js
  var NativeFatalError = class extends Error {
    constructor(message = "native application terminated with a fatal error") {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_NATIVE_FATAL;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/NativeInvalidArgumentError.js
  var NativeInvalidArgumentError = class extends Error {
    constructor(message = "native application received an invalid argument") {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_NATIVE_INVALID_ARGUMENT;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/NativeUnavailableError.js
  var NativeUnavailableError = class extends Error {
    constructor(message = "Web-eID native application is not available") {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_NATIVE_UNAVAILABLE;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/UnknownError.js
  var UnknownError = class extends Error {
    constructor(message = "an unknown error occurred") {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_UNKNOWN_ERROR;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/UserCancelledError.js
  var UserCancelledError = class extends Error {
    constructor(message = "request was cancelled by the user") {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_USER_CANCELLED;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/UserTimeoutError.js
  var UserTimeoutError = class extends Error {
    constructor(message = "user failed to respond in time") {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_USER_TIMEOUT;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/VersionInvalidError.js
  var VersionInvalidError = class extends Error {
    constructor(message = "invalid version string") {
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_VERSION_INVALID;
    }
  };

  // ../node_modules/@web-eid/web-eid-library/errors/VersionMismatchError.js
  function tmpl(strings, requiresUpdate) {
    return `Update required for Web-eID ${requiresUpdate}`;
  }
  var VersionMismatchError = class extends Error {
    constructor(message, versions, requiresUpdate) {
      if (!message) {
        if (!requiresUpdate) {
          message = "requiresUpdate not provided";
        } else if (requiresUpdate.extension && requiresUpdate.nativeApp) {
          message = tmpl`${"extension and native app"}`;
        } else if (requiresUpdate.extension) {
          message = tmpl`${"extension"}`;
        } else if (requiresUpdate.nativeApp) {
          message = tmpl`${"native app"}`;
        }
      }
      super(message);
      this.name = this.constructor.name;
      this.code = ErrorCode_default.ERR_WEBEID_VERSION_MISMATCH;
      this.requiresUpdate = requiresUpdate;
      if (versions) {
        const { library, extension, nativeApp } = versions;
        Object.assign(this, { library, extension, nativeApp });
      }
    }
  };

  // ../node_modules/@web-eid/web-eid-library/utils/errorSerializer.js
  var errorCodeToErrorClass = {
    [ErrorCode_default.ERR_WEBEID_ACTION_PENDING]: ActionPendingError,
    [ErrorCode_default.ERR_WEBEID_ACTION_TIMEOUT]: ActionTimeoutError,
    [ErrorCode_default.ERR_WEBEID_CONTEXT_INSECURE]: ContextInsecureError,
    [ErrorCode_default.ERR_WEBEID_EXTENSION_UNAVAILABLE]: ExtensionUnavailableError,
    [ErrorCode_default.ERR_WEBEID_NATIVE_INVALID_ARGUMENT]: NativeInvalidArgumentError,
    [ErrorCode_default.ERR_WEBEID_NATIVE_FATAL]: NativeFatalError,
    [ErrorCode_default.ERR_WEBEID_NATIVE_UNAVAILABLE]: NativeUnavailableError,
    [ErrorCode_default.ERR_WEBEID_USER_CANCELLED]: UserCancelledError,
    [ErrorCode_default.ERR_WEBEID_USER_TIMEOUT]: UserTimeoutError,
    [ErrorCode_default.ERR_WEBEID_VERSION_INVALID]: VersionInvalidError,
    [ErrorCode_default.ERR_WEBEID_VERSION_MISMATCH]: VersionMismatchError
  };
  function deserializeError(errorObject) {
    let error;
    if (typeof errorObject.code == "string" && errorObject.code in errorCodeToErrorClass) {
      const CustomError = errorCodeToErrorClass[errorObject.code];
      error = new CustomError();
    } else {
      error = new UnknownError();
    }
    for (const [key, value] of Object.entries(errorObject)) {
      error[key] = value;
    }
    return error;
  }

  // ../node_modules/@web-eid/web-eid-library/services/WebExtensionService.js
  var WebExtensionService = class {
    constructor() {
      this.loggedWarnings = [];
      this.queue = [];
      window.addEventListener("message", (event) => this.receive(event));
    }
    receive(event) {
      var _a, _b, _c, _d, _e, _f;
      if (!/^web-eid:/.test((_a = event.data) === null || _a === void 0 ? void 0 : _a.action))
        return;
      const message = event.data;
      const suffix = (_c = (_b = message.action) === null || _b === void 0 ? void 0 : _b.match(/success$|failure$|ack$/)) === null || _c === void 0 ? void 0 : _c[0];
      const initialAction = this.getInitialAction(message.action);
      const pending = this.getPendingMessage(initialAction);
      if (message.action === Action_default.WARNING) {
        (_d = message.warnings) === null || _d === void 0 ? void 0 : _d.forEach((warning) => {
          if (!this.loggedWarnings.includes(warning)) {
            this.loggedWarnings.push(warning);
            console.warn(warning.replace(/\n|\r/g, ""));
          }
        });
      } else if (pending) {
        switch (suffix) {
          case "ack": {
            clearTimeout(pending.ackTimer);
            break;
          }
          case "success": {
            this.removeFromQueue(initialAction);
            (_e = pending.resolve) === null || _e === void 0 ? void 0 : _e.call(pending, message);
            break;
          }
          case "failure": {
            const failureMessage = message;
            this.removeFromQueue(initialAction);
            (_f = pending.reject) === null || _f === void 0 ? void 0 : _f.call(pending, failureMessage.error ? deserializeError(failureMessage.error) : failureMessage);
            break;
          }
        }
      }
    }
    send(message, timeout) {
      if (this.getPendingMessage(message.action)) {
        return Promise.reject(new ActionPendingError());
      } else if (!window.isSecureContext) {
        return Promise.reject(new ContextInsecureError());
      } else {
        const pending = { message };
        this.queue.push(pending);
        pending.promise = new Promise((resolve, reject) => {
          pending.resolve = resolve;
          pending.reject = reject;
        });
        pending.ackTimer = window.setTimeout(() => this.onAckTimeout(pending), config_default.EXTENSION_HANDSHAKE_TIMEOUT);
        pending.replyTimer = window.setTimeout(() => this.onReplyTimeout(pending), timeout);
        window.postMessage(message, "*");
        return pending.promise;
      }
    }
    onReplyTimeout(pending) {
      var _a;
      this.removeFromQueue(pending.message.action);
      (_a = pending.reject) === null || _a === void 0 ? void 0 : _a.call(pending, new ActionTimeoutError());
    }
    onAckTimeout(pending) {
      var _a;
      clearTimeout(pending.replyTimer);
      this.removeFromQueue(pending.message.action);
      (_a = pending.reject) === null || _a === void 0 ? void 0 : _a.call(pending, new ExtensionUnavailableError());
    }
    getPendingMessage(action) {
      return this.queue.find((pm) => {
        return pm.message.action === action;
      });
    }
    getInitialAction(action) {
      return action.replace(/-success$|-failure$|-ack$/, "");
    }
    removeFromQueue(action) {
      const pending = this.getPendingMessage(action);
      clearTimeout(pending === null || pending === void 0 ? void 0 : pending.replyTimer);
      this.queue = this.queue.filter((pending2) => pending2.message.action !== action);
    }
  };

  // ../node_modules/@web-eid/web-eid-library/utils/sleep.js
  function sleep(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), milliseconds);
    });
  }

  // ../node_modules/@web-eid/web-eid-library/web-eid.js
  var webExtensionService = new WebExtensionService();
  var initializationTime = +/* @__PURE__ */ new Date();
  async function extensionLoadDelay() {
    const now = +/* @__PURE__ */ new Date();
    await sleep(initializationTime + config_default.MAX_EXTENSION_LOAD_DELAY - now);
  }
  async function authenticate(challengeNonce, options) {
    await extensionLoadDelay();
    if (!challengeNonce) {
      throw new MissingParameterError("authenticate function requires a challengeNonce");
    }
    const timeout = config_default.EXTENSION_HANDSHAKE_TIMEOUT + config_default.NATIVE_APP_HANDSHAKE_TIMEOUT + ((options === null || options === void 0 ? void 0 : options.userInteractionTimeout) || config_default.DEFAULT_USER_INTERACTION_TIMEOUT);
    const message = {
      action: Action_default.AUTHENTICATE,
      libraryVersion: config_default.VERSION,
      challengeNonce,
      options
    };
    const { unverifiedCertificate, algorithm, signature, format, appVersion } = await webExtensionService.send(message, timeout);
    return {
      unverifiedCertificate,
      algorithm,
      signature,
      format,
      appVersion
    };
  }
  async function getSigningCertificate(options) {
    await extensionLoadDelay();
    const timeout = config_default.EXTENSION_HANDSHAKE_TIMEOUT + config_default.NATIVE_APP_HANDSHAKE_TIMEOUT + ((options === null || options === void 0 ? void 0 : options.userInteractionTimeout) || config_default.DEFAULT_USER_INTERACTION_TIMEOUT) * 2;
    const message = {
      action: Action_default.GET_SIGNING_CERTIFICATE,
      libraryVersion: config_default.VERSION,
      options
    };
    const { certificate, supportedSignatureAlgorithms } = await webExtensionService.send(message, timeout);
    return {
      certificate,
      supportedSignatureAlgorithms
    };
  }
  async function sign(certificate, hash, hashFunction, options) {
    await extensionLoadDelay();
    if (!certificate) {
      throw new MissingParameterError("sign function requires a certificate as parameter");
    }
    if (!hash) {
      throw new MissingParameterError("sign function requires a hash as parameter");
    }
    if (!hashFunction) {
      throw new MissingParameterError("sign function requires a hashFunction as parameter");
    }
    const timeout = config_default.EXTENSION_HANDSHAKE_TIMEOUT + config_default.NATIVE_APP_HANDSHAKE_TIMEOUT + ((options === null || options === void 0 ? void 0 : options.userInteractionTimeout) || config_default.DEFAULT_USER_INTERACTION_TIMEOUT) * 2;
    const message = {
      action: Action_default.SIGN,
      libraryVersion: config_default.VERSION,
      certificate,
      hash,
      hashFunction,
      options
    };
    const { signature, signatureAlgorithm } = await webExtensionService.send(message, timeout);
    return {
      signature,
      signatureAlgorithm
    };
  }
//-------------------------------------------------
var backendUrl = "";
var datosUsuarioATR = null;

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuarioATR = JSON.parse(localStorage.getItem("usuario"));
}

if(localStorage !== null && localStorage.getItem("backendUrl") !== null){
  backendUrl = localStorage.getItem("backendUrl");
}

var lang = "en"

var certButton = document.querySelector("#readCard");
certButton.addEventListener("click", async () => {
  try {
    const { certificate, supportedSignatureAlgorithms } = await getSigningCertificate({ lang });

    //const URLSERVERlecturatarjeta = "http://localhost:3000/lecturaTarjeta";
    const URLSERVERlecturatarjeta = backendUrl + "/lecturaTarjeta";

    const fdUser = {
        fdUserId: datosUsuarioATR.id,
    }

    return fetch(URLSERVERlecturatarjeta, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(fdUser)
    })
    .then((response) => { 
        console.log(response);

        if(response.status === 400 || response.status === 500){
            modalAlert("No se ha podido hacer lectura de tarjeta");
            console.error("No se ha podido hacer lectura de tarjeta");
            window.location.href = "table.html?page=1";
        }else{
            modalAlert("Se ha podido hacer lectura de tarjeta");
            console.info("Se ha podido hacer lectura de tarjeta");
            window.location.href = "table.html?page=1";
        } 

    });
   
    //TODO mostrar el certificado en pantalla?
  } catch (error) {
    console.log("Certificate ATR failed! Error:", error);
  }
});  


})(); 

//-----------------------------------
//-----------------------------------
var backendUrl = "";
var URLSERVERdetail = "";
var datosUsuario = null;

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(localStorage !== null && localStorage.getItem("backendUrl") !== null){
  backendUrl = localStorage.getItem("backendUrl");
  URLSERVERdetail = backendUrl + "/users/";

  //const URLSERVERdetail = "http://localhost:3000/users/";
}

function checkUserHosting() {

    return fetch(URLSERVERdetail + datosUsuario.id)
        .then((response) => { 
            return response.json().then((data) => {
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

function appendData(data){
    var con=document.getElementById("main-container")
    for(let i=0;i<data.length;i++){

        var j=document.createElement("div")
        var estadoATR = "No Existe";
        if(data[i].atrexists === 0){
            estadoATR = "No Existe";
        }
        if(data[i].atrexists === 1){
            estadoATR = "Existe";
        }
        j.textContent="ATR: " + estadoATR                      
        con.appendChild(j);
    }

}


checkUserHosting();


/*async function sendData(){

    const URLSERVERlecturatarjeta = "http://localhost:3000/lecturaTarjeta";


    const fdUser = {
        fdUserId: datosUsuario.id,
    }

    return fetch(URLSERVERlecturatarjeta, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(fdUser)
    })
    .then((response) => { 
        console.log(response);

        if(response.status === 400 || response.status === 500){
            modalAlert("No se ha podido hacer lectura de tarjeta");
            console.error("No se ha podido hacer lectura de tarjeta");
            window.location.href = "table.html?page=1";
        }else{
            modalAlert("Se ha podido hacer lectura de tarjeta");
            console.info("Se ha podido hacer lectura de tarjeta");
            window.location.href = "table.html?page=1";
        } 

    });

}*/
