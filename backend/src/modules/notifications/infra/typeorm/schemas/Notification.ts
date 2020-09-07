import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity('notification')
class Notification {
  @ObjectIdColumn()
  id: ObjectID;
  
  @Column()
  content: string;

  @Column('uuid')
  recepient_id: string;
  
  @Column({ default: false })
  readed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Notification;
