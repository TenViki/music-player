import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "songs" })
export class Song {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column()
  duration: number;

  @ManyToOne(() => User, (user) => user.songs)
  user: User;
}
