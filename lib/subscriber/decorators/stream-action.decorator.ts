import { applyDecorators } from "@nestjs/common";
import { EventPattern } from '@nestjs/microservices';
import { getEventPattern } from "../utils";

export function StreamAction(streamName: string, action: string) {
    return applyDecorators(EventPattern(getEventPattern(streamName, action)));
}