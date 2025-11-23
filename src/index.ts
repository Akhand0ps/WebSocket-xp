import {WebSocketServer,WebSocket} from "ws";
import { nanoid } from 'nanoid'

const wss = new WebSocketServer({port:8080});

// interface User {

//     socket: WebSocket;
//     room: string;
// }
// let allSockets: User[]=[];

const rooms = new Map<string,Set<WebSocket>>();



wss.on("connection", (socket)=>{

   
    socket.on("message",(message:string)=>{


        const parsedMsg = JSON.parse(message);
        // console.log(parsedMsg);


        if(parsedMsg.type=='create-room'){
            console.log('creating room....');
            const roomId = nanoid(6);

            rooms.set(roomId, new Set([socket]));

            socket.send(JSON.stringify({
                type:"room-created",
                payload:{roomId}
            }))

            
        }

        if(parsedMsg.type === 'join'){

            console.log('user joined room '+parsedMsg.payload.roomId);

            // allSockets.push({
            //     socket,
            //     room:parsedMsg.payload.roomId
            // })

            const roomId = parsedMsg.payload.roomId;

            if(!rooms.has(roomId)){

                rooms.set(roomId,new Set());
            }

            rooms.get(roomId)?.add(socket);
        }

        if(parsedMsg.type ==='chat'){

            // const curr_user_room = allSockets.find( (x)=> x.socket == socket)?.room; ye easy way hai room nikalne ka but still niche wala OG

            console.log('user open to chat')

            //more industory way

           /* const roomId = [...rooms.entries()]
                    .find( ([_,users]) =>users.has(socket))?.[0] 
            */
           let roomId = null;

           for(const[id,users] of rooms.entries()){

            if(users.has(socket)){
                roomId = id;
                break;
            }
           }

           if(!roomId) return;

           const message = parsedMsg.payload.message;

           for(const userSocket of rooms.get(roomId)!)
            userSocket.send(message);
        }

    })

    socket.on("close",()=>{

        for(const[roomId,socketId] of rooms.entries()){

            socketId.delete(socket);

            if(socketId.size ==0) rooms.delete(roomId);
        }
    });



})