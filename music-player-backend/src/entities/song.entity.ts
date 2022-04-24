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

  @Column()
  cover: string;

  @Column()
  bitrate: number;

  @Column()
  sampleRate: number;

  @Column()
  size: number;

  @Column()
  lossless: boolean;

  @Column()
  file: string;

  @Column()
  channels: number;

  @Column()
  format: string;

  @Column({ nullable: true })
  lyrics: string;

  @ManyToOne(() => User, (user) => user.songs)
  user: User;
}
