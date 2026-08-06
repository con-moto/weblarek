type EventName = string | RegExp;
type Subscriber = (data?: unknown) => void;

type EmitterEvent = {
    eventName: string;
    data: unknown;
};

export interface IEvents {
    on<T extends object>(
        event: EventName,
        callback: (data: T) => void
    ): void;

    off(
        event: EventName,
        callback: Subscriber
    ): void;

    emit<T extends object>(
        event: string,
        data?: T
    ): void;

    trigger<T extends object>(
        event: string,
        context?: Partial<T>
    ): (data?: Partial<T>) => void;
}

export class EventEmitter implements IEvents {
    private _events: Map<EventName, Set<Subscriber>> = new Map();

    public on<T extends object>(
        eventName: EventName,
        callback: (event: T) => void
    ): void {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set());
        }

        this._events.get(eventName)?.add(callback as Subscriber);
    }

    public off(
        eventName: EventName,
        callback: Subscriber
    ): void {
        const subscribers = this._events.get(eventName);

        if (!subscribers) {
            return;
        }

        subscribers.delete(callback);

        if (subscribers.size === 0) {
            this._events.delete(eventName);
        }
    }

    public emit<T extends object>(
        eventName: string,
        data?: T
    ): void {
        this._events.forEach((subscribers, name) => {
            if (name === '*') {
                subscribers.forEach((callback) => {
                    callback({
                        eventName,
                        data,
                    });
                });

                return;
            }

            const matchesRegexp =
                name instanceof RegExp && name.test(eventName);

            if (matchesRegexp || name === eventName) {
                subscribers.forEach((callback) => {
                    callback(data);
                });
            }
        });
    }

    public onAll(
        callback: (event: EmitterEvent) => void
    ): void {
        this.on<EmitterEvent>('*', callback);
    }

    public offAll(): void {
        this._events.clear();
    }

    public trigger<T extends object>(
        eventName: string,
        context?: Partial<T>
    ): (data?: Partial<T>) => void {
        return (data: Partial<T> = {}) => {
            this.emit(eventName, {
                ...data,
                ...context,
            } as T);
        };
    }
}