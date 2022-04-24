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
  event: "error",
  data: message,
});

interface DeviceType {
  id: string;
  name: string;
  type: string;
}

@WebSocketGateway({ cors: "*" })
export class SongsGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clients: Map<string, User> = new Map();
  private userDevices: Map<User, DeviceType[]> = new Map();

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  handleDisconnect(client: Socket) {
    // Remove device
    const user = this.clients.get(client.id);
    if (!user) return;
    const devices = this.userDevices.get(user);
    if (!devices) return;
    const device = devices.find((d) => d.id === client.id);
    if (!device) return;
    devices.splice(devices.indexOf(device), 1);
    this.send("device-disconnect", device, user.id);

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
        jwt.verify(token, process.env.JWT_KEY) as {
          id: string;
        }
      ).id;
    } catch (error) {
      console.log(error);
      return wsError("Invalid token");
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    this.clients.set(client.id, user);
    client.join(user.id);

    return {
      event: "auth-success",
      data: user.name,
    };
  }

  async send(event: string, data: object, room: string) {
    if (room) this.server.to(room).emit(event, data);
    else this.server.emit(event, data);
  }

  @SubscribeMessage("register-device")
  async handleRegisterDevice(
    @ConnectedSocket() client: Socket,
    @MessageBody("name") deviceName: string,
    @MessageBody("type") deviceType: string,
  ) {
    const user = this.clients.get(client.id);
    if (!user) return wsError("User not authenticated");
    if (!deviceName) return wsError("No device name provided");
    if (!deviceType) return wsError("No device type provided");

    const device = {
      id: client.id,
      name: deviceName,
      type: deviceType,
    } as DeviceType;

    if (!this.userDevices.has(user)) {
      this.userDevices.set(user, []);
    }

    this.userDevices.get(user).push(device);

    this.send("device-connect", device, user.id);
  }
}
