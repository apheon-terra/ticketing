"use strict";
// import { BadRequestError } from './errors/bad-request-error';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// interface Color {
//     red: number;
//     blue: number;
//     green:number
// }
// const color: Color = {
//     red: 20,
//     blue: 10,
//     green: 10
// };
// console.log(color);
// export default color;
// two options to import 
//bad
// import { BadRequestError } from '@apheontickets/common/errors/bad-request-error'
//better
// import { BadRequestError } from '@apheontickets/common'
//
//for solution 2
__exportStar(require("./errors/bad-request-error"), exports);
__exportStar(require("./errors/custom-error"), exports);
__exportStar(require("./errors/database-connection-error"), exports);
__exportStar(require("./errors/not-authorized-error"), exports);
__exportStar(require("./errors/not-found-error"), exports);
__exportStar(require("./errors/request-validation-error"), exports);
__exportStar(require("./middlewares/current-user"), exports);
__exportStar(require("./middlewares/error-handler"), exports);
__exportStar(require("./middlewares/require-auth"), exports);
__exportStar(require("./middlewares/validate-request"), exports);
