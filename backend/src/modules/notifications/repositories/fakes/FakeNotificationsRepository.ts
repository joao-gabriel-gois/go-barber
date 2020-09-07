import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/DTOs/ICreateNotificationDTO';

import Notification from "../../infra/typeorm/schemas/Notification";

class NotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({ content, recepient_id }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();
    
    Object.assign(notification, {
      id: new ObjectID(),
      content,
      recepient_id
    })

    this.notifications.push(notification);

    console.info('Should Create a notification after creating an Appointment (2 created without expecting app error):')
    console.table(this.notifications);

    return notification;
  }
}

export default NotificationsRepository;
