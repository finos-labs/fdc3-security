import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../world/index';

const contextMap: Record<string, any> = {
  "fdc3.instrument": {
    "type": "fdc3.instrument",
    "name": "Apple",
    "id": {
      "ticker": "AAPL"
    }
  },
  "fdc3.country": {
    "type": "fdc3.country",
    "name": "Sweden",
    "id": {
      "COUNTRY_ISOALPHA2": "SE",
      "COUNTRY_ISOALPHA3": "SWE",
    }
  },
  "fdc3.unsupported": {
    "type": "fdc3.unsupported",
    "bogus": true
  }
}

Given('{string} is a {string} context', function (this: CustomWorld, field: string, type: string) {
  this.props[field] = contextMap[type];
})

// Given('{string} is a {string} message on channel {string} with context {string} and signature {string}', function (this: CustomWorld, field: string, type: string, channel: string, context: string, signature: string) {
//   const message = {
//     meta: this.messaging!!.createMeta(),
//     payload: {
//       "channelId": handleResolve(channel, this),
//       "context": contextMap[context]
//     },
//     type: type
//   } as PrivateChannelBroadcastAgentRequest | BroadcastAgentRequest

//   (message as any).signature = JSON.parse(signature)

//   this.props[field] = message;
// })

// Given('{string} is a {string} message on channel {string}', function (this: CustomWorld, field: string, type: string, channel: string) {
//   const message = {
//     meta: this.messaging!!.createMeta(),
//     payload: {
//       "channelId": handleResolve(channel, this),
//     },
//     type
//   } as PrivateChannelOnDisconnectAgentRequest

//   this.props[field] = message;
// })

// Given('{string} is a {string} message on channel {string} with listenerType as {string}', function (this: CustomWorld, field: string, type: string, channel: string, listenerType: string) {
//   const message = {
//     meta: this.messaging!!.createMeta(),
//     payload: {
//       "channelId": handleResolve(channel, this),
//       listenerType
//     },
//     type
//   }

//   this.props[field] = message;
// })

// Given('{string} is a {string} message on channel {string} with contextType as {string}', function (this: CustomWorld, field: string, type: string, channel: string, contextType: string) {
//   const message = {
//     meta: this.messaging!!.createMeta(),
//     payload: {
//       "channelId": handleResolve(channel, this),
//       contextType
//     },
//     type
//   } as PrivateChannelOnUnsubscribeAgentRequest

//   this.props[field] = message;
// })

// Given('{string} pipes types to {string}', function (this: CustomWorld, typeHandlerName: string, field: string) {
//   this.props[field] = []
//   this.props[typeHandlerName] = (s?: string) => {
//     this.props[field].push(s)
//   }
// })

// Given('{string} pipes context to {string} and metadata to {string}', function (this: CustomWorld, contextHandlerName: string, field: string, field2: string) {
//   this.props[field] = []
//   this.props[field2] = []
//   this.props[contextHandlerName] = (context: Context, metadata: ContextMetadata) => {
//     this.props[field].push(context)
//     this.props[field2].push(metadata)
//   }
// })


// When('messaging receives a {string} with payload:', function (this: CustomWorld, type: RequestMessageType, docString: string) {
//   const message: AgentRequestMessage = {
//     meta: this.messaging!!.createMeta(),
//     payload: JSON.parse(docString),
//     type
//   }

//   this.log(`Sending: ${JSON.stringify(message)}`)
//   this.messaging!!.receive(message, this.log);
// });

// When('messaging receives {string}', function (this: CustomWorld, field: string) {
//   const message = handleResolve(field, this)
//   this.log(`Sending: ${JSON.stringify(message)}`)
//   this.messaging!!.receive(message, this.log);
// });


// Then('messaging will have posts', function (this: CustomWorld, dt: DataTable) {
//   // just take the last few posts and match those
//   const matching = dt.rows().length
//   var toUse = this.messaging?.allPosts!!
//   if (toUse.length > matching) {
//     toUse = toUse.slice(toUse.length - matching, toUse.length)
//   }
//   matchData(this, toUse, dt)
// })


// Given("channel {string} has context {string}", function (this: CustomWorld, channel: string, context: string) {
//   const ctxObject = handleResolve(context, this)
//   const state = this.props[CHANNEL_STATE] ?? {}
//   this.props[CHANNEL_STATE] = state

//   const cs = state[channel] ?? []
//   cs.push(ctxObject)
//   state[channel] = cs
// })
