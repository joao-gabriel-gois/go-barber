# Missing features to come:

## Password recovery

**Functional Requirements (abstraction of business logic)**

* User should be able to recover you password by inputing his/her email
* User should be able to receive an email with all instructions to do so
* User should be able to reset password

**Non-functional Requirements (infra services)**

* Use MailTrap to test sending, in dev env
* Use Amazon SES for sending these emails in prod env
* Email sending should be run in background (as a bg job - using queues)

**Business logic**

* The link sent by email should expire in until 2 hours
* User needs to confirm this new password (inserting this 2 times at least)

## Profile Update

**Functional Requirements (abstraction of business logic)**

- [ ] User should be able to update your name, email and password.

**Business logic**

* User should not be able his/her email to another one already in use
* To change his/her password, user should inform his/her old password
* To change his/her password, user should confirm his/her new password

## Service Provider (Barber) Panel

**Functional Requirements (abstraction of business logic)**

* User should be able to list all apointments for a particular day;
* The service provider should receive a notification everytime a new appointment is scheduled to him/her;
* Service provider should be able to access all non read notifications;

**Non-functional Requirements (infra services)**

* Service provider appointments for a certain day should be cached;
* Notifications from service provider should be storaged in MongoDB;
* Service provider notifications should be sent in realtime with Socket.io;

**Business logic**

* Notification should has a read / non-read status to service provider be able to manage;

## Service Appointment

**Functional Requirements (abstraction of business logic)**

* User should be able to list all registered service providers (barbers);
* User should be able to list a monthly calenda with at least one available hour to schedule the service;
* User should be able to list available hour to schedule the service in a specific day;
* User should be able to schedule his/her new appointment;

**Non-functional Requirements (infra services)**

* Service provider (Barbers) should be cached;

**Business logic**

* Each appointment should lasts exactly one hour;
* All Appointments should be available betwen 8am until 18pm (first 8am, last 17pm);
* User can't schedule in an occupied hour;
* User can't schedule in a past hour from his current clock;
* User can't schedule schedule appointments with him/herself;
