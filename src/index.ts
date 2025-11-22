import {WebSocketServer,WebSocket} from "ws";


const wss = new WebSocketServer({port:8080});

interface User {

    socket: WebSocket;
    room: string;
}
let allSockets: User[]=[];

wss.on("connection", (socket)=>{

   
    socket.on("message",(message:string)=>{


        const parsedMsg = JSON.parse(message);
        // console.log(parsedMsg);

        if(parsedMsg.type === 'join'){

            console.log('user joined room '+parsedMsg.payload.roomId);

            allSockets.push({
                socket,
                room:parsedMsg.payload.roomId
            })
        }

        if(parsedMsg.type ==='chat'){

            // const curr_user_room = allSockets.find( (x)=> x.socket == socket)?.room; ye easy way hai room nikalne ka but still niche wala OG

            console.log('user open to chat')

            let currentUserRoom = null;

            for(let i=0;i<allSockets.length;i++){

                if(allSockets[i]?.socket == socket){
                    currentUserRoom = allSockets[i]?.room;
                }
            }

            //ab broadcast kr jo iss specific room se connect hai. 

            for(let i=0;i<allSockets.length;i++){

                if(allSockets[i]?.room == currentUserRoom){
                    allSockets[i]?.socket.send(parsedMsg.payload.message);
                }
            }
        }

    })

    socket.on("close",()=>{

        
    })
})