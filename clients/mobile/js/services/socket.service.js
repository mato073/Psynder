import * as io from "socket.io-client";

const URL = "http://localhost:8080";
let socket = io.connect(URL, { autoConnect: false });

export default socket;