import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Topic {
  @PrimaryColumn()
  key: string;

  @Column()
  values: string[];
}
