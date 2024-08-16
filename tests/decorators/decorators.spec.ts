import { Headers } from 'rivulex';
import { EventId, EventPayload, EventAttempt, EventHeaders, EventAck } from '../../lib/subscriber/decorators';
import { createMockEvent, createMockExecutionContext, getParamDecoratorFactory } from './decorators.utils';

describe('Event Decorators', () => {
    it('should extract id from event object using @EventId', () => {
        const id = '12345';
        const event = createMockEvent({ id });
        const context = createMockExecutionContext(event);

        const factory = getParamDecoratorFactory(EventId);
        const result = factory(null, context);

        expect(result).toBe(id);
    });

    it('should extract payload from event object using @EventPayload', () => {
        const payload = { data: 'test' };
        const event = createMockEvent({ payload });
        const context = createMockExecutionContext(event);

        const factory = getParamDecoratorFactory(EventPayload);
        const result = factory(null, context);

        expect(result).toEqual(payload);
    });

    it('should extract attempt from event object using @EventAttempt', () => {
        const attempt = 3;
        const event = createMockEvent({ attempt });
        const context = createMockExecutionContext(event);

        const factory = getParamDecoratorFactory(EventAttempt);
        const result = factory(null, context);

        expect(result).toBe(attempt);
    });

    it('should extract headers from event object using @EventHeaders', () => {
        const headers: Headers<{ id: string }> = { id: "123", group: "group", timestamp: new Date().toISOString() };
        const event = createMockEvent({ headers });
        const context = createMockExecutionContext(event);

        const factory = getParamDecoratorFactory(EventHeaders);
        const result = factory(null, context);

        expect(result).toEqual(headers);
    });

    it('should extract ack from event object using @Ack', () => {
        const ack = jest.fn();
        const event = createMockEvent({ ack });
        const context = createMockExecutionContext(event);

        const factory = getParamDecoratorFactory(EventAck);
        const result = factory(null, context);

        expect(result).toBe(ack);
    });
});
