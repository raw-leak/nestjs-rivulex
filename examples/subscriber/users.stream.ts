import { Event, Action, Stream } from 'rivulex';

interface CustomHeaders {
    requestId: string,
    userId: string
}

interface UserCreatedPayload {
    id: string,
    email: string
}

interface UserDeletedPayload {
    id: string,
    email: string
}

@Stream('users')
class UsersStream {

    @Action('user_created')
    async handleUserCreated(event: Event<UserCreatedPayload, CustomHeaders>) {
        const { action, headers, payload, attempt, ack } = event
        // Handle 'user_created' event
        await ack()
    }

    @Action('user_deleted')
    async handleUserDeleted(event: Event<UserDeletedPayload, CustomHeaders>) {
        const { action, headers, payload, attempt, ack } = event
        // Handle 'user_deleted' event
        await ack()
    }
}
