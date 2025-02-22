import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export interface IGateConnection {
  id: string
  hu: string
}

@Entity()
export class Gate {

  @PrimaryGeneratedColumn()
  id: string

  @Column()
  name: string

  @Column({ type: 'jsonb', array: true })
  connections: Array<IGateConnection>

}
