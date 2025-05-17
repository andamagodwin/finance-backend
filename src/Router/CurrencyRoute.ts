import { Router } from "express";
const { handleCurrencyDelete,handleCurrencyFetch,handleSaveCurrency } = require("../Controllers/CurrencyController");
// import { handleCurrencyDelete,handleCurrencyFetch,handleSaveCurrency } from "../Controllers/CurrencyController";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
export default (router: Router) => {
    const currencyPrefix = "/currency";
    router.get(`${currencyPrefix}/all`, JWTAuthMiddleWare, handleCurrencyFetch);
    router.post(`${currencyPrefix}/create`, JWTAuthMiddleWare, handleSaveCurrency);
    router.put(`${currencyPrefix}/update`, JWTAuthMiddleWare,handleSaveCurrency );
    router.delete(`${currencyPrefix}/delete/:id`, JWTAuthMiddleWare, handleCurrencyDelete);
};