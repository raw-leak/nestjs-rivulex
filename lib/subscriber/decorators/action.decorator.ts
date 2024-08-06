
import { ACTION_METADATA_KEY } from '../constants';

export function Action(actionName: string): MethodDecorator {
    return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(ACTION_METADATA_KEY, actionName, descriptor.value);
        console.log(`Action decorator applied to method: ${String(propertyKey)}`);
        return descriptor;
    };
}
