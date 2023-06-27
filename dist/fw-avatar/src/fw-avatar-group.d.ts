export class FwAvatarGroup extends LitElement {
    static get properties(): {
        items: ObjectConstructor;
        _filteredItems: ObjectConstructor;
        nameAttribute: ObjectConstructor;
        secondaryAttribute: ObjectConstructor;
        maxCount: NumberConstructor;
        header: ObjectConstructor;
        avatarBackground: ObjectConstructor;
        showSearchBar: BooleanConstructor;
        _searchInputValue: StringConstructor;
        emptyStateMessage: StringConstructor;
        emptyStateAction: ObjectConstructor;
        primaryAction: ObjectConstructor;
        secondaryAction: ObjectConstructor;
        absolute: BooleanConstructor;
    };
    render(): import("lit-html").TemplateResult<1>;
    maxCount: number;
    nameAttribute: string;
    updated(changedProperties: any): void;
    showAllAvatars(e: any): void;
    closeAvatarDialog(): void;
    onAvatarDialogClose(): void;
    searchInputValueChanged(value: any): void;
    _searchInputValue: any;
    _filteredItems: any;
    fireEvent(eventName: any, detail: any): void;
}
import { LitElement } from "lit-element/lit-element";
