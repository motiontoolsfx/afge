
/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */

Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.7.0
 * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
 */
Prisma.prismaVersion = {
  client: "6.7.0",
  engine: "3cff47a7f5d65c3ea74883f1d736e41d68ce91ed"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  fname: 'fname',
  lname: 'lname',
  username: 'username',
  password: 'password',
  role: 'role',
  createdAt: 'createdAt'
};

exports.Prisma.CaseScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  fname: 'fname',
  lname: 'lname',
  phoneNumber: 'phoneNumber',
  personalEmail: 'personalEmail',
  date: 'date',
  position: 'position',
  payScale: 'payScale',
  entitlement: 'entitlement',
  supervisor: 'supervisor',
  reasonForRequest: 'reasonForRequest',
  typesOfPayIssue: 'typesOfPayIssue',
  typesOfDisciplinaryAction: 'typesOfDisciplinaryAction',
  notes: 'notes',
  progress: 'progress',
  documents: 'documents',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  owner: 'owner',
  admin: 'admin',
  steward: 'steward'
};

exports.Position = exports.$Enums.Position = {
  Nurse: 'Nurse',
  MAS: 'MAS',
  FMS: 'FMS',
  EMS: 'EMS',
  HIMS: 'HIMS',
  Doctor: 'Doctor',
  Tech: 'Tech',
  LPN: 'LPN',
  Social_Work: 'Social_Work',
  Dentist: 'Dentist',
  Dental_Assistant: 'Dental_Assistant',
  Other: 'Other'
};

exports.PayScale = exports.$Enums.PayScale = {
  GS: 'GS',
  WG: 'WG',
  VN: 'VN'
};

exports.Entitlement = exports.$Enums.Entitlement = {
  Title_38: 'Title_38',
  Title_5: 'Title_5',
  Hybrid: 'Hybrid',
  Unknown: 'Unknown'
};

exports.ReasonForRequest = exports.$Enums.ReasonForRequest = {
  Fact_Finding: 'Fact_Finding',
  Pay_Issues: 'Pay_Issues',
  Performance_Appraisal: 'Performance_Appraisal',
  EEO: 'EEO',
  Grievance: 'Grievance',
  Change_in_Working_Condition: 'Change_in_Working_Condition',
  Reasonable_Accommodation_RA: 'Reasonable_Accommodation_RA',
  Workers_Compensation: 'Workers_Compensation',
  Disciplinary_Action: 'Disciplinary_Action',
  Other: 'Other'
};

exports.PayIssueType = exports.$Enums.PayIssueType = {
  Indebtedness: 'Indebtedness',
  Pay_Check: 'Pay_Check'
};

exports.DisciplinaryActionType = exports.$Enums.DisciplinaryActionType = {
  Verbal_Counseling: 'Verbal_Counseling',
  Written_Counseling: 'Written_Counseling',
  Admonishment: 'Admonishment',
  Reprimand: 'Reprimand',
  Proposed_Suspension: 'Proposed_Suspension',
  Proposed_Removal: 'Proposed_Removal'
};

exports.Progress = exports.$Enums.Progress = {
  Not_Started: 'Not_Started',
  In_Progress: 'In_Progress',
  Meeting_Set: 'Meeting_Set',
  Awaiting_Response: 'Awaiting_Response',
  Esculated: 'Esculated',
  Complete: 'Complete'
};

