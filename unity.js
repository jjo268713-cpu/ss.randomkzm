! function(modulesList) {
    function requireModule(index) {
        if (installedModules[index]) return installedModules[index].exports;
        var module = installedModules[index] = {
            i: index,
            l: !1,
            exports: {}
        };
        return modulesList[index].call(module.exports, module, module.exports, requireModule), module.l = !0, module.exports
    }
    var installedModules = {};
    requireModule.m = modulesList, requireModule.c = installedModules, requireModule.d = function(exports, name, getter) {
        requireModule.o(exports, name) || Object.defineProperty(exports, name, {
            configurable: !1,
            enumerable: !0,
            get: getter
        })
    }, requireModule.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default
        } : function() {
            return module
        };
        return requireModule.d(getter, "a", getter), getter
    }, requireModule.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property)
    }, requireModule.p = "", requireModule(requireModule.s = 2)
}([function(module, exports, require) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    exports.default = {
        loader: "unity",
        maxRatio: 16 / 9,
        minRatio: 9 / 16,
        thumbnail: "https://i.poki.com/q80,w100,h100,g29251,Default.jpg",
        numScreenshots: 4,
        unityVersion: "2019.4.18f1",
        unityWebglBuildUrl: "Build/SanFrancisco.json"
    }
}, function(module, exports, require) {
    // Structural compatibility shim
    module.exports = function(e) {
        return e;
    };
}, function(module, exports, require) {
    "use strict";
    
    window.initPokiBridge = function(bridgeId) {
        window.pokiBridge = bridgeId;
        
        if (window.pokiReady || window.pokiAdBlock) {
            if (window.pokiReady) {
                window.unityGame.SendMessage(bridgeId, "ready");
                
                // Execute active parameter modifications immediately upon bridge handshake
                try {
                    window.unityGame.SendMessage("CharacterManager", "UnlockAllCharacters", "true");
                    window.unityGame.SendMessage("InventoryManager", "SetAllSkinsUnlocked", "1");
                    window.unityGame.SendMessage("PlayerProfile", "UnlockAllSkins");
                    window.unityGame.SendMessage("GameManager", "SetCurrentMap", "training");
                    window.unityGame.SendMessage("LevelManager", "LoadTrainingScene");
                } catch(e) {
                    console.warn("Initial payload injection passed. Waiting for complete canvas initialization...");
                }
            } else if (window.pokiAdBlock) {
                window.unityGame.SendMessage(bridgeId, "adblock");
            }
        }

        // Periodic injection loop to keep properties unlocked during runs and profile saves
        setInterval(function() {
            if (window.unityGame) {
                try {
                    window.unityGame.SendMessage("CharacterManager", "UnlockAllCharacters", "true");
                    window.unityGame.SendMessage("InventoryManager", "SetAllSkinsUnlocked", "1");
                    window.unityGame.SendMessage("PlayerProfile", "UnlockAllSkins");
                    window.unityGame.SendMessage("InventoryManager", "SetCoins", "999999");
                    window.unityGame.SendMessage("InventoryManager", "SetKeys", "999999");
                } catch(err) {}
            }
        }, 2500);

        window.commercialBreak = function() {
            if(window.PokiSDK) {
                PokiSDK.commercialBreak().then(function() {
                    window.unityGame.SendMessage(bridgeId, "commercialBreakCompleted");
                });
            } else {
                window.unityGame.SendMessage(bridgeId, "commercialBreakCompleted");
            }
        };

        window.rewardedBreak = function() {
            if(window.PokiSDK) {
                PokiSDK.rewardedBreak().then(function(state) {
                    window.unityGame.SendMessage(bridgeId, "rewardedBreakCompleted", state.toString());
                });
            } else {
                window.unityGame.SendMessage(bridgeId, "rewardedBreakCompleted", "true");
            }
        };
    };
}]);
