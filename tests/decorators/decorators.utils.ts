import { ExecutionContext } from "@nestjs/common";
import { Event, Headers } from "rivulex";
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants'

export function createMockExecutionContext<P = any, H = any>(event: Event<P, H>): ExecutionContext {
    const mockExecutionContext: ExecutionContext = {
        getArgByIndex: jest.fn(() => event),
        getArgs: jest.fn(() => {
            console.log("called getArgs")
            return [event]
        }),
    } as any;

    return mockExecutionContext
}

export function createMockEvent<P = any, H = Record<any, any>>(overrides: Partial<Event<P, H>> = {}): Event<P, H> {
    const defaultEvent: Event<P, H> = {
        id: 'default-id',
        action: 'default-action',
        channel: 'default-channel',
        attempt: 0,
        payload: {} as P,
        ack: jest.fn(),
        headers: {
            timestamp: new Date().toISOString(),
            group: 'default-group',
        } as Headers<H>,
        ...overrides,
    };

    return defaultEvent;
}

export function getParamDecoratorFactory<T = any>(decorator: Function) {
    class Test {
        public test(@decorator() value: T) {
            return value as T
        }
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
    return args[Object.keys(args)[0]].factory;
}