exports.Prisma.ModelName = {
  User: 'User',
  Case: 'Case'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\jcarm\\OneDrive\\Documents\\nextjs_form\\afge_admin\\app\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\jcarm\\OneDrive\\Documents\\nextjs_form\\afge_admin\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "6.7.0",
  "engineVersion": "3cff47a7f5d65c3ea74883f1d736e41d68ce91ed",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": null,
        "value": "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKWTc2V1kyTkoxUkpKNzBCNjU1WlZKM0siLCJ0ZW5hbnRfaWQiOiIwNGIxNDVmNzk4YTRlYTdkMTVhOGU2MDE2MWMxNTc3ZGMwOWI0NDUzNWRiNzdmYTkwMjY3MDBhN2IzNDkzZTI4IiwiaW50ZXJuYWxfc2VjcmV0IjoiZjE2MDAyODMtMTMwMi00ZDhjLWFjMDktOTIyYTkwY2NiMmI0In0.kcgJ5TZQXerpOtZ-l_NbPPH_hcNw2QmH7prY7EbbupA"
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../app/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = \"prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKWTc2V1kyTkoxUkpKNzBCNjU1WlZKM0siLCJ0ZW5hbnRfaWQiOiIwNGIxNDVmNzk4YTRlYTdkMTVhOGU2MDE2MWMxNTc3ZGMwOWI0NDUzNWRiNzdmYTkwMjY3MDBhN2IzNDkzZTI4IiwiaW50ZXJuYWxfc2VjcmV0IjoiZjE2MDAyODMtMTMwMi00ZDhjLWFjMDktOTIyYTkwY2NiMmI0In0.kcgJ5TZQXerpOtZ-l_NbPPH_hcNw2QmH7prY7EbbupA\"\n}\n\nmodel User {\n  id        String   @id @default(cuid())\n  fname     String\n  lname     String\n  username  String   @unique\n  password  String\n  role      Role\n  createdAt DateTime @default(now())\n\n  cases Case[]\n}\n\nenum Role {\n  owner\n  admin\n  steward\n}\n\nmodel Case {\n  id                        Int                     @id @default(autoincrement())\n  userId                    String?\n  user                      User?                   @relation(fields: [userId], references: [id])\n  fname                     String\n  lname                     String\n  phoneNumber               String\n  personalEmail             String\n  date                      String\n  position                  Position\n  payScale                  PayScale\n  entitlement               Entitlement\n  supervisor                String\n  reasonForRequest          ReasonForRequest\n  typesOfPayIssue           PayIssueType?\n  typesOfDisciplinaryAction DisciplinaryActionType?\n  notes                     String?\n  progress                  Progress?               @default(Not_Started)\n  documents                 String?\n  createdAt                 DateTime                @default(now())\n  updatedAt                 DateTime                @updatedAt\n}\n\nenum Position {\n  Nurse\n  MAS\n  FMS\n  EMS\n  HIMS\n  Doctor\n  Tech\n  LPN\n  Social_Work\n  Dentist\n  Dental_Assistant\n  Other\n}\n\nenum PayScale {\n  GS\n  WG\n  VN\n}\n\nenum Entitlement {\n  Title_38\n  Title_5\n  Hybrid\n  Unknown\n}\n\nenum ReasonForRequest {\n  Fact_Finding\n  Pay_Issues\n  Performance_Appraisal\n  EEO\n  Grievance\n  Change_in_Working_Condition\n  Reasonable_Accommodation_RA\n  Workers_Compensation\n  Disciplinary_Action\n  Other\n}\n\nenum PayIssueType {\n  Indebtedness\n  Pay_Check\n}\n\nenum DisciplinaryActionType {\n  Verbal_Counseling\n  Written_Counseling\n  Admonishment\n  Reprimand\n  Proposed_Suspension\n  Proposed_Removal\n}\n\nenum Progress {\n  Not_Started\n  In_Progress\n  Meeting_Set\n  Awaiting_Response\n  Esculated\n  Complete\n}\n",
  "inlineSchemaHash": "8ddeb3978eb05b0eaf7a1a6cfbe2b2b0b39d992b8d3dace4b381188c7406dae8",
  "copyEngine": false
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"username\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Role\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cases\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Case\",\"nativeType\":null,\"relationName\":\"CaseToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Case\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"CaseToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phoneNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"personalEmail\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"position\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Position\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payScale\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PayScale\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entitlement\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Entitlement\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supervisor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reasonForRequest\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ReasonForRequest\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"typesOfPayIssue\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PayIssueType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"typesOfDisciplinaryAction\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DisciplinaryActionType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"progress\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Progress\",\"nativeType\":null,\"default\":\"Not_Started\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"documents\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"Role\":{\"values\":[{\"name\":\"owner\",\"dbName\":null},{\"name\":\"admin\",\"dbName\":null},{\"name\":\"steward\",\"dbName\":null}],\"dbName\":null},\"Position\":{\"values\":[{\"name\":\"Nurse\",\"dbName\":null},{\"name\":\"MAS\",\"dbName\":null},{\"name\":\"FMS\",\"dbName\":null},{\"name\":\"EMS\",\"dbName\":null},{\"name\":\"HIMS\",\"dbName\":null},{\"name\":\"Doctor\",\"dbName\":null},{\"name\":\"Tech\",\"dbName\":null},{\"name\":\"LPN\",\"dbName\":null},{\"name\":\"Social_Work\",\"dbName\":null},{\"name\":\"Dentist\",\"dbName\":null},{\"name\":\"Dental_Assistant\",\"dbName\":null},{\"name\":\"Other\",\"dbName\":null}],\"dbName\":null},\"PayScale\":{\"values\":[{\"name\":\"GS\",\"dbName\":null},{\"name\":\"WG\",\"dbName\":null},{\"name\":\"VN\",\"dbName\":null}],\"dbName\":null},\"Entitlement\":{\"values\":[{\"name\":\"Title_38\",\"dbName\":null},{\"name\":\"Title_5\",\"dbName\":null},{\"name\":\"Hybrid\",\"dbName\":null},{\"name\":\"Unknown\",\"dbName\":null}],\"dbName\":null},\"ReasonForRequest\":{\"values\":[{\"name\":\"Fact_Finding\",\"dbName\":null},{\"name\":\"Pay_Issues\",\"dbName\":null},{\"name\":\"Performance_Appraisal\",\"dbName\":null},{\"name\":\"EEO\",\"dbName\":null},{\"name\":\"Grievance\",\"dbName\":null},{\"name\":\"Change_in_Working_Condition\",\"dbName\":null},{\"name\":\"Reasonable_Accommodation_RA\",\"dbName\":null},{\"name\":\"Workers_Compensation\",\"dbName\":null},{\"name\":\"Disciplinary_Action\",\"dbName\":null},{\"name\":\"Other\",\"dbName\":null}],\"dbName\":null},\"PayIssueType\":{\"values\":[{\"name\":\"Indebtedness\",\"dbName\":null},{\"name\":\"Pay_Check\",\"dbName\":null}],\"dbName\":null},\"DisciplinaryActionType\":{\"values\":[{\"name\":\"Verbal_Counseling\",\"dbName\":null},{\"name\":\"Written_Counseling\",\"dbName\":null},{\"name\":\"Admonishment\",\"dbName\":null},{\"name\":\"Reprimand\",\"dbName\":null},{\"name\":\"Proposed_Suspension\",\"dbName\":null},{\"name\":\"Proposed_Removal\",\"dbName\":null}],\"dbName\":null},\"Progress\":{\"values\":[{\"name\":\"Not_Started\",\"dbName\":null},{\"name\":\"In_Progress\",\"dbName\":null},{\"name\":\"Meeting_Set\",\"dbName\":null},{\"name\":\"Awaiting_Response\",\"dbName\":null},{\"name\":\"Esculated\",\"dbName\":null},{\"name\":\"Complete\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {}
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

