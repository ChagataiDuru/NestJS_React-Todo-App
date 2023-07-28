"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppClient = void 0;
var readline = require("readline");
var socket_io_client_1 = require("socket.io-client");
var axios_1 = require("axios");
var AppClient = /** @class */ (function () {
    function AppClient(rl) {
        this.rl = rl;
        this.args = process.argv.slice(2);
        this.url = this.args[0] || 'http://localhost:4000';
    }
    AppClient.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var option, _a, todoTitle, todoText, todoDueDate, validDate, timestamp, dateObject, todo, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 15, , 16]);
                        option = '';
                        _b.label = 1;
                    case 1:
                        if (!(option !== '4')) return [3 /*break*/, 14];
                        console.log('Select an option:');
                        console.log('1 - Get all todos');
                        console.log('2 - Create todo');
                        console.log('3 - Profile');
                        console.log('4 - Sign out');
                        return [4 /*yield*/, this.prompt(rl, '')];
                    case 2:
                        option = _b.sent();
                        _a = option;
                        switch (_a) {
                            case '1': return [3 /*break*/, 3];
                            case '2': return [3 /*break*/, 4];
                            case '3': return [3 /*break*/, 10];
                            case '4': return [3 /*break*/, 11];
                        }
                        return [3 /*break*/, 12];
                    case 3:
                        this.getTodos();
                        return [3 /*break*/, 13];
                    case 4: return [4 /*yield*/, this.prompt(rl, 'Enter todo title: ')];
                    case 5:
                        todoTitle = _b.sent();
                        return [4 /*yield*/, this.prompt(rl, 'Enter todo text: ')];
                    case 6:
                        todoText = _b.sent();
                        todoDueDate = '';
                        validDate = false;
                        _b.label = 7;
                    case 7:
                        if (!!validDate) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.prompt(rl, 'Enter todo due date (YYYY-MM-DD): ')];
                    case 8:
                        todoDueDate = _b.sent();
                        timestamp = Date.parse(todoDueDate);
                        if (isNaN(timestamp)) {
                            console.log("Invalid date format. Please enter a valid date in the format YYYY-MM-DD.");
                        }
                        else {
                            validDate = true;
                        }
                        return [3 /*break*/, 7];
                    case 9:
                        dateObject = new Date(todoDueDate);
                        todo = { title: todoTitle, text: todoText, dueDate: dateObject };
                        console.log(todo);
                        this.createTodo(todo);
                        return [3 /*break*/, 13];
                    case 10:
                        this.whoAmI();
                        return [3 /*break*/, 13];
                    case 11:
                        this.signOut();
                        return [3 /*break*/, 13];
                    case 12:
                        console.log('Invalid option');
                        return [3 /*break*/, 13];
                    case 13: return [3 /*break*/, 1];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        error_1 = _b.sent();
                        console.error("Authentication failed: ".concat(error_1.message));
                        this.disconnect();
                        process.exit();
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    AppClient.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, response, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.socketOptions = {
                            withCredentials: true,
                            transportOptions: {
                                polling: {
                                    extraHeaders: {}
                                }
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        console.log('Enter your email:');
                        return [4 /*yield*/, this.prompt(rl, '')];
                    case 2:
                        email = _a.sent();
                        console.log('Enter your password:');
                        return [4 /*yield*/, this.prompt(rl, '')];
                    case 3:
                        password = _a.sent();
                        return [4 /*yield*/, axios_1.default.post("".concat(this.url, "/auth/signin"), { email: email, password: password }, { withCredentials: true })];
                    case 4:
                        response = _a.sent();
                        this.socketOptions.transportOptions.polling.extraHeaders.userId = response.data.userId;
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error("Authentication failed: ".concat(error_2.message));
                        return [3 /*break*/, 6];
                    case 6:
                        this.socket = (0, socket_io_client_1.io)(this.url, this.socketOptions);
                        this.socket.on('connect', function () {
                            console.log("Connected to WebSocket server: ".concat(_this.url));
                        });
                        this.socket.on('disconnect', function () {
                            console.log("Disconnected from WebSocket server: ".concat(_this.url));
                        });
                        this.socket.on('message', function (message) {
                            console.log("Received message: ".concat(message));
                        });
                        this.socket.on('whoami', function (userId) {
                            console.log("Received userId: ".concat(JSON.stringify(userId, null, 2)));
                        });
                        this.socket.on('get-todos', function (todos) {
                            console.table("Received todos: ".concat(JSON.stringify(todos, null, 2)));
                        });
                        this.socket.on('create-todo', function (todo) {
                            console.log("Created todo: ".concat(JSON.stringify(todo, null, 2)));
                        });
                        return [2 /*return*/, this.socketOptions.transportOptions.polling.extraHeaders.userId];
                }
            });
        });
    };
    AppClient.prototype.disconnect = function () {
        this.socket.disconnect();
    };
    AppClient.prototype.whoAmI = function () {
        this.socket.emit('whoami');
    };
    AppClient.prototype.getTodos = function () {
        this.socket.emit('get-todos');
    };
    AppClient.prototype.createTodo = function (todo) {
        this.socket.emit('create-todo', todo);
    };
    AppClient.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('Signing out...');
                this.disconnect();
                process.exit();
                return [2 /*return*/];
            });
        });
    };
    AppClient.prototype.prompt = function (rl, question) {
        return new Promise(function (resolve) {
            rl.question(question, function (answer) {
                resolve(answer);
            });
        });
    };
    return AppClient;
}());
exports.AppClient = AppClient;
// Main code
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
var client = new AppClient(rl);
try {
    client.connect().then(function (userId) {
        console.log(userId);
        client.start();
    });
}
catch (error) {
}
