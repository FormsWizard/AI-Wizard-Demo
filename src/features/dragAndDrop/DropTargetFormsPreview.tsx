import { DraggableComponent } from '../wizard/WizardSlice'
import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonSchema7, UISchemaElement } from '@jsonforms/core'
import {pathToScope, updateScopeOfUISchemaElement} from "../../utils/uiSchemaHelpers";

const DropTargetFormsPreview: React.FC<{ metadata: DraggableComponent; topLevelUISchema?: boolean }> = ({
  metadata,
  topLevelUISchema,
}) => (
  <>
    {metadata.jsonSchemaElement && (
      <JsonForms
        data={{}}
        renderers={materialRenderers}
        cells={materialCells}
        uischema={
          topLevelUISchema && metadata.uiSchema
            ? updateScopeOfUISchemaElement('#', pathToScope([metadata.name]), metadata.uiSchema)
            : ({
                type: 'VerticalLayout',
                elements: [
                  {
                    type: 'Control',
                    scope: `#/properties/${metadata.name}`,
                    ...(updateScopeOfUISchemaElement('#', pathToScope([metadata.name]), metadata.uiSchema) || {}),
                  },
                ],
              } as UISchemaElement)
        }
        schema={
          topLevelUISchema && metadata.jsonSchemaElement
            ? metadata.jsonSchemaElement
            : ({
                type: 'object',
                properties: {
                  [metadata?.name]: metadata.jsonSchemaElement,
                },
              } as JsonSchema7)
        }
      />
    )}
  </>
)

export default DropTargetFormsPreview
