import { Injectable } from "@nestjs/common";
import { PublisherService } from "../../lib/publisher.service";

interface UserCreatedPayload {
    id: string,
    email: string
}

interface UserDeletedPayload {
    id: string,
    email: string
}

interface CustomHeaders {
    requestId: string,
    userId: string
}

@Injectable()
export class UsersPublisherService {

    private readonly stream = "users";
    private readonly userCreatedAction = "user_created"
    private readonly userDeletedAction = "user_deleted"

    constructor(private readonly publisher: PublisherService) { }

    async onUserCreated(payload: UserCreatedPayload, headers: CustomHeaders) {
        await this.publisher.publish(this.stream, this.userCreatedAction, payload, headers)
    }

    async onUserDeleted(payload: UserDeletedPayload, headers: CustomHeaders) {
        await this.publisher.publish(this.stream, this.userDeletedAction, payload, headers)
    }
}