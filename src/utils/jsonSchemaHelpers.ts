import {JsonSchema} from "@jsonforms/core";

/**
 * insert or update a property into a nested schema by following the given path
 * will throw an error if the path is invalid
 * @param schema original json schema
 * @param path path to the nested schema
 * @param newKey new key for the property
 * @param newProperty the property to insert
 */
export const deeplySetNestedProperty: (schema: JsonSchema, path: string[], newKey: string, newProperty: JsonSchema) => JsonSchema =
    (schema, path, newKey, newProperty) => {
      if (!schema.properties)
        throw new Error(`Schema has no properties`)
      if (path.length === 0) {
        return {
          ...schema,
          properties: {
            ...schema.properties,
            [newKey]: newProperty
          }
        } as JsonSchema
      }
      const [first, ...rest] = path
      const nestedSchema = schema.properties[first]
      if (!nestedSchema)
        throw new Error(`Could not find nested schema for ${first}`)
      return {
        ...schema,
        properties: {
          ...schema.properties,
          [first]: deeplySetNestedProperty(nestedSchema, rest, newKey, newProperty)
        }
      } as JsonSchema
    }