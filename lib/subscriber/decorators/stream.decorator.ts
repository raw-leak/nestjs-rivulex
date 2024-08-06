import 'reflect-metadata';
import { EventPattern } from '@nestjs/microservices';
import { ACTION_METADATA_KEY, STREAM_METADATA_KEY } from '../constants';
import { getEventPattern } from '../utils';

export function Stream(streamName: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(STREAM_METADATA_KEY, streamName, target);
    console.log(`Stream decorator executed for class: ${target.name}`);

    // Iterate over the methods of the class and check if they have the Action decorator
    const methods = Object.getOwnPropertyNames(target.prototype)
      .filter(prop => prop !== 'constructor' && typeof target.prototype[prop] === 'function');

    methods.forEach(methodName => {
      const method = target.prototype[methodName];
      const actionName = Reflect.getMetadata(ACTION_METADATA_KEY, method);
      if (actionName) {
        const eventPattern = getEventPattern(streamName, actionName);

        // Apply the EventPattern decorator to the method descriptor
        EventPattern(eventPattern)(target.prototype, methodName, Object.getOwnPropertyDescriptor(target.prototype, methodName));
        
        console.log(`EventPattern applied to method: ${methodName} with pattern: ${eventPattern}`);
      } else {
        console.log(`Method ${methodName} does not have Action decorator`);
      }
    });
  };
}
