System.register(["angular2/src/web_workers/shared/message_bus", "angular2/src/facade/lang", "angular2/src/facade/async", "angular2/src/facade/collection", "angular2/src/web_workers/shared/serializer", "angular2/src/core/di"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var message_bus_1, lang_1, async_1, collection_1, serializer_1, di_1, lang_2;
    var ClientMessageBrokerFactory, ClientMessageBrokerFactory_, ClientMessageBroker, ClientMessageBroker_, MessageData, FnArg, UiArguments;
    return {
        setters:[
            function (message_bus_1_1) {
                message_bus_1 = message_bus_1_1;
            },
            function (lang_1_1) {
                lang_1 = lang_1_1;
                lang_2 = lang_1_1;
                exports_1({
                    "Type": lang_1_1["Type"]
                });
            },
            function (async_1_1) {
                async_1 = async_1_1;
            },
            function (collection_1_1) {
                collection_1 = collection_1_1;
            },
            function (serializer_1_1) {
                serializer_1 = serializer_1_1;
            },
            function (di_1_1) {
                di_1 = di_1_1;
            }],
        execute: function() {
            ClientMessageBrokerFactory = (function () {
                function ClientMessageBrokerFactory() {
                }
                return ClientMessageBrokerFactory;
            }());
            exports_1("ClientMessageBrokerFactory", ClientMessageBrokerFactory);
            ClientMessageBrokerFactory_ = (function (_super) {
                __extends(ClientMessageBrokerFactory_, _super);
                function ClientMessageBrokerFactory_(_messageBus, _serializer) {
                    _super.call(this);
                    this._messageBus = _messageBus;
                    this._serializer = _serializer;
                }
                /**
                 * Initializes the given channel and attaches a new {@link ClientMessageBroker} to it.
                 */
                ClientMessageBrokerFactory_.prototype.createMessageBroker = function (channel, runInZone) {
                    if (runInZone === void 0) { runInZone = true; }
                    this._messageBus.initChannel(channel, runInZone);
                    return new ClientMessageBroker_(this._messageBus, this._serializer, channel);
                };
                ClientMessageBrokerFactory_ = __decorate([
                    di_1.Injectable(), 
                    __metadata('design:paramtypes', [message_bus_1.MessageBus, serializer_1.Serializer])
                ], ClientMessageBrokerFactory_);
                return ClientMessageBrokerFactory_;
            }(ClientMessageBrokerFactory));
            exports_1("ClientMessageBrokerFactory_", ClientMessageBrokerFactory_);
            ClientMessageBroker = (function () {
                function ClientMessageBroker() {
                }
                return ClientMessageBroker;
            }());
            exports_1("ClientMessageBroker", ClientMessageBroker);
            ClientMessageBroker_ = (function (_super) {
                __extends(ClientMessageBroker_, _super);
                function ClientMessageBroker_(messageBus, _serializer, channel) {
                    var _this = this;
                    _super.call(this);
                    this.channel = channel;
                    this._pending = new Map();
                    this._sink = messageBus.to(channel);
                    this._serializer = _serializer;
                    var source = messageBus.from(channel);
                    async_1.ObservableWrapper.subscribe(source, function (message) { return _this._handleMessage(message); });
                }
                ClientMessageBroker_.prototype._generateMessageId = function (name) {
                    var time = lang_1.stringify(lang_1.DateWrapper.toMillis(lang_1.DateWrapper.now()));
                    var iteration = 0;
                    var id = name + time + lang_1.stringify(iteration);
                    while (lang_1.isPresent(this._pending[id])) {
                        id = "" + name + time + iteration;
                        iteration++;
                    }
                    return id;
                };
                ClientMessageBroker_.prototype.runOnService = function (args, returnType) {
                    var _this = this;
                    var fnArgs = [];
                    if (lang_1.isPresent(args.args)) {
                        args.args.forEach(function (argument) {
                            if (argument.type != null) {
                                fnArgs.push(_this._serializer.serialize(argument.value, argument.type));
                            }
                            else {
                                fnArgs.push(argument.value);
                            }
                        });
                    }
                    var promise;
                    var id = null;
                    if (returnType != null) {
                        var completer = async_1.PromiseWrapper.completer();
                        id = this._generateMessageId(args.method);
                        this._pending.set(id, completer);
                        async_1.PromiseWrapper.catchError(completer.promise, function (err, stack) {
                            lang_1.print(err);
                            completer.reject(err, stack);
                        });
                        promise = async_1.PromiseWrapper.then(completer.promise, function (value) {
                            if (_this._serializer == null) {
                                return value;
                            }
                            else {
                                return _this._serializer.deserialize(value, returnType);
                            }
                        });
                    }
                    else {
                        promise = null;
                    }
                    // TODO(jteplitz602): Create a class for these messages so we don't keep using StringMap #3685
                    var message = { 'method': args.method, 'args': fnArgs };
                    if (id != null) {
                        message['id'] = id;
                    }
                    async_1.ObservableWrapper.callEmit(this._sink, message);
                    return promise;
                };
                ClientMessageBroker_.prototype._handleMessage = function (message) {
                    var data = new MessageData(message);
                    // TODO(jteplitz602): replace these strings with messaging constants #3685
                    if (lang_2.StringWrapper.equals(data.type, "result") || lang_2.StringWrapper.equals(data.type, "error")) {
                        var id = data.id;
                        if (this._pending.has(id)) {
                            if (lang_2.StringWrapper.equals(data.type, "result")) {
                                this._pending.get(id).resolve(data.value);
                            }
                            else {
                                this._pending.get(id).reject(data.value, null);
                            }
                            this._pending.delete(id);
                        }
                    }
                };
                return ClientMessageBroker_;
            }(ClientMessageBroker));
            exports_1("ClientMessageBroker_", ClientMessageBroker_);
            MessageData = (function () {
                function MessageData(data) {
                    this.type = collection_1.StringMapWrapper.get(data, "type");
                    this.id = this._getValueIfPresent(data, "id");
                    this.value = this._getValueIfPresent(data, "value");
                }
                /**
                 * Returns the value from the StringMap if present. Otherwise returns null
                 * @internal
                 */
                MessageData.prototype._getValueIfPresent = function (data, key) {
                    if (collection_1.StringMapWrapper.contains(data, key)) {
                        return collection_1.StringMapWrapper.get(data, key);
                    }
                    else {
                        return null;
                    }
                };
                return MessageData;
            }());
            FnArg = (function () {
                function FnArg(value, type) {
                    this.value = value;
                    this.type = type;
                }
                return FnArg;
            }());
            exports_1("FnArg", FnArg);
            UiArguments = (function () {
                function UiArguments(method, args) {
                    this.method = method;
                    this.args = args;
                }
                return UiArguments;
            }());
            exports_1("UiArguments", UiArguments);
        }
    }
});
//# sourceMappingURL=client_message_broker.js.map