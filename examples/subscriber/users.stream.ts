import { Done, Event } from 'rivulex';
import { Action } from '../../lib/decorators/action.decorator';
import { Stream } from '../../lib/decorators/stream.decorator';

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
    async handleUserCreated(event: Event<UserCreatedPayload, CustomHeaders>, done: Done) {
        const { action, headers, payload, attempt } = event
        // Handle 'user_created' event
        await done()
    }

    @Action('user_deleted')
    async handleUserDeleted(event: Event<UserDeletedPayload, CustomHeaders>, done: Done) {
        const { action, headers, payload, attempt } = event
        // Handle 'user_deleted' event
        await done()
    }
}
