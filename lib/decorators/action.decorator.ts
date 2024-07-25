import { applyDecorators, } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { STREAM_METADATA_KEY } from '../constants';
import { getEventPattern } from '../utils';


// export const Action = (actionName: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//     const streamName = Reflect.getMetadata(STREAM_METADATA_KEY, target.constructor);
//     // EventPattern(`${streamName}_${actionName}`)(target, propertyKey, descriptor);
//     return applyDecorators(EventPattern(getEventPattern(streamName, actionName)));
// };

// export function Action2(action: string) {
//     const streamName = ''; // get from the class decorator
//     return applyDecorators(EventPattern(getEventPattern(streamName, action)));
// }

export const Action = (actionName: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const streamName = Reflect.getMetadata(STREAM_METADATA_KEY, target.constructor);
    if (streamName) {
        EventPattern(`${streamName}:${actionName}`)(target, propertyKey, descriptor);
    }
};