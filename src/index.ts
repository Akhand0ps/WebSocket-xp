import {WebSocketServer,WebSocket} from "ws";


const wss = new WebSocketServer({port:8080});

let users=0;
let allSockets: WebSocket[]=[];

wss.on("connection", (socket)=>{

    allSockets.push(socket);
    users +=1;
    console.log("user connected: ", users);

    socket.on("message",(message)=>{

        console.log("Message recieved: "+message.toString());

        // for(let i=0;i<allSockets.length;i++){

        //     const s = allSockets[i];
        //     //@ts-ignore
        //     s.send(message.toString()+": sent from the server");

        // }

        allSockets.forEach((s:WebSocket)=>{
            s.send(message.toString()+": sent from the server");
            console.log("size allsockets before: ", allSockets.length);
        })
    })

    socket.on("close",()=>{

        allSockets = allSockets.filter(x => x != socket);
        console.log("size allsockets after: ", allSockets.length);
    })
})