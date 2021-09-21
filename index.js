"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
var nedb_promises_1 = __importDefault(require("nedb-promises"));
var events_1 = require("events");
var ONE_DAY = 86400000;
var TWO_WEEKS = 14 * ONE_DAY;
/**
 * Create a new session store, backed by an NeDB datastore
 * @param {DatastoreOptions}   options                        Primarily a subset of the options from https://github.com/louischatriot/nedb#creatingloading-a-database
 * @param {Function}           options.connect                Connect Connect-compatible session middleware (e.g. Express, express-session)
 * @param {Number}             options.defaultExpiry          The default expiry period (max age) in milliseconds to use if the session's expiry is not controlled by the session cookie configuration. Default: 2 weeks.
 * @param {Boolean}            options.inMemoryOnly           The datastore will be in-memory only. Overrides `options.filename`.
 * @param {String}             options.filename               Relative file path where session data will be persisted; if none, a default of 'data/sessions.db' will be used.
 * @param {Function}           options.afterSerialization     Optional serialization callback invoked before writing to file, e.g. for encrypting data.
 * @param {Function}           options.beforeDeserialization  Optional deserialization callback invoked after reading from file, e.g. for decrypting data.
 * @param {Number}             options.corruptAlertThreshold  Optional threshold after which an error is thrown if too much data read from file is corrupt. Default: 0.1 (10%).
 * @param {Number}             options.autoCompactInterval    Optional interval in milliseconds at which to auto-compact file-based datastores. Valid range is 5000ms to 1 day. Pass `null` to disable.
 * @param {Function}           options.onload                 Optional callback to be invoked when the datastore is loaded and ready.
 * @returns {Store}  your new Store
 */
var makeStore = function (options) {
    var _a, _b;
    var defaultExpiry = (_a = options.defaultExpiry) !== null && _a !== void 0 ? _a : TWO_WEEKS;
    var datastore = nedb_promises_1["default"].create(__assign(__assign(__assign({}, options), { autoload: true, timestampData: true, onload: function (error) {
            if (error) {
                store.emit('error', error);
            }
            store.emit((error ? 'dis' : '') + "connect");
            if (options.onload)
                options.onload(error);
        } }), (options.inMemoryOnly ? {
        afterSerialization: undefined,
        beforeDeserialization: undefined,
        corruptAlertThreshold: undefined
    } : {})));
    if (options.filename && options.autoCompactInterval) {
        // autoCompactInterval in the region [5000, ONE_DAY]
        var autoCompactInterval = Math.min(Math.max(options.autoCompactInterval, 5000), ONE_DAY);
        datastore.persistence.setAutocompactionInterval(autoCompactInterval);
    }
    var parentStore = ((_b = options.connect.Store) !== null && _b !== void 0 ? _b : options.connect.session.Store).prototype;
    var store = __assign(__assign(__assign({}, events_1.EventEmitter.prototype), parentStore), { set: function (sid, session, callback) { return __awaiter(void 0, void 0, void 0, function () {
            var expirationDate, sess, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expirationDate = ((_a = session === null || session === void 0 ? void 0 : session.cookie) === null || _a === void 0 ? void 0 : _a.expires)
                            ? new Date(session.cookie.expires)
                            : new Date(Date.now() + defaultExpiry);
                        sess = __assign({}, session);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, datastore.update({ _id: sid }, { $set: { session: sess, expiresAt: expirationDate } }, { multi: false, upsert: true })];
                    case 2:
                        _b.sent();
                        if (callback)
                            callback();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        if (callback)
                            callback(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); }, touch: function (sid, session, callback) { return __awaiter(void 0, void 0, void 0, function () {
            var touchSetOp;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        touchSetOp = __assign({ updatedAt: new Date() }, (((_a = session === null || session === void 0 ? void 0 : session.cookie) === null || _a === void 0 ? void 0 : _a.expires) ? { expiresAt: new Date(session.cookie.expires) } : {}));
                        return [4 /*yield*/, datastore.update({ _id: sid }, { $set: touchSetOp }, { multi: false, upsert: false })];
                    case 1:
                        _b.sent();
                        if (callback)
                            callback();
                        return [2 /*return*/];
                }
            });
        }); }, get: function (sid, callback) { return __awaiter(void 0, void 0, void 0, function () {
            var doc, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, datastore.findOne({ _id: sid })];
                    case 1:
                        doc = _a.sent();
                        if (doc != null) {
                            if ((doc.session && !doc.expiresAt) || new Date() < doc.expiresAt) {
                                return [2 /*return*/, callback(null, doc.session)];
                            }
                            return [2 /*return*/, store.destroy(sid, function (error) { callback(error, null); })];
                        }
                        callback(null);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        callback(error_2, null);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, all: function (callback) { return __awaiter(void 0, void 0, void 0, function () {
            var existingDocs, sessions, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, datastore.find({})];
                    case 1:
                        existingDocs = _a.sent();
                        sessions = existingDocs.reduce(function (accumulator, doc) {
                            if ((doc.session && !doc.expiresAt) || new Date() < doc.expiresAt) {
                                accumulator.push(doc.session);
                            }
                            store.destroy(doc._id, function (error) { return error && store.emit('error', error); });
                            return accumulator;
                        }, []);
                        callback(null, sessions);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        callback(error_3, null);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, length: function (callback) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (store.all != null) {
                    store.all(function (err, sessions) {
                        callback(err, sessions.length);
                    });
                }
                return [2 /*return*/];
            });
        }); }, destroy: function (sid, callback) { return __awaiter(void 0, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, datastore.remove({ _id: sid }, { multi: false })];
                    case 1:
                        _a.sent();
                        if (callback)
                            callback();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        if (callback)
                            callback(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, clear: function (callback) { return __awaiter(void 0, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, datastore.remove({}, { multi: this })];
                    case 1:
                        _a.sent();
                        if (callback)
                            callback();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        if (callback)
                            callback(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); } });
    return store;
};
exports["default"] = makeStore;
