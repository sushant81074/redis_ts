import { dataExpiryLoop } from "./data";
import { connExpiryLoop } from "./netSoc";

export const expiryLoop = () => {
    dataExpiryLoop();
    connExpiryLoop();
};