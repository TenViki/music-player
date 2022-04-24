import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { User } from "src/entities/user.entity";
import { Server, Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

const wsError = (message: string) => ({
  type: "error",
  message,
});

interface DeviceType {
  id: string;
  name: string;
}

@WebSocketGateway({ cors: "*" })
export class SongsGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clients: Map<string, User> = new Map();
  private userDevices: Map<User, DeviceType> = new Map();

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
  }

  @SubscribeMessage("auth")
  async handleAuth(
    @ConnectedSocket() client: Socket,
    @MessageBody("token") token: string,
  ) {
    if (!token) return wsError("No token provided");
    let userId: string;
    try {
      userId = (
        jwt.verify(token, process.env.JWT_SECRET) as {
          id: string;
        }
      ).id;
    } catch (error) {
      return wsError("Invalid token");
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    this.clients.set(client.id, user);
    client.join(user.id);

    return {
      event: "events",
      data: "Hello World",
    };
  }

  async send(event: string, data: object, room: string) {
    if (room) this.server.to(room).emit(event, data);
    else this.server.emit(event, data);
  }
}
