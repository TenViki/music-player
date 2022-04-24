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

interface Status {
  device: string;
  song: string;
  shuffle: boolean;
  repeat: boolean;
  paused: boolean;
}

@WebSocketGateway({ cors: "*" })
export class SongsGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clients: Map<string, User> = new Map();
  private userDevices: Map<string, DeviceType[]> = new Map();
  private userStatuses: Map<string, Status> = new Map();
  private userTimes: Map<string, number> = new Map();

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  handleDisconnect(client: Socket) {
    // Remove device
    const user = this.clients.get(client.id);
    if (!user) return;
    const devices = this.userDevices.get(user.id);
    if (!devices) return;
    const device = devices.find((d) => d.id === client.id);
    if (!device) return;
    devices.splice(devices.indexOf(device), 1);

    this.send("device-update", devices, user.id);

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
      return wsError("Invalid token");
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    this.clients.set(client.id, user);
    client.join(user.id);

    if (!this.userTimes.has(user.id)) {
      this.userTimes.set(user.id, 0);
    }
    this.userTimes.set(userId, 0);

    if (!this.userStatuses.has(user.id))
      this.userStatuses.set(user.id, {
        device: "",
        song: "",
        shuffle: false,
        repeat: false,
        paused: false,
      });

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

    if (!this.userDevices.has(user.id)) {
      this.userDevices.set(user.id, []);
    }

    const devices = this.userDevices.get(user.id);
    devices.push(device);

    this.send("device-update", devices, user.id);
  }

  @SubscribeMessage("get-devices")
  async handleGetDevices(@ConnectedSocket() client: Socket) {
    const user = this.clients.get(client.id);
    if (!user) return wsError("User not authenticated");

    const devices = this.userDevices.get(user.id);
    if (!devices) return wsError("No devices registered");

    return {
      event: "device-update",
      data: devices,
    };
  }

  @SubscribeMessage("get-status")
  async handleGetStatus(@ConnectedSocket() client: Socket) {
    const user = this.clients.get(client.id);
    if (!user) return wsError("User not authenticated");

    const status = this.userStatuses.get(user.id);
    if (!status) return wsError("No status registered");

    return {
      event: "status-update",
      data: status,
    };
  }

  @SubscribeMessage("set-status")
  async handleSetStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody("status") status: Status,
  ) {
    const user = this.clients.get(client.id);
    if (!user) return wsError("User not authenticated");

    const oldStatus = this.userStatuses.get(user.id);
    const newStatus = { ...oldStatus, ...status };
    this.userStatuses.set(user.id, newStatus);

    this.send("status-update", newStatus, user.id);
  }

  @SubscribeMessage("get-time")
  async handleGetTime(@ConnectedSocket() client: Socket) {
    const user = this.clients.get(client.id);
    if (!user) return wsError("User not authenticated");

    const time = this.userTimes.get(user.id);
    if (!time) return wsError("No time registered");

    return {
      event: "time-update",
      data: time,
    };
  }

  @SubscribeMessage("set-time")
  async handleSetTime(
    @ConnectedSocket() client: Socket,
    @MessageBody("time") time: number,
    @MessageBody("control") control: boolean,
  ) {
    const user = this.clients.get(client.id);
    if (!user) return wsError("User not authenticated");

    this.userTimes.set(user.id, time);

    this.send("time-update", { time, control }, user.id);
  }

  @SubscribeMessage("latency")
  async handleLatency(@MessageBody("timestamp") timestamp: number) {
    return {
      event: "latency",
      data: { timestamp },
    };
  }
}
