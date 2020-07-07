/// <reference path="../../Modules/_Ext/_q/_q.d.ts" />
/// <reference path="../typings/serenity/Serenity.CoreLib.d.ts" />
/// <reference path="../typings/jspdf/jspdf.autotable.d.ts" />
/// <reference types="jquery" />
/// <reference types="jqueryui" />
/// <reference types="jquery.validation" />
declare var isPageRefreshRequired: boolean;
declare namespace q {
    var queryString: {};
    var jsPDFHeaderImageData: string;
    var jsPDFHeaderTitle: string;
    var useSerenityInlineEditors: boolean;
    var DefaultMainGridOptions: ExtGridOptions;
    var DefaultEditorGridOptions: ExtGridOptions;
    var DefaultEntityDialogOptions: ExtDialogOptions;
    var DefaultEditorDialogOptions: ExtDialogOptions;
    var fiscalYearMonths: number[];
}
declare namespace _Ext {
    class GridBase<TItem, TOptions> extends Serenity.EntityGrid<TItem, TOptions> {
        protected get_ExtGridOptions(): ExtGridOptions;
        protected isPickerMode(): boolean;
        isReadOnly: boolean;
        isRequired: boolean;
        isAutosized: boolean;
        isChildGrid: boolean;
        nextRowNumber: number;
        autoColumnSizePlugin: any;
        rowSelection: Serenity.GridRowSelectionMixin;
        pickerDialog: GridItemPickerDialog;
        constructor(container: JQuery, options?: TOptions);
        protected markupReady(): void;
        protected getButtons(): Serenity.ToolButton[];
        protected getReportRequest(): _Ext.ListReportRequest;
        protected getColumns(): Slick.Column[];
        protected createSlickGrid(): Slick.Grid;
        resetColumns(columns: Slick.Column[]): void;
        resizeAllCulumn(): void;
        protected getSlickOptions(): Slick.GridOptions;
        protected getViewOptions(): Slick.RemoteViewOptions;
        protected getPrintRowServiceMethod(): string;
        protected onClick(e: JQueryEventObject, row: number, cell: number): void;
        protected onInlineActionClick(target: JQuery, recordId: any, item: TItem): void;
        protected resetRowNumber(): void;
        protected setGrouping(groupInfo: Slick.GroupInfo<TItem>[]): void;
        protected onViewProcessData(response: Serenity.ListResponse<TItem>): Serenity.ListResponse<TItem>;
        initDialog(dialog: DialogBase<TItem, any>): void;
        readonly selectedItems: TItem[];
        selectedKeys: any[];
        protected onViewSubmit(): boolean;
    }
}
declare namespace _Ext {
    class ReportGridBase<TItem, TOptions> extends _Ext.GridBase<TItem, TOptions> {
        protected getButtons(): Serenity.ToolButton[];
        protected getColumns(): Slick.Column[];
    }
}
declare namespace _Ext {
    class ReportPanelBase<TRequest> extends Serenity.PropertyPanel<TRequest, any> {
        protected getReportTitle(): string;
        protected getReportKey(): string;
        protected getReportRequest(): TRequest;
        constructor(container: JQuery);
        protected getTemplate(): string;
    }
}
declare namespace _Ext {
    class DialogBase<TEntity, TOptions> extends Serenity.EntityDialog<TEntity, TOptions> {
        protected get_ExtDialogOptions(): ExtDialogOptions;
        private loadedState;
        isReadOnly: boolean;
        protected form: any;
        constructor(opt?: any);
        protected updateInterface(): void;
        protected onDialogOpen(): void;
        protected onDialogClose(): void;
        protected setReadOnly(value: boolean): void;
        protected getToolbarButtons(): Serenity.ToolButton[];
        onRefreshClick(): void;
        protected getSaveState(): string;
        protected onSaveSuccess(response: any): void;
        loadResponse(data: any): void;
        maximize(): void;
        fullContentArea(): void;
        setDialogSize(width?: any, height?: any, top?: any, left?: any, $content?: any): void;
        onAfterSetDialogSize(): void;
        onAfterDialogClose(entity: TEntity): void;
        parentGrid: GridBase<TEntity, any>;
    }
}
declare namespace _Ext {
    class GridItemPickerDialog extends Serenity.TemplatedDialog<GridItemPickerEditorOptions> {
        getTemplate(): string;
        checkGrid: GridBase<any, GridItemPickerEditorOptions>;
        readonly selectedItems: any[];
        constructor(options: GridItemPickerEditorOptions);
        onSuccess: (selectedItems: any) => void;
        getDialogOptions(): JQueryUI.DialogOptions;
    }
}
declare namespace _Ext {
    class EditorDialogBase<TEntity> extends DialogBase<TEntity, any> {
        protected get_ExtDialogOptions(): ExtDialogOptions;
        protected getIdProperty(): string;
        onSave: (options: Serenity.ServiceOptions<Serenity.SaveResponse>, callback: (response: Serenity.SaveResponse) => void) => void;
        onDelete: (options: Serenity.ServiceOptions<Serenity.DeleteResponse>, callback: (response: Serenity.DeleteResponse) => void) => void;
        destroy(): void;
        protected updateInterface(): void;
        protected saveHandler(options: Serenity.ServiceOptions<Serenity.SaveResponse>, callback: (response: Serenity.SaveResponse) => void): void;
        protected deleteHandler(options: Serenity.ServiceOptions<Serenity.DeleteResponse>, callback: (response: Serenity.DeleteResponse) => void): void;
        parentEditor: GridEditorBase<TEntity>;
    }
}
declare namespace _Ext {
    class GridEditorBase<TEntity> extends _Ext.GridBase<TEntity, any> implements Serenity.IGetEditValue, Serenity.ISetEditValue, Serenity.IReadOnly {
        protected get_ExtGridOptions(): ExtGridOptions;
        protected getIdProperty(): string;
        isChildGrid: boolean;
        protected nextId: number;
        constructor(container: JQuery);
        private sortGridFunction;
        protected getQuickFilters(): any[];
        protected id(entity: TEntity): any;
        protected save(opt: Serenity.ServiceOptions<any>, callback: (r: Serenity.ServiceResponse) => void): void;
        protected deleteEntity(id: number): boolean;
        protected validateEntity(row: TEntity, id: number): boolean;
        protected getNewEntity(): TEntity;
        protected getButtons(): Serenity.ToolButton[];
        protected addButtonClick(): void;
        protected editItem(entityOrId: any): void;
        getEditValue(property: any, target: any): void;
        setEditValue(source: any, property: any): void;
        value: TEntity[];
        protected getGridCanLoad(): boolean;
        protected usePager(): boolean;
        protected getInitialTitle(): any;
        private searchText;
        protected createToolbarExtensions(): void;
        protected onViewFilter(row: any): boolean;
        private matchContains;
        protected enableFiltering(): boolean;
        protected onViewSubmit(): boolean;
        get_readOnly(): boolean;
        set_readOnly(value: boolean): void;
        protected getSlickOptions(): Slick.GridOptions;
        parentDialog: DialogBase<any, any>;
        onItemsChanged(): void;
        onBeforeGetValue(items: TEntity[]): void;
    }
}
declare namespace _Ext {
    class JsonGridEditorBase<TEntity> extends _Ext.GridEditorBase<TEntity> {
        getEditValue(property: any, target: any): void;
        setEditValue(source: any, property: any): void;
    }
}
declare namespace SereneInventory.Administration {
}
declare namespace SereneInventory.Administration {
    interface LanguageForm {
        LanguageId: Serenity.StringEditor;
        LanguageName: Serenity.StringEditor;
    }
    class LanguageForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Administration {
    interface LanguageRow {
        Id?: number;
        LanguageId?: string;
        LanguageName?: string;
    }
    namespace LanguageRow {
        const idProperty = "Id";
        const nameProperty = "LanguageName";
        const localTextPrefix = "Administration.Language";
        const lookupKey = "Administration.Language";
        function getLookup(): Q.Lookup<LanguageRow>;
        const enum Fields {
            Id = "Id",
            LanguageId = "LanguageId",
            LanguageName = "LanguageName"
        }
    }
}
declare namespace SereneInventory.Administration {
    namespace LanguageService {
        const baseUrl = "Administration/Language";
        function Create(request: Serenity.SaveRequest<LanguageRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<LanguageRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<LanguageRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: Serenity.ListRequest, onSuccess?: (response: Serenity.ListResponse<LanguageRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "Administration/Language/Create",
            Update = "Administration/Language/Update",
            Delete = "Administration/Language/Delete",
            Retrieve = "Administration/Language/Retrieve",
            List = "Administration/Language/List"
        }
    }
}
declare namespace SereneInventory.Administration {
}
declare namespace SereneInventory.Administration {
    interface RoleForm {
        RoleName: Serenity.StringEditor;
    }
    class RoleForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Administration {
    interface RolePermissionListRequest extends Serenity.ServiceRequest {
        RoleID?: number;
        Module?: string;
        Submodule?: string;
    }
}
declare namespace SereneInventory.Administration {
    interface RolePermissionListResponse extends Serenity.ListResponse<string> {
    }
}
declare namespace SereneInventory.Administration {
    interface RolePermissionRow {
        RolePermissionId?: number;
        RoleId?: number;
        PermissionKey?: string;
        RoleRoleName?: string;
    }
    namespace RolePermissionRow {
        const idProperty = "RolePermissionId";
        const nameProperty = "PermissionKey";
        const localTextPrefix = "Administration.RolePermission";
        const enum Fields {
            RolePermissionId = "RolePermissionId",
            RoleId = "RoleId",
            PermissionKey = "PermissionKey",
            RoleRoleName = "RoleRoleName"
        }
    }
}
declare namespace SereneInventory.Administration {
    namespace RolePermissionService {
        const baseUrl = "Administration/RolePermission";
        function Update(request: RolePermissionUpdateRequest, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: RolePermissionListRequest, onSuccess?: (response: RolePermissionListResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Update = "Administration/RolePermission/Update",
            List = "Administration/RolePermission/List"
        }
    }
}
declare namespace SereneInventory.Administration {
    interface RolePermissionUpdateRequest extends Serenity.ServiceRequest {
        RoleID?: number;
        Module?: string;
        Submodule?: string;
        Permissions?: string[];
    }
}
declare namespace SereneInventory.Administration {
    interface RoleRow {
        RoleId?: number;
        RoleName?: string;
    }
    namespace RoleRow {
        const idProperty = "RoleId";
        const nameProperty = "RoleName";
        const localTextPrefix = "Administration.Role";
        const lookupKey = "Administration.Role";
        function getLookup(): Q.Lookup<RoleRow>;
        const enum Fields {
            RoleId = "RoleId",
            RoleName = "RoleName"
        }
    }
}
declare namespace SereneInventory.Administration {
    namespace RoleService {
        const baseUrl = "Administration/Role";
        function Create(request: Serenity.SaveRequest<RoleRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<RoleRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<RoleRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: Serenity.ListRequest, onSuccess?: (response: Serenity.ListResponse<RoleRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "Administration/Role/Create",
            Update = "Administration/Role/Update",
            Delete = "Administration/Role/Delete",
            Retrieve = "Administration/Role/Retrieve",
            List = "Administration/Role/List"
        }
    }
}
declare namespace SereneInventory.Administration {
}
declare namespace SereneInventory.Administration {
    interface TenantForm {
        Name: Serenity.StringEditor;
        Description: Serenity.StringEditor;
        TenantId: Serenity.StringEditor;
    }
    class TenantForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Administration {
    interface TenantRow {
        Id?: number;
        Name?: string;
        Description?: string;
        Remarks?: string;
        IUserId?: number;
        TenantId?: number;
        EUserId?: number;
        RowNum?: number;
        IDate?: string;
        EDate?: string;
    }
    namespace TenantRow {
        const idProperty = "Id";
        const nameProperty = "Name";
        const localTextPrefix = "Administration.Tenant";
        const enum Fields {
            Id = "Id",
            Name = "Name",
            Description = "Description",
            Remarks = "Remarks",
            IUserId = "IUserId",
            TenantId = "TenantId",
            EUserId = "EUserId",
            RowNum = "RowNum",
            IDate = "IDate",
            EDate = "EDate"
        }
    }
}
declare namespace SereneInventory.Administration {
    namespace TenantService {
        const baseUrl = "Administration/Tenant";
        function Create(request: Serenity.SaveRequest<TenantRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<TenantRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<TenantRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: Serenity.ListRequest, onSuccess?: (response: Serenity.ListResponse<TenantRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "Administration/Tenant/Create",
            Update = "Administration/Tenant/Update",
            Delete = "Administration/Tenant/Delete",
            Retrieve = "Administration/Tenant/Retrieve",
            List = "Administration/Tenant/List"
        }
    }
}
declare namespace SereneInventory.Administration {
    interface TranslationItem {
        Key?: string;
        SourceText?: string;
        TargetText?: string;
        CustomText?: string;
    }
}
declare namespace SereneInventory.Administration {
    interface TranslationListRequest extends Serenity.ListRequest {
        SourceLanguageID?: string;
        TargetLanguageID?: string;
    }
}
declare namespace SereneInventory.Administration {
    namespace TranslationService {
        const baseUrl = "Administration/Translation";
        function List(request: TranslationListRequest, onSuccess?: (response: Serenity.ListResponse<TranslationItem>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: TranslationUpdateRequest, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            List = "Administration/Translation/List",
            Update = "Administration/Translation/Update"
        }
    }
}
declare namespace SereneInventory.Administration {
    interface TranslationUpdateRequest extends Serenity.ServiceRequest {
        TargetLanguageID?: string;
        Translations?: {
            [key: string]: string;
        };
    }
}
declare namespace SereneInventory.Administration {
}
declare namespace SereneInventory.Administration {
    interface UserForm {
        Username: Serenity.StringEditor;
        DisplayName: Serenity.StringEditor;
        Email: Serenity.EmailEditor;
        UserImage: Serenity.ImageUploadEditor;
        Password: Serenity.PasswordEditor;
        PasswordConfirm: Serenity.PasswordEditor;
        Source: Serenity.StringEditor;
    }
    class UserForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Administration {
    interface UserPermissionListRequest extends Serenity.ServiceRequest {
        UserID?: number;
        Module?: string;
        Submodule?: string;
    }
}
declare namespace SereneInventory.Administration {
    interface UserPermissionRow {
        UserPermissionId?: number;
        UserId?: number;
        PermissionKey?: string;
        Granted?: boolean;
        Username?: string;
        User?: string;
    }
    namespace UserPermissionRow {
        const idProperty = "UserPermissionId";
        const nameProperty = "PermissionKey";
        const localTextPrefix = "Administration.UserPermission";
        const enum Fields {
            UserPermissionId = "UserPermissionId",
            UserId = "UserId",
            PermissionKey = "PermissionKey",
            Granted = "Granted",
            Username = "Username",
            User = "User"
        }
    }
}
declare namespace SereneInventory.Administration {
    namespace UserPermissionService {
        const baseUrl = "Administration/UserPermission";
        function Update(request: UserPermissionUpdateRequest, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: UserPermissionListRequest, onSuccess?: (response: Serenity.ListResponse<UserPermissionRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function ListRolePermissions(request: UserPermissionListRequest, onSuccess?: (response: Serenity.ListResponse<string>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function ListPermissionKeys(request: Serenity.ServiceRequest, onSuccess?: (response: Serenity.ListResponse<string>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Update = "Administration/UserPermission/Update",
            List = "Administration/UserPermission/List",
            ListRolePermissions = "Administration/UserPermission/ListRolePermissions",
            ListPermissionKeys = "Administration/UserPermission/ListPermissionKeys"
        }
    }
}
declare namespace SereneInventory.Administration {
    interface UserPermissionUpdateRequest extends Serenity.ServiceRequest {
        UserID?: number;
        Module?: string;
        Submodule?: string;
        Permissions?: UserPermissionRow[];
    }
}
declare namespace SereneInventory.Administration {
    interface UserRoleListRequest extends Serenity.ServiceRequest {
        UserID?: number;
    }
}
declare namespace SereneInventory.Administration {
    interface UserRoleListResponse extends Serenity.ListResponse<number> {
    }
}
declare namespace SereneInventory.Administration {
    interface UserRoleRow {
        UserRoleId?: number;
        UserId?: number;
        RoleId?: number;
        Username?: string;
        User?: string;
    }
    namespace UserRoleRow {
        const idProperty = "UserRoleId";
        const localTextPrefix = "Administration.UserRole";
        const enum Fields {
            UserRoleId = "UserRoleId",
            UserId = "UserId",
            RoleId = "RoleId",
            Username = "Username",
            User = "User"
        }
    }
}
declare namespace SereneInventory.Administration {
    namespace UserRoleService {
        const baseUrl = "Administration/UserRole";
        function Update(request: UserRoleUpdateRequest, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: UserRoleListRequest, onSuccess?: (response: UserRoleListResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Update = "Administration/UserRole/Update",
            List = "Administration/UserRole/List"
        }
    }
}
declare namespace SereneInventory.Administration {
    interface UserRoleUpdateRequest extends Serenity.ServiceRequest {
        UserID?: number;
        Roles?: number[];
    }
}
declare namespace SereneInventory.Administration {
    interface UserRow {
        UserId?: number;
        Username?: string;
        Source?: string;
        PasswordHash?: string;
        PasswordSalt?: string;
        DisplayName?: string;
        Email?: string;
        UserImage?: string;
        LastDirectoryUpdate?: string;
        IsActive?: number;
        Password?: string;
        PasswordConfirm?: string;
        InsertUserId?: number;
        InsertDate?: string;
        UpdateUserId?: number;
        UpdateDate?: string;
    }
    namespace UserRow {
        const idProperty = "UserId";
        const isActiveProperty = "IsActive";
        const nameProperty = "Username";
        const localTextPrefix = "Administration.User";
        const lookupKey = "Administration.User";
        function getLookup(): Q.Lookup<UserRow>;
        const enum Fields {
            UserId = "UserId",
            Username = "Username",
            Source = "Source",
            PasswordHash = "PasswordHash",
            PasswordSalt = "PasswordSalt",
            DisplayName = "DisplayName",
            Email = "Email",
            UserImage = "UserImage",
            LastDirectoryUpdate = "LastDirectoryUpdate",
            IsActive = "IsActive",
            Password = "Password",
            PasswordConfirm = "PasswordConfirm",
            InsertUserId = "InsertUserId",
            InsertDate = "InsertDate",
            UpdateUserId = "UpdateUserId",
            UpdateDate = "UpdateDate"
        }
    }
}
declare namespace SereneInventory.Administration {
    namespace UserService {
        const baseUrl = "Administration/User";
        function Create(request: Serenity.SaveRequest<UserRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<UserRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Undelete(request: Serenity.UndeleteRequest, onSuccess?: (response: Serenity.UndeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<UserRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: Serenity.ListRequest, onSuccess?: (response: Serenity.ListResponse<UserRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "Administration/User/Create",
            Update = "Administration/User/Update",
            Delete = "Administration/User/Delete",
            Undelete = "Administration/User/Undelete",
            Retrieve = "Administration/User/Retrieve",
            List = "Administration/User/List"
        }
    }
}
declare namespace SereneInventory.Common {
    interface UserPreferenceRetrieveRequest extends Serenity.ServiceRequest {
        PreferenceType?: string;
        Name?: string;
    }
}
declare namespace SereneInventory.Common {
    interface UserPreferenceRetrieveResponse extends Serenity.ServiceResponse {
        Value?: string;
    }
}
declare namespace SereneInventory.Common {
    interface UserPreferenceRow {
        UserPreferenceId?: number;
        UserId?: number;
        PreferenceType?: string;
        Name?: string;
        Value?: string;
    }
    namespace UserPreferenceRow {
        const idProperty = "UserPreferenceId";
        const nameProperty = "Name";
        const localTextPrefix = "Common.UserPreference";
        const enum Fields {
            UserPreferenceId = "UserPreferenceId",
            UserId = "UserId",
            PreferenceType = "PreferenceType",
            Name = "Name",
            Value = "Value"
        }
    }
}
declare namespace SereneInventory.Common {
    namespace UserPreferenceService {
        const baseUrl = "Common/UserPreference";
        function Update(request: UserPreferenceUpdateRequest, onSuccess?: (response: Serenity.ServiceResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: UserPreferenceRetrieveRequest, onSuccess?: (response: UserPreferenceRetrieveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Update = "Common/UserPreference/Update",
            Retrieve = "Common/UserPreference/Retrieve"
        }
    }
}
declare namespace SereneInventory.Common {
    interface UserPreferenceUpdateRequest extends Serenity.ServiceRequest {
        PreferenceType?: string;
        Name?: string;
        Value?: string;
    }
}
declare namespace SereneInventory {
    interface ExcelImportRequest extends Serenity.ServiceRequest {
        FileName?: string;
    }
}
declare namespace SereneInventory {
    interface ExcelImportResponse extends Serenity.ServiceResponse {
        Inserted?: number;
        Updated?: number;
        ErrorList?: string[];
    }
}
declare namespace SereneInventory {
    enum ExpenseType {
        Transportation = 10,
        Media = 20,
        Delivery = 30,
        Misc = 40
    }
}
declare namespace SereneInventory {
    interface GetNextNumberRequest extends Serenity.ServiceRequest {
        Prefix?: string;
        Length?: number;
    }
}
declare namespace SereneInventory {
    interface GetNextNumberResponse extends Serenity.ServiceResponse {
        Number?: number;
        Serial?: string;
    }
}
declare namespace SereneInventory.Inventory {
    interface ProfitLossReportRequest extends Serenity.ServiceRequest {
        DateFrom?: string;
        DateTo?: string;
    }
}
declare namespace SereneInventory.Inventory {
    interface ProfitLossReportRequestForm {
        DateFrom: Serenity.DateEditor;
        DateTo: Serenity.DateEditor;
    }
    class ProfitLossReportRequestForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Inventory {
}
declare namespace SereneInventory.Inventory {
    interface PurchaseInvoiceForm {
        TransactionType: Serenity.EnumEditor;
        TransactionNumber: Serenity.StringEditor;
        TransactionDate: Serenity.DateEditor;
        TenantId: Serenity.LookupEditor;
        TransactionDetailRows: TransactionDetailGridEditor;
        TransactionExpenseRows: TransactionExpenseGridEditor;
        ExpensePerPiece: Serenity.DecimalEditor;
        TotalRefferencedAmount: Serenity.DecimalEditor;
    }
    class PurchaseInvoiceForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Inventory {
}
declare namespace SereneInventory.Inventory {
    interface SalesInvoiceForm {
        TransactionType: Serenity.EnumEditor;
        TransactionNumber: Serenity.StringEditor;
        TransactionDate: Serenity.DateEditor;
        PartyId: Serenity.LookupEditor;
        TenantId: Serenity.StringEditor;
        TransactionDetailRows: TransactionDetailGridEditor;
    }
    class SalesInvoiceForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Inventory {
}
declare namespace SereneInventory.Inventory {
}
declare namespace SereneInventory.Inventory {
    interface TransactionDetailForm {
        ProductId: Serenity.LookupEditor;
        Quantity: Serenity.DecimalEditor;
        UnitPrice: Serenity.DecimalEditor;
        Amount: Serenity.DecimalEditor;
        TenantId: Serenity.StringEditor;
    }
    class TransactionDetailForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Inventory {
    interface TransactionDetailRow {
        Id?: number;
        TransactionId?: number;
        ProductId?: number;
        Quantity?: number;
        UnitPrice?: number;
        Amount?: number;
        TransactionTransactionType?: number;
        TransactionRefTransactionId?: number;
        TransactionTransactionNumber?: string;
        TransactionTransactionDate?: string;
        TransactionPartyId?: number;
        ProductName?: string;
        ProductProductType?: number;
        ProductProductCategoryId?: number;
        ProductDescription?: string;
        ProductImages?: string;
        LookupText?: string;
        Remarks?: string;
        IUserId?: number;
        TenantId?: number;
        EUserId?: number;
        RowNum?: number;
        IDate?: string;
        EDate?: string;
    }
    namespace TransactionDetailRow {
        const idProperty = "Id";
        const nameProperty = "LookupText";
        const localTextPrefix = "Inventory.TransactionDetail";
        const enum Fields {
            Id = "Id",
            TransactionId = "TransactionId",
            ProductId = "ProductId",
            Quantity = "Quantity",
            UnitPrice = "UnitPrice",
            Amount = "Amount",
            TransactionTransactionType = "TransactionTransactionType",
            TransactionRefTransactionId = "TransactionRefTransactionId",
            TransactionTransactionNumber = "TransactionTransactionNumber",
            TransactionTransactionDate = "TransactionTransactionDate",
            TransactionPartyId = "TransactionPartyId",
            ProductName = "ProductName",
            ProductProductType = "ProductProductType",
            ProductProductCategoryId = "ProductProductCategoryId",
            ProductDescription = "ProductDescription",
            ProductImages = "ProductImages",
            LookupText = "LookupText",
            Remarks = "Remarks",
            IUserId = "IUserId",
            TenantId = "TenantId",
            EUserId = "EUserId",
            RowNum = "RowNum",
            IDate = "IDate",
            EDate = "EDate"
        }
    }
}
declare namespace SereneInventory.Inventory {
    namespace TransactionDetailService {
        const baseUrl = "Inventory/TransactionDetail";
        function Create(request: Serenity.SaveRequest<TransactionDetailRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<TransactionDetailRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<TransactionDetailRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: Serenity.ListRequest, onSuccess?: (response: Serenity.ListResponse<TransactionDetailRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "Inventory/TransactionDetail/Create",
            Update = "Inventory/TransactionDetail/Update",
            Delete = "Inventory/TransactionDetail/Delete",
            Retrieve = "Inventory/TransactionDetail/Retrieve",
            List = "Inventory/TransactionDetail/List"
        }
    }
}
declare namespace SereneInventory.Inventory {
}
declare namespace SereneInventory.Inventory {
    interface TransactionExpenseForm {
        ExpenseType: Serenity.EnumEditor;
        Amount: Serenity.DecimalEditor;
    }
    class TransactionExpenseForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Inventory {
    interface TransactionExpenseRow {
        Id?: number;
        TransactionId?: number;
        ExpenseType?: ExpenseType;
        Amount?: number;
        TransactionTransactionType?: number;
        TransactionRefTransactionId?: number;
        TransactionTransactionNumber?: string;
        TransactionTransactionDate?: string;
        TransactionPartyId?: number;
        Remarks?: string;
        IUserId?: number;
        TenantId?: number;
        EUserId?: number;
        RowNum?: number;
        IDate?: string;
        EDate?: string;
    }
    namespace TransactionExpenseRow {
        const idProperty = "Id";
        const localTextPrefix = "Inventory.TransactionExpense";
        const enum Fields {
            Id = "Id",
            TransactionId = "TransactionId",
            ExpenseType = "ExpenseType",
            Amount = "Amount",
            TransactionTransactionType = "TransactionTransactionType",
            TransactionRefTransactionId = "TransactionRefTransactionId",
            TransactionTransactionNumber = "TransactionTransactionNumber",
            TransactionTransactionDate = "TransactionTransactionDate",
            TransactionPartyId = "TransactionPartyId",
            Remarks = "Remarks",
            IUserId = "IUserId",
            TenantId = "TenantId",
            EUserId = "EUserId",
            RowNum = "RowNum",
            IDate = "IDate",
            EDate = "EDate"
        }
    }
}
declare namespace SereneInventory.Inventory {
    namespace TransactionExpenseService {
        const baseUrl = "Inventory/TransactionExpense";
        function Create(request: Serenity.SaveRequest<TransactionExpenseRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<TransactionExpenseRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<TransactionExpenseRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: Serenity.ListRequest, onSuccess?: (response: Serenity.ListResponse<TransactionExpenseRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "Inventory/TransactionExpense/Create",
            Update = "Inventory/TransactionExpense/Update",
            Delete = "Inventory/TransactionExpense/Delete",
            Retrieve = "Inventory/TransactionExpense/Retrieve",
            List = "Inventory/TransactionExpense/List"
        }
    }
}
declare namespace SereneInventory.Inventory {
    interface TransactionForm {
        TransactionType: Serenity.EnumEditor;
        TransactionNumber: Serenity.StringEditor;
        TransactionDate: Serenity.DateEditor;
        PartyId: Serenity.LookupEditor;
        TenantId: Serenity.StringEditor;
        TransactionDetailRows: TransactionDetailGridEditor;
        TransactionExpenseRows: TransactionExpenseGridEditor;
    }
    class TransactionForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Inventory {
    interface TransactionListRequest extends Serenity.ListRequest {
        ProductId?: number;
    }
}
declare namespace SereneInventory.Inventory {
    interface TransactionRow {
        Id?: number;
        TransactionType?: TransactionType;
        TransactionNumber?: string;
        TransactionDate?: string;
        PartyId?: number;
        PartyPartyType?: number;
        PartyName?: string;
        PartyAddress?: string;
        PartyContact?: string;
        TransactionDetailRows?: TransactionDetailRow[];
        TransactionExpenseRows?: TransactionExpenseRow[];
        TotalQuantity?: number;
        TotalAmount?: number;
        TotalExpense?: number;
        Remarks?: string;
        IUserId?: number;
        TenantId?: number;
        EUserId?: number;
        RowNum?: number;
        IDate?: string;
        EDate?: string;
    }
    namespace TransactionRow {
        const idProperty = "Id";
        const nameProperty = "TransactionNumber";
        const localTextPrefix = "Inventory.Transaction";
        const lookupKey = "Inventory.Transaction";
        function getLookup(): Q.Lookup<TransactionRow>;
        const enum Fields {
            Id = "Id",
            TransactionType = "TransactionType",
            TransactionNumber = "TransactionNumber",
            TransactionDate = "TransactionDate",
            PartyId = "PartyId",
            PartyPartyType = "PartyPartyType",
            PartyName = "PartyName",
            PartyAddress = "PartyAddress",
            PartyContact = "PartyContact",
            TransactionDetailRows = "TransactionDetailRows",
            TransactionExpenseRows = "TransactionExpenseRows",
            TotalQuantity = "TotalQuantity",
            TotalAmount = "TotalAmount",
            TotalExpense = "TotalExpense",
            Remarks = "Remarks",
            IUserId = "IUserId",
            TenantId = "TenantId",
            EUserId = "EUserId",
            RowNum = "RowNum",
            IDate = "IDate",
            EDate = "EDate"
        }
    }
}
declare namespace SereneInventory.Inventory {
    namespace TransactionService {
        const baseUrl = "Inventory/Transaction";
        function Create(request: Serenity.SaveRequest<TransactionRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<TransactionRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<TransactionRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: TransactionListRequest, onSuccess?: (response: Serenity.ListResponse<TransactionRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function GetNextNumber(request: GetNextNumberRequest, onSuccess?: (response: GetNextNumberResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "Inventory/Transaction/Create",
            Update = "Inventory/Transaction/Update",
            Delete = "Inventory/Transaction/Delete",
            Retrieve = "Inventory/Transaction/Retrieve",
            List = "Inventory/Transaction/List",
            GetNextNumber = "Inventory/Transaction/GetNextNumber"
        }
    }
}
declare namespace SereneInventory.Membership {
    interface ChangePasswordForm {
        OldPassword: Serenity.PasswordEditor;
        NewPassword: Serenity.PasswordEditor;
        ConfirmPassword: Serenity.PasswordEditor;
    }
    class ChangePasswordForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Membership {
    interface ChangePasswordRequest extends Serenity.ServiceRequest {
        OldPassword?: string;
        NewPassword?: string;
        ConfirmPassword?: string;
    }
}
declare namespace SereneInventory.Membership {
    interface ForgotPasswordForm {
        Email: Serenity.EmailEditor;
    }
    class ForgotPasswordForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Membership {
    interface ForgotPasswordRequest extends Serenity.ServiceRequest {
        Email?: string;
    }
}
declare namespace SereneInventory.Membership {
    interface LoginForm {
        Username: Serenity.StringEditor;
        Password: Serenity.PasswordEditor;
    }
    class LoginForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Membership {
    interface LoginRequest extends Serenity.ServiceRequest {
        Username?: string;
        Password?: string;
    }
}
declare namespace SereneInventory.Membership {
    interface ResetPasswordForm {
        NewPassword: Serenity.PasswordEditor;
        ConfirmPassword: Serenity.PasswordEditor;
    }
    class ResetPasswordForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Membership {
    interface ResetPasswordRequest extends Serenity.ServiceRequest {
        Token?: string;
        NewPassword?: string;
        ConfirmPassword?: string;
    }
}
declare namespace SereneInventory.Membership {
    interface SignUpForm {
        DisplayName: Serenity.StringEditor;
        Email: Serenity.EmailEditor;
        ConfirmEmail: Serenity.EmailEditor;
        Password: Serenity.PasswordEditor;
        ConfirmPassword: Serenity.PasswordEditor;
    }
    class SignUpForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Membership {
    interface SignUpRequest extends Serenity.ServiceRequest {
        DisplayName?: string;
        Email?: string;
        Password?: string;
    }
}
declare namespace SereneInventory {
    enum PartyType {
        Supplier = 10,
        Customer = 20
    }
}
declare namespace SereneInventory {
    enum ProductType {
        ProductType1 = 10,
        ProductType2 = 20
    }
}
declare namespace SereneInventory {
    interface ScriptUserDefinition {
        Username?: string;
        DisplayName?: string;
        IsAdmin?: boolean;
        Permissions?: {
            [key: string]: boolean;
        };
    }
}
declare namespace SereneInventory.Setup {
}
declare namespace SereneInventory.Setup {
    interface PartyForm {
        PartyType: Serenity.EnumEditor;
        Name: Serenity.StringEditor;
        Address: Serenity.StringEditor;
        Contact: Serenity.StringEditor;
        TenantId: Serenity.StringEditor;
    }
    class PartyForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Setup {
    interface PartyRow {
        Id?: number;
        PartyType?: PartyType;
        Name?: string;
        Address?: string;
        Contact?: string;
        Remarks?: string;
        IUserId?: number;
        TenantId?: number;
        EUserId?: number;
        RowNum?: number;
        IDate?: string;
        EDate?: string;
    }
    namespace PartyRow {
        const idProperty = "Id";
        const nameProperty = "Name";
        const localTextPrefix = "Setup.Party";
        const lookupKey = "Setup.Party";
        function getLookup(): Q.Lookup<PartyRow>;
        const enum Fields {
            Id = "Id",
            PartyType = "PartyType",
            Name = "Name",
            Address = "Address",
            Contact = "Contact",
            Remarks = "Remarks",
            IUserId = "IUserId",
            TenantId = "TenantId",
            EUserId = "EUserId",
            RowNum = "RowNum",
            IDate = "IDate",
            EDate = "EDate"
        }
    }
}
declare namespace SereneInventory.Setup {
    namespace PartyService {
        const baseUrl = "Setup/Party";
        function Create(request: Serenity.SaveRequest<PartyRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<PartyRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<PartyRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: Serenity.ListRequest, onSuccess?: (response: Serenity.ListResponse<PartyRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "Setup/Party/Create",
            Update = "Setup/Party/Update",
            Delete = "Setup/Party/Delete",
            Retrieve = "Setup/Party/Retrieve",
            List = "Setup/Party/List"
        }
    }
}
declare namespace SereneInventory.Setup {
}
declare namespace SereneInventory.Setup {
    interface ProductCategoryForm {
        Name: Serenity.StringEditor;
        Description: Serenity.StringEditor;
        TenantId: Serenity.StringEditor;
    }
    class ProductCategoryForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Setup {
    interface ProductCategoryRow {
        Id?: number;
        Name?: string;
        Description?: string;
        Remarks?: string;
        IUserId?: number;
        TenantId?: number;
        EUserId?: number;
        RowNum?: number;
        IDate?: string;
        EDate?: string;
    }
    namespace ProductCategoryRow {
        const idProperty = "Id";
        const nameProperty = "Name";
        const localTextPrefix = "Setup.ProductCategory";
        const lookupKey = "Setup.ProductCategory";
        function getLookup(): Q.Lookup<ProductCategoryRow>;
        const enum Fields {
            Id = "Id",
            Name = "Name",
            Description = "Description",
            Remarks = "Remarks",
            IUserId = "IUserId",
            TenantId = "TenantId",
            EUserId = "EUserId",
            RowNum = "RowNum",
            IDate = "IDate",
            EDate = "EDate"
        }
    }
}
declare namespace SereneInventory.Setup {
    namespace ProductCategoryService {
        const baseUrl = "Setup/ProductCategory";
        function Create(request: Serenity.SaveRequest<ProductCategoryRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<ProductCategoryRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<ProductCategoryRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: Serenity.ListRequest, onSuccess?: (response: Serenity.ListResponse<ProductCategoryRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "Setup/ProductCategory/Create",
            Update = "Setup/ProductCategory/Update",
            Delete = "Setup/ProductCategory/Delete",
            Retrieve = "Setup/ProductCategory/Retrieve",
            List = "Setup/ProductCategory/List"
        }
    }
}
declare namespace SereneInventory.Setup {
}
declare namespace SereneInventory.Setup {
    interface ProductForm {
        Name: Serenity.StringEditor;
        Code: Serenity.StringEditor;
        ProductCategoryId: Serenity.LookupEditor;
        Description: Serenity.StringEditor;
        Images: Serenity.MultipleImageUploadEditor;
        TenantId: Serenity.StringEditor;
    }
    class ProductForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace SereneInventory.Setup {
    interface ProductRow {
        Id?: number;
        Name?: string;
        Code?: string;
        ProductType?: ProductType;
        ProductCategoryId?: number;
        Description?: string;
        Images?: string;
        ProductCategoryName?: string;
        ProductCategoryDescription?: string;
        QuantityIn?: number;
        QuantityOut?: number;
        RemainingQuantity?: number;
        Remarks?: string;
        IUserId?: number;
        TenantId?: number;
        EUserId?: number;
        RowNum?: number;
        IDate?: string;
        EDate?: string;
    }
    namespace ProductRow {
        const idProperty = "Id";
        const nameProperty = "Name";
        const localTextPrefix = "Setup.Product";
        const lookupKey = "Setup.Product";
        function getLookup(): Q.Lookup<ProductRow>;
        const enum Fields {
            Id = "Id",
            Name = "Name",
            Code = "Code",
            ProductType = "ProductType",
            ProductCategoryId = "ProductCategoryId",
            Description = "Description",
            Images = "Images",
            ProductCategoryName = "ProductCategoryName",
            ProductCategoryDescription = "ProductCategoryDescription",
            QuantityIn = "QuantityIn",
            QuantityOut = "QuantityOut",
            RemainingQuantity = "RemainingQuantity",
            Remarks = "Remarks",
            IUserId = "IUserId",
            TenantId = "TenantId",
            EUserId = "EUserId",
            RowNum = "RowNum",
            IDate = "IDate",
            EDate = "EDate"
        }
    }
}
declare namespace SereneInventory.Setup {
    namespace ProductService {
        const baseUrl = "Setup/Product";
        function Create(request: Serenity.SaveRequest<ProductRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<ProductRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<ProductRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: Serenity.ListRequest, onSuccess?: (response: Serenity.ListResponse<ProductRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "Setup/Product/Create",
            Update = "Setup/Product/Update",
            Delete = "Setup/Product/Delete",
            Retrieve = "Setup/Product/Retrieve",
            List = "Setup/Product/List"
        }
    }
}
declare namespace SereneInventory.Texts {
}
declare namespace SereneInventory {
    enum TransactionType {
        PurchaseInvoice = 10,
        SalesInvoice = 20
    }
}
declare namespace _Ext {
    enum AuditActionType {
        Insert = 1,
        Update = 2,
        Delete = 3
    }
}
declare namespace _Ext {
}
declare namespace _Ext {
    interface AuditLogForm {
        EntityTableName: Serenity.StringEditor;
        VersionNo: Serenity.IntegerEditor;
        UserId: Serenity.LookupEditor;
        ActionType: Serenity.EnumEditor;
        ActionDate: Serenity.DateTimeEditor;
        EntityId: Serenity.IntegerEditor;
        OldEntity: Serenity.StringEditor;
        NewEntity: Serenity.StringEditor;
        Differences: StaticTextBlock;
        IpAddress: Serenity.StringEditor;
        SessionId: Serenity.StringEditor;
    }
    class AuditLogForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace _Ext {
    interface AuditLogRow {
        Id?: number;
        VersionNo?: number;
        UserId?: number;
        ActionType?: AuditActionType;
        ActionDate?: string;
        EntityTableName?: string;
        EntityId?: number;
        OldEntity?: string;
        NewEntity?: string;
        IpAddress?: string;
        SessionId?: string;
    }
    namespace AuditLogRow {
        const idProperty = "Id";
        const nameProperty = "EntityTableName";
        const localTextPrefix = "_Ext.AuditLog";
        const enum Fields {
            Id = "Id",
            VersionNo = "VersionNo",
            UserId = "UserId",
            ActionType = "ActionType",
            ActionDate = "ActionDate",
            EntityTableName = "EntityTableName",
            EntityId = "EntityId",
            OldEntity = "OldEntity",
            NewEntity = "NewEntity",
            IpAddress = "IpAddress",
            SessionId = "SessionId"
        }
    }
}
declare namespace _Ext {
    namespace AuditLogService {
        const baseUrl = "_Ext/AuditLog";
        function Create(request: Serenity.SaveRequest<AuditLogRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Update(request: Serenity.SaveRequest<AuditLogRow>, onSuccess?: (response: Serenity.SaveResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Delete(request: Serenity.DeleteRequest, onSuccess?: (response: Serenity.DeleteResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Retrieve(request: Serenity.RetrieveRequest, onSuccess?: (response: Serenity.RetrieveResponse<AuditLogRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function List(request: Serenity.ListRequest, onSuccess?: (response: Serenity.ListResponse<AuditLogRow>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Create = "_Ext/AuditLog/Create",
            Update = "_Ext/AuditLog/Update",
            Delete = "_Ext/AuditLog/Delete",
            Retrieve = "_Ext/AuditLog/Retrieve",
            List = "_Ext/AuditLog/List"
        }
    }
}
declare namespace _Ext {
    interface AuditLogViewerRequest extends Serenity.ServiceRequest {
        FormKey?: string;
        EntityId?: number;
    }
}
declare namespace _Ext {
    interface AuditLogViewerResponse extends Serenity.ServiceResponse {
        EntityVersions?: AuditLogRow[];
    }
}
declare namespace _Ext {
    namespace AuditLogViewerService {
        const baseUrl = "AuditLogViewer";
        function List(request: AuditLogViewerRequest, onSuccess?: (response: AuditLogViewerResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            List = "AuditLogViewer/List"
        }
    }
}
declare namespace _Ext.DevTools {
    interface SergenConnection {
        Key?: string;
    }
}
declare namespace _Ext.DevTools {
    interface SergenGenerateOptions {
        Row?: boolean;
        Service?: boolean;
        UI?: boolean;
    }
}
declare namespace _Ext.DevTools {
    interface SergenGenerateRequest extends Serenity.ServiceRequest {
        ConnectionKey?: string;
        Table?: SergenTable;
        GenerateOptions?: SergenGenerateOptions;
    }
}
declare namespace _Ext.DevTools {
    interface SergenListTablesRequest extends Serenity.ServiceRequest {
        ConnectionKey?: string;
    }
}
declare namespace _Ext.DevTools {
    namespace SergenService {
        const baseUrl = "DevTools/Sergen";
        function ListConnections(request: Serenity.ServiceRequest, onSuccess?: (response: Serenity.ListResponse<SergenConnection>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function ListTables(request: SergenListTablesRequest, onSuccess?: (response: Serenity.ListResponse<SergenTable>) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        function Generate(request: SergenGenerateRequest, onSuccess?: (response: Serenity.ServiceResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            ListConnections = "DevTools/Sergen/ListConnections",
            ListTables = "DevTools/Sergen/ListTables",
            Generate = "DevTools/Sergen/Generate"
        }
    }
}
declare namespace _Ext.DevTools {
    interface SergenTable {
        Tablename?: string;
        Identifier?: string;
        Module?: string;
        PermissionKey?: string;
    }
}
declare namespace _Ext {
    interface EntityReportRequest extends Serenity.RetrieveRequest {
        ReportKey?: string;
        ReportServiceMethodName?: string;
        ReportDesignPath?: string;
    }
}
declare namespace _Ext {
    interface ListReportRequest extends Serenity.ListRequest {
        ReportKey?: string;
        ReportServiceMethodName?: string;
        ListExcelServiceMethodName?: string;
        ReportDesignPath?: string;
        EqualityFilterWithTextValue?: {
            [key: string]: string;
        };
    }
}
declare namespace _Ext {
    enum Months {
        January = 0,
        February = 1,
        March = 2,
        April = 3,
        May = 4,
        June = 5,
        July = 6,
        August = 7,
        September = 8,
        October = 9,
        November = 10,
        December = 11
    }
}
declare namespace _Ext {
    interface ReplaceRowForm {
        DeletedEntityName: Serenity.StringEditor;
        ReplaceWithEntityId: EmptyLookupEditor;
    }
    class ReplaceRowForm extends Serenity.PrefixedContext {
        static formKey: string;
        private static init;
        constructor(prefix: string);
    }
}
declare namespace _Ext {
    interface ReplaceRowRequest extends Serenity.ServiceRequest {
        FormKey?: string;
        IdProperty?: string;
        NameProperty?: string;
        EntityTypeTitle?: string;
        DeletedEntityId?: number;
        DeletedEntityName?: string;
        ReplaceWithEntityId?: number;
    }
}
declare namespace _Ext {
    interface ReplaceRowResponse extends Serenity.ServiceResponse {
    }
}
declare namespace _Ext {
    namespace ReplaceRowService {
        const baseUrl = "ReplaceRow";
        function Replace(request: ReplaceRowRequest, onSuccess?: (response: ReplaceRowResponse) => void, opt?: Q.ServiceOptions<any>): JQueryXHR;
        const enum Methods {
            Replace = "ReplaceRow/Replace"
        }
    }
}
declare namespace _Ext.Reports {
    interface CommonReportRequest extends Serenity.ListRequest {
        ColumnKey?: string;
        ReportKey?: string;
        ReportServiceMethodName?: string;
        ListExcelServiceMethodName?: string;
        ReportDesignPath?: string;
        EqualityFilterWithTextValue?: {
            [key: string]: string;
        };
    }
}
declare namespace _Ext.Reports {
    namespace CommonReportService {
        const baseUrl = "Reports/CommonReport";
        const enum Methods {
        }
    }
}
declare namespace _Ext {
    enum TimeUoM {
        Hour = 1,
        Day = 2,
        Week = 3,
        Month = 4,
        CalenderMonth = 5,
        Year = 6
    }
}
declare namespace SereneInventory.Administration {
    class LanguageDialog extends Serenity.EntityDialog<LanguageRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected form: LanguageForm;
    }
}
declare namespace SereneInventory.Administration {
    class LanguageGrid extends Serenity.EntityGrid<LanguageRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof LanguageDialog;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        constructor(container: JQuery);
        protected getDefaultSortBy(): LanguageRow.Fields[];
    }
}
declare namespace SereneInventory.Administration {
    class RoleDialog extends Serenity.EntityDialog<RoleRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected form: RoleForm;
        protected getToolbarButtons(): Serenity.ToolButton[];
        protected updateInterface(): void;
    }
}
declare namespace SereneInventory.Administration {
    class RoleGrid extends Serenity.EntityGrid<RoleRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof RoleDialog;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        constructor(container: JQuery);
        protected getDefaultSortBy(): RoleRow.Fields[];
    }
}
declare namespace SereneInventory.Administration {
    class RolePermissionDialog extends Serenity.TemplatedDialog<RolePermissionDialogOptions> {
        private permissions;
        constructor(opt: RolePermissionDialogOptions);
        protected getDialogOptions(): JQueryUI.DialogOptions;
        protected getTemplate(): string;
    }
    interface RolePermissionDialogOptions {
        roleID?: number;
        title?: string;
    }
}
declare namespace q {
    function text(key: string, fallback: string): string;
    function isCosmicThemeApplied(): boolean;
    function getSelectedLanguage(): string;
    function formatDecimal(value: any): string;
    function formatInt(value: any): string;
    function ToNumber(value: any): any;
    function ToBool(value: any): boolean;
    function getRandomColor(hexLetters: any): string;
}
declare namespace SereneInventory.Administration {
    class TenantDialog extends _Ext.DialogBase<TenantRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected form: TenantForm;
    }
}
declare namespace SereneInventory.Administration {
    class TenantGrid extends _Ext.GridBase<TenantRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof TenantDialog;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        constructor(container: JQuery);
    }
}
declare namespace SereneInventory.Administration {
    class TranslationGrid extends Serenity.EntityGrid<TranslationItem, any> {
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        private hasChanges;
        private searchText;
        private sourceLanguage;
        private targetLanguage;
        private targetLanguageKey;
        constructor(container: JQuery);
        protected onClick(e: JQueryEventObject, row: number, cell: number): any;
        protected getColumns(): Slick.Column[];
        protected createToolbarExtensions(): void;
        protected saveChanges(language: string): PromiseLike<any>;
        protected onViewSubmit(): boolean;
        protected getButtons(): Serenity.ToolButton[];
        protected createQuickSearchInput(): void;
        protected onViewFilter(item: TranslationItem): boolean;
        protected usePager(): boolean;
    }
}
declare namespace SereneInventory.Administration {
    class UserDialog extends Serenity.EntityDialog<UserRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getIsActiveProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected form: UserForm;
        constructor();
        protected getToolbarButtons(): Serenity.ToolButton[];
        protected updateInterface(): void;
        protected afterLoadEntity(): void;
    }
}
declare namespace SereneInventory.Administration {
    class UserGrid extends Serenity.EntityGrid<UserRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof UserDialog;
        protected getIdProperty(): string;
        protected getIsActiveProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        constructor(container: JQuery);
        protected getDefaultSortBy(): UserRow.Fields[];
    }
}
declare namespace SereneInventory.Authorization {
    let userDefinition: ScriptUserDefinition;
    function hasPermission(permissionKey: string): boolean;
}
declare namespace SereneInventory.Administration {
    class PermissionCheckEditor extends Serenity.DataGrid<PermissionCheckItem, PermissionCheckEditorOptions> {
        protected getIdProperty(): string;
        private searchText;
        private byParentKey;
        constructor(container: JQuery, opt: PermissionCheckEditorOptions);
        private getItemGrantRevokeClass;
        private roleOrImplicit;
        private getItemEffectiveClass;
        protected getColumns(): Slick.Column[];
        setItems(items: PermissionCheckItem[]): void;
        protected onViewSubmit(): boolean;
        protected onViewFilter(item: PermissionCheckItem): boolean;
        private matchContains;
        private getDescendants;
        protected onClick(e: any, row: any, cell: any): void;
        private getParentKey;
        protected getButtons(): Serenity.ToolButton[];
        protected createToolbarExtensions(): void;
        private getSortedGroupAndPermissionKeys;
        value: UserPermissionRow[];
        private _rolePermissions;
        rolePermissions: string[];
        private _implicitPermissions;
        implicitPermissions: Q.Dictionary<string[]>;
    }
    interface PermissionCheckEditorOptions {
        showRevoke?: boolean;
    }
    interface PermissionCheckItem {
        ParentKey?: string;
        Key?: string;
        Title?: string;
        IsGroup?: boolean;
        GrantRevoke?: boolean;
    }
}
declare namespace SereneInventory.Administration {
    class UserPermissionDialog extends Serenity.TemplatedDialog<UserPermissionDialogOptions> {
        private permissions;
        constructor(opt: UserPermissionDialogOptions);
        protected getDialogOptions(): JQueryUI.DialogOptions;
        protected getTemplate(): string;
    }
    interface UserPermissionDialogOptions {
        userID?: number;
        username?: string;
    }
}
declare namespace SereneInventory.Administration {
    class RoleCheckEditor extends Serenity.CheckTreeEditor<Serenity.CheckTreeItem<any>, any> {
        private searchText;
        constructor(div: JQuery);
        protected createToolbarExtensions(): void;
        protected getButtons(): any[];
        protected getTreeItems(): Serenity.CheckTreeItem<any>[];
        protected onViewFilter(item: any): boolean;
    }
}
declare namespace SereneInventory.Administration {
    class UserRoleDialog extends Serenity.TemplatedDialog<UserRoleDialogOptions> {
        private permissions;
        constructor(opt: UserRoleDialogOptions);
        protected getDialogOptions(): JQueryUI.DialogOptions;
        protected getTemplate(): string;
    }
    interface UserRoleDialogOptions {
        userID: number;
        username: string;
    }
}
declare namespace SereneInventory.LanguageList {
    function getValue(): string[][];
}
declare namespace SereneInventory.ScriptInitialization {
}
declare namespace SereneInventory {
    class BasicProgressDialog extends Serenity.TemplatedDialog<any> {
        constructor();
        cancelled: boolean;
        max: number;
        value: number;
        title: string;
        cancelTitle: string;
        getDialogOptions(): JQueryUI.DialogOptions;
        initDialog(): void;
        getTemplate(): string;
    }
}
declare namespace SereneInventory.Common {
    class BulkServiceAction {
        protected keys: string[];
        protected queue: string[];
        protected queueIndex: number;
        protected progressDialog: BasicProgressDialog;
        protected pendingRequests: number;
        protected completedRequests: number;
        protected errorByKey: Q.Dictionary<Serenity.ServiceError>;
        private successCount;
        private errorCount;
        done: () => void;
        protected createProgressDialog(): void;
        protected getConfirmationFormat(): string;
        protected getConfirmationMessage(targetCount: any): string;
        protected confirm(targetCount: any, action: any): void;
        protected getNothingToProcessMessage(): string;
        protected nothingToProcess(): void;
        protected getParallelRequests(): number;
        protected getBatchSize(): number;
        protected startParallelExecution(): void;
        protected serviceCallCleanup(): void;
        protected executeForBatch(batch: string[]): void;
        protected executeNextBatch(): void;
        protected getAllHadErrorsFormat(): string;
        protected showAllHadErrors(): void;
        protected getSomeHadErrorsFormat(): string;
        protected showSomeHadErrors(): void;
        protected getAllSuccessFormat(): string;
        protected showAllSuccess(): void;
        protected showResults(): void;
        execute(keys: string[]): void;
        get_successCount(): any;
        set_successCount(value: number): void;
        get_errorCount(): any;
        set_errorCount(value: number): void;
    }
}
declare namespace SereneInventory.DialogUtils {
    function pendingChangesConfirmation(element: JQuery, hasPendingChanges: () => boolean): void;
}
declare namespace SereneInventory.Common {
    class EnumSelectFormatter implements Slick.Formatter {
        constructor();
        format(ctx: Slick.FormatterContext): string;
        enumKey: string;
        allowClear: boolean;
        emptyItemText: string;
    }
}
declare namespace SereneInventory.Common {
    interface ExcelExportOptions {
        grid: Serenity.DataGrid<any, any>;
        service: string;
        onViewSubmit: () => boolean;
        title?: string;
        hint?: string;
        separator?: boolean;
    }
    namespace ExcelExportHelper {
        function createToolButton(options: ExcelExportOptions): Serenity.ToolButton;
    }
}
declare namespace SereneInventory.Common {
    class GridEditorBase<TEntity> extends Serenity.EntityGrid<TEntity, any> implements Serenity.IGetEditValue, Serenity.ISetEditValue {
        protected getIdProperty(): string;
        protected nextId: number;
        constructor(container: JQuery);
        protected id(entity: TEntity): any;
        protected getNextId(): string;
        protected setNewId(entity: TEntity): void;
        protected save(opt: Serenity.ServiceOptions<any>, callback: (r: Serenity.ServiceResponse) => void): void;
        protected deleteEntity(id: number): boolean;
        protected validateEntity(row: TEntity, id: number): boolean;
        protected setEntities(items: TEntity[]): void;
        protected getNewEntity(): TEntity;
        protected getButtons(): Serenity.ToolButton[];
        protected editItem(entityOrId: any): void;
        getEditValue(property: any, target: any): void;
        setEditValue(source: any, property: any): void;
        value: TEntity[];
        protected getGridCanLoad(): boolean;
        protected usePager(): boolean;
        protected getInitialTitle(): any;
        protected createQuickSearchInput(): void;
    }
}
declare namespace SereneInventory.Common {
    class GridEditorDialog<TEntity> extends Serenity.EntityDialog<TEntity, any> {
        protected getIdProperty(): string;
        onSave: (options: Serenity.ServiceOptions<Serenity.SaveResponse>, callback: (response: Serenity.SaveResponse) => void) => void;
        onDelete: (options: Serenity.ServiceOptions<Serenity.DeleteResponse>, callback: (response: Serenity.DeleteResponse) => void) => void;
        destroy(): void;
        protected updateInterface(): void;
        protected saveHandler(options: Serenity.ServiceOptions<Serenity.SaveResponse>, callback: (response: Serenity.SaveResponse) => void): void;
        protected deleteHandler(options: Serenity.ServiceOptions<Serenity.DeleteResponse>, callback: (response: Serenity.DeleteResponse) => void): void;
    }
}
declare namespace SereneInventory {
    /**
     * This is an editor widget but it only displays a text, not edits it.
     *
     */
    class StaticTextBlock extends Serenity.Widget<StaticTextBlockOptions> implements Serenity.ISetEditValue {
        private value;
        constructor(container: JQuery, options: StaticTextBlockOptions);
        private updateElementContent;
        /**
         * By implementing ISetEditValue interface, we allow this editor to display its field value.
         * But only do this when our text content is not explicitly set in options
         */
        setEditValue(source: any, property: Serenity.PropertyItem): void;
    }
    interface StaticTextBlockOptions {
        text: string;
        isHtml: boolean;
        isLocalText: boolean;
        hideLabel: boolean;
    }
}
declare namespace SereneInventory.Common {
    class LanguageSelection extends Serenity.Widget<any> {
        constructor(select: JQuery, currentLanguage: string);
    }
}
declare namespace SereneInventory.Common {
    class SidebarSearch extends Serenity.Widget<any> {
        private menuUL;
        constructor(input: JQuery, menuUL: JQuery);
        protected updateMatchFlags(text: string): void;
    }
}
declare namespace SereneInventory.Common {
    class ThemeSelection extends Serenity.Widget<any> {
        constructor(select: JQuery);
        protected getCurrentTheme(): string;
    }
}
declare var jsPDF: any;
declare namespace SereneInventory.Common {
    interface PdfExportOptions {
        grid: Serenity.DataGrid<any, any>;
        onViewSubmit: () => boolean;
        title?: string;
        hint?: string;
        separator?: boolean;
        reportTitle?: string;
        titleTop?: number;
        titleFontSize?: number;
        fileName?: string;
        pageNumbers?: boolean;
        columnTitles?: {
            [key: string]: string;
        };
        tableOptions?: jsPDF.AutoTableOptions;
        output?: string;
        autoPrint?: boolean;
        printDateTimeHeader?: boolean;
    }
    namespace PdfExportHelper {
        function exportToPdf(options: PdfExportOptions): void;
        function createToolButton(options: PdfExportOptions): Serenity.ToolButton;
    }
}
declare var jsPDF: any;
declare namespace SereneInventory.Common {
    class ReportDialog extends Serenity.TemplatedDialog<ReportDialogOptions> {
        private report;
        private propertyGrid;
        constructor(options: ReportDialogOptions);
        protected getDialogButtons(): any;
        protected createPropertyGrid(): void;
        protected loadReport(reportKey: string): void;
        protected updateInterface(): void;
        executeReport(target: string, ext: string, download: boolean): void;
        getToolbarButtons(): {
            title: string;
            cssClass: string;
            onClick: () => void;
        }[];
    }
    interface ReportDialogOptions {
        reportKey: string;
    }
}
declare namespace SereneInventory.Common {
    interface ReportExecuteOptions {
        reportKey: string;
        download?: boolean;
        extension?: 'pdf' | 'htm' | 'html' | 'xlsx' | 'docx';
        getParams?: () => any;
        params?: {
            [key: string]: any;
        };
        target?: string;
    }
    interface ReportButtonOptions extends ReportExecuteOptions {
        title?: string;
        cssClass?: string;
        icon?: string;
    }
    namespace ReportHelper {
        function createToolButton(options: ReportButtonOptions): Serenity.ToolButton;
        function execute(options: ReportExecuteOptions): void;
    }
}
declare var jsPDF: any;
declare namespace SereneInventory.Common {
    class ReportPage extends Serenity.Widget<any> {
        private reportKey;
        private propertyItems;
        private propertyGrid;
        constructor(element: JQuery);
        protected updateMatchFlags(text: string): void;
        protected categoryClick(e: any): void;
        protected reportLinkClick(e: any): void;
    }
}
declare namespace SereneInventory.Common {
    class UserPreferenceStorage implements Serenity.SettingStorage {
        getItem(key: string): string;
        setItem(key: string, data: string): void;
    }
}
declare namespace SereneInventory.Inventory {
    class ProfitLossReportPanel extends _Ext.ReportPanelBase<ProfitLossReportRequest> {
        protected getReportTitle(): string;
        protected getReportKey(): string;
        protected getFormKey(): string;
        private form;
        constructor(container: JQuery);
    }
}
declare namespace SereneInventory.Inventory {
    class TransactionDialog extends _Ext.DialogBase<TransactionRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected getEntityTitle(): string;
        protected form: TransactionForm;
        constructor();
        protected getToolbarButtons(): Serenity.ToolButton[];
        protected getSaveEntity(): TransactionRow;
        protected getPropertyItems(): Serenity.PropertyItem[];
        protected afterLoadEntity(): void;
        private getNextNumber;
    }
}
declare namespace SereneInventory.Inventory {
    class TransactionGrid extends _Ext.GridBase<TransactionRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof TransactionDialog;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        protected getDisplayName(): string;
        protected getItemName(): string;
        constructor(container: JQuery);
        protected getColumns(): Slick.Column[];
        protected getQuickFilters(): Serenity.QuickFilter<Serenity.Widget<any>, any>[];
        protected onViewSubmit(): boolean;
    }
}
declare namespace SereneInventory.Inventory {
    class TransactionEditorDialog extends _Ext.EditorDialogBase<TransactionRow> {
        protected getFormKey(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getEntityTitle(): string;
        protected form: TransactionForm;
        protected getPropertyItems(): Serenity.PropertyItem[];
    }
}
declare namespace SereneInventory.Inventory {
    class TransactionEditorGrid extends _Ext.GridEditorBase<TransactionRow> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof TransactionEditorDialog;
        protected getLocalTextPrefix(): string;
        protected getDisplayName(): string;
        protected getItemName(): string;
        constructor(container: JQuery);
        protected getButtons(): any[];
        protected getColumns(): Slick.Column[];
    }
}
declare namespace SereneInventory.Inventory {
    class PurchaseInvoiceDialog extends _Ext.DialogBase<TransactionRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected getEntityTitle(): string;
        protected form: PurchaseInvoiceForm;
        constructor();
        protected getSaveEntity(): TransactionRow;
        protected afterLoadEntity(): void;
        private calculateAmount;
        private getNextNumber;
    }
}
declare namespace SereneInventory.Inventory {
    class PurchaseInvoiceGrid extends _Ext.GridBase<TransactionRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof PurchaseInvoiceDialog;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        protected getDisplayName(): string;
        protected getItemName(): string;
        constructor(container: JQuery);
        protected getQuickFilters(): Serenity.QuickFilter<Serenity.Widget<any>, any>[];
        protected onViewSubmit(): boolean;
    }
}
declare namespace SereneInventory.Inventory {
    class SalesInvoiceDialog extends _Ext.DialogBase<TransactionRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected getEntityTitle(): string;
        protected form: TransactionForm;
        constructor();
        protected getToolbarButtons(): Serenity.ToolButton[];
        protected getSaveEntity(): TransactionRow;
        protected afterLoadEntity(): void;
        private getNextNumber;
    }
}
declare namespace SereneInventory.Inventory {
    class SalesInvoiceGrid extends _Ext.GridBase<TransactionRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof SalesInvoiceDialog;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        protected getDisplayName(): string;
        protected getItemName(): string;
        constructor(container: JQuery);
        protected getQuickFilters(): Serenity.QuickFilter<Serenity.Widget<any>, any>[];
        protected onViewSubmit(): boolean;
    }
}
declare namespace SereneInventory.Inventory {
    class TransactionDetailEditorDialog extends _Ext.EditorDialogBase<TransactionDetailRow> {
        protected getFormKey(): string;
        protected getLocalTextPrefix(): string;
        protected form: TransactionDetailForm;
        constructor();
        private calculateAmount;
    }
}
declare namespace SereneInventory.Inventory {
    class TransactionDetailGridEditor extends _Ext.GridEditorBase<TransactionDetailRow> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof TransactionDetailEditorDialog;
        protected getLocalTextPrefix(): string;
        constructor(container: JQuery);
        validateEntity(row: TransactionDetailRow, id: number): boolean;
    }
}
declare namespace SereneInventory.Inventory {
    class TransactionExpenseDialog extends _Ext.EditorDialogBase<TransactionExpenseRow> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected form: TransactionExpenseForm;
    }
}
declare namespace SereneInventory.Inventory {
    class TransactionExpenseGridEditor extends _Ext.GridEditorBase<TransactionExpenseRow> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof TransactionExpenseDialog;
        protected getLocalTextPrefix(): string;
        constructor(container: JQuery);
    }
}
declare namespace SereneInventory.Membership {
    class ChangePasswordPanel extends Serenity.PropertyPanel<ChangePasswordRequest, any> {
        protected getFormKey(): string;
        private form;
        constructor(container: JQuery);
    }
}
declare namespace SereneInventory.Membership {
    class ForgotPasswordPanel extends Serenity.PropertyPanel<ForgotPasswordRequest, any> {
        protected getFormKey(): string;
        private form;
        constructor(container: JQuery);
    }
}
declare namespace SereneInventory.Membership {
    class ResetPasswordPanel extends Serenity.PropertyPanel<ResetPasswordRequest, any> {
        protected getFormKey(): string;
        private form;
        constructor(container: JQuery);
    }
}
declare namespace SereneInventory.Membership {
    class SignUpPanel extends Serenity.PropertyPanel<SignUpRequest, any> {
        protected getFormKey(): string;
        private form;
        constructor(container: JQuery);
    }
}
declare namespace SereneInventory.Setup {
    class PartyDialog extends _Ext.DialogBase<PartyRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected form: PartyForm;
    }
}
declare namespace SereneInventory.Setup {
    class PartyGrid extends _Ext.GridBase<PartyRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof PartyDialog;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        constructor(container: JQuery);
    }
}
declare namespace SereneInventory.Setup {
    class ProductDialog extends _Ext.DialogBase<ProductRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected form: ProductForm;
    }
}
declare namespace SereneInventory.Setup {
    class ProductGrid extends _Ext.GridBase<ProductRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof ProductDialog;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        constructor(container: JQuery);
    }
}
declare namespace SereneInventory.Setup {
    class ProductCategoryDialog extends _Ext.DialogBase<ProductCategoryRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected form: ProductCategoryForm;
    }
}
declare namespace SereneInventory.Setup {
    class ProductCategoryGrid extends _Ext.GridBase<ProductCategoryRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof ProductCategoryDialog;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        constructor(container: JQuery);
    }
}
declare namespace _Ext {
    class AuditLogActionTypeFormatter implements Slick.Formatter {
        static format(ctx: Slick.FormatterContext): string;
        format(ctx: Slick.FormatterContext): string;
    }
}
declare namespace _Ext {
    class AuditLogDialog extends DialogBase<AuditLogRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected form: AuditLogForm;
        protected afterLoadEntity(): void;
    }
}
declare namespace _Ext {
    class AuditLogGrid extends GridBase<AuditLogRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof AuditLogDialog;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        constructor(container: JQuery);
        protected getButtons(): Serenity.ToolButton[];
    }
}
declare var jsondiffpatch: any;
declare namespace _Ext {
    class AuditLogViewer {
        el: string;
        data: {
            entityVersions: any[];
        };
        entity: any;
        entityId: any;
        constructor(el: string, entityVersions: AuditLogRow[]);
        mounted: () => void;
        computed: {
            test: () => string;
        };
        filters: {
            filterByYardId: () => any[];
        };
        methods: {
            showDiff: (versionInfo: AuditLogRow) => void;
            getDiff: (versionInfo: AuditLogRow) => any;
        };
        destroyed(): void;
    }
}
declare namespace _Ext {
    class AuditLogViewerDialog extends Serenity.TemplatedDialog<any> {
        request: AuditLogViewerRequest;
        constructor(request: AuditLogViewerRequest);
        protected getTemplateName(): string;
    }
}
declare namespace _Ext {
    class DialogSnippets extends DialogBase<AuditLogRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected form: AuditLogForm;
        protected addCssClass(): void;
        protected getTemplate(): string;
        protected getTemplateName(): string;
        protected getFallbackTemplate(): string;
        protected initValidator(): void;
        protected getValidatorOptions(): JQueryValidation.ValidationOptions;
        protected initTabs(): void;
        protected initToolbar(): void;
        protected getToolbarButtons(): Serenity.ToolButton[];
        protected initPropertyGrid(): void;
        protected initPropertyGridAsync(): PromiseLike<void>;
        protected getPropertyGridOptions(): Serenity.PropertyGridOptions;
        protected getPropertyGridOptionsAsync(): PromiseLike<Serenity.PropertyGridOptions>;
        protected initLocalizationGrid(): void;
        protected initLocalizationGridAsync(): PromiseLike<void>;
        protected initLocalizationGridCommon(pgOptions: Serenity.PropertyGridOptions): void;
        load(entityOrId: any, done: () => void, fail: (ex: ss.Exception) => void): void;
        loadResponse(data: any): void;
        protected onLoadingData(data: Serenity.RetrieveResponse<AuditLogRow>): void;
        protected beforeLoadEntity(entity: AuditLogRow): void;
        protected loadEntity(entity: AuditLogRow): void;
        protected set_entityId(value: any): void;
        protected set_entity(entity: any): void;
        protected isEditMode(): boolean;
        protected get_entityId(): any;
        protected get_entity(): AuditLogRow;
        protected afterLoadEntity(): void;
        protected updateInterface(): void;
        protected isDeleted(): boolean;
        protected isLocalizationMode(): boolean;
        protected isNew(): boolean;
        protected updateTitle(): void;
        protected getEntityTitle(): string;
        protected getEntitySingular(): string;
        protected getSaveEntity(): AuditLogRow;
        protected initDialog(): void;
        protected getDialogOptions(): JQueryUI.DialogOptions;
        protected getDialogTitle(): string;
        protected handleResponsive(): void;
        protected onDialogOpen(): void;
        protected arrange(): void;
        protected save(callback?: (response: Serenity.SaveResponse) => void): void | boolean;
        protected validateBeforeSave(): boolean;
        protected save_submitHandler(callback: (response: Serenity.SaveResponse) => void): void;
        protected getSaveOptions(callback: (response: Serenity.SaveResponse) => void): Serenity.ServiceOptions<Serenity.SaveResponse>;
        protected getSaveRequest(): Serenity.SaveRequest<AuditLogRow>;
        protected saveHandler(options: Serenity.ServiceOptions<Serenity.SaveResponse>, callback: (response: Serenity.SaveResponse) => void): void;
        protected onSaveSuccess(response: Serenity.SaveResponse): void;
        loadById(id: any, callback?: (response: Serenity.RetrieveResponse<AuditLogRow>) => void, fail?: () => void): void;
        protected getLoadByIdRequest(id: any): Serenity.RetrieveRequest;
        protected getLoadByIdOptions(id: any, callback: (response: Serenity.RetrieveResponse<AuditLogRow>) => void): Serenity.ServiceOptions<Serenity.RetrieveResponse<AuditLogRow>>;
        protected loadByIdHandler(options: Serenity.ServiceOptions<Serenity.RetrieveResponse<AuditLogRow>>, callback: (response: Serenity.RetrieveResponse<AuditLogRow>) => void, fail: () => void): void;
        protected showSaveSuccessMessage(response: Serenity.SaveResponse): void;
        protected initializeAsync(): PromiseLike<void>;
        protected getEntityNameFieldValue(): any;
        protected isCloneMode(): boolean;
        protected isNewOrDeleted(): boolean;
        protected getDeleteOptions(callback: (response: Serenity.DeleteResponse) => void): Serenity.ServiceOptions<Serenity.DeleteResponse>;
        protected deleteHandler(options: Serenity.ServiceOptions<Serenity.DeleteResponse>, callback: (response: Serenity.DeleteResponse) => void): void;
        protected doDelete(callback: (response: Serenity.DeleteResponse) => void): void;
        protected onDeleteSuccess(response: Serenity.DeleteResponse): void;
        protected getEntityType(): string;
        protected getLocalTextDbPrefix(): string;
        protected getIsActiveProperty(): string;
        protected getIsDeletedProperty(): string;
        loadNewAndOpenDialog(asPanel?: boolean): void;
        loadEntityAndOpenDialog(entity: AuditLogRow, asPanel?: boolean): void;
        loadByIdAndOpenDialog(entityId: any, asPanel?: boolean): void;
        protected reloadById(): void;
        protected isLocalizationModeAndChanged(): boolean;
        protected localizationButtonClick(): void;
        protected getLanguages(): any[];
        protected loadLocalization(): void;
        protected setLocalizationGridCurrentValues(): void;
        protected getLocalizationGridValue(): any;
        protected getPendingLocalizations(): any;
        protected getPropertyItems(): Serenity.PropertyItem[];
        protected getPropertyItemsAsync(): PromiseLike<Serenity.PropertyItem[]>;
        protected getCloningEntity(): AuditLogRow;
        protected getUndeleteOptions(callback?: (response: Serenity.UndeleteResponse) => void): Serenity.ServiceOptions<Serenity.UndeleteResponse>;
        protected undeleteHandler(options: Serenity.ServiceOptions<Serenity.UndeleteResponse>, callback: (response: Serenity.UndeleteResponse) => void): void;
        protected undelete(callback?: (response: Serenity.UndeleteResponse) => void): void;
        protected resetValidation(): void;
        protected validateForm(): boolean;
        protected onDialogClose(): void;
        destroy(): void;
    }
}
declare namespace _Ext {
    class DialogWithAllOverridableMethods extends DialogBase<AuditLogRow, any> {
        protected getFormKey(): string;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getNameProperty(): string;
        protected getService(): string;
        protected form: AuditLogForm;
        protected addCssClass(): void;
        protected getTemplate(): string;
        protected getTemplateName(): string;
        protected getFallbackTemplate(): string;
        protected initValidator(): void;
        protected getValidatorOptions(): JQueryValidation.ValidationOptions;
        protected initTabs(): void;
        protected initToolbar(): void;
        protected getToolbarButtons(): Serenity.ToolButton[];
        protected initPropertyGrid(): void;
        protected initPropertyGridAsync(): PromiseLike<void>;
        protected getPropertyGridOptions(): Serenity.PropertyGridOptions;
        protected getPropertyGridOptionsAsync(): PromiseLike<Serenity.PropertyGridOptions>;
        protected initLocalizationGrid(): void;
        protected initLocalizationGridAsync(): PromiseLike<void>;
        protected initLocalizationGridCommon(pgOptions: Serenity.PropertyGridOptions): void;
        load(entityOrId: any, done: () => void, fail: (ex: ss.Exception) => void): void;
        loadResponse(data: any): void;
        protected onLoadingData(data: Serenity.RetrieveResponse<AuditLogRow>): void;
        protected beforeLoadEntity(entity: AuditLogRow): void;
        protected loadEntity(entity: AuditLogRow): void;
        protected set_entityId(value: any): void;
        protected set_entity(entity: any): void;
        protected isEditMode(): boolean;
        protected get_entityId(): any;
        protected get_entity(): AuditLogRow;
        protected afterLoadEntity(): void;
        protected updateInterface(): void;
        protected isDeleted(): boolean;
        protected isLocalizationMode(): boolean;
        protected isNew(): boolean;
        protected updateTitle(): void;
        protected getEntityTitle(): string;
        protected getEntitySingular(): string;
        protected getSaveEntity(): AuditLogRow;
        protected initDialog(): void;
        protected getDialogOptions(): JQueryUI.DialogOptions;
        protected getDialogTitle(): string;
        protected handleResponsive(): void;
        protected onDialogOpen(): void;
        protected arrange(): void;
        protected save(callback?: (response: Serenity.SaveResponse) => void): void | boolean;
        protected validateBeforeSave(): boolean;
        protected save_submitHandler(callback: (response: Serenity.SaveResponse) => void): void;
        protected getSaveOptions(callback: (response: Serenity.SaveResponse) => void): Serenity.ServiceOptions<Serenity.SaveResponse>;
        protected getSaveRequest(): Serenity.SaveRequest<AuditLogRow>;
        protected saveHandler(options: Serenity.ServiceOptions<Serenity.SaveResponse>, callback: (response: Serenity.SaveResponse) => void): void;
        protected onSaveSuccess(response: Serenity.SaveResponse): void;
        loadById(id: any, callback?: (response: Serenity.RetrieveResponse<AuditLogRow>) => void, fail?: () => void): void;
        protected getLoadByIdRequest(id: any): Serenity.RetrieveRequest;
        protected getLoadByIdOptions(id: any, callback: (response: Serenity.RetrieveResponse<AuditLogRow>) => void): Serenity.ServiceOptions<Serenity.RetrieveResponse<AuditLogRow>>;
        protected loadByIdHandler(options: Serenity.ServiceOptions<Serenity.RetrieveResponse<AuditLogRow>>, callback: (response: Serenity.RetrieveResponse<AuditLogRow>) => void, fail: () => void): void;
        protected showSaveSuccessMessage(response: Serenity.SaveResponse): void;
        protected initializeAsync(): PromiseLike<void>;
        protected getEntityNameFieldValue(): any;
        protected isCloneMode(): boolean;
        protected isNewOrDeleted(): boolean;
        protected getDeleteOptions(callback: (response: Serenity.DeleteResponse) => void): Serenity.ServiceOptions<Serenity.DeleteResponse>;
        protected deleteHandler(options: Serenity.ServiceOptions<Serenity.DeleteResponse>, callback: (response: Serenity.DeleteResponse) => void): void;
        protected doDelete(callback: (response: Serenity.DeleteResponse) => void): void;
        protected onDeleteSuccess(response: Serenity.DeleteResponse): void;
        protected getEntityType(): string;
        protected getLocalTextDbPrefix(): string;
        protected getIsActiveProperty(): string;
        protected getIsDeletedProperty(): string;
        loadNewAndOpenDialog(asPanel?: boolean): void;
        loadEntityAndOpenDialog(entity: AuditLogRow, asPanel?: boolean): void;
        loadByIdAndOpenDialog(entityId: any, asPanel?: boolean): void;
        protected reloadById(): void;
        protected isLocalizationModeAndChanged(): boolean;
        protected localizationButtonClick(): void;
        protected getLanguages(): any[];
        protected loadLocalization(): void;
        protected setLocalizationGridCurrentValues(): void;
        protected getLocalizationGridValue(): any;
        protected getPendingLocalizations(): any;
        protected getPropertyItems(): Serenity.PropertyItem[];
        protected getPropertyItemsAsync(): PromiseLike<Serenity.PropertyItem[]>;
        protected getCloningEntity(): AuditLogRow;
        protected getUndeleteOptions(callback?: (response: Serenity.UndeleteResponse) => void): Serenity.ServiceOptions<Serenity.UndeleteResponse>;
        protected undeleteHandler(options: Serenity.ServiceOptions<Serenity.UndeleteResponse>, callback: (response: Serenity.UndeleteResponse) => void): void;
        protected undelete(callback?: (response: Serenity.UndeleteResponse) => void): void;
        protected resetValidation(): void;
        protected validateForm(): boolean;
        protected onDialogClose(): void;
        destroy(): void;
    }
}
declare namespace _Ext {
    class GridSnippets extends _Ext.GridBase<AuditLogRow, any> {
        protected getColumnsKey(): string;
        protected getDialogType(): typeof DialogSnippets;
        protected getIdProperty(): string;
        protected getLocalTextPrefix(): string;
        protected getService(): string;
        protected get_ExtGridOptions(): ExtGridOptions;
        constructor(container: JQuery, options?: any);
        protected getInitialTitle(): string;
        protected getDisplayName(): string;
        setTitle(value: string): void;
        getTitle(): string;
        protected layout(): void;
        protected getButtons(): Serenity.ToolButton[];
        protected getAddButtonCaption(): string;
        protected getItemName(): string;
        protected newRefreshButton(noText?: boolean): Serenity.ToolButton;
        getView(): Slick.RemoteView<AuditLogRow>;
        protected createToolbar(buttons: Serenity.ToolButton[]): void;
        protected createSlickContainer(): JQuery;
        protected createView(): Slick.RemoteView<AuditLogRow>;
        protected getViewOptions(): Slick.RemoteViewOptions;
        protected getDefaultSortBy(): any[];
        protected usePager(): boolean;
        protected createSlickGrid(): Slick.Grid;
        protected getColumns(): Slick.Column[];
        protected getPropertyItems(): Serenity.PropertyItem[];
        protected propertyItemsToSlickColumns(propertyItems: Serenity.PropertyItem[]): Slick.Column[];
        protected itemLink(itemType?: string, idField?: string, text?: (ctx: Slick.FormatterContext) => string, cssClass?: (ctx: Slick.FormatterContext) => string, encode?: boolean): Slick.Format;
        protected getItemType(): string;
        protected getEntityType(): string;
        protected getSlickOptions(): Slick.GridOptions;
        protected postProcessColumns(columns: Slick.Column[]): Slick.Column[];
        protected setInitialSortOrder(): void;
        protected enableFiltering(): boolean;
        protected createFilterBar(): void;
        protected initializeFilterBar(): void;
        protected canFilterColumn(column: Slick.Column): boolean;
        protected createPager(): void;
        protected getPagerOptions(): Slick.PagerOptions;
        protected bindToSlickEvents(): void;
        protected bindToViewEvents(): void;
        protected createToolbarExtensions(): void;
        protected createIncludeDeletedButton(): void;
        protected createQuickSearchInput(): void;
        protected getQuickSearchFields(): Serenity.QuickSearchField[];
        protected createQuickFilters(): void;
        protected getQuickFilters(): Serenity.QuickFilter<Serenity.Widget<any>, any>[];
        protected dateTimeRangeQuickFilter(field: string, title?: string): Serenity.QuickFilter<Serenity.DateTimeEditor, Serenity.DateTimeEditorOptions>;
        protected addQuickFilter<TWidget extends Serenity.Widget<any>, TOptions>(opt: Serenity.QuickFilter<TWidget, TOptions>): TWidget;
        protected add_submitHandlers(action: () => void): void;
        protected updateDisabledState(): void;
        protected getCurrentSettings(flags?: Serenity.GridPersistanceFlags): Serenity.PersistedGridSettings;
        protected gridPersistanceFlags(): Serenity.GridPersistanceFlags;
        protected restoreSettings(settings?: Serenity.PersistedGridSettings, flags?: Serenity.GridPersistanceFlags): void;
        protected getPersistedSettings(): Serenity.PersistedGridSettings;
        protected getPersistanceStorage(): Serenity.SettingStorage;
        getGrid(): Slick.Grid;
        protected initialPopulate(): void;
        protected populateWhenVisible(): boolean;
        protected onViewSubmit(): boolean;
        protected getGridCanLoad(): boolean;
        protected setCriteriaParameter(): void;
        protected setIncludeColumnsParameter(): void;
        protected getIncludeColumns(include: {
            [key: string]: boolean;
        }): void;
        protected invokeSubmitHandlers(): void;
        protected onViewProcessData(response: Serenity.ListResponse<AuditLogRow>): Serenity.ListResponse<AuditLogRow>;
        protected getItemMetadata(item: AuditLogRow, index: number): any;
        protected getItemCssClass(item: AuditLogRow, index: number): string;
        protected getIsActiveProperty(): string;
        protected getIsDeletedProperty(): string;
        protected onViewFilter(item: AuditLogRow): boolean;
        getElement(): JQuery;
        protected viewDataChanged(e: any, rows: AuditLogRow[]): void;
        protected markupReady(): void;
        getItems(): AuditLogRow[];
        setItems(value: AuditLogRow[]): void;
        protected addButtonClick(): void;
        protected editItem(entityOrId: any): void;
        protected editItemOfType(itemType: string, entityOrId: any): void;
        protected routeDialog(itemType: string, dialog: Serenity.Widget<any>): void;
        protected initEntityDialog(itemType: string, dialog: Serenity.Widget<any>): void;
        protected createEntityDialog(itemType: string, callback?: (dlg: Serenity.Widget<any>) => void): Serenity.Widget<any>;
        protected getDialogOptions(): JQueryUI.DialogOptions;
        protected getDialogOptionsFor(itemType: string): JQueryUI.DialogOptions;
        protected remove_submitHandlers(action: () => void): void;
        destroy(): void;
        protected initializeAsync(): PromiseLike<void>;
        protected onClick(e: JQueryEventObject, row: number, cell: number): void;
        protected setEquality(field: string, value: any): void;
        protected getPropertyItemsAsync(): PromiseLike<Serenity.PropertyItem[]>;
        protected getColumnsAsync(): PromiseLike<Slick.Column[]>;
        protected populateLock(): void;
        protected populateUnlock(): void;
        refresh(): void;
        protected refreshIfNeeded(): void;
        protected internalRefresh(): void;
        setIsDisabled(value: boolean): void;
        protected resizeCanvas(): void;
        protected subDialogDataChange(): void;
        protected addFilterSeparator(): void;
        protected determineText(getKey: (prefix: string) => string): string;
        protected addDateRangeFilter(field: string, title?: string): Serenity.DateEditor;
        protected dateRangeQuickFilter(field: string, title?: string): Serenity.QuickFilter<Serenity.DateEditor, Serenity.DateTimeEditorOptions>;
        protected addDateTimeRangeFilter(field: string, title?: string): Serenity.DateTimeEditor;
        protected addBooleanFilter(field: string, title?: string, yes?: string, no?: string): Serenity.SelectEditor;
        protected booleanQuickFilter(field: string, title?: string, yes?: string, no?: string): Serenity.QuickFilter<Serenity.SelectEditor, Serenity.SelectEditorOptions>;
        protected quickFilterChange(e: JQueryEventObject): void;
        protected getPersistanceKey(): string;
        protected canShowColumn(column: Slick.Column): boolean;
        protected persistSettings(flags?: Serenity.GridPersistanceFlags): void;
        getFilterStore(): Serenity.FilterStore;
    }
}
declare namespace _Ext {
    class GridWithAllOverridableMethods extends _Ext.GridBase<AuditLogRow, any> {
        protected getDialogType(): typeof DialogWithAllOverridableMethods;
        constructor(container: JQuery, options?: any);
        protected getInitialTitle(): string;
        protected getDisplayName(): string;
        protected getLocalTextPrefix(): string;
        setTitle(value: string): void;
        getTitle(): string;
        protected layout(): void;
        protected getButtons(): Serenity.ToolButton[];
        protected getAddButtonCaption(): string;
        protected getItemName(): string;
        protected newRefreshButton(noText?: boolean): Serenity.ToolButton;
        getView(): Slick.RemoteView<AuditLogRow>;
        protected createToolbar(buttons: Serenity.ToolButton[]): void;
        protected createSlickContainer(): JQuery;
        protected createView(): Slick.RemoteView<AuditLogRow>;
        protected getViewOptions(): Slick.RemoteViewOptions;
        protected getIdProperty(): string;
        protected getDefaultSortBy(): any[];
        protected usePager(): boolean;
        protected getService(): string;
        protected createSlickGrid(): Slick.Grid;
        protected getColumns(): Slick.Column[];
        protected getPropertyItems(): Serenity.PropertyItem[];
        protected getColumnsKey(): string;
        protected propertyItemsToSlickColumns(propertyItems: Serenity.PropertyItem[]): Slick.Column[];
        protected itemLink(itemType?: string, idField?: string, text?: (ctx: Slick.FormatterContext) => string, cssClass?: (ctx: Slick.FormatterContext) => string, encode?: boolean): Slick.Format;
        protected getItemType(): string;
        protected getEntityType(): string;
        protected getSlickOptions(): Slick.GridOptions;
        protected get_ExtGridOptions(): ExtGridOptions;
        protected postProcessColumns(columns: Slick.Column[]): Slick.Column[];
        protected setInitialSortOrder(): void;
        protected enableFiltering(): boolean;
        protected createFilterBar(): void;
        protected initializeFilterBar(): void;
        protected canFilterColumn(column: Slick.Column): boolean;
        protected createPager(): void;
        protected getPagerOptions(): Slick.PagerOptions;
        protected bindToSlickEvents(): void;
        protected bindToViewEvents(): void;
        protected createToolbarExtensions(): void;
        protected createIncludeDeletedButton(): void;
        protected createQuickSearchInput(): void;
        protected getQuickSearchFields(): Serenity.QuickSearchField[];
        protected createQuickFilters(): void;
        protected getQuickFilters(): Serenity.QuickFilter<Serenity.Widget<any>, any>[];
        protected dateTimeRangeQuickFilter(field: string, title?: string): Serenity.QuickFilter<Serenity.DateTimeEditor, Serenity.DateTimeEditorOptions>;
        protected addQuickFilter<TWidget extends Serenity.Widget<any>, TOptions>(opt: Serenity.QuickFilter<TWidget, TOptions>): TWidget;
        protected add_submitHandlers(action: () => void): void;
        protected updateDisabledState(): void;
        protected getCurrentSettings(flags?: Serenity.GridPersistanceFlags): Serenity.PersistedGridSettings;
        protected gridPersistanceFlags(): Serenity.GridPersistanceFlags;
        protected restoreSettings(settings?: Serenity.PersistedGridSettings, flags?: Serenity.GridPersistanceFlags): void;
        protected getPersistedSettings(): Serenity.PersistedGridSettings;
        protected getPersistanceStorage(): Serenity.SettingStorage;
        getGrid(): Slick.Grid;
        protected initialPopulate(): void;
        protected populateWhenVisible(): boolean;
        protected onViewSubmit(): boolean;
        protected getGridCanLoad(): boolean;
        protected setCriteriaParameter(): void;
        protected setIncludeColumnsParameter(): void;
        protected getIncludeColumns(include: {
            [key: string]: boolean;
        }): void;
        protected invokeSubmitHandlers(): void;
        protected onViewProcessData(response: Serenity.ListResponse<AuditLogRow>): Serenity.ListResponse<AuditLogRow>;
        protected getItemMetadata(item: AuditLogRow, index: number): any;
        protected getItemCssClass(item: AuditLogRow, index: number): string;
        protected getIsActiveProperty(): string;
        protected getIsDeletedProperty(): string;
        protected onViewFilter(item: AuditLogRow): boolean;
        getElement(): JQuery;
        protected viewDataChanged(e: any, rows: AuditLogRow[]): void;
        protected markupReady(): void;
        getItems(): AuditLogRow[];
        setItems(value: AuditLogRow[]): void;
        protected addButtonClick(): void;
        protected editItem(entityOrId: any): void;
        protected editItemOfType(itemType: string, entityOrId: any): void;
        protected routeDialog(itemType: string, dialog: Serenity.Widget<any>): void;
        protected initEntityDialog(itemType: string, dialog: Serenity.Widget<any>): void;
        protected createEntityDialog(itemType: string, callback?: (dlg: Serenity.Widget<any>) => void): Serenity.Widget<any>;
        protected getDialogOptions(): JQueryUI.DialogOptions;
        protected getDialogOptionsFor(itemType: string): JQueryUI.DialogOptions;
        protected remove_submitHandlers(action: () => void): void;
        destroy(): void;
        protected initializeAsync(): PromiseLike<void>;
        protected onClick(e: JQueryEventObject, row: number, cell: number): void;
        protected setEquality(field: string, value: any): void;
        protected getPropertyItemsAsync(): PromiseLike<Serenity.PropertyItem[]>;
        protected getColumnsAsync(): PromiseLike<Slick.Column[]>;
        protected populateLock(): void;
        protected populateUnlock(): void;
        refresh(): void;
        protected refreshIfNeeded(): void;
        protected internalRefresh(): void;
        setIsDisabled(value: boolean): void;
        protected resizeCanvas(): void;
        protected subDialogDataChange(): void;
        protected addFilterSeparator(): void;
        protected determineText(getKey: (prefix: string) => string): string;
        protected addDateRangeFilter(field: string, title?: string): Serenity.DateEditor;
        protected dateRangeQuickFilter(field: string, title?: string): Serenity.QuickFilter<Serenity.DateEditor, Serenity.DateTimeEditorOptions>;
        protected addDateTimeRangeFilter(field: string, title?: string): Serenity.DateTimeEditor;
        protected addBooleanFilter(field: string, title?: string, yes?: string, no?: string): Serenity.SelectEditor;
        protected booleanQuickFilter(field: string, title?: string, yes?: string, no?: string): Serenity.QuickFilter<Serenity.SelectEditor, Serenity.SelectEditorOptions>;
        protected quickFilterChange(e: JQueryEventObject): void;
        protected getPersistanceKey(): string;
        protected canShowColumn(column: Slick.Column): boolean;
        protected persistSettings(flags?: Serenity.GridPersistanceFlags): void;
        getFilterStore(): Serenity.FilterStore;
    }
}
declare namespace _Ext {
    class ReplaceRowDialog extends _Ext.DialogBase<any, any> {
        request: ReplaceRowRequest;
        entityList: Array<any>;
        protected getFormKey(): string;
        protected form: ReplaceRowForm;
        constructor(request: ReplaceRowRequest, entityList: Array<any>);
        protected getToolbarButtons(): Serenity.ToolButton[];
    }
}
declare var Vue: any;
declare namespace _Ext.DevTools {
    class SergenPanel extends Serenity.Widget<any> {
        constructor(container: JQuery);
    }
}
declare namespace _Ext {
    class AutoCompleteEditor extends Serenity.StringEditor {
        constructor(input: JQuery, options: AutoCompleteOptions);
        protected bindAutoComplete(input: any): void;
    }
    interface AutoCompleteOptions {
        lookupKey: string;
        sourceArray: string[];
        sourceCSV: string;
        minSearchLength: number;
    }
}
declare namespace _Ext {
    class ColorEditor extends Serenity.TemplatedWidget<any> implements Serenity.IGetEditValue, Serenity.ISetEditValue {
        protected getTemplate(): string;
        constructor(container: JQuery);
        getEditValue(property: any, target: any): void;
        setEditValue(source: any, property: any): void;
    }
}
declare namespace _Ext {
    class DateTimePickerEditor extends Serenity.Widget<any> implements Serenity.IGetEditValue, Serenity.ISetEditValue, Serenity.IReadOnly {
        getEditValue(property: any, target: any): void;
        setEditValue(source: any, property: any): void;
        constructor(container: JQuery);
        value: string;
        valueAsDate: Date;
        get_readOnly(): boolean;
        set_readOnly(value: boolean): void;
        set_minDate(date: Date): void;
        set_maxDate(date: Date): void;
        set_minDateTime(date: Date): void;
        set_maxDateTime(date: Date): void;
    }
}
declare namespace _Ext {
    class EmptyLookupEditor extends Serenity.LookupEditorBase<Serenity.LookupEditorOptions, any> {
        setSelect2Items(items: Serenity.Select2Item[]): void;
        setLookupItems(lookup: Q.Lookup<any>): void;
    }
}
declare namespace _Ext {
    class HardCodedLookupEditor extends Serenity.Select2Editor<any, any> {
        constructor(container: JQuery, options: HardCodedLookupEditorOptions);
        protected getSelect2Options(): Select2Options;
    }
    interface HardCodedLookupEditorOptions {
        sourceArray: string[];
        sourceCSV: string;
        allowOtherValue: boolean;
    }
}
declare namespace _Ext {
    class HtmlTemplateEditor extends Serenity.HtmlContentEditor {
        constructor(textArea: JQuery, opt?: HtmlTemplateEditorOptions);
        protected getConfig(): Serenity.CKEditorConfig;
    }
    interface HtmlTemplateEditorOptions extends Serenity.HtmlContentEditorOptions {
        cols?: any;
        rows?: any;
        placeholders?: any;
    }
}
declare namespace _Ext {
    class MonthYearEditor extends Serenity.Widget<any> implements Serenity.IGetEditValue, Serenity.ISetEditValue, Serenity.IReadOnly {
        getEditValue(property: any, target: any): void;
        setEditValue(source: any, property: any): void;
        constructor(container: JQuery);
        value: string;
        get_readOnly(): boolean;
        set_readOnly(value: boolean): void;
    }
}
declare namespace _Ext {
    class PrefixedStringEditor extends Serenity.Widget<PrefixedStringEditorOptions> implements Serenity.IGetEditValue, Serenity.ISetEditValue, Serenity.IReadOnly {
        getEditValue(property: any, target: any): void;
        setEditValue(source: any, property: any): void;
        private prefixInput;
        constructor(container: JQuery, options: PrefixedStringEditorOptions);
        value: string;
        private _prefix;
        prefix: string;
        get_readOnly(): boolean;
        set_readOnly(value: boolean): void;
    }
    interface PrefixedStringEditorOptions {
        prefixLength: number;
        inputMaxLength: number;
        prefixFormatterType?: string;
    }
}
declare namespace _Ext {
    class StaticTextBlock extends Serenity.Widget<StaticTextBlockOptions> implements Serenity.ISetEditValue {
        private _value;
        constructor(container: JQuery, options: StaticTextBlockOptions);
        private updateElementContent;
        /**
         * By implementing ISetEditValue interface, we allow this editor to display its field value.
         * But only do this when our text content is not explicitly set in options
         */
        setEditValue(source: any, property: Serenity.PropertyItem): void;
        value: string;
    }
    interface StaticTextBlockOptions {
        text: string;
        isHtml: boolean;
        isLocalText: boolean;
        hideLabel: boolean;
        isDate: boolean;
        isDateTime: boolean;
    }
}
declare namespace _Ext {
    class GridItemPickerEditor extends Serenity.TemplatedWidget<GridItemPickerEditorOptions> implements Serenity.ISetEditValue, Serenity.IGetEditValue, Serenity.IStringValue, Serenity.IReadOnly, Serenity.IValidateRequired {
        options: GridItemPickerEditorOptions;
        protected getTemplate(): string;
        inplaceSearchButton: JQuery;
        inplaceViewButton: JQuery;
        clearSelectionButton: JQuery;
        constructor(container: JQuery, options: GridItemPickerEditorOptions);
        protected addInplaceButtons(): void;
        protected inplaceSearchClick(e: any): void;
        protected inplaceViewClick(e: any): void;
        private getDialogInstance;
        value: string;
        text: string;
        getEditValue(property: any, target: any): void;
        setEditValue(source: any, property: any): void;
        get_value(): string;
        set_value(value: string): void;
        get_readOnly(): boolean;
        set_readOnly(value: boolean): void;
        get_required(): boolean;
        set_required(value: boolean): void;
        private _selectedItem;
        selectedItemIncludeColumns: string[];
        readonly selectedItem: any;
        selectedItems: any[];
        private _serviceUrl;
        readonly serviceUrl: string;
        setValueAndText(value: any, text: any): void;
        protected getCascadeFromValue(parent: Serenity.Widget<any>): any;
        protected cascadeLink: Serenity.CascadedWidgetLink<Serenity.Widget<any>>;
        protected setCascadeFrom(value: string): void;
        protected get_cascadeFrom(): string;
        cascadeFrom: string;
        protected set_cascadeFrom(value: string): void;
        protected get_cascadeField(): any;
        cascadeField: string;
        protected set_cascadeField(value: string): void;
        protected get_cascadeValue(): any;
        cascadeValue: any;
        protected set_cascadeValue(value: any): void;
        protected get_filterField(): string;
        filterField: string;
        protected set_filterField(value: string): void;
        protected get_filterValue(): any;
        filterValue: any;
        protected set_filterValue(value: any): void;
        protected updateItems(): void;
    }
    interface GridItemPickerEditorOptions extends Serenity.Select2FilterOptions {
        gridType: any;
        nameFieldInThisRow?: string;
        serviceUrl?: string;
        rowType?: string;
        idFieldInGridRow?: string;
        nameFieldInGridRow?: string;
        inplaceView?: boolean;
        multiple?: boolean;
        preSelectedKeys?: any[];
        filteringCriteria?: any;
        dialogType?: any;
        cascadeFrom?: string;
        cascadeField?: string;
        cascadeValue?: any;
        filterField?: string;
        filterValue?: any;
    }
}
declare namespace _Ext {
    class MonthYearFormatter implements Slick.Formatter {
        static format(val: string): string;
        format(ctx: Slick.FormatterContext): string;
    }
}
declare namespace _Ext {
    class CardViewMixin<TItem> {
        private options;
        private dataGrid;
        private getId;
        private vm;
        private cardContainer;
        viewType: ('list' | 'card');
        constructor(options: CardViewMixinOptions<TItem>);
        switchView(viewType: ('grid' | 'card')): void;
        updateCardItems(): void;
        resizeCardView(): void;
    }
    interface CardViewMixinOptions<TItem> {
        grid: Serenity.DataGrid<TItem, any>;
        containerTemplate?: string;
        itemTemplate?: string;
        methods?: any;
        itemCssClass?: string;
        defaultViewType?: ('list' | 'card');
        itemsCssStyle?: string;
        itemCssStyle?: string;
    }
}
declare namespace _Ext {
    /**
     * A mixin that can be applied to a DataGrid for excel style filtering functionality
     */
    class HeaderFiltersMixin<TItem> {
        private options;
        private dataGrid;
        constructor(options: HeaderFiltersMixinOptions<TItem>);
    }
    interface HeaderFiltersMixinOptions<TItem> {
        grid: Serenity.DataGrid<TItem, any>;
    }
}
declare namespace _Ext {
    /**
     * A mixin that can be applied to a DataGrid for tree functionality
     */
    class TreeGridMixin<TItem> {
        private options;
        private dataGrid;
        private getId;
        constructor(options: TreeGridMixinOptions<TItem>);
        /**
         * Expands / collapses all rows in a grid automatically
         */
        toggleAll(): void;
        expandAll(): void;
        collapsedAll(): void;
        /**
         * Reorders a set of items so that parents comes before their children.
         * This method is required for proper tree ordering, as it is not so easy to perform with SQL.
         * @param items list of items to be ordered
         * @param getId a delegate to get ID of a record (must return same ID with grid identity field)
         * @param getParentId a delegate to get parent ID of a record
         */
        static applyTreeOrdering<TItem>(items: TItem[], getId: (item: TItem) => any, getParentId: (item: TItem) => any): TItem[];
        static filterById<TItem>(item: TItem, view: Slick.RemoteView<TItem>, idProperty: any, getParentId: (x: TItem) => any): boolean;
        static treeToggle<TItem>(getView: () => Slick.RemoteView<TItem>, getId: (x: TItem) => any, formatter: Slick.Format): Slick.Format;
        static toggleClick<TItem>(e: JQueryEventObject, row: number, cell: number, view: Slick.RemoteView<TItem>, getId: (x: TItem) => any): void;
    }
    interface TreeGridMixinOptions<TItem> {
        grid: Serenity.DataGrid<TItem, any>;
        idField?: string;
        getParentId: (item: TItem) => any;
        toggleField: string;
        initialCollapse?: () => boolean;
    }
}
declare namespace _Ext {
    interface ExcelExportOptions {
        grid: Serenity.DataGrid<any, any>;
        service: string;
        onViewSubmit: () => boolean;
        title?: string;
        hint?: string;
        separator?: boolean;
    }
    namespace ExcelExportHelper {
        function createToolButton(options: ExcelExportOptions): Serenity.ToolButton;
    }
}
declare var jsPDF: any;
declare namespace _Ext {
    interface PdfExportOptions {
        grid: Serenity.DataGrid<any, any>;
        onViewSubmit: () => boolean;
        title?: string;
        hint?: string;
        separator?: boolean;
        reportTitle?: string;
        titleTop?: number;
        titleFontSize?: number;
        fileName?: string;
        pageNumbers?: boolean;
        columnTitles?: {
            [key: string]: string;
        };
        tableOptions?: jsPDF.AutoTableOptions;
        output?: string;
        autoPrint?: boolean;
    }
    namespace PdfExportHelper {
        function exportToPdf(options: PdfExportOptions): void;
        function createToolButton(options: PdfExportOptions): Serenity.ToolButton;
    }
}
declare namespace Slick {
    interface RemoteView<TEntity> {
        getGroups(): Slick.Group<TEntity>[];
        getGrouping(): Slick.GroupInfo<TEntity>[];
    }
}
declare namespace _Ext {
    interface ReportExecuteOptions {
        reportKey: string;
        download?: boolean;
        extension?: 'pdf' | 'htm' | 'html' | 'xlsx' | 'docx';
        getParams?: () => any;
        params?: {
            [key: string]: any;
        };
        target?: string;
    }
    interface ReportButtonOptions extends ReportExecuteOptions {
        title?: string;
        cssClass?: string;
        icon?: string;
    }
    namespace ReportHelper {
        function createToolButton(options: ReportButtonOptions): Serenity.ToolButton;
        function execute(options: ReportExecuteOptions): void;
    }
}
declare namespace _Ext.DialogUtils {
    function pendingChangesConfirmation(element: JQuery, hasPendingChanges: () => boolean): void;
}
declare function loadScriptAsync(url: any, callback: any): void;
declare function loadScript(url: any): void;
declare function usingVuejs(): void;
declare function includeBootstrapColorPickerCss(): void;
declare function usingBootstrapColorPicker(): void;
declare function includeJqueryUITimepickerAddonCss(): void;
declare function usingJqueryUITimepickerAddon(): void;
declare function usingBabylonjs(): void;
declare function usingChartjs(): void;
declare function includeCustomMarkerCss(): void;
declare function usingCustomMarker(): void;
declare function includeGoogleMap(callback?: Function, callbackFullName?: string): void;
declare function includeMarkerWithLabel(): void;
declare function includeVisCss(): void;
declare function usingVisjs(): void;
declare function usingJsonDiffPatch(): void;
declare function usingSlickGridEditors(): void;
declare function usingSlickAutoColumnSize(): void;
declare function usingSlickHeaderFilters(): void;
declare namespace q {
    function sum(xs: any[], key: any): any;
    function groupBy(xs: any[], key: any): any;
    function sortBy<T>(xs: T[], key: any): T[];
    function sortByDesc<T>(xs: T[], key: any): T[];
}
declare namespace q {
    function nextTick(date: any): Date;
    function addMinutes(date: Date, minutes: number): Date;
    function addHours(date: Date, hours: number): Date;
    function getHours(fromDate: Date, toDate: Date): number;
    function getDays24HourPulse(fromDate: Date, toDate: Date): number;
    function getDays(pFromDate: Date, pToDate: Date): number;
    function getMonths(fromDate: Date, toDate: Date): number;
    function getCalenderMonths(fromDate: Date, toDate: Date): number;
    function getCalenderMonthsCeil(fromDate: Date, toDate: Date): number;
    function addDays(date: Date, days: number): Date;
    function addMonths(date: Date, months: number): Date;
    function addYear(date: Date, years: number): Date;
    function getPeriods(fromDate: Date, toDate: Date, periodUnit: _Ext.TimeUoM): number;
    function addPeriod(date: Date, period: number, periodUnit: _Ext.TimeUoM): Date;
    function formatISODate(date: Date): string;
    function bindDateTimeEditorChange(editor: any, handler: any): void;
    function initDateRangeEditor(fromDateEditor: Serenity.DateEditor, toDateEditor: Serenity.DateEditor, onChangeHandler?: (e: JQueryEventObject) => void): void;
    function initDateTimeRangeEditor(fromDateTimeEditor: _Ext.DateTimePickerEditor, toDateTimeEditor: _Ext.DateTimePickerEditor, onChangeHandler?: (e: JQueryEventObject) => void): void;
    function formatDate(d: Date | string, format?: string): string;
}
declare namespace q {
    function initDetailEditor(dialog: _Ext.DialogBase<any, any>, editor: _Ext.GridEditorBase<any>, options?: ExtGridEditorOptions): void;
    function setGridEditorHeight(editor: JQuery, heightInPx: number): void;
    function addNotificationIcon(editor: Serenity.Widget<any>, isSuccess: boolean): void;
    function addPopoverIcon(editor: Serenity.Widget<any>, isSuccess: boolean, popoverOptions: any): void;
    function setEditorLabel(editor: Serenity.Widget<any>, value: string): void;
    function hideEditorLabel(editor: Serenity.Widget<any>): void;
    function setEditorCategoryLabel(editor: Serenity.Widget<any>, value: string): void;
    function hideEditorCategory(editor: Serenity.Widget<any>, value?: boolean): void;
    function hideCategories(containerElement: JQuery, value?: boolean): void;
    function hideFields(containerElement: JQuery, value?: boolean): void;
    function hideFieldsAndCategories(containerElement: JQuery, value?: boolean): void;
    function hideField(editor: Serenity.Widget<any>, value?: boolean): void;
    function showField(editor: Serenity.Widget<any>, value?: boolean): void;
    function showAndEnableField(editor: Serenity.Widget<any>): void;
    function showFieldAndCategory(editor: Serenity.Widget<any>, value?: boolean): void;
    function hideEditorTab(editor: Serenity.Widget<any>, value?: boolean): void;
    function disableEditorTab(editor: Serenity.Widget<any>, value?: boolean): void;
    function readOnlyEditorTab(editor: Serenity.Widget<any>, value?: boolean): void;
    function readOnlyEditorCategory(editor: Serenity.Widget<any>, value?: boolean): void;
    function readonlyEditorCategory($editor: JQuery, value?: boolean): void;
    function readOnlyEditorPropertyGrid(editor: Serenity.Widget<any>, value?: boolean): void;
    function readonlyEditorPropertyGrid($editor: JQuery, value?: boolean): void;
    function readOnlyEditor(editor: Serenity.Widget<any>, value?: boolean): void;
    function readonlyEditor($editor: JQuery, value?: boolean): void;
    function moveEditorFromTab(editor: Serenity.Widget<any>, toElement: JQuery, isPrepend?: boolean): void;
    function moveEditorCategoryFromTab(editor: Serenity.Widget<any>, toElement: JQuery, isPrepend?: boolean): void;
    function selectEditorTab(editor: Serenity.Widget<any>): void;
    function getSelectedRow<TRow>(e: JQueryEventObject): TRow;
}
declare namespace q {
    function getEnumText(enumTypeOrKey: any, value: any): string;
    function isNumber(value: any): boolean;
    function getEnumValues(enumType: any): number[];
    function getEnumKeys(enumType: any): string[];
}
declare namespace SereneInventory {
    function getTrasactionTypeFromUrl(): TransactionType;
    function getTrasactionTypeName(transactionType: TransactionType): string;
    function getTrasactionNumberCaption(transactionType: TransactionType): string;
    function getTrasactionNumberPrefix(transactionType: TransactionType): string;
}
