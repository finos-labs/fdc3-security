import { AppIdentifier, AppIntent, AppMetadata, Channel, Context, ContextHandler, DesktopAgent, DisplayMetadata, ImplementationMetadata, IntentHandler, IntentResolution, IntentResult, Listener, PrivateChannel } from "@finos/fdc3";
import { v4 as uuid } from 'uuid'

export interface Call {
    method: string,
    args: any[]
}

function addCall(a: Call[], method: string, arg0?: any, arg1?: any, arg2?: any) {
    const args = []
    if (arg0) {
        args.push(arg0)
    }

    if (arg1) {
        args.push(arg1)
    }

    if (arg2) {
        args.push(arg2)
    }

    a.push(
        {
            method,
            args
        }
    )
}

export class MockChannel implements PrivateChannel {

    readonly id: string
    readonly type: "user" | "app" | "private"
    readonly displayMetadata: DisplayMetadata
    public tracking: Call[] = []
    public handlers: { [type: string]: ContextHandler | IntentHandler } = {}
    send: ((ctx: Context) => void) | null = null

    constructor(id: string, type: "user" | "app" | "private", displayMetadata: DisplayMetadata) {
        this.id = id;
        this.type = type
        this.displayMetadata = displayMetadata
    }

    onAddContextListener(_handler: (contextType?: string | undefined) => void): Listener {
        throw new Error("Method not implemented.");
    }

    onUnsubscribe(_handler: (contextType?: string | undefined) => void): Listener {
        throw new Error("Method not implemented.");
    }

    onDisconnect(_handler: () => void): Listener {
        throw new Error("Method not implemented.");
    }

    disconnect(): void {
        throw new Error("Method not implemented.");
    }

    call(method: string, arg0?: any, arg1?: any, arg2?: any) {
        addCall(this.tracking, method, arg0, arg1, arg2)
    }

    async broadcast(context: Context): Promise<void> {
        this.call("broadcast", context)
        if (this.send) {
            this.send(context)
        }
    }

    async getCurrentContext(type?: string | undefined): Promise<Context | null> {
        this.call("getCurrentContext", type)
        return null
    }

    async addContextListener(context: string | null | ContextHandler, handler?: ContextHandler): Promise<Listener> {
        const theHandler: ContextHandler = handler ? handler : (context as ContextHandler)
        const theContextType: string | null = context && handler ? (context as string) : "any"
        this.handlers[theContextType] = theHandler
        return {

        } as Listener
    }
}

const MOCK_CHANNELS = [
    new MockChannel("one", "user", { color: "red" }),
    new MockChannel("two", "user", { color: "green" }),
    new MockChannel("three", "user", { color: "blue" })
]

/**
 * Keeps track of calls so that we can test out the delegation capabilities
 */
export class DesktopAgentSpy implements DesktopAgent {

    tracking: Call[] = []
    private uc: Channel | undefined = undefined
    public handlers: { [type: string]: ContextHandler } = {}


    call(method: string, arg0?: any, arg1?: any, arg2?: any) {
        addCall(this.tracking, method, arg0, arg1, arg2)
    }

    async open(arg0?: any, arg1?: any): Promise<AppIdentifier> {
        this.call("open", arg0, arg1)
        return {
            appId: "DummyApp",
            instanceId: uuid()
        } as AppIdentifier
    }

    async findIntent(intent: string, context?: Context | undefined, resultType?: string | undefined): Promise<AppIntent> {
        this.call("findIntent", context, resultType)
        return {
            intent: {
                name: intent,
                displayName: "Some Display Name"
            },
            apps: []
        } as AppIntent
    }

    async findIntentsByContext(context: Context, resultType?: string | undefined): Promise<AppIntent[]> {
        this.call("findIntentsByContext", context, resultType)
        return []
    }

    async findInstances(app: AppIdentifier): Promise<AppIdentifier[]> {
        this.call("findInstances", app)
        return []
    }
    async broadcast(context: Context): Promise<void> {
        this.call("broadcast", context)
    }

    async raiseIntent(intent: string, context: Context, a2: any): Promise<IntentResolution> {
        this.call("raiseIntent", intent, context, a2)
        return {
            source: {
                appId: "abc123"
            },
            intent,
            getResult: async () => {
                return {

                } as IntentResult
            }
        } as IntentResolution
    }


    async raiseIntentForContext(context: Context, arg1?: any): Promise<IntentResolution> {
        this.call("raiseIntentForContext", context, arg1)
        return {
            source: {
                appId: "abc123"
            },
            intent: "showNews",
            getResult: async () => {
                return {

                } as IntentResult
            }
        } as IntentResolution
    }

    async addIntentListener(intent: string, handler: IntentHandler): Promise<Listener> {
        this.handlers[intent] = handler
        return {

        } as Listener
    }

    async addContextListener(context: string | null | ContextHandler, handler?: ContextHandler): Promise<Listener> {
        const theHandler: ContextHandler = handler ? handler : (context as ContextHandler)
        const theContextType: string | null = context && handler ? (context as string) : "any"
        this.handlers[theContextType] = theHandler
        return {

        } as Listener
    }

    async getUserChannels(): Promise<Channel[]> {
        return MOCK_CHANNELS
    }

    async joinUserChannel(id: string): Promise<void> {
        this.uc = MOCK_CHANNELS.find(c => c.id == id)
    }

    async getOrCreateChannel(channelId: string): Promise<Channel> {
        this.call("getOrCreateChannel", channelId)
        return new MockChannel(channelId, "app", {})
    }

    async createPrivateChannel(): Promise<MockChannel> {
        return new MockChannel("priv123", "private", {})
    }

    async getCurrentChannel(): Promise<Channel | null> {
        return this.uc ? this.uc : null;
    }

    async leaveCurrentChannel(): Promise<void> {
        this.uc = undefined
    }

    getInfo(): Promise<ImplementationMetadata> {
        throw new Error("Method not implemented.");
    }

    getAppMetadata(_app: AppIdentifier): Promise<AppMetadata> {
        throw new Error("Method not implemented.");
    }

    getSystemChannels(): Promise<Channel[]> {
        return this.getUserChannels()
    }

    async joinChannel(id: string): Promise<void> {
        return this.joinUserChannel(id)
    }

    connectChannels(channel1: MockChannel, channel2: MockChannel) {

        function deliver(channel: MockChannel, ctx: Context) {
            const first = channel.handlers[ctx.type]
            const second = channel.handlers["any"]

            if (first) {
                first(ctx)
            }

            if (second) {
                second(ctx)
            }
        }

        channel1.send = (ctx: Context) => deliver(channel2, ctx)
        channel2.send = (ctx: Context) => deliver(channel1, ctx)
    }
}