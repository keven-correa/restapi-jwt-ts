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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testing = exports.profile = exports.singin = exports.singup = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const singup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //guardando usuario
    const user = new User_1.default({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    user.password = yield user.encryptPassword(user.password);
    const savedUser = yield user.save();
    //creadno token
    const token = jsonwebtoken_1.default.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET || 'tokentest');
    console.log(savedUser);
    res.header('auth-token', token).json(savedUser);
});
exports.singup = singup;
const singin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).json('Email or Password is wrong!');
    const correctPassword = yield user.validatePassword(req.body.password);
    if (!correctPassword)
        return res.status(400).json('Invalid password');
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKE_SECRET || 'tokentest', {
        expiresIn: 60 * 60 * 24
    });
    res.header('auth-token', token).json(user);
});
exports.singin = singin;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.userId, { password: 0 });
    if (!user)
        return res.status(404).json('User nor found');
    res.json(user);
});
exports.profile = profile;
const testing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json('private');
});
exports.testing = testing;
//# sourceMappingURL=authController.js.map