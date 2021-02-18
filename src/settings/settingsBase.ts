/*
* Developed by Yiwen Zhou
*/
import powerbiVisualsApi from "powerbi-visuals-api";

import {
    dataViewObjects,
    dataViewObjectsParser,
} from "powerbi-visuals-utils-dataviewutils";

import {
    BaseDescriptor,
    IDescriptor,
} from "./descriptors/descriptor";

export class SettingsBase extends dataViewObjectsParser.DataViewObjectsParser {
    public parse(dataView: powerbiVisualsApi.DataView): SettingsBase {
        return this.parseObjects(dataView
            && dataView.metadata
            && dataView.metadata.objects,
        );
    }

    public parseObjects(objects: powerbiVisualsApi.DataViewObjects): SettingsBase {
        if (objects) {
            const properties: dataViewObjectsParser.DataViewProperties = this.getProperties();

            // for (const objectName in properties) {
            //     for (const propertyName in properties[objectName]) {
            //         const defaultValue: any = this[objectName][propertyName];

            //         this[objectName][propertyName] = dataViewObjects.getCommonValue(
            //             objects,
            //             properties[objectName][propertyName],
            //             defaultValue);
            //     }

            //     this.processDescriptor(this[objectName]);
            // }
        }

        return this as any;
    }

    public enumerateObjectInstances(
        options: powerbiVisualsApi.EnumerateVisualObjectInstancesOptions,
    ): powerbiVisualsApi.VisualObjectInstance[] {
        const descriptor: BaseDescriptor = this[options.objectName];

        if (!descriptor) {
            return [];
        }

        return [{
            objectName: options.objectName,
            properties: descriptor.enumerateProperties(),
            selector: null,
        }];
    }

    protected processDescriptor(descriptor: IDescriptor): void {
        if (!descriptor || !descriptor.parse) {
            return;
        }

        descriptor.parse();
    }
}