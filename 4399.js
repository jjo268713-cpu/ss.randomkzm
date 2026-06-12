var my4399UnityModule = (function() {
    return (function(UnityModule) {
        UnityModule = UnityModule || {};
        var Module = typeof UnityModule !== "undefined" ? UnityModule : {};
        
        Module["preRun"] = Module["preRun"] || [];
        Module["preRun"].push(function() {
            if (!Module.indexedDB) {
                console.log("IndexedDB interface unavailable. State will fall back to local instance allocation.");
            }
            try {
                FS.mkdir("/idbfs");
                FS.mount(IDBFS, {}, "/idbfs");
                Module.addRunDependency("JS_FileSystem_Mount");
                FS.syncfs(true, function(err) {
                    Module.removeRunDependency("JS_FileSystem_Mount");
                });
            } catch(e) {
                console.log("File system initialization skipped or already present.");
            }
        });

        Module["SetFullscreen"] = function(fullscreen) {
            if (typeof runtimeInitialized !== "undefined" && runtimeInitialized && typeof JSEvents !== "undefined") {
                JSEvents.handleCanvasResize(fullscreen);
            }
        };

        // Complete rewrite of Engine Communication Bridge
        function SendMessage(gameObject, func, param) {
            // Intercept internal engine calls trying to switch environments out of training
            if (gameObject === "GameManager" && (func === "LoadScene" || func === "SetCurrentMap")) {
                param = "training";
            }
            if (gameObject === "LevelManager" && func === "ChangeMap") {
                param = "st_training_map";
            }

            if (param === undefined) {
                Module.ccall("SendMessage", null, ["string", "string"], [gameObject, func]);
            } else if (typeof param === "string") {
                Module.ccall("SendMessageString", null, ["string", "string", "string"], [gameObject, func, param]);
            } else if (typeof param === "number") {
                Module.ccall("SendMessageFloat", null, ["string", "string", "number"], [gameObject, func, param]);
            } else {
                throw "" + param + " is not a type supported by the SendMessage compiler interface.";
            }
        }
        Module["SendMessage"] = SendMessage;

        function run() {
            console.log("Interpreted engine runtime initiated successfully.");
        }
        
        Module["abort"] = function(what) {
            console.error("Critical execution encounter aborted: " + what);
            throw "abort(" + what + ")";
        };

        Module["noExitRuntime"] = true;
        run();
        
        return UnityModule;
    });
})();

if (typeof exports === 'object' && typeof module === 'object') module.exports = my4399UnityModule;
else if (typeof define === 'function' && define['amd']) define([], function() { return my4399UnityModule; });
else if (typeof exports === 'object') exports["UnityModule"] = my4399UnityModule;
