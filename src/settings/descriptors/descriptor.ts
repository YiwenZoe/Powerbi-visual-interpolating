/**
 * Developed by Yiwen Zhou
 */
import powerbi from "powerbi-visuals-api";

import { DataRepresentationTypeEnum } from "./dataRepresentationType";

export interface IDescriptorParserOptions {
    isAutoHideBehaviorEnabled: boolean;
    viewport: powerbi.IViewport;
    type: DataRepresentationTypeEnum;
}

export interface IDescriptor {
    parse?(options?: IDescriptorParserOptions): void;
    setDefault?(): void;
    getValueByKey?(key: string): string | number | boolean;
    shouldKeyBeEnumerated?(key: string): boolean;
}

export abstract class BaseDescriptor {
    public applyDefault(defaultSettings: BaseDescriptor) {
        if (!defaultSettings) {
            return;
        }

        Object
            .keys(defaultSettings)
            .forEach((propertyName: string) => {
                this[propertyName] = defaultSettings[propertyName];
            });
    }

    public enumerateProperties(): { [propertyName: string]: powerbi.DataViewPropertyValue; } {
        const properties: { [propertyName: string]: powerbi.DataViewPropertyValue; } = {};

        for (const key in this) {
            const shouldKeyBeEnumerated: boolean = (this as IDescriptor).shouldKeyBeEnumerated
                ? (this as IDescriptor).shouldKeyBeEnumerated(key)
                : this.hasOwnProperty(key);

            if (shouldKeyBeEnumerated) {
                if ((this as IDescriptor).getValueByKey) {
                    properties[key] = (this as IDescriptor).getValueByKey(key);
                } else {
                    properties[key] = this[key] as any;
                }
            }
        }

        return properties;
    }
}