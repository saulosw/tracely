import { builder } from '../builder.js'

import './scalars.js'
import './enums.js'
import './auth.js'
import './connections.js'
import './sync.js'
import './timeline.js'


builder.queryType({})
builder.mutationType({})

export const schema = builder.toSchema()
