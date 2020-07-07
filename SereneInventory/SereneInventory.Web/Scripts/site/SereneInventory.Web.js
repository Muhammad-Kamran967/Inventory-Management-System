var isPageRefreshRequired;
//const nameof = <T>(name: keyof T) => name;
//const nameofFactory = <T>() => (name: keyof T) => name;
//usage const nameof = nameofFactory<Edoc.RevenueReportModel>();
var q;
(function (q) {
    q.queryString = {};
    q.jsPDFHeaderImageData = null;
    q.jsPDFHeaderTitle = 'Report Title';
    q.useSerenityInlineEditors = true;
    q.DefaultMainGridOptions = {
        AutoColumnSize: true,
        FadeInEffectWhenInit: true,
        ShowAnyInEqualityFilterWithTextValue: true,
        ShowInlineActionsColumn: true,
        ShowDeleteInlineButtun: false,
        ShowEditInlineButtun: true,
        ShowPrintInlineButtun: false,
        ShowRowNumberColumn: true,
        ShowRowSelectionCheckboxColumn: false,
        EnableQuickSearch: true,
        RowsPerPage: 20
    };
    q.DefaultEditorGridOptions = {
        AutoColumnSize: true,
        FadeInEffectWhenInit: true,
        ShowAnyInEqualityFilterWithTextValue: true,
        ShowInlineActionsColumn: true,
        ShowDeleteInlineButtun: true,
        ShowEditInlineButtun: true,
        ShowPrintInlineButtun: false,
        ShowRowSelectionCheckboxColumn: false,
        ShowRowNumberColumn: true,
        EnableQuickSearch: false
    };
    q.DefaultEntityDialogOptions = {
        AutoFitContentArea: true,
        HideCategoyLinksBar: true,
        PendingChangesConfirmation: true,
        ShowSaveAndNewButtonInToolbar: false,
        ShowCloseButtonInToolbar: false,
        ShowRefreshButtonInToolbar: false,
        ShowChangeLogButtonInToolbar: true,
        ShowReplaceRowButtonInToolbar: false
    };
    q.DefaultEditorDialogOptions = {
        AutoFitContentArea: false,
        HideCategoyLinksBar: true,
        PendingChangesConfirmation: true,
        ShowSaveAndNewButtonInToolbar: false,
        ShowCloseButtonInToolbar: false,
        ShowRefreshButtonInToolbar: false,
        ShowChangeLogButtonInToolbar: false,
        ShowReplaceRowButtonInToolbar: false
    };
    //date time
    q.fiscalYearMonths = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
})(q || (q = {}));
/// <reference path="../_q/_q.d.ts" />
var _Ext;
(function (_Ext) {
    var GridBase = /** @class */ (function (_super) {
        __extends(GridBase, _super);
        function GridBase(container, options) {
            var _this = _super.call(this, container, options) || this;
            _this.isAutosized = false;
            _this.isChildGrid = false;
            _this.nextRowNumber = 1;
            _this.rowSelection = new Serenity.GridRowSelectionMixin(_this);
            _this.slickContainer.fadeTo(0, 0);
            return _this;
        }
        GridBase.prototype.get_ExtGridOptions = function () { return Q.deepClone(q.DefaultMainGridOptions); };
        GridBase.prototype.isPickerMode = function () { return this.element.hasClass('RowSelectionCheckGrid'); };
        GridBase.prototype.markupReady = function () {
            var _this = this;
            _super.prototype.markupReady.call(this);
            setTimeout(function () {
                if (_this.isAutosized == false) {
                    if (_this.get_ExtGridOptions().AutoColumnSize == true) {
                        _this.resizeAllCulumn();
                    }
                    _this.slickContainer.fadeTo(100, 1);
                }
            }, 100);
        };
        GridBase.prototype.getButtons = function () {
            var _this = this;
            var buttons = _super.prototype.getButtons.call(this);
            var reportRequest = this.getReportRequest();
            if (reportRequest.ListExcelServiceMethodName) {
                buttons.push(_Ext.ExcelExportHelper.createToolButton({
                    grid: this,
                    service: this.getService() + '/' + reportRequest.ListExcelServiceMethodName,
                    onViewSubmit: function () { return _this.onViewSubmit(); },
                    separator: true
                }));
            }
            if (reportRequest.ReportKey) {
                buttons.push({
                    title: 'Export to PDF',
                    icon: 'fa fa-file-pdf-o',
                    onClick: function () {
                        _Ext.ReportHelper.execute({ reportKey: reportRequest.ReportKey, params: { request: _this.getReportRequest() } });
                    }
                });
                buttons.push({
                    title: 'View as Report',
                    icon: 'fa fa-html5',
                    onClick: function () {
                        var request = _this.getReportRequest();
                        if (request)
                            _Ext.ReportHelper.execute({ reportKey: reportRequest.ReportKey, params: { request: request }, extension: 'html' });
                    }
                });
            }
            else if (reportRequest.ReportServiceMethodName) {
                buttons.push({
                    title: 'View as Report',
                    icon: 'fa fa-eye',
                    onClick: function () {
                        Q.postToService({ service: Q.resolveUrl(_this.getService() + '/' + reportRequest.ReportServiceMethodName), request: _this.getReportRequest(), target: '_blank' });
                    }
                });
            }
            else {
                buttons.push(_Ext.PdfExportHelper.createToolButton({
                    grid: this,
                    tableOptions: { theme: 'grid' },
                    onViewSubmit: function () { return _this.onViewSubmit(); }
                }));
            }
            return buttons;
        };
        GridBase.prototype.getReportRequest = function () {
            var view = this.getView();
            var request = Q.deepClone(view ? view.params : {}); //as _Ext.ReportRequest;
            request.ReportServiceMethodName = null; // if some value found in this property then "view as report" button will appear
            request.ReportKey = null; // if some value found in this property then "export to pdf" button will appear
            request.ListExcelServiceMethodName = null; // if some value found in this property then "export to xls" button will appear
            request.EqualityFilterWithTextValue = {};
            if (view) {
                var quickFilters = this.getQuickFilters();
                for (var _i = 0, quickFilters_1 = quickFilters; _i < quickFilters_1.length; _i++) {
                    var quickFilter = quickFilters_1[_i];
                    var filterValue = request.EqualityFilter[quickFilter.field];
                    if (filterValue && filterValue.length > 0) {
                        if (quickFilter.options.lookupKey) {
                            var lookup = Q.getLookup(quickFilter.options.lookupKey);
                            request.EqualityFilterWithTextValue[quickFilter.title] = lookup.itemById[filterValue][lookup.textField];
                        }
                        else if (quickFilter.options.enumKey) {
                            var enumKey = quickFilter.options.enumKey;
                            var enumValue = Q.toId(filterValue);
                            request.EqualityFilterWithTextValue[quickFilter.title] = Serenity.EnumFormatter.format(Serenity.EnumTypeRegistry.get(enumKey), enumValue);
                        }
                        else if (quickFilter.type == _Ext.GridItemPickerEditor) {
                            var customFilter = this.findQuickFilter(_Ext.GridItemPickerEditor, quickFilter.field);
                            request.EqualityFilterWithTextValue[quickFilter.title] = customFilter.text;
                        }
                        else {
                            request.EqualityFilterWithTextValue[quickFilter.title] = filterValue;
                        }
                    }
                    else if (quickFilter.type == Serenity.DateEditor) {
                        var qf = this.findQuickFilter(Serenity.DateEditor, quickFilter.field);
                        var dateFrom = qf.element.val();
                        var dateTo = qf.element.siblings('input').val();
                        var filterText = '';
                        if (!Q.isEmptyOrNull(dateFrom))
                            filterText = Q.format(q.text('Controls.FromDate', 'From {0}'), dateFrom) + ' ';
                        if (!Q.isEmptyOrNull(dateTo))
                            filterText = filterText + Q.format(q.text('Controls.ToDate', 'To {0}'), dateTo);
                        if (!Q.isEmptyOrNull(filterText)) {
                            request.EqualityFilterWithTextValue[quickFilter.title] = filterText;
                        }
                        else if (this.get_ExtGridOptions().ShowAnyInEqualityFilterWithTextValue == true) {
                            request.EqualityFilterWithTextValue[quickFilter.title] = q.text('Controls.All', 'all');
                        }
                    }
                    else if (this.get_ExtGridOptions().ShowAnyInEqualityFilterWithTextValue == true) {
                        request.EqualityFilterWithTextValue[quickFilter.title] = q.text('Controls.All', 'all');
                    }
                }
            }
            return request;
        };
        GridBase.prototype.getColumns = function () {
            var _this = this;
            var columns = _super.prototype.getColumns.call(this);
            var isEditable = this.getSlickOptions().editable;
            var extOptions = this.get_ExtGridOptions();
            if (isEditable == true) {
                usingSlickGridEditors();
            }
            columns.forEach(function (column) {
                if (extOptions.AutoColumnSize == true) {
                    column.width = column.minWidth || column.width || 50;
                    column.cssClass = column.cssClass || '';
                }
                if (column.sourceItem) {
                    var formatterType = column.sourceItem.formatterType;
                    //width and cssClass
                    if (column.sourceItem.filteringType == "Lookup") {
                        column.cssClass += ' align-left';
                        column.width = column.minWidth > 100 ? column.minWidth : 100;
                    }
                    else if (formatterType == "Enum") {
                        column.width = column.minWidth > 100 ? column.minWidth : 100;
                    }
                    else if (formatterType == "Date") {
                        column.cssClass += ' align-center';
                        column.width = column.minWidth > 99 ? column.minWidth : 99;
                    }
                    else if (formatterType == "DateTime") {
                        column.cssClass += ' align-center';
                        column.width = column.minWidth > 140 ? column.minWidth : 140;
                    }
                    else if (formatterType == "Number") {
                        column.cssClass += ' align-right';
                    }
                    else if (formatterType == "Checkbox") {
                        column.cssClass += ' align-center';
                    }
                    else {
                        column.cssClass += ' align-left';
                        column.width = column.minWidth > 99 ? column.minWidth : 99;
                    }
                    //formatter
                    if (column.sourceItem.editorType == "Lookup") {
                        if (!column.sourceItem.editorParams.autoComplete) {
                            column.lookup = Q.getLookup(column.sourceItem.editorParams.lookupKey);
                            column.formatter = function (row, cell, value, columnDef, dataContext) {
                                var item = columnDef.lookup.itemById[value];
                                if (item)
                                    return item[columnDef.lookup.textField];
                                else
                                    return '-';
                            };
                        }
                    }
                    else if (formatterType == "Enum") {
                        column.formatter = function (row, cell, value, columnDef, dataContext) {
                            var enumKey = columnDef.sourceItem.editorParams.enumKey;
                            var text = Serenity.EnumFormatter.format(Serenity.EnumTypeRegistry.get(enumKey), Q.toId(value));
                            if (text)
                                return text;
                            else
                                return '-';
                        };
                    }
                    else if (column.sourceItem.editorType == "Decimal") {
                        var formatSrt_1 = '#,##0.00';
                        if (column.sourceItem.editorParams) {
                            var decimals = column.sourceItem.editorParams['decimals'];
                            if (decimals) {
                                formatSrt_1 = '#,##0.';
                                for (var i = 0; i < decimals; i++) {
                                    formatSrt_1 += '0';
                                }
                            }
                            else if (column.sourceItem.editorParams['minValue']) {
                                var splitedMinValue = column.sourceItem.editorParams['minValue'].split('.');
                                if (splitedMinValue.length > 1) {
                                    formatSrt_1 = '#,##0.' + splitedMinValue[1];
                                }
                                else {
                                    formatSrt_1 = '#,##0';
                                }
                            }
                        }
                        column.format = function (ctx) { return Serenity.NumberFormatter.format(ctx.value, formatSrt_1); };
                    }
                    //editor
                    if (isEditable == true && column.sourceItem.readOnly != true) {
                        if (q.useSerenityInlineEditors) {
                            column.editor = SerenityInlineEditor;
                        }
                        else {
                            var editorType = column.sourceItem.editorType;
                            if (editorType == "Lookup" || editorType == "Enum") {
                                column.editor = Slick['Editors']['Select2'];
                                column.width = column.minWidth > 160 ? column.minWidth : 160;
                            }
                            else if (editorType == "Date") {
                                column.editor = Slick['Editors']['Date'];
                            }
                            else if (editorType == "Boolean") {
                                column.editor = Slick['Editors']['Checkbox'];
                            }
                            else if (editorType == "Integer") {
                                column.editor = Slick['Editors']['Integer'];
                            }
                            else if (editorType == "Decimal") {
                                column.editor = Slick['Editors']['Float'];
                            }
                            else if (editorType == "YesNoSelect") {
                                column.editor = Slick['Editors']['YesNoSelect'];
                            }
                            else if (editorType == "PercentComplete") {
                                column.editor = Slick['Editors']['PercentComplete'];
                            }
                            else if (editorType == "LongText") {
                                column.editor = Slick['Editors']['LongText'];
                            }
                            else {
                                column.editor = Slick['Editors']['Text'];
                            }
                        }
                    }
                }
            });
            columns.unshift({
                field: 'RowNum',
                name: '#',
                cssClass: 'rownum-column',
                headerCssClass: 'align-center',
                width: 40,
                minWidth: 40,
                maxWidth: 40,
                visible: extOptions.ShowRowNumberColumn,
                format: function (ctx) {
                    if (!ctx.item.RowNum) {
                        ctx.item.RowNum = _this.nextRowNumber++;
                    }
                    return String(ctx.item.RowNum);
                }
            });
            if (extOptions.ShowInlineActionsColumn == true) {
                var inlineActionsColumnWidth = 0;
                var inlineActionsColumnContent_1 = '';
                if (extOptions.ShowEditInlineButtun == true) {
                    inlineActionsColumnWidth += 32;
                    var title = this.isReadOnly ? q.text('Controls.View', 'View Details') : q.text('Controls.Edit', 'Edit');
                    inlineActionsColumnContent_1 += "<a class=\"inline-actions view-details\" title=\"" + title + "\" style=\"padding: 0 5px;\"><i class=\"view-details fa fa-pencil-square-o\"></i></a>";
                }
                if (extOptions.ShowDeleteInlineButtun == true) {
                    inlineActionsColumnWidth += 22;
                    inlineActionsColumnContent_1 += "<a class=\"inline-actions delete-row\" title=\"" + q.text('Controls.Delete', 'Delete') + "\" style=\"padding-left: 5px;\"><i class=\"delete-row fa fa-trash-o text-red\"></i></a>";
                }
                if (extOptions.ShowPrintInlineButtun == true) {
                    inlineActionsColumnWidth += 25;
                    inlineActionsColumnContent_1 += "<a class=\"inline-actions print-row\" title=\"" + q.text('Controls.Print', 'Print') + "\" style=\"padding-left: 5px;\"><i class=\"print-row fa fa-print\"></i></a>";
                }
                columns.unshift({
                    field: 'inline-actions',
                    name: '',
                    cssClass: 'inline-actions-column',
                    width: inlineActionsColumnWidth,
                    minWidth: inlineActionsColumnWidth,
                    maxWidth: inlineActionsColumnWidth,
                    format: function (ctx) { return inlineActionsColumnContent_1; }
                });
            }
            if (extOptions.ShowRowSelectionCheckboxColumn == true) {
                var rowSelectionCol = Serenity.GridRowSelectionMixin.createSelectColumn(function () { return _this.rowSelection; });
                rowSelectionCol.width = rowSelectionCol.minWidth = rowSelectionCol.maxWidth = 25;
                columns.unshift(rowSelectionCol);
            }
            if (this.isPickerMode()) { //show checkbox column in picker mode
                var options = this.options;
                if (!options.multiple && !options.gridType) {
                    Q.notifyWarning("Could not determine multiple/single. Probably there is no 'options' parameter in grid's constructor.");
                }
                //remove edit link in picker mode
                columns.forEach(function (column) {
                    if (column.sourceItem && column.sourceItem.editLink)
                        column.format = undefined;
                });
                if (options.multiple == true) {
                    var rowSelectionCol = Serenity.GridRowSelectionMixin.createSelectColumn(function () { return _this.rowSelection; });
                    rowSelectionCol.width = rowSelectionCol.minWidth = rowSelectionCol.maxWidth = 25;
                    columns.unshift(rowSelectionCol);
                }
                else {
                    columns.unshift({
                        field: 'row-selection',
                        name: '',
                        cssClass: 'inline-actions-column',
                        width: 66,
                        minWidth: 66,
                        maxWidth: 66,
                        format: function (ctx) { return '<a class="inline-actions select-row"><i class="select-row fa fa-check"></i> Select</a>'; }
                    });
                }
            }
            return columns;
        };
        GridBase.prototype.createSlickGrid = function () {
            var grid = _super.prototype.createSlickGrid.call(this);
            usingSlickAutoColumnSize();
            if (Slick.AutoColumnSize) {
                this.autoColumnSizePlugin = new Slick.AutoColumnSize();
                grid.registerPlugin(this.autoColumnSizePlugin);
            }
            grid.registerPlugin(new Slick.Data.GroupItemMetadataProvider());
            return grid;
        };
        GridBase.prototype.resetColumns = function (columns) {
            var _this = this;
            this.slickContainer.fadeTo(0, 0);
            this.slickGrid.setColumns(columns);
            setTimeout(function () {
                if (_this.get_ExtGridOptions().AutoColumnSize == true) {
                    _this.resizeAllCulumn();
                }
                _this.slickContainer.fadeTo(100, 1);
            }, 100);
        };
        GridBase.prototype.resizeAllCulumn = function () {
            this.isAutosized = true;
            var gridContainerWidth = this.slickContainer.width();
            if (gridContainerWidth > 0) { }
            else {
                gridContainerWidth = this.element.closest('.s-Dialog').width() - 55;
            }
            if (gridContainerWidth > 0) { }
            else {
                gridContainerWidth = this.element.closest('.s-Panel').width() - 55;
            }
            if (gridContainerWidth > 0) { }
            else {
                gridContainerWidth = $('section.content').width() - 75;
            }
            this.slickGrid.setOptions({ forceFitColumns: false });
            var allVisibleColumns = this.autoColumnSizePlugin.resizeAllColumns().filter(function (f) { return f.visible != false; }); // this.allColumns;
            var allVisibleColumnWidth = 0;
            allVisibleColumns.map(function (m) { return m.width; }).forEach(function (e) { return allVisibleColumnWidth += e; });
            if (allVisibleColumnWidth > gridContainerWidth) {
                this.autoColumnSizePlugin.resizeAllColumns();
            }
            else if (allVisibleColumnWidth < gridContainerWidth) {
                this.autoColumnSizePlugin.resizeAllColumns();
                var fixedSizeColumns_1 = [];
                var resizableColumns_1 = [];
                allVisibleColumns.forEach(function (c) {
                    if (c.minWidth == c.maxWidth) {
                        fixedSizeColumns_1.push(c);
                        c.width = c.maxWidth;
                    }
                    else if (c.sourceItem) {
                        if (c.sourceItem.formatterType == String("Number")) {
                            fixedSizeColumns_1.push(c);
                        }
                        else if (c.sourceItem.filteringType == String("Enum")) {
                            fixedSizeColumns_1.push(c);
                            if (c.width < 80)
                                c.width = 80;
                        }
                        else if (c.sourceItem.formatterType == String("Date")) {
                            fixedSizeColumns_1.push(c);
                            if (c.width < 80)
                                c.width = 80;
                        }
                        else if (c.sourceItem.formatterType == String("DateTime")) {
                            fixedSizeColumns_1.push(c);
                            if (c.width < 140)
                                c.width = 140;
                        }
                        else if (c.sourceItem.formatterType == String("Checkbox")) {
                            fixedSizeColumns_1.push(c);
                        }
                        else {
                            resizableColumns_1.push(c);
                        }
                    }
                    else {
                        resizableColumns_1.push(c);
                    }
                });
                if (resizableColumns_1.length == 0) {
                    fixedSizeColumns_1 = [];
                    resizableColumns_1 = [];
                    allVisibleColumns.forEach(function (c) {
                        if (c.minWidth == c.maxWidth) {
                            fixedSizeColumns_1.push(c);
                            c.width = c.maxWidth;
                        }
                        else {
                            resizableColumns_1.push(c);
                        }
                    });
                }
                var fixedSizeColumnsWidth_1 = 0;
                fixedSizeColumns_1.map(function (m) { return m.width; }).forEach(function (e) { return fixedSizeColumnsWidth_1 += e; });
                var stretchableGridAreaWidth_1 = gridContainerWidth - fixedSizeColumnsWidth_1 - (this.isChildGrid ? 48 : 18);
                var resizableColumnsWidth_1 = 0;
                resizableColumns_1
                    .map(function (m) { return m.width; })
                    .forEach(function (e) { return resizableColumnsWidth_1 += e; });
                resizableColumns_1.forEach(function (c) {
                    var widthMultiplyingFactor = stretchableGridAreaWidth_1 / resizableColumnsWidth_1;
                    var newWidth = c.width * widthMultiplyingFactor;
                    var increment = newWidth - c.width;
                    //if (increment <= 200) // maximum streching is 200
                    c.width = newWidth;
                    //else c.width = c.width + 200;
                });
                this.slickGrid.setColumns(allVisibleColumns);
                this.slickGrid.onColumnsResized.notify();
            }
            this.setItems(this.getItems());
        };
        GridBase.prototype.getSlickOptions = function () {
            var opt = _super.prototype.getSlickOptions.call(this);
            if (this.get_ExtGridOptions().AutoColumnSize == true) {
                opt.forceFitColumns = true;
            }
            opt.enableTextSelectionOnCells = true;
            opt.enableCellNavigation = true;
            opt.asyncEditorLoading = false;
            opt.autoEdit = true;
            return opt;
        };
        GridBase.prototype.getViewOptions = function () {
            var opt = _super.prototype.getViewOptions.call(this);
            opt.rowsPerPage = q.DefaultMainGridOptions.RowsPerPage;
            return opt;
        };
        GridBase.prototype.getPrintRowServiceMethod = function () { return 'Print'; };
        GridBase.prototype.onClick = function (e, row, cell) {
            _super.prototype.onClick.call(this, e, row, cell);
            if (e.isDefaultPrevented())
                return;
            var item = this.itemAt(row);
            var recordId = item[this.getIdProperty()];
            var target = $(e.target);
            // if user clicks "i" element, e.g. icon
            if (target.parent().hasClass('inline-action') || target.parent().hasClass('inline-actions') || target.parent().hasClass('inline-btn'))
                target = target.parent();
            if (target.hasClass('inline-action') || target.hasClass('inline-actions') || target.hasClass('inline-btn')) {
                //e.preventDefault();
                this.onInlineActionClick(target, recordId, item);
            }
        };
        GridBase.prototype.onInlineActionClick = function (target, recordId, item) {
            var _this = this;
            if (target.hasClass('delete-row')) {
                if (this.isReadOnly == true) {
                    Q.notifyWarning('Read only records could not be deleted!');
                }
                else {
                    Q.confirm('Delete record?', function () {
                        var o = _this;
                        if (o.deleteEntity) { //for in-memory grid
                            o.deleteEntity(recordId);
                        }
                        else {
                            Q.serviceRequest(_this.getService() + '/Delete', { EntityId: recordId }, function (response) {
                                _this.refresh();
                            });
                        }
                    });
                }
            }
            else if (target.hasClass('view-details')) {
                this.slickGrid.getEditController().commitCurrentEdit();
                this.editItem(recordId);
            }
            else if (target.hasClass('print-row')) {
                var request = { EntityId: recordId };
                Q.postToService({ service: Q.resolveUrl(this.getService() + '/' + this.getPrintRowServiceMethod()), request: request, target: '_blank' });
            }
            else if (target.hasClass('select-row')) {
                this.rowSelection.setSelectedKeys([recordId]);
                this.pickerDialog.onSuccess(this.selectedItems);
                this.pickerDialog.dialogClose();
            }
        };
        GridBase.prototype.resetRowNumber = function () {
            this.nextRowNumber = 1;
            var items = this.getItems();
            var grouping_fields = this.view.getGrouping();
            if (grouping_fields.length == 0) {
                for (var i = 0; i < items.length; i++) {
                    items[i].RowNum = i + 1;
                }
            }
            else if (grouping_fields.length > 0) {
                var generateRowNumber_1 = function (groups) {
                    for (var gi = 0; gi < groups.length; gi++) {
                        var subGroups = groups[gi].groups;
                        if (subGroups) {
                            generateRowNumber_1(subGroups);
                        }
                        else {
                            var rows = groups[gi].rows;
                            for (var i = 0; i < rows.length; i++) {
                                rows[i].RowNum = i + 1;
                            }
                        }
                    }
                };
                var groups = this.view.getGroups();
                generateRowNumber_1(groups);
            }
            this.setItems(items);
        };
        GridBase.prototype.setGrouping = function (groupInfo) {
            this.view.setGrouping(groupInfo);
            this.resetRowNumber();
        };
        GridBase.prototype.onViewProcessData = function (response) {
            var _this = this;
            var r = _super.prototype.onViewProcessData.call(this, response);
            if (this.get_ExtGridOptions().ShowRowNumberColumn == true) {
                setTimeout(function () { _this.resetRowNumber(); });
            }
            return r;
        };
        GridBase.prototype.initDialog = function (dialog) {
            _super.prototype.initDialog.call(this, dialog);
            dialog.parentGrid = this;
        };
        Object.defineProperty(GridBase.prototype, "selectedItems", {
            get: function () {
                var _this = this;
                return this.rowSelection.getSelectedKeys().map(function (m) {
                    var item = _this.view.getItemById(m);
                    if (!item) {
                        item = {};
                        item[_this.getIdProperty()] = m;
                    }
                    return item;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridBase.prototype, "selectedKeys", {
            set: function (value) {
                var options = this.options;
                if (options.multiple == true) {
                    this.rowSelection.setSelectedKeys(value);
                }
                else {
                }
            },
            enumerable: true,
            configurable: true
        });
        GridBase.prototype.onViewSubmit = function () {
            if (!_super.prototype.onViewSubmit.call(this)) {
                return false;
            }
            var options = this.options;
            if (options.filteringCriteria) {
                var request = this.view.params;
                request.Criteria = Serenity.Criteria.and(request.Criteria, options.filteringCriteria);
            }
            return true;
        };
        GridBase = __decorate([
            Serenity.Decorators.filterable()
        ], GridBase);
        return GridBase;
    }(Serenity.EntityGrid));
    _Ext.GridBase = GridBase;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var ReportGridBase = /** @class */ (function (_super) {
        __extends(ReportGridBase, _super);
        function ReportGridBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ReportGridBase.prototype.getButtons = function () {
            var buttons = _super.prototype.getButtons.call(this);
            buttons.splice(0, 1);
            return buttons;
        };
        ReportGridBase.prototype.getColumns = function () {
            var columns = _super.prototype.getColumns.call(this);
            columns.splice(0, 1);
            return columns;
        };
        ReportGridBase = __decorate([
            Serenity.Decorators.filterable()
        ], ReportGridBase);
        return ReportGridBase;
    }(_Ext.GridBase));
    _Ext.ReportGridBase = ReportGridBase;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var ReportPanelBase = /** @class */ (function (_super) {
        __extends(ReportPanelBase, _super);
        function ReportPanelBase(container) {
            var _this = _super.call(this, container) || this;
            _this.byId('PanelTitle').text(_this.getReportTitle());
            _this.element.addClass('s-DataGrid');
            _this.byId('SubmitButton').click(function (e) {
                e.preventDefault();
                if (!_this.validateForm()) {
                    return;
                }
                _Ext.ReportHelper.execute({ reportKey: _this.getReportKey(), params: { Request: _this.getReportRequest() }, extension: 'html' });
            });
            _this.byId('DownloadPdfButton').click(function (e) {
                e.preventDefault();
                if (!_this.validateForm()) {
                    return;
                }
                _Ext.ReportHelper.execute({ reportKey: _this.getReportKey(), params: { Request: _this.getReportRequest() }, extension: 'pdf' });
            });
            return _this;
        }
        //protected getTemplateName() { return 'ReportPanel'; }
        ReportPanelBase.prototype.getReportTitle = function () { return 'Report Title'; };
        ReportPanelBase.prototype.getReportKey = function () { return 'Report.Key'; };
        ReportPanelBase.prototype.getReportRequest = function () { return this.getSaveEntity(); };
        ReportPanelBase.prototype.getTemplate = function () {
            return "\n    <div class=\"page-title grid-title\" id=\"~_PanelTitle\">Report Title</div>\n\n    <div class=\"s-Form flex-layout\">\n        <form id=\"~_Form\" action=\"\">\n            <div class=\"fieldset ui-widget ui-widget-content ui-corner-all\">\n                <div id=\"~_PropertyGrid\"></div>\n                <div class=\"clear\"></div>\n            </div>\n        </form>\n        <br />\n        <div class=\"buttons align-center\">\n            <button id=\"~_SubmitButton\" class=\"btn btn-primary\"><i class=\"fa fa-search margin-r-5\"></i> Show</button>\n            <button id=\"~_DownloadPdfButton\" class=\"btn btn-default\"><i class=\"fa fa-file-pdf-o margin-r-5\"></i> Download PDF</button>\n        </div>\n    </div>\n";
        };
        return ReportPanelBase;
    }(Serenity.PropertyPanel));
    _Ext.ReportPanelBase = ReportPanelBase;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var DialogBase = /** @class */ (function (_super) {
        __extends(DialogBase, _super);
        function DialogBase(opt) {
            var _this = _super.call(this, opt) || this;
            _this.isReadOnly = false;
            _this.element.fadeTo(0, 0);
            if (_this.get_ExtDialogOptions().PendingChangesConfirmation == true) {
                _Ext.DialogUtils.pendingChangesConfirmation(_this.element, function () { return _this.getSaveState() != _this.loadedState; });
            }
            return _this;
        }
        DialogBase.prototype.get_ExtDialogOptions = function () { return q.DefaultEntityDialogOptions; };
        DialogBase.prototype.updateInterface = function () {
            _super.prototype.updateInterface.call(this);
            this.setReadOnly(this.isReadOnly);
            if (this.get_ExtDialogOptions().HideCategoyLinksBar == true) {
                this.element.find('.category-links').hide();
                var $FirstCategory = this.element.find('.first-category > .category-title');
                if (Q.isEmptyOrNull($FirstCategory.find('.category-anchor').text()))
                    $FirstCategory.hide();
            }
            this.element.fadeTo(100, 1);
        };
        DialogBase.prototype.onDialogOpen = function () {
            var _this = this;
            _super.prototype.onDialogOpen.call(this);
            if (this.get_ExtDialogOptions().AutoFitContentArea == true) {
                this.fullContentArea();
            }
            //temporary fix for set grid editor height
            setTimeout(function () { _this.onAfterSetDialogSize(); }, 200);
        };
        DialogBase.prototype.onDialogClose = function () {
            _super.prototype.onDialogClose.call(this);
            this.onAfterDialogClose(this.entity);
        };
        DialogBase.prototype.setReadOnly = function (value) {
            this.isReadOnly = value;
            if (this.isReadOnly == true) {
                this.saveAndCloseButton.toggleClass('disabled', this.isReadOnly);
                this.applyChangesButton.toggleClass('disabled', this.isReadOnly);
                this.deleteButton.toggleClass('disabled', this.isReadOnly);
                this.cloneButton.toggleClass('disabled', this.isReadOnly);
                this.undeleteButton.toggleClass('disabled', this.isReadOnly);
                this.toolbar.findButton('btn-save-and-close').addClass('disabled');
                this.toolbar.findButton('btn-replace-row').addClass('disabled');
                this.toolbar.findButton('btn-history').addClass('disabled');
                // remove required asterisk (*)
                this.element.find('sup').toggle(this.isReadOnly);
                for (var editor in this.form) {
                    if (this.form[editor].widgetName) {
                        try {
                            Serenity.EditorUtils.setReadOnly(this.form[editor], this.isReadOnly);
                        }
                        catch (_a) { }
                    }
                }
            }
        };
        DialogBase.prototype.getToolbarButtons = function () {
            var _this = this;
            var buttons = _super.prototype.getToolbarButtons.call(this);
            var extOptions = this.get_ExtDialogOptions();
            if (extOptions.ShowSaveAndNewButtonInToolbar == true)
                buttons.push({
                    title: 'Save & New',
                    icon: 'fa fa-save',
                    cssClass: 'btn-save-and-close',
                    onClick: function () {
                        _this.save(function (response) {
                            _this.loadEntity({});
                        });
                    }
                });
            if (extOptions.ShowCloseButtonInToolbar == true)
                buttons.push({
                    title: 'Close',
                    icon: 'fa fa-close',
                    cssClass: 'btn-close',
                    onClick: function () {
                        _this.dialogClose();
                    }
                });
            if (extOptions.ShowRefreshButtonInToolbar == true)
                buttons.push({
                    title: 'Refresh',
                    icon: 'fa fa-refresh',
                    onClick: function () {
                        _this.onRefreshClick();
                    }
                });
            try {
                if (extOptions.ShowReplaceRowButtonInToolbar == true && Q.Authorization.hasPermission('Administration:ReplaceRow')) {
                    if (Q.isEmptyOrNull(this.getService()) == false) {
                        buttons.push({
                            title: 'Replace',
                            icon: 'fa fa-trash-o',
                            cssClass: 'btn-replace-row',
                            onClick: function () {
                                var idProperty = _this.getIdProperty();
                                var nameProperty = _this.getNameProperty();
                                var entityId = _this.entity[idProperty];
                                var entityName = _this.entity[nameProperty];
                                if (entityId) {
                                    Q.serviceRequest(_this.getService() + '/List', {}, function (response) {
                                        var entityList = response.Entities;
                                        var dlg = new _Ext.ReplaceRowDialog({
                                            FormKey: _this.getFormKey(),
                                            IdProperty: idProperty,
                                            NameProperty: nameProperty,
                                            EntityTypeTitle: _this.getEntitySingular(),
                                            DeletedEntityName: entityName,
                                            DeletedEntityId: entityId,
                                        }, entityList);
                                        dlg.dialogOpen();
                                        _this.dialogClose();
                                    });
                                }
                            }
                        });
                    }
                }
                if (extOptions.ShowChangeLogButtonInToolbar == true && Q.Authorization.hasPermission('Administration:AuditLog')) {
                    buttons.push({
                        cssClass: 'btn-history',
                        icon: 'fa fa-history',
                        onClick: function () {
                            var entityId = _this.entity[_this.getIdProperty()];
                            if (entityId) {
                                var dlg = new _Ext.AuditLogViewerDialog({ FormKey: _this.getFormKey(), EntityId: entityId });
                                dlg.dialogOpen();
                            }
                            else {
                                Q.alert('No change log found for this entity.');
                            }
                        }
                    });
                }
                //clone button click event customization
                var cloneButton = Q.tryFirst(buttons, function (x) { return x.cssClass == 'clone-button'; });
                cloneButton.onClick = function () {
                    if (!_this.isEditMode()) {
                        return;
                    }
                    var cloneEntity = _this.getCloningEntity();
                    Serenity.Widget.create({
                        type: ss.getInstanceType(_this),
                        init: function (dlg) {
                            _this.parentGrid.initDialog(dlg);
                            dlg.loadEntityAndOpenDialog(cloneEntity, null);
                        }
                    });
                    _this.dialogClose();
                };
            }
            catch (e) { }
            return buttons;
        };
        DialogBase.prototype.onRefreshClick = function () {
            this.reloadById();
        };
        DialogBase.prototype.getSaveState = function () {
            try {
                return $.toJSON(this.getSaveEntity());
            }
            catch (e) {
                return null;
            }
        };
        DialogBase.prototype.onSaveSuccess = function (response) {
            _super.prototype.onSaveSuccess.call(this, response);
            isPageRefreshRequired = true;
            //Q.reloadLookup(this.getLookupKey());
        };
        DialogBase.prototype.loadResponse = function (data) {
            _super.prototype.loadResponse.call(this, data);
            if (this.get_ExtDialogOptions().PendingChangesConfirmation == true) {
                this.loadedState = this.getSaveState();
            }
        };
        DialogBase.prototype.maximize = function () {
            var _this = this;
            this.element.closest(".ui-dialog").find(".ui-dialog-titlebar-maximize").click();
            setTimeout(function () {
                var dialogElement = _this.element ? _this.element.closest(".ui-dialog") : $(".ui-dialog");
                var dialogHeight = dialogElement.height();
                var titleBarHeight = dialogElement.find('.ui-dialog-title').height() || 20;
                var toolBarHeight = dialogElement.find('.s-DialogToolbar.s-Toolbar').height() || 0;
                var tabBarHeight = dialogElement.find('.nav.nav-tabs.property-tabs').height() || 0;
                var categoryLinkHeight = dialogElement.find('.category-links').height() || 0;
                _this.element.find('.categories').height(dialogHeight - titleBarHeight - toolBarHeight - tabBarHeight - categoryLinkHeight - 40);
            }, 100);
        };
        DialogBase.prototype.fullContentArea = function () {
            this.setDialogSize();
        };
        // set the dialog size relative to content area (to shrink use negative value)
        DialogBase.prototype.setDialogSize = function (width, height, top, left, $content) {
            var _this = this;
            if (!$content) {
                $content = $('section.content');
            }
            if ($content.length == 0) {
                $content = $('.content-wrapper');
            }
            var dialogElement = this.element ? this.element.closest(".ui-dialog") : $(".ui-dialog");
            if ($content.length > 0 && dialogElement.length > 0) {
                var dialogWidth = $content.width() + 30 + (width || 0);
                var dialogHeight = $content.height() + (height || 30);
                this.element.dialog("option", "width", dialogWidth);
                this.element.dialog("option", "height", dialogHeight);
                var titleBarHeight = dialogElement.find('.ui-dialog-title').height() || 20;
                var toolBarHeight = dialogElement.find('.s-DialogToolbar.s-Toolbar').height() || 0;
                var tabBarHeight = dialogElement.find('.nav.nav-tabs.property-tabs').height() || 0;
                var categoryLinkHeight = dialogElement.find('.category-links').height() || 0;
                this.element.find('.categories').height(dialogHeight - titleBarHeight - toolBarHeight - tabBarHeight - categoryLinkHeight - 55);
                dialogElement.css({
                    left: $content.position().left + (left || 0),
                    top: (top || 50),
                });
            }
            setTimeout(function () {
                _this.onAfterSetDialogSize();
            }, 200);
        };
        DialogBase.prototype.onAfterSetDialogSize = function () { };
        DialogBase.prototype.onAfterDialogClose = function (entity) { };
        DialogBase = __decorate([
            Serenity.Decorators.responsive(),
            Serenity.Decorators.maximizable()
        ], DialogBase);
        return DialogBase;
    }(Serenity.EntityDialog));
    _Ext.DialogBase = DialogBase;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var GridItemPickerDialog = /** @class */ (function (_super) {
        __extends(GridItemPickerDialog, _super);
        function GridItemPickerDialog(options) {
            var _this = _super.call(this, options) || this;
            _this.onSuccess = function (selectedItems) { };
            var gridType = options.gridType;
            if (!gridType.prototype)
                gridType = Q.typeByFullName(options.gridType);
            try {
                _this.checkGrid = new gridType(_this.byId("RowSelectionCheckGrid"), options);
                if (options.preSelectedKeys)
                    _this.checkGrid.selectedKeys = options.preSelectedKeys;
                _this.dialogTitle = q.text('Controls.Select', "Select") + " - " + _this.checkGrid.getTitle();
                _this.checkGrid.setTitle(null);
                _this.checkGrid.element.height(500);
                _this.checkGrid.pickerDialog = _this;
            }
            catch (ex) {
                console.warn('Could not intialize ' + options.gridType);
            }
            return _this;
        }
        GridItemPickerDialog.prototype.getTemplate = function () {
            return "<div id=\"~_RowSelectionCheckGrid\" \n                class=\"RowSelectionCheckGrid " + (this.options.multiple == true ? 'multi-select' : 'single-select') + "\" \n                style = \"margin: 15px 15px 0 15px;\" >\n            </div>";
        };
        Object.defineProperty(GridItemPickerDialog.prototype, "selectedItems", {
            get: function () { return this.checkGrid.selectedItems; },
            enumerable: true,
            configurable: true
        });
        GridItemPickerDialog.prototype.getDialogOptions = function () {
            var _this = this;
            var opt = _super.prototype.getDialogOptions.call(this);
            opt.buttons = [{
                    text: Q.text("Dialogs.OkButton"),
                    click: function () {
                        var selectedItems = _this.checkGrid.selectedItems;
                        if (!selectedItems.length) {
                            Q.notifyWarning("Please select some items!");
                            return;
                        }
                        _this.onSuccess(selectedItems);
                        _this.dialogClose();
                    }
                }, {
                    text: Q.text("Dialogs.CancelButton"),
                    click: function () {
                        _this.dialogClose();
                    }
                }];
            opt.height = 500;
            return opt;
        };
        GridItemPickerDialog = __decorate([
            Serenity.Decorators.registerClass()
        ], GridItemPickerDialog);
        return GridItemPickerDialog;
    }(Serenity.TemplatedDialog));
    _Ext.GridItemPickerDialog = GridItemPickerDialog;
})(_Ext || (_Ext = {}));
/// <reference path="../Bases/DialogBase.ts" />
var _Ext;
(function (_Ext) {
    var EditorDialogBase = /** @class */ (function (_super) {
        __extends(EditorDialogBase, _super);
        function EditorDialogBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorDialogBase.prototype.get_ExtDialogOptions = function () { return q.DefaultEditorDialogOptions; };
        EditorDialogBase.prototype.getIdProperty = function () { return "__id"; };
        EditorDialogBase.prototype.destroy = function () {
            this.onSave = null;
            this.onDelete = null;
            _super.prototype.destroy.call(this);
        };
        EditorDialogBase.prototype.updateInterface = function () {
            _super.prototype.updateInterface.call(this);
            this.saveAndCloseButton.find('.button-inner').text(this.isNew() ? (Q.tryGetText('Controls.AddButton') || 'Add') : (Q.tryGetText('Controls.ApplyButton') || 'Apply'));
            // apply changes button doesn't work properly with in-memory grids yet
            if (this.applyChangesButton) {
                this.applyChangesButton.hide();
            }
            if (this.parentEditor.isReadOnly == true) {
                this.saveAndCloseButton.addClass('disabled');
                this.deleteButton.addClass('disabled');
                Serenity.EditorUtils.setReadonly(this.element.find('.editor'), true);
                // remove required asterisk (*)
                this.element.find('sup').hide();
            }
        };
        EditorDialogBase.prototype.saveHandler = function (options, callback) {
            this.onSave && this.onSave(options, callback);
        };
        EditorDialogBase.prototype.deleteHandler = function (options, callback) {
            this.onDelete && this.onDelete(options, callback);
        };
        EditorDialogBase = __decorate([
            Serenity.Decorators.registerClass()
        ], EditorDialogBase);
        return EditorDialogBase;
    }(_Ext.DialogBase));
    _Ext.EditorDialogBase = EditorDialogBase;
})(_Ext || (_Ext = {}));
/// <reference path="../Bases/GridBase.ts" />
var _Ext;
(function (_Ext) {
    var GridEditorBase = /** @class */ (function (_super) {
        __extends(GridEditorBase, _super);
        function GridEditorBase(container) {
            var _this = _super.call(this, container) || this;
            _this.isChildGrid = true;
            _this.nextId = 1;
            _this.slickGrid.onSort.subscribe(function (e, args) {
                _this.sortGridFunction(args.grid, args.sortCols[0], args.sortCols[0].sortCol.field);
                //(args.grid as Slick.Grid).init();
                args.grid.invalidateAllRows();
                args.grid.invalidate();
                args.grid.render();
                args.grid.resizeCanvas();
            });
            return _this;
        }
        GridEditorBase.prototype.get_ExtGridOptions = function () { return Q.deepClone(q.DefaultEditorGridOptions); };
        GridEditorBase.prototype.getIdProperty = function () { return "__id"; };
        GridEditorBase.prototype.sortGridFunction = function (grid, column, field) {
            grid.getData().sort(function (a, b) {
                var result = a[field] > b[field] ? 1 :
                    a[field] < b[field] ? -1 :
                        0;
                return column.sortAsc ? result : -result;
            });
        };
        GridEditorBase.prototype.getQuickFilters = function () {
            return [];
        };
        GridEditorBase.prototype.id = function (entity) {
            return entity[this.getIdProperty()];
        };
        GridEditorBase.prototype.save = function (opt, callback) {
            var _this = this;
            var request = opt.request;
            var row = Q.deepClone(request.Entity);
            var id = this.id(row);
            if (id == null) {
                row[this.getIdProperty()] = "`" + this.nextId++;
            }
            if (!this.validateEntity(row, id)) {
                return;
            }
            var items = this.view.getItems().slice();
            if (id == null) {
                items.push(row);
            }
            else {
                var index = Q.indexOf(items, function (x) { return _this.id(x) === id; });
                items[index] = Q.deepClone({}, items[index], row);
            }
            this.value = items;
            callback({});
        };
        GridEditorBase.prototype.deleteEntity = function (id) {
            var _this = this;
            this.view.deleteItem(id);
            setTimeout(function () { _this.onItemsChanged(); });
            return true;
        };
        GridEditorBase.prototype.validateEntity = function (row, id) {
            return true;
        };
        GridEditorBase.prototype.getNewEntity = function () {
            return {};
        };
        GridEditorBase.prototype.getButtons = function () {
            var _this = this;
            return [{
                    title: /*'Add ' +*/ this.getItemName(),
                    cssClass: 'add-button',
                    onClick: function () { _this.addButtonClick(); }
                }];
        };
        GridEditorBase.prototype.addButtonClick = function () {
            var _this = this;
            this.createEntityDialog(this.getItemType(), function (dlg) {
                var dialog = dlg;
                dialog.parentEditor = _this;
                dialog.onSave = function (opt, callback) { return _this.save(opt, callback); };
                dialog.loadEntityAndOpenDialog(_this.getNewEntity());
            });
        };
        GridEditorBase.prototype.editItem = function (entityOrId) {
            var _this = this;
            var id = entityOrId;
            var item = this.view.getItemById(id);
            this.createEntityDialog(this.getItemType(), function (dlg) {
                var dialog = dlg;
                dialog.onDelete = function (opt, callback) {
                    if (!_this.deleteEntity(id)) {
                        return;
                    }
                    callback({});
                };
                dialog.parentEditor = _this;
                dialog.onSave = function (opt, callback) { return _this.save(opt, callback); };
                dialog.loadEntityAndOpenDialog(item);
            });
            ;
        };
        GridEditorBase.prototype.getEditValue = function (property, target) {
            target[property.name] = this.value;
        };
        GridEditorBase.prototype.setEditValue = function (source, property) {
            this.value = source[property.name];
        };
        Object.defineProperty(GridEditorBase.prototype, "value", {
            get: function () {
                var p = this.getIdProperty();
                this.slickGrid.getEditController().commitCurrentEdit();
                var items = this.view.getItems();
                this.onBeforeGetValue(items);
                return items.map(function (x) {
                    var y = Q.deepClone(x);
                    var id = y[p];
                    if (id && id.toString().charAt(0) == '`')
                        delete y[p];
                    if (y['RowNum'])
                        delete y['RowNum'];
                    return y;
                });
            },
            set: function (value) {
                var _this = this;
                var id = this.getIdProperty();
                var val = value || [];
                var items = val.map(function (x) {
                    var y = Q.deepClone(x);
                    if (y[id] == null) {
                        y[id] = "`" + _this.nextId++;
                    }
                    return y;
                });
                var r = this.onViewProcessData({ Entities: items });
                this.view.setItems(r.Entities, true);
                setTimeout(function () { _this.onItemsChanged(); });
                this.resetRowNumber(); // to generate serial no.
            },
            enumerable: true,
            configurable: true
        });
        GridEditorBase.prototype.getGridCanLoad = function () {
            return false;
        };
        GridEditorBase.prototype.usePager = function () {
            return false;
        };
        GridEditorBase.prototype.getInitialTitle = function () {
            return null;
        };
        GridEditorBase.prototype.createToolbarExtensions = function () {
            var _this = this;
            //super.createToolbarExtensions();
            if (this.get_ExtGridOptions().EnableQuickSearch) {
                Serenity.GridUtils.addQuickSearchInputCustom(this.toolbar.element, function (field, text) {
                    _this.searchText = Select2.util.stripDiacritics(Q.trimToNull(text) || '').toLowerCase();
                    _this.view.setItems(_this.view.getItems(), true);
                });
            }
        };
        GridEditorBase.prototype.onViewFilter = function (row) {
            if (!_super.prototype.onViewFilter.call(this, row)) {
                return false;
            }
            if (this.searchText) {
                return this.matchContains(row);
            }
            return true;
        };
        GridEditorBase.prototype.matchContains = function (item) {
            var result = false;
            for (var prop in item) {
                result = Select2.util.stripDiacritics(String(item[prop] || '')).toLowerCase().indexOf(this.searchText) >= 0;
                if (result == true) {
                    return result;
                }
            }
            return result;
        };
        GridEditorBase.prototype.enableFiltering = function () { return false; };
        GridEditorBase.prototype.onViewSubmit = function () { return false; };
        GridEditorBase.prototype.get_readOnly = function () {
            return this.isReadOnly;
        };
        GridEditorBase.prototype.set_readOnly = function (value) {
            this.isReadOnly = value;
            if (value == true) {
                this.element.find('.add-button').addClass('disabled');
                var opt = this.slickGrid.getOptions();
                opt.editable = false;
                this.slickGrid.setOptions(opt);
            }
            else {
                this.element.find('.add-button').removeClass('disabled');
            }
        };
        GridEditorBase.prototype.getSlickOptions = function () {
            var opt = _super.prototype.getSlickOptions.call(this);
            opt.forceFitColumns = false;
            //opt.autoHeight = true; // If you need to show footer, you have to do opt.autoHeight = false
            return opt;
        };
        //custom events
        GridEditorBase.prototype.onItemsChanged = function () {
        };
        GridEditorBase.prototype.onBeforeGetValue = function (items) {
        };
        GridEditorBase = __decorate([
            Serenity.Decorators.registerClass([Serenity.IGetEditValue, Serenity.ISetEditValue, Serenity.IReadOnly]),
            Serenity.Decorators.editor(),
            Serenity.Decorators.element("<div/>")
        ], GridEditorBase);
        return GridEditorBase;
    }(_Ext.GridBase));
    _Ext.GridEditorBase = GridEditorBase;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var JsonGridEditorBase = /** @class */ (function (_super) {
        __extends(JsonGridEditorBase, _super);
        function JsonGridEditorBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        JsonGridEditorBase.prototype.getEditValue = function (property, target) {
            target[property.name] = JSON.stringify(this.value || []);
        };
        JsonGridEditorBase.prototype.setEditValue = function (source, property) {
            this.value = JSON.parse(source[property.name] || '[]');
        };
        return JsonGridEditorBase;
    }(_Ext.GridEditorBase));
    _Ext.JsonGridEditorBase = JsonGridEditorBase;
})(_Ext || (_Ext = {}));
/// <reference path="../Scripts/typings/serenity/Serenity.CoreLib.d.ts" />
/// <reference path="../Scripts/typings/jspdf/jspdf.autotable.d.ts" />
/// <reference path="../Modules/_Ext/_q/_q.var.ts" />
/// <reference path="../Modules/_Ext/Bases/GridBase.ts" />
/// <reference path="../Modules/_Ext/Bases/ReportGridBase.ts" />
/// <reference path="../Modules/_Ext/Bases/ReportPanelBase.ts" />
/// <reference path="../Modules/_Ext/Bases/DialogBase.ts" />
/// <reference path="../Modules/_Ext/Editors/GridItemPicker/GridItemPickerDialog.ts" />
/// <reference path="../Modules/_Ext/Editors/EditorDialogBase.ts" />
/// <reference path="../Modules/_Ext/Editors/GridEditorBase.ts" />
/// <reference path="../Modules/_Ext/Editors/JsonGridEditorBase.ts" />
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var LanguageForm = /** @class */ (function (_super) {
            __extends(LanguageForm, _super);
            function LanguageForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!LanguageForm.init) {
                    LanguageForm.init = true;
                    var s = Serenity;
                    var w0 = s.StringEditor;
                    Q.initFormType(LanguageForm, [
                        'LanguageId', w0,
                        'LanguageName', w0
                    ]);
                }
                return _this;
            }
            LanguageForm.formKey = 'Administration.Language';
            return LanguageForm;
        }(Serenity.PrefixedContext));
        Administration.LanguageForm = LanguageForm;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var LanguageRow;
        (function (LanguageRow) {
            LanguageRow.idProperty = 'Id';
            LanguageRow.nameProperty = 'LanguageName';
            LanguageRow.localTextPrefix = 'Administration.Language';
            LanguageRow.lookupKey = 'Administration.Language';
            function getLookup() {
                return Q.getLookup('Administration.Language');
            }
            LanguageRow.getLookup = getLookup;
        })(LanguageRow = Administration.LanguageRow || (Administration.LanguageRow = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var LanguageService;
        (function (LanguageService) {
            LanguageService.baseUrl = 'Administration/Language';
            [
                'Create',
                'Update',
                'Delete',
                'Retrieve',
                'List'
            ].forEach(function (x) {
                LanguageService[x] = function (r, s, o) {
                    return Q.serviceRequest(LanguageService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(LanguageService = Administration.LanguageService || (Administration.LanguageService = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var RoleForm = /** @class */ (function (_super) {
            __extends(RoleForm, _super);
            function RoleForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!RoleForm.init) {
                    RoleForm.init = true;
                    var s = Serenity;
                    var w0 = s.StringEditor;
                    Q.initFormType(RoleForm, [
                        'RoleName', w0
                    ]);
                }
                return _this;
            }
            RoleForm.formKey = 'Administration.Role';
            return RoleForm;
        }(Serenity.PrefixedContext));
        Administration.RoleForm = RoleForm;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var RolePermissionRow;
        (function (RolePermissionRow) {
            RolePermissionRow.idProperty = 'RolePermissionId';
            RolePermissionRow.nameProperty = 'PermissionKey';
            RolePermissionRow.localTextPrefix = 'Administration.RolePermission';
        })(RolePermissionRow = Administration.RolePermissionRow || (Administration.RolePermissionRow = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var RolePermissionService;
        (function (RolePermissionService) {
            RolePermissionService.baseUrl = 'Administration/RolePermission';
            [
                'Update',
                'List'
            ].forEach(function (x) {
                RolePermissionService[x] = function (r, s, o) {
                    return Q.serviceRequest(RolePermissionService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(RolePermissionService = Administration.RolePermissionService || (Administration.RolePermissionService = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var RoleRow;
        (function (RoleRow) {
            RoleRow.idProperty = 'RoleId';
            RoleRow.nameProperty = 'RoleName';
            RoleRow.localTextPrefix = 'Administration.Role';
            RoleRow.lookupKey = 'Administration.Role';
            function getLookup() {
                return Q.getLookup('Administration.Role');
            }
            RoleRow.getLookup = getLookup;
        })(RoleRow = Administration.RoleRow || (Administration.RoleRow = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var RoleService;
        (function (RoleService) {
            RoleService.baseUrl = 'Administration/Role';
            [
                'Create',
                'Update',
                'Delete',
                'Retrieve',
                'List'
            ].forEach(function (x) {
                RoleService[x] = function (r, s, o) {
                    return Q.serviceRequest(RoleService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(RoleService = Administration.RoleService || (Administration.RoleService = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var TenantForm = /** @class */ (function (_super) {
            __extends(TenantForm, _super);
            function TenantForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!TenantForm.init) {
                    TenantForm.init = true;
                    var s = Serenity;
                    var w0 = s.StringEditor;
                    Q.initFormType(TenantForm, [
                        'Name', w0,
                        'Description', w0,
                        'TenantId', w0
                    ]);
                }
                return _this;
            }
            TenantForm.formKey = 'Administration.Tenant';
            return TenantForm;
        }(Serenity.PrefixedContext));
        Administration.TenantForm = TenantForm;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var TenantRow;
        (function (TenantRow) {
            TenantRow.idProperty = 'Id';
            TenantRow.nameProperty = 'Name';
            TenantRow.localTextPrefix = 'Administration.Tenant';
        })(TenantRow = Administration.TenantRow || (Administration.TenantRow = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var TenantService;
        (function (TenantService) {
            TenantService.baseUrl = 'Administration/Tenant';
            [
                'Create',
                'Update',
                'Delete',
                'Retrieve',
                'List'
            ].forEach(function (x) {
                TenantService[x] = function (r, s, o) {
                    return Q.serviceRequest(TenantService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(TenantService = Administration.TenantService || (Administration.TenantService = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var TranslationService;
        (function (TranslationService) {
            TranslationService.baseUrl = 'Administration/Translation';
            [
                'List',
                'Update'
            ].forEach(function (x) {
                TranslationService[x] = function (r, s, o) {
                    return Q.serviceRequest(TranslationService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(TranslationService = Administration.TranslationService || (Administration.TranslationService = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserForm = /** @class */ (function (_super) {
            __extends(UserForm, _super);
            function UserForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!UserForm.init) {
                    UserForm.init = true;
                    var s = Serenity;
                    var w0 = s.StringEditor;
                    var w1 = s.EmailEditor;
                    var w2 = s.ImageUploadEditor;
                    var w3 = s.PasswordEditor;
                    Q.initFormType(UserForm, [
                        'Username', w0,
                        'DisplayName', w0,
                        'Email', w1,
                        'UserImage', w2,
                        'Password', w3,
                        'PasswordConfirm', w3,
                        'Source', w0
                    ]);
                }
                return _this;
            }
            UserForm.formKey = 'Administration.User';
            return UserForm;
        }(Serenity.PrefixedContext));
        Administration.UserForm = UserForm;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserPermissionRow;
        (function (UserPermissionRow) {
            UserPermissionRow.idProperty = 'UserPermissionId';
            UserPermissionRow.nameProperty = 'PermissionKey';
            UserPermissionRow.localTextPrefix = 'Administration.UserPermission';
        })(UserPermissionRow = Administration.UserPermissionRow || (Administration.UserPermissionRow = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserPermissionService;
        (function (UserPermissionService) {
            UserPermissionService.baseUrl = 'Administration/UserPermission';
            [
                'Update',
                'List',
                'ListRolePermissions',
                'ListPermissionKeys'
            ].forEach(function (x) {
                UserPermissionService[x] = function (r, s, o) {
                    return Q.serviceRequest(UserPermissionService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(UserPermissionService = Administration.UserPermissionService || (Administration.UserPermissionService = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserRoleRow;
        (function (UserRoleRow) {
            UserRoleRow.idProperty = 'UserRoleId';
            UserRoleRow.localTextPrefix = 'Administration.UserRole';
        })(UserRoleRow = Administration.UserRoleRow || (Administration.UserRoleRow = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserRoleService;
        (function (UserRoleService) {
            UserRoleService.baseUrl = 'Administration/UserRole';
            [
                'Update',
                'List'
            ].forEach(function (x) {
                UserRoleService[x] = function (r, s, o) {
                    return Q.serviceRequest(UserRoleService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(UserRoleService = Administration.UserRoleService || (Administration.UserRoleService = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserRow;
        (function (UserRow) {
            UserRow.idProperty = 'UserId';
            UserRow.isActiveProperty = 'IsActive';
            UserRow.nameProperty = 'Username';
            UserRow.localTextPrefix = 'Administration.User';
            UserRow.lookupKey = 'Administration.User';
            function getLookup() {
                return Q.getLookup('Administration.User');
            }
            UserRow.getLookup = getLookup;
        })(UserRow = Administration.UserRow || (Administration.UserRow = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserService;
        (function (UserService) {
            UserService.baseUrl = 'Administration/User';
            [
                'Create',
                'Update',
                'Delete',
                'Undelete',
                'Retrieve',
                'List'
            ].forEach(function (x) {
                UserService[x] = function (r, s, o) {
                    return Q.serviceRequest(UserService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(UserService = Administration.UserService || (Administration.UserService = {}));
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var UserPreferenceRow;
        (function (UserPreferenceRow) {
            UserPreferenceRow.idProperty = 'UserPreferenceId';
            UserPreferenceRow.nameProperty = 'Name';
            UserPreferenceRow.localTextPrefix = 'Common.UserPreference';
        })(UserPreferenceRow = Common.UserPreferenceRow || (Common.UserPreferenceRow = {}));
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var UserPreferenceService;
        (function (UserPreferenceService) {
            UserPreferenceService.baseUrl = 'Common/UserPreference';
            [
                'Update',
                'Retrieve'
            ].forEach(function (x) {
                UserPreferenceService[x] = function (r, s, o) {
                    return Q.serviceRequest(UserPreferenceService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(UserPreferenceService = Common.UserPreferenceService || (Common.UserPreferenceService = {}));
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var ExpenseType;
    (function (ExpenseType) {
        ExpenseType[ExpenseType["Transportation"] = 10] = "Transportation";
        ExpenseType[ExpenseType["Media"] = 20] = "Media";
        ExpenseType[ExpenseType["Delivery"] = 30] = "Delivery";
        ExpenseType[ExpenseType["Misc"] = 40] = "Misc";
    })(ExpenseType = SereneInventory.ExpenseType || (SereneInventory.ExpenseType = {}));
    Serenity.Decorators.registerEnumType(ExpenseType, 'SereneInventory.ExpenseType');
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var ProfitLossReportRequestForm = /** @class */ (function (_super) {
            __extends(ProfitLossReportRequestForm, _super);
            function ProfitLossReportRequestForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!ProfitLossReportRequestForm.init) {
                    ProfitLossReportRequestForm.init = true;
                    var s = Serenity;
                    var w0 = s.DateEditor;
                    Q.initFormType(ProfitLossReportRequestForm, [
                        'DateFrom', w0,
                        'DateTo', w0
                    ]);
                }
                return _this;
            }
            ProfitLossReportRequestForm.formKey = 'Inventory.ProfitLossReportRequestForm';
            return ProfitLossReportRequestForm;
        }(Serenity.PrefixedContext));
        Inventory.ProfitLossReportRequestForm = ProfitLossReportRequestForm;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var PurchaseInvoiceForm = /** @class */ (function (_super) {
            __extends(PurchaseInvoiceForm, _super);
            function PurchaseInvoiceForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!PurchaseInvoiceForm.init) {
                    PurchaseInvoiceForm.init = true;
                    var s = Serenity;
                    var w0 = s.EnumEditor;
                    var w1 = s.StringEditor;
                    var w2 = s.DateEditor;
                    var w3 = s.LookupEditor;
                    var w4 = Inventory.TransactionDetailGridEditor;
                    var w5 = Inventory.TransactionExpenseGridEditor;
                    var w6 = s.DecimalEditor;
                    Q.initFormType(PurchaseInvoiceForm, [
                        'TransactionType', w0,
                        'TransactionNumber', w1,
                        'TransactionDate', w2,
                        'TenantId', w3,
                        'TransactionDetailRows', w4,
                        'TransactionExpenseRows', w5,
                        'ExpensePerPiece', w6,
                        'TotalRefferencedAmount', w6
                    ]);
                }
                return _this;
            }
            PurchaseInvoiceForm.formKey = 'Inventory.PurchaseInvoice';
            return PurchaseInvoiceForm;
        }(Serenity.PrefixedContext));
        Inventory.PurchaseInvoiceForm = PurchaseInvoiceForm;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var SalesInvoiceForm = /** @class */ (function (_super) {
            __extends(SalesInvoiceForm, _super);
            function SalesInvoiceForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!SalesInvoiceForm.init) {
                    SalesInvoiceForm.init = true;
                    var s = Serenity;
                    var w0 = s.EnumEditor;
                    var w1 = s.StringEditor;
                    var w2 = s.DateEditor;
                    var w3 = s.LookupEditor;
                    var w4 = Inventory.TransactionDetailGridEditor;
                    Q.initFormType(SalesInvoiceForm, [
                        'TransactionType', w0,
                        'TransactionNumber', w1,
                        'TransactionDate', w2,
                        'PartyId', w3,
                        'TenantId', w1,
                        'TransactionDetailRows', w4
                    ]);
                }
                return _this;
            }
            SalesInvoiceForm.formKey = 'Inventory.SalesInvoice';
            return SalesInvoiceForm;
        }(Serenity.PrefixedContext));
        Inventory.SalesInvoiceForm = SalesInvoiceForm;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionDetailForm = /** @class */ (function (_super) {
            __extends(TransactionDetailForm, _super);
            function TransactionDetailForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!TransactionDetailForm.init) {
                    TransactionDetailForm.init = true;
                    var s = Serenity;
                    var w0 = s.LookupEditor;
                    var w1 = s.DecimalEditor;
                    var w2 = s.StringEditor;
                    Q.initFormType(TransactionDetailForm, [
                        'ProductId', w0,
                        'Quantity', w1,
                        'UnitPrice', w1,
                        'Amount', w1,
                        'TenantId', w2
                    ]);
                }
                return _this;
            }
            TransactionDetailForm.formKey = 'Inventory.TransactionDetail';
            return TransactionDetailForm;
        }(Serenity.PrefixedContext));
        Inventory.TransactionDetailForm = TransactionDetailForm;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionDetailRow;
        (function (TransactionDetailRow) {
            TransactionDetailRow.idProperty = 'Id';
            TransactionDetailRow.nameProperty = 'LookupText';
            TransactionDetailRow.localTextPrefix = 'Inventory.TransactionDetail';
        })(TransactionDetailRow = Inventory.TransactionDetailRow || (Inventory.TransactionDetailRow = {}));
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionDetailService;
        (function (TransactionDetailService) {
            TransactionDetailService.baseUrl = 'Inventory/TransactionDetail';
            [
                'Create',
                'Update',
                'Delete',
                'Retrieve',
                'List'
            ].forEach(function (x) {
                TransactionDetailService[x] = function (r, s, o) {
                    return Q.serviceRequest(TransactionDetailService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(TransactionDetailService = Inventory.TransactionDetailService || (Inventory.TransactionDetailService = {}));
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionExpenseForm = /** @class */ (function (_super) {
            __extends(TransactionExpenseForm, _super);
            function TransactionExpenseForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!TransactionExpenseForm.init) {
                    TransactionExpenseForm.init = true;
                    var s = Serenity;
                    var w0 = s.EnumEditor;
                    var w1 = s.DecimalEditor;
                    Q.initFormType(TransactionExpenseForm, [
                        'ExpenseType', w0,
                        'Amount', w1
                    ]);
                }
                return _this;
            }
            TransactionExpenseForm.formKey = 'Inventory.TransactionExpense';
            return TransactionExpenseForm;
        }(Serenity.PrefixedContext));
        Inventory.TransactionExpenseForm = TransactionExpenseForm;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionExpenseRow;
        (function (TransactionExpenseRow) {
            TransactionExpenseRow.idProperty = 'Id';
            TransactionExpenseRow.localTextPrefix = 'Inventory.TransactionExpense';
        })(TransactionExpenseRow = Inventory.TransactionExpenseRow || (Inventory.TransactionExpenseRow = {}));
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionExpenseService;
        (function (TransactionExpenseService) {
            TransactionExpenseService.baseUrl = 'Inventory/TransactionExpense';
            [
                'Create',
                'Update',
                'Delete',
                'Retrieve',
                'List'
            ].forEach(function (x) {
                TransactionExpenseService[x] = function (r, s, o) {
                    return Q.serviceRequest(TransactionExpenseService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(TransactionExpenseService = Inventory.TransactionExpenseService || (Inventory.TransactionExpenseService = {}));
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionForm = /** @class */ (function (_super) {
            __extends(TransactionForm, _super);
            function TransactionForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!TransactionForm.init) {
                    TransactionForm.init = true;
                    var s = Serenity;
                    var w0 = s.EnumEditor;
                    var w1 = s.StringEditor;
                    var w2 = s.DateEditor;
                    var w3 = s.LookupEditor;
                    var w4 = Inventory.TransactionDetailGridEditor;
                    var w5 = Inventory.TransactionExpenseGridEditor;
                    Q.initFormType(TransactionForm, [
                        'TransactionType', w0,
                        'TransactionNumber', w1,
                        'TransactionDate', w2,
                        'PartyId', w3,
                        'TenantId', w1,
                        'TransactionDetailRows', w4,
                        'TransactionExpenseRows', w5
                    ]);
                }
                return _this;
            }
            TransactionForm.formKey = 'Inventory.Transaction';
            return TransactionForm;
        }(Serenity.PrefixedContext));
        Inventory.TransactionForm = TransactionForm;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionRow;
        (function (TransactionRow) {
            TransactionRow.idProperty = 'Id';
            TransactionRow.nameProperty = 'TransactionNumber';
            TransactionRow.localTextPrefix = 'Inventory.Transaction';
            TransactionRow.lookupKey = 'Inventory.Transaction';
            function getLookup() {
                return Q.getLookup('Inventory.Transaction');
            }
            TransactionRow.getLookup = getLookup;
        })(TransactionRow = Inventory.TransactionRow || (Inventory.TransactionRow = {}));
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionService;
        (function (TransactionService) {
            TransactionService.baseUrl = 'Inventory/Transaction';
            [
                'Create',
                'Update',
                'Delete',
                'Retrieve',
                'List',
                'GetNextNumber'
            ].forEach(function (x) {
                TransactionService[x] = function (r, s, o) {
                    return Q.serviceRequest(TransactionService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(TransactionService = Inventory.TransactionService || (Inventory.TransactionService = {}));
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Membership;
    (function (Membership) {
        var ChangePasswordForm = /** @class */ (function (_super) {
            __extends(ChangePasswordForm, _super);
            function ChangePasswordForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!ChangePasswordForm.init) {
                    ChangePasswordForm.init = true;
                    var s = Serenity;
                    var w0 = s.PasswordEditor;
                    Q.initFormType(ChangePasswordForm, [
                        'OldPassword', w0,
                        'NewPassword', w0,
                        'ConfirmPassword', w0
                    ]);
                }
                return _this;
            }
            ChangePasswordForm.formKey = 'Membership.ChangePassword';
            return ChangePasswordForm;
        }(Serenity.PrefixedContext));
        Membership.ChangePasswordForm = ChangePasswordForm;
    })(Membership = SereneInventory.Membership || (SereneInventory.Membership = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Membership;
    (function (Membership) {
        var ForgotPasswordForm = /** @class */ (function (_super) {
            __extends(ForgotPasswordForm, _super);
            function ForgotPasswordForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!ForgotPasswordForm.init) {
                    ForgotPasswordForm.init = true;
                    var s = Serenity;
                    var w0 = s.EmailEditor;
                    Q.initFormType(ForgotPasswordForm, [
                        'Email', w0
                    ]);
                }
                return _this;
            }
            ForgotPasswordForm.formKey = 'Membership.ForgotPassword';
            return ForgotPasswordForm;
        }(Serenity.PrefixedContext));
        Membership.ForgotPasswordForm = ForgotPasswordForm;
    })(Membership = SereneInventory.Membership || (SereneInventory.Membership = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Membership;
    (function (Membership) {
        var LoginForm = /** @class */ (function (_super) {
            __extends(LoginForm, _super);
            function LoginForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!LoginForm.init) {
                    LoginForm.init = true;
                    var s = Serenity;
                    var w0 = s.StringEditor;
                    var w1 = s.PasswordEditor;
                    Q.initFormType(LoginForm, [
                        'Username', w0,
                        'Password', w1
                    ]);
                }
                return _this;
            }
            LoginForm.formKey = 'Membership.Login';
            return LoginForm;
        }(Serenity.PrefixedContext));
        Membership.LoginForm = LoginForm;
    })(Membership = SereneInventory.Membership || (SereneInventory.Membership = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Membership;
    (function (Membership) {
        var ResetPasswordForm = /** @class */ (function (_super) {
            __extends(ResetPasswordForm, _super);
            function ResetPasswordForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!ResetPasswordForm.init) {
                    ResetPasswordForm.init = true;
                    var s = Serenity;
                    var w0 = s.PasswordEditor;
                    Q.initFormType(ResetPasswordForm, [
                        'NewPassword', w0,
                        'ConfirmPassword', w0
                    ]);
                }
                return _this;
            }
            ResetPasswordForm.formKey = 'Membership.ResetPassword';
            return ResetPasswordForm;
        }(Serenity.PrefixedContext));
        Membership.ResetPasswordForm = ResetPasswordForm;
    })(Membership = SereneInventory.Membership || (SereneInventory.Membership = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Membership;
    (function (Membership) {
        var SignUpForm = /** @class */ (function (_super) {
            __extends(SignUpForm, _super);
            function SignUpForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!SignUpForm.init) {
                    SignUpForm.init = true;
                    var s = Serenity;
                    var w0 = s.StringEditor;
                    var w1 = s.EmailEditor;
                    var w2 = s.PasswordEditor;
                    Q.initFormType(SignUpForm, [
                        'DisplayName', w0,
                        'Email', w1,
                        'ConfirmEmail', w1,
                        'Password', w2,
                        'ConfirmPassword', w2
                    ]);
                }
                return _this;
            }
            SignUpForm.formKey = 'Membership.SignUp';
            return SignUpForm;
        }(Serenity.PrefixedContext));
        Membership.SignUpForm = SignUpForm;
    })(Membership = SereneInventory.Membership || (SereneInventory.Membership = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var PartyType;
    (function (PartyType) {
        PartyType[PartyType["Supplier"] = 10] = "Supplier";
        PartyType[PartyType["Customer"] = 20] = "Customer";
    })(PartyType = SereneInventory.PartyType || (SereneInventory.PartyType = {}));
    Serenity.Decorators.registerEnumType(PartyType, 'SereneInventory.PartyType');
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var ProductType;
    (function (ProductType) {
        ProductType[ProductType["ProductType1"] = 10] = "ProductType1";
        ProductType[ProductType["ProductType2"] = 20] = "ProductType2";
    })(ProductType = SereneInventory.ProductType || (SereneInventory.ProductType = {}));
    Serenity.Decorators.registerEnumType(ProductType, 'SereneInventory.ProductType');
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var PartyForm = /** @class */ (function (_super) {
            __extends(PartyForm, _super);
            function PartyForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!PartyForm.init) {
                    PartyForm.init = true;
                    var s = Serenity;
                    var w0 = s.EnumEditor;
                    var w1 = s.StringEditor;
                    Q.initFormType(PartyForm, [
                        'PartyType', w0,
                        'Name', w1,
                        'Address', w1,
                        'Contact', w1,
                        'TenantId', w1
                    ]);
                }
                return _this;
            }
            PartyForm.formKey = 'Setup.Party';
            return PartyForm;
        }(Serenity.PrefixedContext));
        Setup.PartyForm = PartyForm;
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var PartyRow;
        (function (PartyRow) {
            PartyRow.idProperty = 'Id';
            PartyRow.nameProperty = 'Name';
            PartyRow.localTextPrefix = 'Setup.Party';
            PartyRow.lookupKey = 'Setup.Party';
            function getLookup() {
                return Q.getLookup('Setup.Party');
            }
            PartyRow.getLookup = getLookup;
        })(PartyRow = Setup.PartyRow || (Setup.PartyRow = {}));
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var PartyService;
        (function (PartyService) {
            PartyService.baseUrl = 'Setup/Party';
            [
                'Create',
                'Update',
                'Delete',
                'Retrieve',
                'List'
            ].forEach(function (x) {
                PartyService[x] = function (r, s, o) {
                    return Q.serviceRequest(PartyService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(PartyService = Setup.PartyService || (Setup.PartyService = {}));
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var ProductCategoryForm = /** @class */ (function (_super) {
            __extends(ProductCategoryForm, _super);
            function ProductCategoryForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!ProductCategoryForm.init) {
                    ProductCategoryForm.init = true;
                    var s = Serenity;
                    var w0 = s.StringEditor;
                    Q.initFormType(ProductCategoryForm, [
                        'Name', w0,
                        'Description', w0,
                        'TenantId', w0
                    ]);
                }
                return _this;
            }
            ProductCategoryForm.formKey = 'Setup.ProductCategory';
            return ProductCategoryForm;
        }(Serenity.PrefixedContext));
        Setup.ProductCategoryForm = ProductCategoryForm;
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var ProductCategoryRow;
        (function (ProductCategoryRow) {
            ProductCategoryRow.idProperty = 'Id';
            ProductCategoryRow.nameProperty = 'Name';
            ProductCategoryRow.localTextPrefix = 'Setup.ProductCategory';
            ProductCategoryRow.lookupKey = 'Setup.ProductCategory';
            function getLookup() {
                return Q.getLookup('Setup.ProductCategory');
            }
            ProductCategoryRow.getLookup = getLookup;
        })(ProductCategoryRow = Setup.ProductCategoryRow || (Setup.ProductCategoryRow = {}));
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var ProductCategoryService;
        (function (ProductCategoryService) {
            ProductCategoryService.baseUrl = 'Setup/ProductCategory';
            [
                'Create',
                'Update',
                'Delete',
                'Retrieve',
                'List'
            ].forEach(function (x) {
                ProductCategoryService[x] = function (r, s, o) {
                    return Q.serviceRequest(ProductCategoryService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(ProductCategoryService = Setup.ProductCategoryService || (Setup.ProductCategoryService = {}));
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var ProductForm = /** @class */ (function (_super) {
            __extends(ProductForm, _super);
            function ProductForm(prefix) {
                var _this = _super.call(this, prefix) || this;
                if (!ProductForm.init) {
                    ProductForm.init = true;
                    var s = Serenity;
                    var w0 = s.StringEditor;
                    var w1 = s.LookupEditor;
                    var w2 = s.MultipleImageUploadEditor;
                    Q.initFormType(ProductForm, [
                        'Name', w0,
                        'Code', w0,
                        'ProductCategoryId', w1,
                        'Description', w0,
                        'Images', w2,
                        'TenantId', w0
                    ]);
                }
                return _this;
            }
            ProductForm.formKey = 'Setup.Product';
            return ProductForm;
        }(Serenity.PrefixedContext));
        Setup.ProductForm = ProductForm;
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var ProductRow;
        (function (ProductRow) {
            ProductRow.idProperty = 'Id';
            ProductRow.nameProperty = 'Name';
            ProductRow.localTextPrefix = 'Setup.Product';
            ProductRow.lookupKey = 'Setup.Product';
            function getLookup() {
                return Q.getLookup('Setup.Product');
            }
            ProductRow.getLookup = getLookup;
        })(ProductRow = Setup.ProductRow || (Setup.ProductRow = {}));
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var ProductService;
        (function (ProductService) {
            ProductService.baseUrl = 'Setup/Product';
            [
                'Create',
                'Update',
                'Delete',
                'Retrieve',
                'List'
            ].forEach(function (x) {
                ProductService[x] = function (r, s, o) {
                    return Q.serviceRequest(ProductService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(ProductService = Setup.ProductService || (Setup.ProductService = {}));
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Texts;
    (function (Texts) {
        SereneInventory['Texts'] = Q.proxyTexts(Texts, '', { Db: { Administration: { Language: { Id: 1, LanguageId: 1, LanguageName: 1 }, Role: { RoleId: 1, RoleName: 1 }, RolePermission: { PermissionKey: 1, RoleId: 1, RolePermissionId: 1, RoleRoleName: 1 }, Tenant: { Description: 1, EDate: 1, EUserId: 1, IDate: 1, IUserId: 1, Id: 1, Name: 1, Remarks: 1, RowNum: 1, TenantId: 1 }, Translation: { CustomText: 1, EntityPlural: 1, Key: 1, OverrideConfirmation: 1, SaveChangesButton: 1, SourceLanguage: 1, SourceText: 1, TargetLanguage: 1, TargetText: 1 }, User: { DisplayName: 1, Email: 1, InsertDate: 1, InsertUserId: 1, IsActive: 1, LastDirectoryUpdate: 1, Password: 1, PasswordConfirm: 1, PasswordHash: 1, PasswordSalt: 1, Source: 1, UpdateDate: 1, UpdateUserId: 1, UserId: 1, UserImage: 1, Username: 1 }, UserPermission: { Granted: 1, PermissionKey: 1, User: 1, UserId: 1, UserPermissionId: 1, Username: 1 }, UserRole: { RoleId: 1, User: 1, UserId: 1, UserRoleId: 1, Username: 1 } }, Common: { UserPreference: { Name: 1, PreferenceType: 1, UserId: 1, UserPreferenceId: 1, Value: 1 } }, Inventory: { Transaction: { EDate: 1, EUserId: 1, IDate: 1, IUserId: 1, Id: 1, PartyAddress: 1, PartyContact: 1, PartyId: 1, PartyName: 1, PartyPartyType: 1, Remarks: 1, RowNum: 1, TenantId: 1, TotalAmount: 1, TotalExpense: 1, TotalQuantity: 1, TransactionDate: 1, TransactionDetailRows: 1, TransactionExpenseRows: 1, TransactionNumber: 1, TransactionType: 1 }, TransactionDetail: { Amount: 1, EDate: 1, EUserId: 1, IDate: 1, IUserId: 1, Id: 1, LookupText: 1, ProductDescription: 1, ProductId: 1, ProductImages: 1, ProductName: 1, ProductProductCategoryId: 1, ProductProductType: 1, Quantity: 1, Remarks: 1, RowNum: 1, TenantId: 1, TransactionId: 1, TransactionPartyId: 1, TransactionRefTransactionId: 1, TransactionTransactionDate: 1, TransactionTransactionNumber: 1, TransactionTransactionType: 1, UnitPrice: 1 }, TransactionExpense: { Amount: 1, EDate: 1, EUserId: 1, ExpenseType: 1, IDate: 1, IUserId: 1, Id: 1, Remarks: 1, RowNum: 1, TenantId: 1, TransactionId: 1, TransactionPartyId: 1, TransactionRefTransactionId: 1, TransactionTransactionDate: 1, TransactionTransactionNumber: 1, TransactionTransactionType: 1 } }, Setup: { Party: { Address: 1, Contact: 1, EDate: 1, EUserId: 1, IDate: 1, IUserId: 1, Id: 1, Name: 1, PartyType: 1, Remarks: 1, RowNum: 1, TenantId: 1 }, Product: { Code: 1, Description: 1, EDate: 1, EUserId: 1, IDate: 1, IUserId: 1, Id: 1, Images: 1, Name: 1, ProductCategoryDescription: 1, ProductCategoryId: 1, ProductCategoryName: 1, ProductType: 1, QuantityIn: 1, QuantityOut: 1, RemainingQuantity: 1, Remarks: 1, RowNum: 1, TenantId: 1 }, ProductCategory: { Description: 1, EDate: 1, EUserId: 1, IDate: 1, IUserId: 1, Id: 1, Name: 1, Remarks: 1, RowNum: 1, TenantId: 1 } }, _Ext: { AuditLog: { ActionDate: 1, ActionType: 1, EntityId: 1, EntityTableName: 1, Id: 1, IpAddress: 1, NewEntity: 1, OldEntity: 1, SessionId: 1, UserId: 1, VersionNo: 1 } } }, Forms: { Membership: { ChangePassword: { FormTitle: 1, SubmitButton: 1, Success: 1 }, ForgotPassword: { BackToLogin: 1, FormInfo: 1, FormTitle: 1, SubmitButton: 1, Success: 1 }, Login: { FacebookButton: 1, ForgotPassword: 1, FormTitle: 1, GoogleButton: 1, OR: 1, RememberMe: 1, SignInButton: 1, SignUpButton: 1 }, ResetPassword: { BackToLogin: 1, EmailSubject: 1, FormTitle: 1, SubmitButton: 1, Success: 1 }, SignUp: { AcceptTerms: 1, ActivateEmailSubject: 1, ActivationCompleteMessage: 1, BackToLogin: 1, ConfirmEmail: 1, ConfirmPassword: 1, DisplayName: 1, Email: 1, FormInfo: 1, FormTitle: 1, Password: 1, SubmitButton: 1, Success: 1 } } }, Site: { AccessDenied: { ClickToChangeUser: 1, ClickToLogin: 1, LackPermissions: 1, NotLoggedIn: 1, PageTitle: 1 }, BasicProgressDialog: { CancelTitle: 1, PleaseWait: 1 }, BulkServiceAction: { AllHadErrorsFormat: 1, AllSuccessFormat: 1, ConfirmationFormat: 1, ErrorCount: 1, NothingToProcess: 1, SomeHadErrorsFormat: 1, SuccessCount: 1 }, Dashboard: { ContentDescription: 1 }, Layout: { FooterCopyright: 1, FooterInfo: 1, FooterRights: 1, GeneralSettings: 1, Language: 1, Theme: 1, ThemeBlack: 1, ThemeBlackLight: 1, ThemeBlue: 1, ThemeBlueLight: 1, ThemeGreen: 1, ThemeGreenLight: 1, ThemePurple: 1, ThemePurpleLight: 1, ThemeRed: 1, ThemeRedLight: 1, ThemeYellow: 1, ThemeYellowLight: 1 }, RolePermissionDialog: { DialogTitle: 1, EditButton: 1, SaveSuccess: 1 }, UserDialog: { EditPermissionsButton: 1, EditRolesButton: 1 }, UserPermissionDialog: { DialogTitle: 1, Grant: 1, Permission: 1, Revoke: 1, SaveSuccess: 1 }, UserRoleDialog: { DialogTitle: 1, SaveSuccess: 1 }, ValidationError: { Title: 1 } }, Validation: { AuthenticationError: 1, CantFindUserWithEmail: 1, CurrentPasswordMismatch: 1, DeleteForeignKeyError: 1, EmailConfirm: 1, EmailInUse: 1, InvalidActivateToken: 1, InvalidResetToken: 1, MinRequiredPasswordLength: 1, SavePrimaryKeyError: 1 } });
    })(Texts = SereneInventory.Texts || (SereneInventory.Texts = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var TransactionType;
    (function (TransactionType) {
        TransactionType[TransactionType["PurchaseInvoice"] = 10] = "PurchaseInvoice";
        TransactionType[TransactionType["SalesInvoice"] = 20] = "SalesInvoice";
    })(TransactionType = SereneInventory.TransactionType || (SereneInventory.TransactionType = {}));
    Serenity.Decorators.registerEnumType(TransactionType, 'SereneInventory.TransactionType');
})(SereneInventory || (SereneInventory = {}));
var _Ext;
(function (_Ext) {
    var AuditActionType;
    (function (AuditActionType) {
        AuditActionType[AuditActionType["Insert"] = 1] = "Insert";
        AuditActionType[AuditActionType["Update"] = 2] = "Update";
        AuditActionType[AuditActionType["Delete"] = 3] = "Delete";
    })(AuditActionType = _Ext.AuditActionType || (_Ext.AuditActionType = {}));
    Serenity.Decorators.registerEnumType(AuditActionType, '_Ext.AuditActionType', 'Enum.Audit.AuditActionType');
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var AuditLogForm = /** @class */ (function (_super) {
        __extends(AuditLogForm, _super);
        function AuditLogForm(prefix) {
            var _this = _super.call(this, prefix) || this;
            if (!AuditLogForm.init) {
                AuditLogForm.init = true;
                var s = Serenity;
                var w0 = s.StringEditor;
                var w1 = s.IntegerEditor;
                var w2 = s.LookupEditor;
                var w3 = s.EnumEditor;
                var w4 = s.DateTimeEditor;
                var w5 = _Ext.StaticTextBlock;
                Q.initFormType(AuditLogForm, [
                    'EntityTableName', w0,
                    'VersionNo', w1,
                    'UserId', w2,
                    'ActionType', w3,
                    'ActionDate', w4,
                    'EntityId', w1,
                    'OldEntity', w0,
                    'NewEntity', w0,
                    'Differences', w5,
                    'IpAddress', w0,
                    'SessionId', w0
                ]);
            }
            return _this;
        }
        AuditLogForm.formKey = '_Ext.AuditLog';
        return AuditLogForm;
    }(Serenity.PrefixedContext));
    _Ext.AuditLogForm = AuditLogForm;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var AuditLogRow;
    (function (AuditLogRow) {
        AuditLogRow.idProperty = 'Id';
        AuditLogRow.nameProperty = 'EntityTableName';
        AuditLogRow.localTextPrefix = '_Ext.AuditLog';
    })(AuditLogRow = _Ext.AuditLogRow || (_Ext.AuditLogRow = {}));
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var AuditLogService;
    (function (AuditLogService) {
        AuditLogService.baseUrl = '_Ext/AuditLog';
        [
            'Create',
            'Update',
            'Delete',
            'Retrieve',
            'List'
        ].forEach(function (x) {
            AuditLogService[x] = function (r, s, o) {
                return Q.serviceRequest(AuditLogService.baseUrl + '/' + x, r, s, o);
            };
        });
    })(AuditLogService = _Ext.AuditLogService || (_Ext.AuditLogService = {}));
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var AuditLogViewerService;
    (function (AuditLogViewerService) {
        AuditLogViewerService.baseUrl = 'AuditLogViewer';
        [
            'List'
        ].forEach(function (x) {
            AuditLogViewerService[x] = function (r, s, o) {
                return Q.serviceRequest(AuditLogViewerService.baseUrl + '/' + x, r, s, o);
            };
        });
    })(AuditLogViewerService = _Ext.AuditLogViewerService || (_Ext.AuditLogViewerService = {}));
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var DevTools;
    (function (DevTools) {
        var SergenService;
        (function (SergenService) {
            SergenService.baseUrl = 'DevTools/Sergen';
            [
                'ListConnections',
                'ListTables',
                'Generate'
            ].forEach(function (x) {
                SergenService[x] = function (r, s, o) {
                    return Q.serviceRequest(SergenService.baseUrl + '/' + x, r, s, o);
                };
            });
        })(SergenService = DevTools.SergenService || (DevTools.SergenService = {}));
    })(DevTools = _Ext.DevTools || (_Ext.DevTools = {}));
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var Months;
    (function (Months) {
        Months[Months["January"] = 0] = "January";
        Months[Months["February"] = 1] = "February";
        Months[Months["March"] = 2] = "March";
        Months[Months["April"] = 3] = "April";
        Months[Months["May"] = 4] = "May";
        Months[Months["June"] = 5] = "June";
        Months[Months["July"] = 6] = "July";
        Months[Months["August"] = 7] = "August";
        Months[Months["September"] = 8] = "September";
        Months[Months["October"] = 9] = "October";
        Months[Months["November"] = 10] = "November";
        Months[Months["December"] = 11] = "December";
    })(Months = _Ext.Months || (_Ext.Months = {}));
    Serenity.Decorators.registerEnumType(Months, '_Ext.Months', 'Months');
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var ReplaceRowForm = /** @class */ (function (_super) {
        __extends(ReplaceRowForm, _super);
        function ReplaceRowForm(prefix) {
            var _this = _super.call(this, prefix) || this;
            if (!ReplaceRowForm.init) {
                ReplaceRowForm.init = true;
                var s = Serenity;
                var w0 = s.StringEditor;
                var w1 = _Ext.EmptyLookupEditor;
                Q.initFormType(ReplaceRowForm, [
                    'DeletedEntityName', w0,
                    'ReplaceWithEntityId', w1
                ]);
            }
            return _this;
        }
        ReplaceRowForm.formKey = '_Ext.ReplaceRow';
        return ReplaceRowForm;
    }(Serenity.PrefixedContext));
    _Ext.ReplaceRowForm = ReplaceRowForm;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var ReplaceRowService;
    (function (ReplaceRowService) {
        ReplaceRowService.baseUrl = 'ReplaceRow';
        [
            'Replace'
        ].forEach(function (x) {
            ReplaceRowService[x] = function (r, s, o) {
                return Q.serviceRequest(ReplaceRowService.baseUrl + '/' + x, r, s, o);
            };
        });
    })(ReplaceRowService = _Ext.ReplaceRowService || (_Ext.ReplaceRowService = {}));
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var Reports;
    (function (Reports) {
        var CommonReportService;
        (function (CommonReportService) {
            CommonReportService.baseUrl = 'Reports/CommonReport';
        })(CommonReportService = Reports.CommonReportService || (Reports.CommonReportService = {}));
    })(Reports = _Ext.Reports || (_Ext.Reports = {}));
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var TimeUoM;
    (function (TimeUoM) {
        TimeUoM[TimeUoM["Hour"] = 1] = "Hour";
        TimeUoM[TimeUoM["Day"] = 2] = "Day";
        TimeUoM[TimeUoM["Week"] = 3] = "Week";
        TimeUoM[TimeUoM["Month"] = 4] = "Month";
        TimeUoM[TimeUoM["CalenderMonth"] = 5] = "CalenderMonth";
        TimeUoM[TimeUoM["Year"] = 6] = "Year";
    })(TimeUoM = _Ext.TimeUoM || (_Ext.TimeUoM = {}));
    Serenity.Decorators.registerEnumType(TimeUoM, '_Ext.TimeUoM', 'TimeUoM');
})(_Ext || (_Ext = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var LanguageDialog = /** @class */ (function (_super) {
            __extends(LanguageDialog, _super);
            function LanguageDialog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.form = new Administration.LanguageForm(_this.idPrefix);
                return _this;
            }
            LanguageDialog.prototype.getFormKey = function () { return Administration.LanguageForm.formKey; };
            LanguageDialog.prototype.getIdProperty = function () { return Administration.LanguageRow.idProperty; };
            LanguageDialog.prototype.getLocalTextPrefix = function () { return Administration.LanguageRow.localTextPrefix; };
            LanguageDialog.prototype.getNameProperty = function () { return Administration.LanguageRow.nameProperty; };
            LanguageDialog.prototype.getService = function () { return Administration.LanguageService.baseUrl; };
            LanguageDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], LanguageDialog);
            return LanguageDialog;
        }(Serenity.EntityDialog));
        Administration.LanguageDialog = LanguageDialog;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var LanguageGrid = /** @class */ (function (_super) {
            __extends(LanguageGrid, _super);
            function LanguageGrid(container) {
                return _super.call(this, container) || this;
            }
            LanguageGrid.prototype.getColumnsKey = function () { return "Administration.Language"; };
            LanguageGrid.prototype.getDialogType = function () { return Administration.LanguageDialog; };
            LanguageGrid.prototype.getIdProperty = function () { return Administration.LanguageRow.idProperty; };
            LanguageGrid.prototype.getLocalTextPrefix = function () { return Administration.LanguageRow.localTextPrefix; };
            LanguageGrid.prototype.getService = function () { return Administration.LanguageService.baseUrl; };
            LanguageGrid.prototype.getDefaultSortBy = function () {
                return ["LanguageName" /* LanguageName */];
            };
            LanguageGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], LanguageGrid);
            return LanguageGrid;
        }(Serenity.EntityGrid));
        Administration.LanguageGrid = LanguageGrid;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var RoleDialog = /** @class */ (function (_super) {
            __extends(RoleDialog, _super);
            function RoleDialog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.form = new Administration.RoleForm(_this.idPrefix);
                return _this;
            }
            RoleDialog.prototype.getFormKey = function () { return Administration.RoleForm.formKey; };
            RoleDialog.prototype.getIdProperty = function () { return Administration.RoleRow.idProperty; };
            RoleDialog.prototype.getLocalTextPrefix = function () { return Administration.RoleRow.localTextPrefix; };
            RoleDialog.prototype.getNameProperty = function () { return Administration.RoleRow.nameProperty; };
            RoleDialog.prototype.getService = function () { return Administration.RoleService.baseUrl; };
            RoleDialog.prototype.getToolbarButtons = function () {
                var _this = this;
                var buttons = _super.prototype.getToolbarButtons.call(this);
                buttons.push({
                    title: Q.text('Site.RolePermissionDialog.EditButton'),
                    cssClass: 'edit-permissions-button',
                    icon: 'fa-lock text-green',
                    onClick: function () {
                        new Administration.RolePermissionDialog({
                            roleID: _this.entity.RoleId,
                            title: _this.entity.RoleName
                        }).dialogOpen();
                    }
                });
                return buttons;
            };
            RoleDialog.prototype.updateInterface = function () {
                _super.prototype.updateInterface.call(this);
                this.toolbar.findButton("edit-permissions-button").toggleClass("disabled", this.isNewOrDeleted());
            };
            RoleDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], RoleDialog);
            return RoleDialog;
        }(Serenity.EntityDialog));
        Administration.RoleDialog = RoleDialog;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var RoleGrid = /** @class */ (function (_super) {
            __extends(RoleGrid, _super);
            function RoleGrid(container) {
                return _super.call(this, container) || this;
            }
            RoleGrid.prototype.getColumnsKey = function () { return "Administration.Role"; };
            RoleGrid.prototype.getDialogType = function () { return Administration.RoleDialog; };
            RoleGrid.prototype.getIdProperty = function () { return Administration.RoleRow.idProperty; };
            RoleGrid.prototype.getLocalTextPrefix = function () { return Administration.RoleRow.localTextPrefix; };
            RoleGrid.prototype.getService = function () { return Administration.RoleService.baseUrl; };
            RoleGrid.prototype.getDefaultSortBy = function () {
                return ["RoleName" /* RoleName */];
            };
            RoleGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], RoleGrid);
            return RoleGrid;
        }(Serenity.EntityGrid));
        Administration.RoleGrid = RoleGrid;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var RolePermissionDialog = /** @class */ (function (_super) {
            __extends(RolePermissionDialog, _super);
            function RolePermissionDialog(opt) {
                var _this = _super.call(this, opt) || this;
                _this.permissions = new Administration.PermissionCheckEditor(_this.byId('Permissions'), {
                    showRevoke: false
                });
                Administration.RolePermissionService.List({
                    RoleID: _this.options.roleID,
                    Module: null,
                    Submodule: null
                }, function (response) {
                    _this.permissions.value = response.Entities.map(function (x) { return ({ PermissionKey: x }); });
                });
                _this.permissions.implicitPermissions = Q.getRemoteData('Administration.ImplicitPermissions');
                return _this;
            }
            RolePermissionDialog.prototype.getDialogOptions = function () {
                var _this = this;
                var opt = _super.prototype.getDialogOptions.call(this);
                opt.buttons = [
                    {
                        text: Q.text('Dialogs.OkButton'),
                        click: function (e) {
                            Administration.RolePermissionService.Update({
                                RoleID: _this.options.roleID,
                                Permissions: _this.permissions.value.map(function (x) { return x.PermissionKey; }),
                                Module: null,
                                Submodule: null
                            }, function (response) {
                                _this.dialogClose();
                                window.setTimeout(function () { return Q.notifySuccess(Q.text('Site.RolePermissionDialog.SaveSuccess')); }, 0);
                            });
                        }
                    }, {
                        text: Q.text('Dialogs.CancelButton'),
                        click: function () { return _this.dialogClose(); }
                    }
                ];
                opt.title = Q.format(Q.text('Site.RolePermissionDialog.DialogTitle'), this.options.title);
                return opt;
            };
            RolePermissionDialog.prototype.getTemplate = function () {
                return '<div id="~_Permissions"></div>';
            };
            RolePermissionDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], RolePermissionDialog);
            return RolePermissionDialog;
        }(Serenity.TemplatedDialog));
        Administration.RolePermissionDialog = RolePermissionDialog;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var q;
(function (q) {
    function text(key, fallback) {
        var result = Q.text(key);
        if (result == key)
            return fallback;
        else
            return result;
    }
    q.text = text;
    function isCosmicThemeApplied() {
        return document.body.className.indexOf('cosmic') >= 0;
    }
    q.isCosmicThemeApplied = isCosmicThemeApplied;
    function getSelectedLanguage() {
        return document.getElementById('LanguageSelect').value;
    }
    q.getSelectedLanguage = getSelectedLanguage;
    function formatDecimal(value) {
        var title = Serenity.NumberFormatter.format(value, '#,##0.00');
        return title;
    }
    q.formatDecimal = formatDecimal;
    function formatInt(value) {
        var title = Serenity.NumberFormatter.format(value, '#,##0');
        return title;
    }
    q.formatInt = formatInt;
    // Check numeric or not then return value, if NAN then return zero(0)
    function ToNumber(value) {
        return isNaN(value) ? 0 : value;
    }
    q.ToNumber = ToNumber;
    function ToBool(value) {
        return value == 'true' ? true : false;
    }
    q.ToBool = ToBool;
    //colorDepth should be within '0123456789ABCDEF'
    function getRandomColor(hexLetters) {
        var letters = hexLetters; // '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            var letterIndex = Math.floor((Math.random()) * letters.length);
            if (letterIndex > 15)
                letterIndex = 15;
            if (letterIndex < 0)
                letterIndex = 0;
            color += letters[letterIndex];
        }
        return color;
    }
    q.getRandomColor = getRandomColor;
})(q || (q = {}));
/// <reference path="../../_Ext/_q/_q.ts" />
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var TenantDialog = /** @class */ (function (_super) {
            __extends(TenantDialog, _super);
            function TenantDialog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.form = new Administration.TenantForm(_this.idPrefix);
                return _this;
            }
            TenantDialog.prototype.getFormKey = function () { return Administration.TenantForm.formKey; };
            TenantDialog.prototype.getIdProperty = function () { return Administration.TenantRow.idProperty; };
            TenantDialog.prototype.getLocalTextPrefix = function () { return Administration.TenantRow.localTextPrefix; };
            TenantDialog.prototype.getNameProperty = function () { return Administration.TenantRow.nameProperty; };
            TenantDialog.prototype.getService = function () { return Administration.TenantService.baseUrl; };
            TenantDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], TenantDialog);
            return TenantDialog;
        }(_Ext.DialogBase));
        Administration.TenantDialog = TenantDialog;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
/// <reference path="../../_Ext/_q/_q.ts" />
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var TenantGrid = /** @class */ (function (_super) {
            __extends(TenantGrid, _super);
            function TenantGrid(container) {
                return _super.call(this, container) || this;
            }
            TenantGrid.prototype.getColumnsKey = function () { return 'Administration.Tenant'; };
            TenantGrid.prototype.getDialogType = function () { return Administration.TenantDialog; };
            TenantGrid.prototype.getIdProperty = function () { return Administration.TenantRow.idProperty; };
            TenantGrid.prototype.getLocalTextPrefix = function () { return Administration.TenantRow.localTextPrefix; };
            TenantGrid.prototype.getService = function () { return Administration.TenantService.baseUrl; };
            TenantGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], TenantGrid);
            return TenantGrid;
        }(_Ext.GridBase));
        Administration.TenantGrid = TenantGrid;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var TranslationGrid = /** @class */ (function (_super) {
            __extends(TranslationGrid, _super);
            function TranslationGrid(container) {
                var _this = _super.call(this, container) || this;
                _this.element.on('keyup.' + _this.uniqueName + ' change.' + _this.uniqueName, 'input.custom-text', function (e) {
                    var value = Q.trimToNull($(e.target).val());
                    if (value === '') {
                        value = null;
                    }
                    _this.view.getItemById($(e.target).data('key')).CustomText = value;
                    _this.hasChanges = true;
                });
                return _this;
            }
            TranslationGrid.prototype.getIdProperty = function () { return "Key"; };
            TranslationGrid.prototype.getLocalTextPrefix = function () { return "Administration.Translation"; };
            TranslationGrid.prototype.getService = function () { return Administration.TranslationService.baseUrl; };
            TranslationGrid.prototype.onClick = function (e, row, cell) {
                var _this = this;
                _super.prototype.onClick.call(this, e, row, cell);
                if (e.isDefaultPrevented()) {
                    return;
                }
                var item = this.itemAt(row);
                var done;
                if ($(e.target).hasClass('source-text')) {
                    e.preventDefault();
                    done = function () {
                        item.CustomText = item.SourceText;
                        _this.view.updateItem(item.Key, item);
                        _this.hasChanges = true;
                    };
                    if (Q.isTrimmedEmpty(item.CustomText) ||
                        (Q.trimToEmpty(item.CustomText) === Q.trimToEmpty(item.SourceText))) {
                        done();
                        return;
                    }
                    Q.confirm(Q.text('Db.Administration.Translation.OverrideConfirmation'), done);
                    return;
                }
                if ($(e.target).hasClass('target-text')) {
                    e.preventDefault();
                    done = function () {
                        item.CustomText = item.TargetText;
                        _this.view.updateItem(item.Key, item);
                        _this.hasChanges = true;
                    };
                    if (Q.isTrimmedEmpty(item.CustomText) ||
                        (Q.trimToEmpty(item.CustomText) === Q.trimToEmpty(item.TargetText))) {
                        done();
                        return;
                    }
                    Q.confirm(Q.text('Db.Administration.Translation.OverrideConfirmation'), done);
                    return;
                }
            };
            TranslationGrid.prototype.getColumns = function () {
                var columns = [];
                columns.push({ field: 'Key', width: 300, sortable: false });
                columns.push({
                    field: 'SourceText',
                    width: 300,
                    sortable: false,
                    format: function (ctx) {
                        return Q.outerHtml($('<a/>')
                            .addClass('source-text')
                            .text(ctx.value || ''));
                    }
                });
                columns.push({
                    field: 'CustomText',
                    width: 300,
                    sortable: false,
                    format: function (ctx) { return Q.outerHtml($('<input/>')
                        .addClass('custom-text')
                        .attr('value', ctx.value)
                        .attr('type', 'text')
                        .attr('data-key', ctx.item.Key)); }
                });
                columns.push({
                    field: 'TargetText',
                    width: 300,
                    sortable: false,
                    format: function (ctx) { return Q.outerHtml($('<a/>')
                        .addClass('target-text')
                        .text(ctx.value || '')); }
                });
                return columns;
            };
            TranslationGrid.prototype.createToolbarExtensions = function () {
                var _this = this;
                _super.prototype.createToolbarExtensions.call(this);
                var opt = {
                    lookupKey: 'Administration.Language'
                };
                this.sourceLanguage = Serenity.Widget.create({
                    type: Serenity.LookupEditor,
                    element: function (el) { return el.appendTo(_this.toolbar.element).attr('placeholder', '--- ' +
                        Q.text('Db.Administration.Translation.SourceLanguage') + ' ---'); },
                    options: opt
                });
                this.sourceLanguage.changeSelect2(function (e) {
                    if (_this.hasChanges) {
                        _this.saveChanges(_this.targetLanguageKey).then(function () { return _this.refresh(); });
                    }
                    else {
                        _this.refresh();
                    }
                });
                this.targetLanguage = Serenity.Widget.create({
                    type: Serenity.LookupEditor,
                    element: function (el) { return el.appendTo(_this.toolbar.element).attr('placeholder', '--- ' +
                        Q.text('Db.Administration.Translation.TargetLanguage') + ' ---'); },
                    options: opt
                });
                this.targetLanguage.changeSelect2(function (e) {
                    if (_this.hasChanges) {
                        _this.saveChanges(_this.targetLanguageKey).then(function () { return _this.refresh(); });
                    }
                    else {
                        _this.refresh();
                    }
                });
            };
            TranslationGrid.prototype.saveChanges = function (language) {
                var _this = this;
                var translations = {};
                for (var _i = 0, _a = this.getItems(); _i < _a.length; _i++) {
                    var item = _a[_i];
                    translations[item.Key] = item.CustomText;
                }
                return Promise.resolve(Administration.TranslationService.Update({
                    TargetLanguageID: language,
                    Translations: translations
                })).then(function () {
                    _this.hasChanges = false;
                    language = Q.trimToNull(language) || 'invariant';
                    Q.notifySuccess('User translations in "' + language +
                        '" language are saved to "user.texts.' +
                        language + '.json" ' + 'file under "~/App_Data/texts/"', '');
                });
            };
            TranslationGrid.prototype.onViewSubmit = function () {
                var request = this.view.params;
                request.SourceLanguageID = this.sourceLanguage.value;
                this.targetLanguageKey = this.targetLanguage.value || '';
                request.TargetLanguageID = this.targetLanguageKey;
                this.hasChanges = false;
                return _super.prototype.onViewSubmit.call(this);
            };
            TranslationGrid.prototype.getButtons = function () {
                var _this = this;
                return [{
                        title: Q.text('Db.Administration.Translation.SaveChangesButton'),
                        onClick: function (e) { return _this.saveChanges(_this.targetLanguageKey).then(function () { return _this.refresh(); }); },
                        cssClass: 'apply-changes-button'
                    }];
            };
            TranslationGrid.prototype.createQuickSearchInput = function () {
                var _this = this;
                Serenity.GridUtils.addQuickSearchInputCustom(this.toolbar.element, function (field, searchText) {
                    _this.searchText = searchText;
                    _this.view.setItems(_this.view.getItems(), true);
                });
            };
            TranslationGrid.prototype.onViewFilter = function (item) {
                if (!_super.prototype.onViewFilter.call(this, item)) {
                    return false;
                }
                if (!this.searchText) {
                    return true;
                }
                var sd = Select2.util.stripDiacritics;
                var searching = sd(this.searchText).toLowerCase();
                function match(str) {
                    if (!str)
                        return false;
                    return str.toLowerCase().indexOf(searching) >= 0;
                }
                return Q.isEmptyOrNull(searching) || match(item.Key) || match(item.SourceText) ||
                    match(item.TargetText) || match(item.CustomText);
            };
            TranslationGrid.prototype.usePager = function () {
                return false;
            };
            TranslationGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], TranslationGrid);
            return TranslationGrid;
        }(Serenity.EntityGrid));
        Administration.TranslationGrid = TranslationGrid;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserDialog = /** @class */ (function (_super) {
            __extends(UserDialog, _super);
            function UserDialog() {
                var _this = _super.call(this) || this;
                _this.form = new Administration.UserForm(_this.idPrefix);
                _this.form.Password.addValidationRule(_this.uniqueName, function (e) {
                    if (_this.form.Password.value.length < 7)
                        return "Password must be at least 7 characters!";
                });
                _this.form.PasswordConfirm.addValidationRule(_this.uniqueName, function (e) {
                    if (_this.form.Password.value != _this.form.PasswordConfirm.value)
                        return "The passwords entered doesn't match!";
                });
                return _this;
            }
            UserDialog.prototype.getFormKey = function () { return Administration.UserForm.formKey; };
            UserDialog.prototype.getIdProperty = function () { return Administration.UserRow.idProperty; };
            UserDialog.prototype.getIsActiveProperty = function () { return Administration.UserRow.isActiveProperty; };
            UserDialog.prototype.getLocalTextPrefix = function () { return Administration.UserRow.localTextPrefix; };
            UserDialog.prototype.getNameProperty = function () { return Administration.UserRow.nameProperty; };
            UserDialog.prototype.getService = function () { return Administration.UserService.baseUrl; };
            UserDialog.prototype.getToolbarButtons = function () {
                var _this = this;
                var buttons = _super.prototype.getToolbarButtons.call(this);
                buttons.push({
                    title: Q.text('Site.UserDialog.EditRolesButton'),
                    cssClass: 'edit-roles-button',
                    icon: 'fa-users text-blue',
                    onClick: function () {
                        new Administration.UserRoleDialog({
                            userID: _this.entity.UserId,
                            username: _this.entity.Username
                        }).dialogOpen();
                    }
                });
                buttons.push({
                    title: Q.text('Site.UserDialog.EditPermissionsButton'),
                    cssClass: 'edit-permissions-button',
                    icon: 'fa-lock text-green',
                    onClick: function () {
                        new Administration.UserPermissionDialog({
                            userID: _this.entity.UserId,
                            username: _this.entity.Username
                        }).dialogOpen();
                    }
                });
                return buttons;
            };
            UserDialog.prototype.updateInterface = function () {
                _super.prototype.updateInterface.call(this);
                this.toolbar.findButton('edit-roles-button').toggleClass('disabled', this.isNewOrDeleted());
                this.toolbar.findButton("edit-permissions-button").toggleClass("disabled", this.isNewOrDeleted());
            };
            UserDialog.prototype.afterLoadEntity = function () {
                _super.prototype.afterLoadEntity.call(this);
                // these fields are only required in new record mode
                this.form.Password.element.toggleClass('required', this.isNew())
                    .closest('.field').find('sup').toggle(this.isNew());
                this.form.PasswordConfirm.element.toggleClass('required', this.isNew())
                    .closest('.field').find('sup').toggle(this.isNew());
            };
            UserDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], UserDialog);
            return UserDialog;
        }(Serenity.EntityDialog));
        Administration.UserDialog = UserDialog;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserGrid = /** @class */ (function (_super) {
            __extends(UserGrid, _super);
            function UserGrid(container) {
                return _super.call(this, container) || this;
            }
            UserGrid.prototype.getColumnsKey = function () { return "Administration.User"; };
            UserGrid.prototype.getDialogType = function () { return Administration.UserDialog; };
            UserGrid.prototype.getIdProperty = function () { return Administration.UserRow.idProperty; };
            UserGrid.prototype.getIsActiveProperty = function () { return Administration.UserRow.isActiveProperty; };
            UserGrid.prototype.getLocalTextPrefix = function () { return Administration.UserRow.localTextPrefix; };
            UserGrid.prototype.getService = function () { return Administration.UserService.baseUrl; };
            UserGrid.prototype.getDefaultSortBy = function () {
                return ["Username" /* Username */];
            };
            UserGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], UserGrid);
            return UserGrid;
        }(Serenity.EntityGrid));
        Administration.UserGrid = UserGrid;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Authorization;
    (function (Authorization) {
        Object.defineProperty(Authorization, 'userDefinition', {
            get: function () {
                return Q.getRemoteData('UserData');
            }
        });
        function hasPermission(permissionKey) {
            var ud = Authorization.userDefinition;
            return ud.Username === 'admin' || !!ud.Permissions[permissionKey];
        }
        Authorization.hasPermission = hasPermission;
    })(Authorization = SereneInventory.Authorization || (SereneInventory.Authorization = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var PermissionCheckEditor = /** @class */ (function (_super) {
            __extends(PermissionCheckEditor, _super);
            function PermissionCheckEditor(container, opt) {
                var _this = _super.call(this, container, opt) || this;
                _this._rolePermissions = {};
                _this._implicitPermissions = {};
                var titleByKey = {};
                var permissionKeys = _this.getSortedGroupAndPermissionKeys(titleByKey);
                var items = permissionKeys.map(function (key) { return ({
                    Key: key,
                    ParentKey: _this.getParentKey(key),
                    Title: titleByKey[key],
                    GrantRevoke: null,
                    IsGroup: key.charAt(key.length - 1) === ':'
                }); });
                _this.byParentKey = Q.toGrouping(items, function (x) { return x.ParentKey; });
                _this.setItems(items);
                return _this;
            }
            PermissionCheckEditor.prototype.getIdProperty = function () { return "Key"; };
            PermissionCheckEditor.prototype.getItemGrantRevokeClass = function (item, grant) {
                if (!item.IsGroup) {
                    return ((item.GrantRevoke === grant) ? ' checked' : '');
                }
                var desc = this.getDescendants(item, true);
                var granted = desc.filter(function (x) { return x.GrantRevoke === grant; });
                if (!granted.length) {
                    return '';
                }
                if (desc.length === granted.length) {
                    return 'checked';
                }
                return 'checked partial';
            };
            PermissionCheckEditor.prototype.roleOrImplicit = function (key) {
                if (this._rolePermissions[key])
                    return true;
                for (var _i = 0, _a = Object.keys(this._rolePermissions); _i < _a.length; _i++) {
                    var k = _a[_i];
                    var d = this._implicitPermissions[k];
                    if (d && d[key])
                        return true;
                }
                for (var _b = 0, _c = Object.keys(this._implicitPermissions); _b < _c.length; _b++) {
                    var i = _c[_b];
                    var item = this.view.getItemById(i);
                    if (item && item.GrantRevoke == true) {
                        var d = this._implicitPermissions[i];
                        if (d && d[key])
                            return true;
                    }
                }
            };
            PermissionCheckEditor.prototype.getItemEffectiveClass = function (item) {
                var _this = this;
                if (item.IsGroup) {
                    var desc = this.getDescendants(item, true);
                    var grantCount = Q.count(desc, function (x) { return x.GrantRevoke === true ||
                        (x.GrantRevoke == null && _this.roleOrImplicit(x.Key)); });
                    if (grantCount === desc.length || desc.length === 0) {
                        return 'allow';
                    }
                    if (grantCount === 0) {
                        return 'deny';
                    }
                    return 'partial';
                }
                var granted = item.GrantRevoke === true ||
                    (item.GrantRevoke == null && this.roleOrImplicit(item.Key));
                return (granted ? ' allow' : ' deny');
            };
            PermissionCheckEditor.prototype.getColumns = function () {
                var _this = this;
                var columns = [{
                        name: Q.text('Site.UserPermissionDialog.Permission'),
                        field: 'Title',
                        format: Serenity.SlickFormatting.treeToggle(function () { return _this.view; }, function (x) { return x.Key; }, function (ctx) {
                            var item = ctx.item;
                            var klass = _this.getItemEffectiveClass(item);
                            return '<span class="effective-permission ' + klass + '">' + Q.htmlEncode(ctx.value) + '</span>';
                        }),
                        width: 495,
                        sortable: false
                    }, {
                        name: Q.text('Site.UserPermissionDialog.Grant'), field: 'Grant',
                        format: function (ctx) {
                            var item1 = ctx.item;
                            var klass1 = _this.getItemGrantRevokeClass(item1, true);
                            return "<span class='check-box grant no-float " + klass1 + "'></span>";
                        },
                        width: 65,
                        sortable: false,
                        headerCssClass: 'align-center',
                        cssClass: 'align-center'
                    }];
                if (this.options.showRevoke) {
                    columns.push({
                        name: Q.text('Site.UserPermissionDialog.Revoke'), field: 'Revoke',
                        format: function (ctx) {
                            var item2 = ctx.item;
                            var klass2 = _this.getItemGrantRevokeClass(item2, false);
                            return '<span class="check-box revoke no-float ' + klass2 + '"></span>';
                        },
                        width: 65,
                        sortable: false,
                        headerCssClass: 'align-center',
                        cssClass: 'align-center'
                    });
                }
                return columns;
            };
            PermissionCheckEditor.prototype.setItems = function (items) {
                Serenity.SlickTreeHelper.setIndents(items, function (x) { return x.Key; }, function (x) { return x.ParentKey; }, false);
                this.view.setItems(items, true);
            };
            PermissionCheckEditor.prototype.onViewSubmit = function () {
                return false;
            };
            PermissionCheckEditor.prototype.onViewFilter = function (item) {
                var _this = this;
                if (!_super.prototype.onViewFilter.call(this, item)) {
                    return false;
                }
                if (!Serenity.SlickTreeHelper.filterById(item, this.view, function (x) { return x.ParentKey; }))
                    return false;
                if (this.searchText) {
                    return this.matchContains(item) || item.IsGroup && Q.any(this.getDescendants(item, false), function (x) { return _this.matchContains(x); });
                }
                return true;
            };
            PermissionCheckEditor.prototype.matchContains = function (item) {
                return Select2.util.stripDiacritics(item.Title || '').toLowerCase().indexOf(this.searchText) >= 0;
            };
            PermissionCheckEditor.prototype.getDescendants = function (item, excludeGroups) {
                var result = [];
                var stack = [item];
                while (stack.length > 0) {
                    var i = stack.pop();
                    var children = this.byParentKey[i.Key];
                    if (!children)
                        continue;
                    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                        var child = children_1[_i];
                        if (!excludeGroups || !child.IsGroup) {
                            result.push(child);
                        }
                        stack.push(child);
                    }
                }
                return result;
            };
            PermissionCheckEditor.prototype.onClick = function (e, row, cell) {
                _super.prototype.onClick.call(this, e, row, cell);
                if (!e.isDefaultPrevented()) {
                    Serenity.SlickTreeHelper.toggleClick(e, row, cell, this.view, function (x) { return x.Key; });
                }
                if (e.isDefaultPrevented()) {
                    return;
                }
                var target = $(e.target);
                var grant = target.hasClass('grant');
                if (grant || target.hasClass('revoke')) {
                    e.preventDefault();
                    var item = this.itemAt(row);
                    var checkedOrPartial = target.hasClass('checked') || target.hasClass('partial');
                    if (checkedOrPartial) {
                        grant = null;
                    }
                    else {
                        grant = grant !== checkedOrPartial;
                    }
                    if (item.IsGroup) {
                        for (var _i = 0, _a = this.getDescendants(item, true); _i < _a.length; _i++) {
                            var d = _a[_i];
                            d.GrantRevoke = grant;
                        }
                    }
                    else
                        item.GrantRevoke = grant;
                    this.slickGrid.invalidate();
                }
            };
            PermissionCheckEditor.prototype.getParentKey = function (key) {
                if (key.charAt(key.length - 1) === ':') {
                    key = key.substr(0, key.length - 1);
                }
                var idx = key.lastIndexOf(':');
                if (idx >= 0) {
                    return key.substr(0, idx + 1);
                }
                return null;
            };
            PermissionCheckEditor.prototype.getButtons = function () {
                return [];
            };
            PermissionCheckEditor.prototype.createToolbarExtensions = function () {
                var _this = this;
                _super.prototype.createToolbarExtensions.call(this);
                Serenity.GridUtils.addQuickSearchInputCustom(this.toolbar.element, function (field, text) {
                    _this.searchText = Select2.util.stripDiacritics(Q.trimToNull(text) || '').toLowerCase();
                    _this.view.setItems(_this.view.getItems(), true);
                });
            };
            PermissionCheckEditor.prototype.getSortedGroupAndPermissionKeys = function (titleByKey) {
                var keys = Q.getRemoteData('Administration.PermissionKeys').Entities;
                var titleWithGroup = {};
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var k = keys_1[_i];
                    var s = k;
                    if (!s) {
                        continue;
                    }
                    if (s.charAt(s.length - 1) == ':') {
                        s = s.substr(0, s.length - 1);
                        if (s.length === 0) {
                            continue;
                        }
                    }
                    if (titleByKey[s]) {
                        continue;
                    }
                    titleByKey[s] = Q.coalesce(Q.tryGetText('Permission.' + s), s);
                    var parts = s.split(':');
                    var group = '';
                    var groupTitle = '';
                    for (var i = 0; i < parts.length - 1; i++) {
                        group = group + parts[i] + ':';
                        var txt = Q.tryGetText('Permission.' + group);
                        if (txt == null) {
                            txt = parts[i];
                        }
                        titleByKey[group] = txt;
                        groupTitle = groupTitle + titleByKey[group] + ':';
                        titleWithGroup[group] = groupTitle;
                    }
                    titleWithGroup[s] = groupTitle + titleByKey[s];
                }
                keys = Object.keys(titleByKey);
                keys = keys.sort(function (x, y) { return Q.turkishLocaleCompare(titleWithGroup[x], titleWithGroup[y]); });
                return keys;
            };
            Object.defineProperty(PermissionCheckEditor.prototype, "value", {
                get: function () {
                    var result = [];
                    for (var _i = 0, _a = this.view.getItems(); _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.GrantRevoke != null && item.Key.charAt(item.Key.length - 1) != ':') {
                            result.push({ PermissionKey: item.Key, Granted: item.GrantRevoke });
                        }
                    }
                    return result;
                },
                set: function (value) {
                    for (var _i = 0, _a = this.view.getItems(); _i < _a.length; _i++) {
                        var item = _a[_i];
                        item.GrantRevoke = null;
                    }
                    if (value != null) {
                        for (var _b = 0, value_1 = value; _b < value_1.length; _b++) {
                            var row = value_1[_b];
                            var r = this.view.getItemById(row.PermissionKey);
                            if (r) {
                                r.GrantRevoke = Q.coalesce(row.Granted, true);
                            }
                        }
                    }
                    this.setItems(this.getItems());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PermissionCheckEditor.prototype, "rolePermissions", {
                get: function () {
                    return Object.keys(this._rolePermissions);
                },
                set: function (value) {
                    this._rolePermissions = {};
                    if (value) {
                        for (var _i = 0, value_2 = value; _i < value_2.length; _i++) {
                            var k = value_2[_i];
                            this._rolePermissions[k] = true;
                        }
                    }
                    this.setItems(this.getItems());
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PermissionCheckEditor.prototype, "implicitPermissions", {
                set: function (value) {
                    this._implicitPermissions = {};
                    if (value) {
                        for (var _i = 0, _a = Object.keys(value); _i < _a.length; _i++) {
                            var k = _a[_i];
                            this._implicitPermissions[k] = this._implicitPermissions[k] || {};
                            var l = value[k];
                            if (l) {
                                for (var _b = 0, l_1 = l; _b < l_1.length; _b++) {
                                    var s = l_1[_b];
                                    this._implicitPermissions[k][s] = true;
                                }
                            }
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            PermissionCheckEditor = __decorate([
                Serenity.Decorators.registerEditor([Serenity.IGetEditValue, Serenity.ISetEditValue])
            ], PermissionCheckEditor);
            return PermissionCheckEditor;
        }(Serenity.DataGrid));
        Administration.PermissionCheckEditor = PermissionCheckEditor;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserPermissionDialog = /** @class */ (function (_super) {
            __extends(UserPermissionDialog, _super);
            function UserPermissionDialog(opt) {
                var _this = _super.call(this, opt) || this;
                _this.permissions = new Administration.PermissionCheckEditor(_this.byId('Permissions'), {
                    showRevoke: true
                });
                Administration.UserPermissionService.List({
                    UserID: _this.options.userID,
                    Module: null,
                    Submodule: null
                }, function (response) {
                    _this.permissions.value = response.Entities;
                });
                Administration.UserPermissionService.ListRolePermissions({
                    UserID: _this.options.userID,
                    Module: null,
                    Submodule: null,
                }, function (response) {
                    _this.permissions.rolePermissions = response.Entities;
                });
                _this.permissions.implicitPermissions = Q.getRemoteData('Administration.ImplicitPermissions');
                return _this;
            }
            UserPermissionDialog.prototype.getDialogOptions = function () {
                var _this = this;
                var opt = _super.prototype.getDialogOptions.call(this);
                opt.buttons = [
                    {
                        text: Q.text('Dialogs.OkButton'),
                        click: function (e) {
                            Administration.UserPermissionService.Update({
                                UserID: _this.options.userID,
                                Permissions: _this.permissions.value,
                                Module: null,
                                Submodule: null
                            }, function (response) {
                                _this.dialogClose();
                                window.setTimeout(function () { return Q.notifySuccess(Q.text('Site.UserPermissionDialog.SaveSuccess')); }, 0);
                            });
                        }
                    }, {
                        text: Q.text('Dialogs.CancelButton'),
                        click: function () { return _this.dialogClose(); }
                    }
                ];
                opt.title = Q.format(Q.text('Site.UserPermissionDialog.DialogTitle'), this.options.username);
                return opt;
            };
            UserPermissionDialog.prototype.getTemplate = function () {
                return '<div id="~_Permissions"></div>';
            };
            UserPermissionDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], UserPermissionDialog);
            return UserPermissionDialog;
        }(Serenity.TemplatedDialog));
        Administration.UserPermissionDialog = UserPermissionDialog;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var RoleCheckEditor = /** @class */ (function (_super) {
            __extends(RoleCheckEditor, _super);
            function RoleCheckEditor(div) {
                return _super.call(this, div) || this;
            }
            RoleCheckEditor.prototype.createToolbarExtensions = function () {
                var _this = this;
                _super.prototype.createToolbarExtensions.call(this);
                Serenity.GridUtils.addQuickSearchInputCustom(this.toolbar.element, function (field, text) {
                    _this.searchText = Select2.util.stripDiacritics(text || '').toUpperCase();
                    _this.view.setItems(_this.view.getItems(), true);
                });
            };
            RoleCheckEditor.prototype.getButtons = function () {
                return [];
            };
            RoleCheckEditor.prototype.getTreeItems = function () {
                return Administration.RoleRow.getLookup().items.map(function (role) { return ({
                    id: role.RoleId.toString(),
                    text: role.RoleName
                }); });
            };
            RoleCheckEditor.prototype.onViewFilter = function (item) {
                return _super.prototype.onViewFilter.call(this, item) &&
                    (Q.isEmptyOrNull(this.searchText) ||
                        Select2.util.stripDiacritics(item.text || '')
                            .toUpperCase().indexOf(this.searchText) >= 0);
            };
            RoleCheckEditor = __decorate([
                Serenity.Decorators.registerEditor()
            ], RoleCheckEditor);
            return RoleCheckEditor;
        }(Serenity.CheckTreeEditor));
        Administration.RoleCheckEditor = RoleCheckEditor;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Administration;
    (function (Administration) {
        var UserRoleDialog = /** @class */ (function (_super) {
            __extends(UserRoleDialog, _super);
            function UserRoleDialog(opt) {
                var _this = _super.call(this, opt) || this;
                _this.permissions = new Administration.RoleCheckEditor(_this.byId('Roles'));
                Administration.UserRoleService.List({
                    UserID: _this.options.userID
                }, function (response) {
                    _this.permissions.value = response.Entities.map(function (x) { return x.toString(); });
                });
                return _this;
            }
            UserRoleDialog.prototype.getDialogOptions = function () {
                var _this = this;
                var opt = _super.prototype.getDialogOptions.call(this);
                opt.buttons = [{
                        text: Q.text('Dialogs.OkButton'),
                        click: function () {
                            Q.serviceRequest('Administration/UserRole/Update', {
                                UserID: _this.options.userID,
                                Roles: _this.permissions.value.map(function (x) { return parseInt(x, 10); })
                            }, function (response) {
                                _this.dialogClose();
                                Q.notifySuccess(Q.text('Site.UserRoleDialog.SaveSuccess'));
                            });
                        }
                    }, {
                        text: Q.text('Dialogs.CancelButton'),
                        click: function () { return _this.dialogClose(); }
                    }];
                opt.title = Q.format(Q.text('Site.UserRoleDialog.DialogTitle'), this.options.username);
                return opt;
            };
            UserRoleDialog.prototype.getTemplate = function () {
                return "<div id='~_Roles'></div>";
            };
            UserRoleDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], UserRoleDialog);
            return UserRoleDialog;
        }(Serenity.TemplatedDialog));
        Administration.UserRoleDialog = UserRoleDialog;
    })(Administration = SereneInventory.Administration || (SereneInventory.Administration = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var LanguageList;
    (function (LanguageList) {
        function getValue() {
            var result = [];
            for (var _i = 0, _a = SereneInventory.Administration.LanguageRow.getLookup().items; _i < _a.length; _i++) {
                var k = _a[_i];
                if (k.LanguageId !== 'en') {
                    result.push([k.Id.toString(), k.LanguageName]);
                }
            }
            return result;
        }
        LanguageList.getValue = getValue;
    })(LanguageList = SereneInventory.LanguageList || (SereneInventory.LanguageList = {}));
})(SereneInventory || (SereneInventory = {}));
/// <reference path="../Common/Helpers/LanguageList.ts" />
/// <reference path="../_ext/_q/_q.ts" />
var SereneInventory;
(function (SereneInventory) {
    var ScriptInitialization;
    (function (ScriptInitialization) {
        Q.Config.responsiveDialogs = true;
        Q.Config.rootNamespaces.push('SereneInventory');
        Q.Config.rootNamespaces.push('_Ext');
        Serenity.EntityDialog.defaultLanguageList = SereneInventory.LanguageList.getValue;
        if ($.fn['colorbox']) {
            $.fn['colorbox'].settings.maxWidth = "95%";
            $.fn['colorbox'].settings.maxHeight = "95%";
        }
        window.onerror = Q.ErrorHandling.runtimeErrorHandler;
    })(ScriptInitialization = SereneInventory.ScriptInitialization || (SereneInventory.ScriptInitialization = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var BasicProgressDialog = /** @class */ (function (_super) {
        __extends(BasicProgressDialog, _super);
        function BasicProgressDialog() {
            var _this = _super.call(this) || this;
            _this.byId('ProgressBar').progressbar({
                max: 100,
                value: 0,
                change: function (e, v) {
                    _this.byId('ProgressLabel').text(_this.value + ' / ' + _this.max);
                }
            });
            return _this;
        }
        Object.defineProperty(BasicProgressDialog.prototype, "max", {
            get: function () {
                return this.byId('ProgressBar').progressbar().progressbar('option', 'max');
            },
            set: function (value) {
                this.byId('ProgressBar').progressbar().progressbar('option', 'max', value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasicProgressDialog.prototype, "value", {
            get: function () {
                return this.byId('ProgressBar').progressbar('value');
            },
            set: function (value) {
                this.byId('ProgressBar').progressbar().progressbar('value', value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasicProgressDialog.prototype, "title", {
            get: function () {
                return this.element.dialog().dialog('option', 'title');
            },
            set: function (value) {
                this.element.dialog().dialog('option', 'title', value);
            },
            enumerable: true,
            configurable: true
        });
        BasicProgressDialog.prototype.getDialogOptions = function () {
            var _this = this;
            var opt = _super.prototype.getDialogOptions.call(this);
            opt.title = Q.text('Site.BasicProgressDialog.PleaseWait');
            opt.width = 600;
            opt.buttons = [{
                    text: Q.text('Dialogs.CancelButton'),
                    click: function () {
                        _this.cancelled = true;
                        _this.element.closest('.ui-dialog')
                            .find('.ui-dialog-buttonpane .ui-button')
                            .attr('disabled', 'disabled')
                            .css('opacity', '0.5');
                        _this.element.dialog('option', 'title', Q.trimToNull(_this.cancelTitle) ||
                            Q.text('Site.BasicProgressDialog.CancelTitle'));
                    }
                }];
            return opt;
        };
        BasicProgressDialog.prototype.initDialog = function () {
            _super.prototype.initDialog.call(this);
            this.element.closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
        };
        BasicProgressDialog.prototype.getTemplate = function () {
            return ("<div class='s-DialogContent s-BasicProgressDialogContent'>" +
                "<div id='~_StatusText' class='status-text' ></div>" +
                "<div id='~_ProgressBar' class='progress-bar'>" +
                "<div id='~_ProgressLabel' class='progress-label' ></div>" +
                "</div>" +
                "</div>");
        };
        return BasicProgressDialog;
    }(Serenity.TemplatedDialog));
    SereneInventory.BasicProgressDialog = BasicProgressDialog;
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var BulkServiceAction = /** @class */ (function () {
            function BulkServiceAction() {
            }
            BulkServiceAction.prototype.createProgressDialog = function () {
                this.progressDialog = new SereneInventory.BasicProgressDialog();
                this.progressDialog.dialogOpen();
                this.progressDialog.max = this.keys.length;
                this.progressDialog.value = 0;
            };
            BulkServiceAction.prototype.getConfirmationFormat = function () {
                return Q.text('Site.BulkServiceAction.ConfirmationFormat');
            };
            BulkServiceAction.prototype.getConfirmationMessage = function (targetCount) {
                return Q.format(this.getConfirmationFormat(), targetCount);
            };
            BulkServiceAction.prototype.confirm = function (targetCount, action) {
                Q.confirm(this.getConfirmationMessage(targetCount), action);
            };
            BulkServiceAction.prototype.getNothingToProcessMessage = function () {
                return Q.text('Site.BulkServiceAction.NothingToProcess');
            };
            BulkServiceAction.prototype.nothingToProcess = function () {
                Q.notifyError(this.getNothingToProcessMessage());
            };
            BulkServiceAction.prototype.getParallelRequests = function () {
                return 1;
            };
            BulkServiceAction.prototype.getBatchSize = function () {
                return 1;
            };
            BulkServiceAction.prototype.startParallelExecution = function () {
                this.createProgressDialog();
                this.successCount = 0;
                this.errorCount = 0;
                this.pendingRequests = 0;
                this.completedRequests = 0;
                this.errorCount = 0;
                this.errorByKey = {};
                this.queue = this.keys.slice();
                this.queueIndex = 0;
                var parallelRequests = this.getParallelRequests();
                while (parallelRequests-- > 0) {
                    this.executeNextBatch();
                }
            };
            BulkServiceAction.prototype.serviceCallCleanup = function () {
                this.pendingRequests--;
                this.completedRequests++;
                var title = Q.text((this.progressDialog.cancelled ?
                    'Site.BasicProgressDialog.CancelTitle' : 'Site.BasicProgressDialog.PleaseWait'));
                title += ' (';
                if (this.successCount > 0) {
                    title += Q.format(Q.text('Site.BulkServiceAction.SuccessCount'), this.successCount);
                }
                if (this.errorCount > 0) {
                    if (this.successCount > 0) {
                        title += ', ';
                    }
                    title += Q.format(Q.text('Site.BulkServiceAction.ErrorCount'), this.errorCount);
                }
                this.progressDialog.title = title + ')';
                this.progressDialog.value = this.successCount + this.errorCount;
                if (!this.progressDialog.cancelled && this.progressDialog.value < this.keys.length) {
                    this.executeNextBatch();
                }
                else if (this.pendingRequests === 0) {
                    this.progressDialog.dialogClose();
                    this.showResults();
                    if (this.done) {
                        this.done();
                        this.done = null;
                    }
                }
            };
            BulkServiceAction.prototype.executeForBatch = function (batch) {
            };
            BulkServiceAction.prototype.executeNextBatch = function () {
                var batchSize = this.getBatchSize();
                var batch = [];
                while (true) {
                    if (batch.length >= batchSize) {
                        break;
                    }
                    if (this.queueIndex >= this.queue.length) {
                        break;
                    }
                    batch.push(this.queue[this.queueIndex++]);
                }
                if (batch.length > 0) {
                    this.pendingRequests++;
                    this.executeForBatch(batch);
                }
            };
            BulkServiceAction.prototype.getAllHadErrorsFormat = function () {
                return Q.text('Site.BulkServiceAction.AllHadErrorsFormat');
            };
            BulkServiceAction.prototype.showAllHadErrors = function () {
                Q.notifyError(Q.format(this.getAllHadErrorsFormat(), this.errorCount));
            };
            BulkServiceAction.prototype.getSomeHadErrorsFormat = function () {
                return Q.text('Site.BulkServiceAction.SomeHadErrorsFormat');
            };
            BulkServiceAction.prototype.showSomeHadErrors = function () {
                Q.notifyWarning(Q.format(this.getSomeHadErrorsFormat(), this.successCount, this.errorCount));
            };
            BulkServiceAction.prototype.getAllSuccessFormat = function () {
                return Q.text('Site.BulkServiceAction.AllSuccessFormat');
            };
            BulkServiceAction.prototype.showAllSuccess = function () {
                Q.notifySuccess(Q.format(this.getAllSuccessFormat(), this.successCount));
            };
            BulkServiceAction.prototype.showResults = function () {
                if (this.errorCount === 0 && this.successCount === 0) {
                    this.nothingToProcess();
                    return;
                }
                if (this.errorCount > 0 && this.successCount === 0) {
                    this.showAllHadErrors();
                    return;
                }
                if (this.errorCount > 0) {
                    this.showSomeHadErrors();
                    return;
                }
                this.showAllSuccess();
            };
            BulkServiceAction.prototype.execute = function (keys) {
                var _this = this;
                this.keys = keys;
                if (this.keys.length === 0) {
                    this.nothingToProcess();
                    return;
                }
                this.confirm(this.keys.length, function () { return _this.startParallelExecution(); });
            };
            BulkServiceAction.prototype.get_successCount = function () {
                return this.successCount;
            };
            BulkServiceAction.prototype.set_successCount = function (value) {
                this.successCount = value;
            };
            BulkServiceAction.prototype.get_errorCount = function () {
                return this.errorCount;
            };
            BulkServiceAction.prototype.set_errorCount = function (value) {
                this.errorCount = value;
            };
            return BulkServiceAction;
        }());
        Common.BulkServiceAction = BulkServiceAction;
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var DialogUtils;
    (function (DialogUtils) {
        function pendingChangesConfirmation(element, hasPendingChanges) {
            element.on('dialogbeforeclose panelbeforeclose', function (e) {
                if (!Serenity.WX.hasOriginalEvent(e) || !hasPendingChanges()) {
                    return;
                }
                e.preventDefault();
                Q.confirm('You have pending changes. Save them?', function () { return element.find('div.save-and-close-button').click(); }, {
                    onNo: function () {
                        if (element.hasClass('ui-dialog-content'))
                            element.dialog('close');
                        else if (element.hasClass('s-Panel'))
                            Serenity.TemplatedDialog.closePanel(element);
                    }
                });
            });
        }
        DialogUtils.pendingChangesConfirmation = pendingChangesConfirmation;
    })(DialogUtils = SereneInventory.DialogUtils || (SereneInventory.DialogUtils = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var EnumSelectFormatter = /** @class */ (function () {
            function EnumSelectFormatter() {
                this.allowClear = true;
            }
            EnumSelectFormatter.prototype.format = function (ctx) {
                var enumType = Serenity.EnumTypeRegistry.get(this.enumKey);
                var sb = "<select>";
                if (this.allowClear) {
                    sb += '<option value="">';
                    sb += Q.htmlEncode(this.emptyItemText || Q.text("Controls.SelectEditor.EmptyItemText"));
                    sb += '</option>';
                }
                for (var _i = 0, _a = Object.keys(enumType).filter(function (v) { return !isNaN(parseInt(v, 10)); }); _i < _a.length; _i++) {
                    var x = _a[_i];
                    sb += '<option value="' + Q.attrEncode(x) + '"';
                    if (x == ctx.value)
                        sb += " selected";
                    var name = enumType[x];
                    sb += ">";
                    sb += Q.htmlEncode(Q.tryGetText("Enums." + this.enumKey + "." + name) || name);
                    sb += "</option>";
                }
                sb += "</select>";
                return sb;
            };
            __decorate([
                Serenity.Decorators.option()
            ], EnumSelectFormatter.prototype, "enumKey", void 0);
            __decorate([
                Serenity.Decorators.option()
            ], EnumSelectFormatter.prototype, "allowClear", void 0);
            __decorate([
                Serenity.Decorators.option()
            ], EnumSelectFormatter.prototype, "emptyItemText", void 0);
            EnumSelectFormatter = __decorate([
                Serenity.Decorators.registerFormatter()
            ], EnumSelectFormatter);
            return EnumSelectFormatter;
        }());
        Common.EnumSelectFormatter = EnumSelectFormatter;
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var ExcelExportHelper;
        (function (ExcelExportHelper) {
            function createToolButton(options) {
                return {
                    hint: Q.coalesce(options.hint, 'Excel'),
                    title: Q.coalesce(options.title, ''),
                    cssClass: 'export-xlsx-button',
                    onClick: function () {
                        if (!options.onViewSubmit()) {
                            return;
                        }
                        var grid = options.grid;
                        var request = Q.deepClone(grid.getView().params);
                        request.Take = 0;
                        request.Skip = 0;
                        var sortBy = grid.getView().sortBy;
                        if (sortBy) {
                            request.Sort = sortBy;
                        }
                        request.IncludeColumns = [];
                        var columns = grid.getGrid().getColumns();
                        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                            var column = columns_1[_i];
                            request.IncludeColumns.push(column.id || column.field);
                        }
                        Q.postToService({ service: options.service, request: request, target: '_blank' });
                    },
                    separator: options.separator
                };
            }
            ExcelExportHelper.createToolButton = createToolButton;
        })(ExcelExportHelper = Common.ExcelExportHelper || (Common.ExcelExportHelper = {}));
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var GridEditorBase = /** @class */ (function (_super) {
            __extends(GridEditorBase, _super);
            function GridEditorBase(container) {
                var _this = _super.call(this, container) || this;
                _this.nextId = 1;
                return _this;
            }
            GridEditorBase.prototype.getIdProperty = function () { return "__id"; };
            GridEditorBase.prototype.id = function (entity) {
                return entity[this.getIdProperty()];
            };
            GridEditorBase.prototype.getNextId = function () {
                return "`" + this.nextId++;
            };
            GridEditorBase.prototype.setNewId = function (entity) {
                entity[this.getIdProperty()] = this.getNextId();
            };
            GridEditorBase.prototype.save = function (opt, callback) {
                var _this = this;
                var request = opt.request;
                var row = Q.deepClone(request.Entity);
                var id = this.id(row);
                if (id == null) {
                    row[this.getIdProperty()] = this.getNextId();
                }
                if (!this.validateEntity(row, id)) {
                    return;
                }
                var items = this.view.getItems().slice();
                if (id == null) {
                    items.push(row);
                }
                else {
                    var index = Q.indexOf(items, function (x) { return _this.id(x) === id; });
                    items[index] = Q.deepClone({}, items[index], row);
                }
                this.setEntities(items);
                callback({});
            };
            GridEditorBase.prototype.deleteEntity = function (id) {
                this.view.deleteItem(id);
                return true;
            };
            GridEditorBase.prototype.validateEntity = function (row, id) {
                return true;
            };
            GridEditorBase.prototype.setEntities = function (items) {
                this.view.setItems(items, true);
            };
            GridEditorBase.prototype.getNewEntity = function () {
                return {};
            };
            GridEditorBase.prototype.getButtons = function () {
                var _this = this;
                return [{
                        title: this.getAddButtonCaption(),
                        cssClass: 'add-button',
                        onClick: function () {
                            _this.createEntityDialog(_this.getItemType(), function (dlg) {
                                var dialog = dlg;
                                dialog.onSave = function (opt, callback) { return _this.save(opt, callback); };
                                dialog.loadEntityAndOpenDialog(_this.getNewEntity());
                            });
                        }
                    }];
            };
            GridEditorBase.prototype.editItem = function (entityOrId) {
                var _this = this;
                var id = entityOrId;
                var item = this.view.getItemById(id);
                this.createEntityDialog(this.getItemType(), function (dlg) {
                    var dialog = dlg;
                    dialog.onDelete = function (opt, callback) {
                        if (!_this.deleteEntity(id)) {
                            return;
                        }
                        callback({});
                    };
                    dialog.onSave = function (opt, callback) { return _this.save(opt, callback); };
                    dialog.loadEntityAndOpenDialog(item);
                });
                ;
            };
            GridEditorBase.prototype.getEditValue = function (property, target) {
                target[property.name] = this.value;
            };
            GridEditorBase.prototype.setEditValue = function (source, property) {
                this.value = source[property.name];
            };
            Object.defineProperty(GridEditorBase.prototype, "value", {
                get: function () {
                    var p = this.getIdProperty();
                    return this.view.getItems().map(function (x) {
                        var y = Q.deepClone(x);
                        var id = y[p];
                        if (id && id.toString().charAt(0) == '`')
                            delete y[p];
                        return y;
                    });
                },
                set: function (value) {
                    var _this = this;
                    var p = this.getIdProperty();
                    this.view.setItems((value || []).map(function (x) {
                        var y = Q.deepClone(x);
                        if (y[p] == null)
                            y[p] = "`" + _this.getNextId();
                        return y;
                    }), true);
                },
                enumerable: true,
                configurable: true
            });
            GridEditorBase.prototype.getGridCanLoad = function () {
                return false;
            };
            GridEditorBase.prototype.usePager = function () {
                return false;
            };
            GridEditorBase.prototype.getInitialTitle = function () {
                return null;
            };
            GridEditorBase.prototype.createQuickSearchInput = function () {
            };
            GridEditorBase = __decorate([
                Serenity.Decorators.registerClass([Serenity.IGetEditValue, Serenity.ISetEditValue]),
                Serenity.Decorators.editor(),
                Serenity.Decorators.element("<div/>")
            ], GridEditorBase);
            return GridEditorBase;
        }(Serenity.EntityGrid));
        Common.GridEditorBase = GridEditorBase;
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var GridEditorDialog = /** @class */ (function (_super) {
            __extends(GridEditorDialog, _super);
            function GridEditorDialog() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            GridEditorDialog.prototype.getIdProperty = function () { return "__id"; };
            GridEditorDialog.prototype.destroy = function () {
                this.onSave = null;
                this.onDelete = null;
                _super.prototype.destroy.call(this);
            };
            GridEditorDialog.prototype.updateInterface = function () {
                _super.prototype.updateInterface.call(this);
                // apply changes button doesn't work properly with in-memory grids yet
                if (this.applyChangesButton) {
                    this.applyChangesButton.hide();
                }
            };
            GridEditorDialog.prototype.saveHandler = function (options, callback) {
                this.onSave && this.onSave(options, callback);
            };
            GridEditorDialog.prototype.deleteHandler = function (options, callback) {
                this.onDelete && this.onDelete(options, callback);
            };
            GridEditorDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], GridEditorDialog);
            return GridEditorDialog;
        }(Serenity.EntityDialog));
        Common.GridEditorDialog = GridEditorDialog;
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    /**
     * This is an editor widget but it only displays a text, not edits it.
     *
     */
    var StaticTextBlock = /** @class */ (function (_super) {
        __extends(StaticTextBlock, _super);
        function StaticTextBlock(container, options) {
            var _this = _super.call(this, container, options) || this;
            // hide the caption label for this editor if in a form. ugly hack
            if (_this.options.hideLabel)
                _this.element.closest('.field').find('.caption').hide();
            _this.updateElementContent();
            return _this;
        }
        StaticTextBlock.prototype.updateElementContent = function () {
            var text = Q.coalesce(this.options.text, this.value);
            // if isLocalText is set, text is actually a local text key
            if (this.options.isLocalText)
                text = Q.text(text);
            // don't html encode if isHtml option is true
            if (this.options.isHtml)
                this.element.html(text);
            else
                this.element.text(text);
        };
        /**
         * By implementing ISetEditValue interface, we allow this editor to display its field value.
         * But only do this when our text content is not explicitly set in options
         */
        StaticTextBlock.prototype.setEditValue = function (source, property) {
            if (this.options.text == null) {
                this.value = Q.coalesce(this.options.text, source[property.name]);
                this.updateElementContent();
            }
        };
        StaticTextBlock = __decorate([
            Serenity.Decorators.element("<div/>"),
            Serenity.Decorators.registerEditor([Serenity.ISetEditValue])
        ], StaticTextBlock);
        return StaticTextBlock;
    }(Serenity.Widget));
    SereneInventory.StaticTextBlock = StaticTextBlock;
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var LanguageSelection = /** @class */ (function (_super) {
            __extends(LanguageSelection, _super);
            function LanguageSelection(select, currentLanguage) {
                var _this = _super.call(this, select) || this;
                currentLanguage = Q.coalesce(currentLanguage, 'en');
                _this.change(function (e) {
                    $.cookie('LanguagePreference', select.val(), {
                        path: Q.Config.applicationPath,
                        expires: 365
                    });
                    window.location.reload(true);
                });
                Q.getLookupAsync('Administration.Language').then(function (x) {
                    if (!Q.any(x.items, function (z) { return z.LanguageId === currentLanguage; })) {
                        var idx = currentLanguage.lastIndexOf('-');
                        if (idx >= 0) {
                            currentLanguage = currentLanguage.substr(0, idx);
                            if (!Q.any(x.items, function (y) { return y.LanguageId === currentLanguage; })) {
                                currentLanguage = 'en';
                            }
                        }
                        else {
                            currentLanguage = 'en';
                        }
                    }
                    for (var _i = 0, _a = x.items; _i < _a.length; _i++) {
                        var l = _a[_i];
                        Q.addOption(select, l.LanguageId, l.LanguageName);
                    }
                    select.val(currentLanguage);
                });
                return _this;
            }
            return LanguageSelection;
        }(Serenity.Widget));
        Common.LanguageSelection = LanguageSelection;
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var SidebarSearch = /** @class */ (function (_super) {
            __extends(SidebarSearch, _super);
            function SidebarSearch(input, menuUL) {
                var _this = _super.call(this, input) || this;
                new Serenity.QuickSearchInput(input, {
                    onSearch: function (field, text, success) {
                        _this.updateMatchFlags(text);
                        success(true);
                    }
                });
                _this.menuUL = menuUL;
                return _this;
            }
            SidebarSearch.prototype.updateMatchFlags = function (text) {
                var liList = this.menuUL.find('li').removeClass('non-match');
                text = Q.trimToNull(text);
                if (text == null) {
                    liList.show();
                    liList.removeClass('expanded');
                    return;
                }
                var parts = text.replace(',', ' ').split(' ').filter(function (x) { return !Q.isTrimmedEmpty(x); });
                for (var i = 0; i < parts.length; i++) {
                    parts[i] = Q.trimToNull(Select2.util.stripDiacritics(parts[i]).toUpperCase());
                }
                var items = liList;
                items.each(function (idx, e) {
                    var x = $(e);
                    var title = Select2.util.stripDiacritics(Q.coalesce(x.text(), '').toUpperCase());
                    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                        var p = parts_1[_i];
                        if (p != null && !(title.indexOf(p) !== -1)) {
                            x.addClass('non-match');
                            break;
                        }
                    }
                });
                var matchingItems = items.not('.non-match');
                var visibles = matchingItems.parents('li').add(matchingItems);
                var nonVisibles = liList.not(visibles);
                nonVisibles.hide().addClass('non-match');
                visibles.show();
                liList.addClass('expanded');
            };
            return SidebarSearch;
        }(Serenity.Widget));
        Common.SidebarSearch = SidebarSearch;
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var ThemeSelection = /** @class */ (function (_super) {
            __extends(ThemeSelection, _super);
            function ThemeSelection(select) {
                var _this = _super.call(this, select) || this;
                _this.change(function (e) {
                    var path = Q.Config.applicationPath;
                    if (path && path != '/' && Q.endsWith(path, '/'))
                        path = path.substr(0, path.length - 1);
                    $.cookie('ThemePreference', select.val(), {
                        path: path,
                        expires: 365
                    });
                    var theme = select.val() || '';
                    var darkSidebar = theme.indexOf('light') < 0;
                    $('body').removeClass('skin-' + _this.getCurrentTheme());
                    $('body').addClass('skin-' + theme)
                        .toggleClass('dark-sidebar', darkSidebar)
                        .toggleClass('light-sidebar', !darkSidebar);
                });
                Q.addOption(select, 'blue', Q.text('Site.Layout.ThemeBlue'));
                Q.addOption(select, 'blue-light', Q.text('Site.Layout.ThemeBlueLight'));
                Q.addOption(select, 'purple', Q.text('Site.Layout.ThemePurple'));
                Q.addOption(select, 'purple-light', Q.text('Site.Layout.ThemePurpleLight'));
                Q.addOption(select, 'red', Q.text('Site.Layout.ThemeRed'));
                Q.addOption(select, 'red-light', Q.text('Site.Layout.ThemeRedLight'));
                Q.addOption(select, 'green', Q.text('Site.Layout.ThemeGreen'));
                Q.addOption(select, 'green-light', Q.text('Site.Layout.ThemeGreenLight'));
                Q.addOption(select, 'yellow', Q.text('Site.Layout.ThemeYellow'));
                Q.addOption(select, 'yellow-light', Q.text('Site.Layout.ThemeYellowLight'));
                Q.addOption(select, 'black', Q.text('Site.Layout.ThemeBlack'));
                Q.addOption(select, 'black-light', Q.text('Site.Layout.ThemeBlackLight'));
                select.val(_this.getCurrentTheme());
                return _this;
            }
            ThemeSelection.prototype.getCurrentTheme = function () {
                var skinClass = Q.first(($('body').attr('class') || '').split(' '), function (x) { return Q.startsWith(x, 'skin-'); });
                if (skinClass) {
                    return skinClass.substr(5);
                }
                return 'blue';
            };
            return ThemeSelection;
        }(Serenity.Widget));
        Common.ThemeSelection = ThemeSelection;
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var PdfExportHelper;
        (function (PdfExportHelper) {
            function toAutoTableColumns(srcColumns, columnStyles, columnTitles) {
                return srcColumns.map(function (src) {
                    var col = {
                        dataKey: src.id || src.field,
                        title: src.name || ''
                    };
                    if (columnTitles && columnTitles[col.dataKey] != null)
                        col.title = columnTitles[col.dataKey];
                    var style = {};
                    if ((src.cssClass || '').indexOf("align-right") >= 0)
                        style.halign = 'right';
                    else if ((src.cssClass || '').indexOf("align-center") >= 0)
                        style.halign = 'center';
                    columnStyles[col.dataKey] = style;
                    return col;
                });
            }
            function toAutoTableData(entities, keys, srcColumns) {
                var el = document.createElement('span');
                var row = 0;
                return entities.map(function (item) {
                    var dst = {};
                    for (var cell = 0; cell < srcColumns.length; cell++) {
                        var src = srcColumns[cell];
                        var fld = src.field || '';
                        var key = keys[cell];
                        var txt = void 0;
                        var html = void 0;
                        if (src.formatter) {
                            html = src.formatter(row, cell, item[fld], src, item);
                        }
                        else if (src.format) {
                            html = src.format({ row: row, cell: cell, item: item, value: item[fld] });
                        }
                        else {
                            dst[key] = item[fld];
                            continue;
                        }
                        if (!html || (html.indexOf('<') < 0 && html.indexOf('&') < 0))
                            dst[key] = html;
                        else {
                            el.innerHTML = html;
                            if (el.children.length == 1 &&
                                $(el.children[0]).is(":input")) {
                                dst[key] = $(el.children[0]).val();
                            }
                            else if (el.children.length == 1 &&
                                $(el.children).is('.check-box')) {
                                dst[key] = $(el.children).hasClass("checked") ? "X" : "";
                            }
                            else
                                dst[key] = el.textContent || '';
                        }
                    }
                    row++;
                    return dst;
                });
            }
            function exportToPdf(options) {
                var g = options.grid;
                if (!options.onViewSubmit())
                    return;
                includeAutoTable();
                var request = Q.deepClone(g.view.params);
                request.Take = 0;
                request.Skip = 0;
                var sortBy = g.view.sortBy;
                if (sortBy != null)
                    request.Sort = sortBy;
                var gridColumns = g.slickGrid.getColumns();
                gridColumns = gridColumns.filter(function (x) { return x.id !== "__select__"; });
                request.IncludeColumns = [];
                for (var _i = 0, gridColumns_1 = gridColumns; _i < gridColumns_1.length; _i++) {
                    var column = gridColumns_1[_i];
                    request.IncludeColumns.push(column.id || column.field);
                }
                Q.serviceCall({
                    url: g.view.url,
                    request: request,
                    onSuccess: function (response) {
                        var doc = new jsPDF('l', 'pt');
                        var srcColumns = gridColumns;
                        var columnStyles = {};
                        var columns = toAutoTableColumns(srcColumns, columnStyles, options.columnTitles);
                        var keys = columns.map(function (x) { return x.dataKey; });
                        var entities = response.Entities || [];
                        var data = toAutoTableData(entities, keys, srcColumns);
                        doc.setFontSize(options.titleFontSize || 10);
                        doc.setFontStyle('bold');
                        var reportTitle = options.reportTitle || g.getTitle() || "Report";
                        doc.autoTableText(reportTitle, doc.internal.pageSize.width / 2, options.titleTop || 25, { halign: 'center' });
                        var totalPagesExp = "{{T}}";
                        var pageNumbers = options.pageNumbers == null || options.pageNumbers;
                        var autoOptions = $.extend({
                            margin: { top: 25, left: 25, right: 25, bottom: pageNumbers ? 25 : 30 },
                            startY: 60,
                            styles: {
                                fontSize: 8,
                                overflow: 'linebreak',
                                cellPadding: 2,
                                valign: 'middle'
                            },
                            columnStyles: columnStyles
                        }, options.tableOptions);
                        if (pageNumbers) {
                            var footer = function (data) {
                                var str = data.pageCount;
                                // Total page number plugin only available in jspdf v1.0+
                                if (typeof doc.putTotalPages === 'function') {
                                    str = str + " / " + totalPagesExp;
                                }
                                doc.autoTableText(str, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - autoOptions.margin.bottom, {
                                    halign: 'center'
                                });
                            };
                            autoOptions.afterPageContent = footer;
                        }
                        // Print header of page
                        if (options.printDateTimeHeader == null || options.printDateTimeHeader) {
                            var beforePage = function (data) {
                                doc.setFontStyle('normal');
                                doc.setFontSize(8);
                                // Date and time of the report
                                doc.autoTableText(Q.formatDate(new Date(), "dd-MM-yyyy HH:mm"), doc.internal.pageSize.width - autoOptions.margin.right, 13, {
                                    halign: 'right'
                                });
                            };
                            autoOptions.beforePageContent = beforePage;
                        }
                        doc.autoTable(columns, data, autoOptions);
                        if (typeof doc.putTotalPages === 'function') {
                            doc.putTotalPages(totalPagesExp);
                        }
                        if (!options.output || options.output == "file") {
                            var fileName = options.fileName || options.reportTitle || "{0}_{1}.pdf";
                            fileName = Q.format(fileName, g.getTitle() || "report", Q.formatDate(new Date(), "yyyyMMdd_HHmm"));
                            doc.save(fileName);
                            return;
                        }
                        if (options.autoPrint)
                            doc.autoPrint();
                        var output = options.output;
                        if (output == 'newwindow' || '_blank')
                            output = 'dataurlnewwindow';
                        else if (output == 'window')
                            output = 'datauri';
                        if (output == 'datauri')
                            doc.output(output);
                        else {
                            var tmpOut = doc.output('datauristring');
                            if (output == 'dataurlnewwindow') {
                                var fileTmpName = options.reportTitle || g.getTitle();
                                var url_with_name = tmpOut.replace("data:application/pdf;", "data:application/pdf;name=" + fileTmpName + ".pdf;");
                                var html = '<html>' +
                                    '<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>' +
                                    '<body>' +
                                    '<p></p>' +
                                    '<iframe type="application/pdf" src="' + url_with_name + '"></iframe>' +
                                    '</body></html>';
                                var a = window.open("about:blank", "_blank");
                                a.document.write(html);
                                a.document.close();
                            }
                        }
                    }
                });
            }
            PdfExportHelper.exportToPdf = exportToPdf;
            function createToolButton(options) {
                return {
                    title: options.title || '',
                    hint: options.hint || 'PDF',
                    cssClass: 'export-pdf-button',
                    onClick: function () { return exportToPdf(options); },
                    separator: options.separator
                };
            }
            PdfExportHelper.createToolButton = createToolButton;
            function includeJsPDF() {
                if (typeof jsPDF !== "undefined")
                    return;
                var script = $("jsPDFScript");
                if (script.length > 0)
                    return;
                $("<script/>")
                    .attr("type", "text/javascript")
                    .attr("id", "jsPDFScript")
                    .attr("src", Q.resolveUrl("~/Scripts/jspdf.min.js"))
                    .appendTo(document.head);
            }
            function includeAutoTable() {
                includeJsPDF();
                if (typeof jsPDF === "undefined" ||
                    typeof jsPDF.API == "undefined" ||
                    typeof jsPDF.API.autoTable !== "undefined")
                    return;
                var script = $("jsPDFAutoTableScript");
                if (script.length > 0)
                    return;
                $("<script/>")
                    .attr("type", "text/javascript")
                    .attr("id", "jsPDFAutoTableScript")
                    .attr("src", Q.resolveUrl("~/Scripts/jspdf.plugin.autotable.min.js"))
                    .appendTo(document.head);
            }
        })(PdfExportHelper = Common.PdfExportHelper || (Common.PdfExportHelper = {}));
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var ReportDialog = /** @class */ (function (_super) {
            __extends(ReportDialog, _super);
            function ReportDialog(options) {
                var _this = _super.call(this, options) || this;
                _this.updateInterface();
                _this.loadReport(_this.options.reportKey);
                return _this;
            }
            ReportDialog.prototype.getDialogButtons = function () {
                return null;
            };
            ReportDialog.prototype.createPropertyGrid = function () {
                this.propertyGrid && this.byId('PropertyGrid').html('').attr('class', '');
                this.propertyGrid = new Serenity.PropertyGrid(this.byId('PropertyGrid'), {
                    idPrefix: this.idPrefix,
                    useCategories: true,
                    items: this.report.Properties
                }).init(null);
            };
            ReportDialog.prototype.loadReport = function (reportKey) {
                var _this = this;
                Q.serviceCall({
                    url: Q.resolveUrl('~/Report/Retrieve'),
                    request: {
                        ReportKey: reportKey
                    },
                    onSuccess: function (response) {
                        _this.report = response;
                        _this.element.dialog().dialog('option', 'title', _this.report.Title);
                        _this.createPropertyGrid();
                        _this.propertyGrid.load(_this.report.InitialSettings || {});
                        _this.updateInterface();
                        _this.dialogOpen();
                    }
                });
            };
            ReportDialog.prototype.updateInterface = function () {
                this.toolbar.findButton('print-preview-button')
                    .toggle(this.report && !this.report.IsDataOnlyReport);
                this.toolbar.findButton('export-pdf-button')
                    .toggle(this.report && !this.report.IsDataOnlyReport);
                this.toolbar.findButton('export-xlsx-button')
                    .toggle(this.report && this.report.IsDataOnlyReport);
            };
            ReportDialog.prototype.executeReport = function (target, ext, download) {
                if (!this.validateForm()) {
                    return;
                }
                var opt = {};
                this.propertyGrid.save(opt);
                Common.ReportHelper.execute({
                    download: download,
                    reportKey: this.report.ReportKey,
                    extension: ext,
                    target: target,
                    params: opt
                });
            };
            ReportDialog.prototype.getToolbarButtons = function () {
                var _this = this;
                return [
                    {
                        title: 'Preview',
                        cssClass: 'print-preview-button',
                        onClick: function () { return _this.executeReport('_blank', null, false); }
                    },
                    {
                        title: 'PDF',
                        cssClass: 'export-pdf-button',
                        onClick: function () { return _this.executeReport('_blank', 'pdf', true); }
                    },
                    {
                        title: 'Excel',
                        cssClass: 'export-xlsx-button',
                        onClick: function () { return _this.executeReport('_blank', 'xlsx', true); }
                    }
                ];
            };
            return ReportDialog;
        }(Serenity.TemplatedDialog));
        Common.ReportDialog = ReportDialog;
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var ReportHelper;
        (function (ReportHelper) {
            function createToolButton(options) {
                return {
                    title: Q.coalesce(options.title, 'Report'),
                    cssClass: Q.coalesce(options.cssClass, 'print-button'),
                    icon: options.icon,
                    onClick: function () {
                        ReportHelper.execute(options);
                    }
                };
            }
            ReportHelper.createToolButton = createToolButton;
            function execute(options) {
                var opt = options.getParams ? options.getParams() : options.params;
                Q.postToUrl({
                    url: '~/Report/' + (options.download ? 'Download' : 'Render'),
                    params: {
                        key: options.reportKey,
                        ext: Q.coalesce(options.extension, 'pdf'),
                        opt: opt ? $.toJSON(opt) : ''
                    },
                    target: Q.coalesce(options.target, '_blank')
                });
            }
            ReportHelper.execute = execute;
        })(ReportHelper = Common.ReportHelper || (Common.ReportHelper = {}));
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var ReportPage = /** @class */ (function (_super) {
            __extends(ReportPage, _super);
            function ReportPage(element) {
                var _this = _super.call(this, element) || this;
                $('.report-link', element).click(function (e) { return _this.reportLinkClick(e); });
                $('div.line', element).click(function (e) { return _this.categoryClick(e); });
                new Serenity.QuickSearchInput($('.s-QuickSearchBar input', element), {
                    onSearch: function (field, text, done) {
                        _this.updateMatchFlags(text);
                        done(true);
                    }
                });
                return _this;
            }
            ReportPage.prototype.updateMatchFlags = function (text) {
                var liList = $('.report-list', this.element).find('li').removeClass('non-match');
                text = Q.trimToNull(text);
                if (!text) {
                    liList.children('ul').hide();
                    liList.show().removeClass('expanded');
                    return;
                }
                text = Select2.util.stripDiacritics(text).toUpperCase();
                var reportItems = liList.filter('.report-item');
                reportItems.each(function (ix, e) {
                    var x = $(e);
                    var title = Select2.util.stripDiacritics(Q.coalesce(x.text(), '').toUpperCase());
                    if (title.indexOf(text) < 0) {
                        x.addClass('non-match');
                    }
                });
                var matchingItems = reportItems.not('.non-match');
                var visibles = matchingItems.parents('li').add(matchingItems);
                var nonVisibles = liList.not(visibles);
                nonVisibles.hide().addClass('non-match');
                visibles.show();
                if (visibles.length <= 100) {
                    liList.children('ul').show();
                    liList.addClass('expanded');
                }
            };
            ReportPage.prototype.categoryClick = function (e) {
                var li = $(e.target).closest('li');
                if (li.hasClass('expanded')) {
                    li.find('ul').hide('fast');
                    li.removeClass('expanded');
                    li.find('li').removeClass('expanded');
                }
                else {
                    li.addClass('expanded');
                    li.children('ul').show('fast');
                    if (li.children('ul').children('li').length === 1 && !li.children('ul').children('li').hasClass('expanded')) {
                        li.children('ul').children('li').children('.line').click();
                    }
                }
            };
            ReportPage.prototype.reportLinkClick = function (e) {
                e.preventDefault();
                new Common.ReportDialog({
                    reportKey: $(e.target).data('key')
                }).dialogOpen();
            };
            return ReportPage;
        }(Serenity.Widget));
        Common.ReportPage = ReportPage;
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Common;
    (function (Common) {
        var UserPreferenceStorage = /** @class */ (function () {
            function UserPreferenceStorage() {
            }
            UserPreferenceStorage.prototype.getItem = function (key) {
                var value;
                Common.UserPreferenceService.Retrieve({
                    PreferenceType: "UserPreferenceStorage",
                    Name: key
                }, function (response) { return value = response.Value; }, {
                    async: false
                });
                return value;
            };
            UserPreferenceStorage.prototype.setItem = function (key, data) {
                Common.UserPreferenceService.Update({
                    PreferenceType: "UserPreferenceStorage",
                    Name: key,
                    Value: data
                });
            };
            return UserPreferenceStorage;
        }());
        Common.UserPreferenceStorage = UserPreferenceStorage;
    })(Common = SereneInventory.Common || (SereneInventory.Common = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var ProfitLossReportPanel = /** @class */ (function (_super) {
            __extends(ProfitLossReportPanel, _super);
            function ProfitLossReportPanel(container) {
                var _this = _super.call(this, container) || this;
                _this.form = new Inventory.ProfitLossReportRequestForm(_this.idPrefix);
                return _this;
            }
            ProfitLossReportPanel.prototype.getReportTitle = function () { return 'Profit/Loss Report'; };
            ProfitLossReportPanel.prototype.getReportKey = function () { return 'Inventory.ProfitLossReport'; };
            ProfitLossReportPanel.prototype.getFormKey = function () { return Inventory.ProfitLossReportRequestForm.formKey; };
            ProfitLossReportPanel = __decorate([
                Serenity.Decorators.registerClass()
            ], ProfitLossReportPanel);
            return ProfitLossReportPanel;
        }(_Ext.ReportPanelBase));
        Inventory.ProfitLossReportPanel = ProfitLossReportPanel;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
/// <reference path="../../_Ext/_q/_q.ts" />
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionDialog = /** @class */ (function (_super) {
            __extends(TransactionDialog, _super);
            function TransactionDialog() {
                var _this = _super.call(this) || this;
                _this.form = new Inventory.TransactionForm(_this.idPrefix);
                q.initDetailEditor(_this, _this.form.TransactionDetailRows);
                q.initDetailEditor(_this, _this.form.TransactionExpenseRows);
                return _this;
                //q.initDetailEditor(this, this.form.RelatedTransactionRows, { hideToolbar: true });
            }
            TransactionDialog.prototype.getFormKey = function () { return Inventory.TransactionForm.formKey; };
            TransactionDialog.prototype.getIdProperty = function () { return Inventory.TransactionRow.idProperty; };
            TransactionDialog.prototype.getLocalTextPrefix = function () { return Inventory.TransactionRow.localTextPrefix; };
            TransactionDialog.prototype.getNameProperty = function () { return Inventory.TransactionRow.nameProperty; };
            TransactionDialog.prototype.getService = function () { return Inventory.TransactionService.baseUrl; };
            TransactionDialog.prototype.getEntityTitle = function () { return SereneInventory.getTrasactionTypeName(SereneInventory.getTrasactionTypeFromUrl()); };
            TransactionDialog.prototype.getToolbarButtons = function () {
                var _this = this;
                var buttons = _super.prototype.getToolbarButtons.call(this);
                buttons.push({
                    title: 'Print',
                    icon: 'fa fa-print',
                    cssClass: 'btn-custom',
                    onClick: function () {
                        SereneInventory.Common.ReportHelper.execute({ reportKey: 'Inventory.SalesInvoice', params: { ID: _this.entityId }, extension: 'html' });
                    }
                });
                return buttons;
            };
            TransactionDialog.prototype.getSaveEntity = function () {
                var entity = _super.prototype.getSaveEntity.call(this);
                entity.TransactionType = SereneInventory.getTrasactionTypeFromUrl();
                return entity;
            };
            TransactionDialog.prototype.getPropertyItems = function () {
                var columns = _super.prototype.getPropertyItems.call(this);
                var transactionType = SereneInventory.getTrasactionTypeFromUrl();
                var trasactionNumberCaption = SereneInventory.getTrasactionNumberCaption(transactionType);
                Q.first(columns, function (x) { return x.name == "TransactionNumber" /* TransactionNumber */; }).title = trasactionNumberCaption;
                return columns;
            };
            TransactionDialog.prototype.afterLoadEntity = function () {
                _super.prototype.afterLoadEntity.call(this);
                // fill next number in new record mode
                if (this.isNew())
                    this.getNextNumber();
            };
            TransactionDialog.prototype.getNextNumber = function () {
                var _this = this;
                var val = Q.trimToNull(this.form.TransactionNumber.value);
                if (!val || val.length <= 1) {
                    var prefix = (val || SereneInventory.getTrasactionNumberPrefix(SereneInventory.getTrasactionTypeFromUrl())).toUpperCase();
                    Inventory.TransactionService.GetNextNumber({
                        Prefix: prefix,
                        Length: prefix.length + 5 // we want service to search for and return serials of 5 in length
                    }, function (response) {
                        _this.form.TransactionNumber.value = response.Serial;
                        // this is to mark numerical part after prefix
                        _this.form.TransactionNumber.element[0].setSelectionRange(prefix.length, response.Serial.length);
                    });
                }
            };
            TransactionDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], TransactionDialog);
            return TransactionDialog;
        }(_Ext.DialogBase));
        Inventory.TransactionDialog = TransactionDialog;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
/// <reference path="../../_Ext/_q/_q.ts" />
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionGrid = /** @class */ (function (_super) {
            __extends(TransactionGrid, _super);
            function TransactionGrid(container) {
                return _super.call(this, container) || this;
            }
            TransactionGrid.prototype.getColumnsKey = function () { return 'Inventory.Transaction'; };
            TransactionGrid.prototype.getDialogType = function () { return Inventory.TransactionDialog; };
            TransactionGrid.prototype.getIdProperty = function () { return Inventory.TransactionRow.idProperty; };
            TransactionGrid.prototype.getLocalTextPrefix = function () { return Inventory.TransactionRow.localTextPrefix; };
            TransactionGrid.prototype.getService = function () { return Inventory.TransactionService.baseUrl; };
            TransactionGrid.prototype.getDisplayName = function () { return SereneInventory.getTrasactionTypeName(SereneInventory.getTrasactionTypeFromUrl()); };
            TransactionGrid.prototype.getItemName = function () { return this.getDisplayName(); };
            TransactionGrid.prototype.getColumns = function () {
                var columns = _super.prototype.getColumns.call(this);
                var transactionType = SereneInventory.getTrasactionTypeFromUrl();
                var trasactionNumberCaption = SereneInventory.getTrasactionNumberCaption(transactionType);
                Q.first(columns, function (x) { return x.field == "TransactionNumber" /* TransactionNumber */; }).name = trasactionNumberCaption;
                //Q.first(columns, x => x.field == fld.RefTransactionTransactionNumber).name = 'Ref. ' + trasactionNumberCaption;
                return columns;
            };
            TransactionGrid.prototype.getQuickFilters = function () {
                var _this = this;
                var filters = _super.prototype.getQuickFilters.call(this);
                filters.push({
                    type: Serenity.LookupEditor,
                    options: {
                        lookupKey: SereneInventory.Setup.ProductRow.lookupKey
                    },
                    field: 'ProductId',
                    title: 'Contains Product in Details',
                    handler: function (w) {
                        _this.view.params.ProductId = Q.toId(w.value);
                    },
                    cssClass: 'hidden-xs'
                });
                return filters;
            };
            TransactionGrid.prototype.onViewSubmit = function () {
                if (!_super.prototype.onViewSubmit.call(this)) {
                    return false;
                }
                var request = this.view.params;
                request.Criteria = Serenity.Criteria.and(request.Criteria, [["TransactionType" /* TransactionType */], '=', SereneInventory.getTrasactionTypeFromUrl()]);
                return true;
            };
            TransactionGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], TransactionGrid);
            return TransactionGrid;
        }(_Ext.GridBase));
        Inventory.TransactionGrid = TransactionGrid;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
/// <reference path="../../../_Ext/_q/_q.ts" />
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionEditorDialog = /** @class */ (function (_super) {
            __extends(TransactionEditorDialog, _super);
            function TransactionEditorDialog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.form = new Inventory.TransactionForm(_this.idPrefix);
                return _this;
            }
            TransactionEditorDialog.prototype.getFormKey = function () { return Inventory.TransactionForm.formKey; };
            TransactionEditorDialog.prototype.getLocalTextPrefix = function () { return Inventory.TransactionRow.localTextPrefix; };
            TransactionEditorDialog.prototype.getNameProperty = function () { return Inventory.TransactionRow.nameProperty; };
            TransactionEditorDialog.prototype.getEntityTitle = function () { return SereneInventory.getTrasactionTypeName(SereneInventory.getTrasactionTypeFromUrl()); };
            TransactionEditorDialog.prototype.getPropertyItems = function () {
                var columns = _super.prototype.getPropertyItems.call(this);
                var transactionType = SereneInventory.getTrasactionTypeFromUrl();
                var trasactionNumberCaption = SereneInventory.getTrasactionNumberCaption(transactionType);
                Q.first(columns, function (x) { return x.name == "TransactionNumber" /* TransactionNumber */; }).title = trasactionNumberCaption;
                return columns;
            };
            TransactionEditorDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], TransactionEditorDialog);
            return TransactionEditorDialog;
        }(_Ext.EditorDialogBase));
        Inventory.TransactionEditorDialog = TransactionEditorDialog;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
/// <reference path="../../../_Ext/_q/_q.ts" />
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionEditorGrid = /** @class */ (function (_super) {
            __extends(TransactionEditorGrid, _super);
            function TransactionEditorGrid(container) {
                return _super.call(this, container) || this;
            }
            TransactionEditorGrid.prototype.getColumnsKey = function () { return 'Inventory.Transaction'; };
            TransactionEditorGrid.prototype.getDialogType = function () { return Inventory.TransactionEditorDialog; };
            TransactionEditorGrid.prototype.getLocalTextPrefix = function () { return Inventory.TransactionRow.localTextPrefix; };
            TransactionEditorGrid.prototype.getDisplayName = function () { return SereneInventory.getTrasactionTypeName(SereneInventory.getTrasactionTypeFromUrl()); };
            TransactionEditorGrid.prototype.getItemName = function () { return this.getDisplayName(); };
            TransactionEditorGrid.prototype.getButtons = function () {
                //let buttons = super.getButtons();
                return [];
            };
            TransactionEditorGrid.prototype.getColumns = function () {
                var columns = _super.prototype.getColumns.call(this);
                var transactionType = SereneInventory.getTrasactionTypeFromUrl();
                var trasactionNumberCaption = SereneInventory.getTrasactionNumberCaption(transactionType);
                Q.first(columns, function (x) { return x.field == "TransactionNumber" /* TransactionNumber */; }).name = trasactionNumberCaption;
                return columns;
            };
            TransactionEditorGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], TransactionEditorGrid);
            return TransactionEditorGrid;
        }(_Ext.GridEditorBase));
        Inventory.TransactionEditorGrid = TransactionEditorGrid;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var PurchaseInvoiceDialog = /** @class */ (function (_super) {
            __extends(PurchaseInvoiceDialog, _super);
            function PurchaseInvoiceDialog() {
                var _this = _super.call(this) || this;
                _this.form = new Inventory.PurchaseInvoiceForm(_this.idPrefix);
                q.initDetailEditor(_this, _this.form.TransactionDetailRows);
                q.initDetailEditor(_this, _this.form.TransactionExpenseRows);
                _this.form.TransactionDetailRows.onItemsChanged = function () {
                    _this.calculateAmount();
                };
                _this.form.TransactionExpenseRows.onItemsChanged = function () {
                    _this.calculateAmount();
                };
                return _this;
            }
            PurchaseInvoiceDialog.prototype.getFormKey = function () { return Inventory.PurchaseInvoiceForm.formKey; };
            PurchaseInvoiceDialog.prototype.getIdProperty = function () { return Inventory.TransactionRow.idProperty; };
            PurchaseInvoiceDialog.prototype.getLocalTextPrefix = function () { return Inventory.TransactionRow.localTextPrefix; };
            PurchaseInvoiceDialog.prototype.getNameProperty = function () { return Inventory.TransactionRow.nameProperty; };
            PurchaseInvoiceDialog.prototype.getService = function () { return Inventory.TransactionService.baseUrl; };
            PurchaseInvoiceDialog.prototype.getEntityTitle = function () { return SereneInventory.getTrasactionTypeName(SereneInventory.TransactionType.PurchaseInvoice); };
            PurchaseInvoiceDialog.prototype.getSaveEntity = function () {
                var entity = _super.prototype.getSaveEntity.call(this);
                entity.TransactionType = SereneInventory.TransactionType.PurchaseInvoice;
                return entity;
            };
            PurchaseInvoiceDialog.prototype.afterLoadEntity = function () {
                _super.prototype.afterLoadEntity.call(this);
                // fill next number in new record mode
                if (this.isNew())
                    this.getNextNumber();
                this.calculateAmount();
            };
            PurchaseInvoiceDialog.prototype.calculateAmount = function () {
                var totalQuantity = 0;
                this.form.TransactionDetailRows.value.forEach(function (r) { return totalQuantity += r.Quantity; });
                var totalExpense = 0;
                this.form.TransactionExpenseRows.value.forEach(function (r) { return totalExpense += r.Amount; });
                this.form.ExpensePerPiece.value = totalExpense / totalQuantity;
            };
            PurchaseInvoiceDialog.prototype.getNextNumber = function () {
                var _this = this;
                var val = Q.trimToNull(this.form.TransactionNumber.value);
                if (!val || val.length <= 1) {
                    var prefix = (val || SereneInventory.getTrasactionNumberPrefix(SereneInventory.TransactionType.PurchaseInvoice)).toUpperCase();
                    Inventory.TransactionService.GetNextNumber({
                        Prefix: prefix,
                        Length: prefix.length + 5 // we want service to search for and return serials of 5 in length
                    }, function (response) {
                        _this.form.TransactionNumber.value = response.Serial;
                        // this is to mark numerical part after prefix
                        _this.form.TransactionNumber.element[0].setSelectionRange(prefix.length, response.Serial.length);
                    });
                }
            };
            PurchaseInvoiceDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], PurchaseInvoiceDialog);
            return PurchaseInvoiceDialog;
        }(_Ext.DialogBase));
        Inventory.PurchaseInvoiceDialog = PurchaseInvoiceDialog;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var PurchaseInvoiceGrid = /** @class */ (function (_super) {
            __extends(PurchaseInvoiceGrid, _super);
            function PurchaseInvoiceGrid(container) {
                return _super.call(this, container) || this;
            }
            PurchaseInvoiceGrid.prototype.getColumnsKey = function () { return 'Inventory.PurchaseInvoice'; };
            PurchaseInvoiceGrid.prototype.getDialogType = function () { return Inventory.PurchaseInvoiceDialog; };
            PurchaseInvoiceGrid.prototype.getIdProperty = function () { return Inventory.TransactionRow.idProperty; };
            PurchaseInvoiceGrid.prototype.getLocalTextPrefix = function () { return Inventory.TransactionRow.localTextPrefix; };
            PurchaseInvoiceGrid.prototype.getService = function () { return Inventory.TransactionService.baseUrl; };
            PurchaseInvoiceGrid.prototype.getDisplayName = function () { return SereneInventory.getTrasactionTypeName(SereneInventory.TransactionType.PurchaseInvoice); };
            PurchaseInvoiceGrid.prototype.getItemName = function () { return this.getDisplayName(); };
            PurchaseInvoiceGrid.prototype.getQuickFilters = function () {
                var _this = this;
                var filters = _super.prototype.getQuickFilters.call(this);
                filters.push({
                    type: Serenity.LookupEditor,
                    options: {
                        lookupKey: SereneInventory.Setup.ProductRow.lookupKey
                    },
                    field: 'ProductId',
                    title: 'Contains Product in Details',
                    handler: function (w) {
                        _this.view.params.ProductId = Q.toId(w.value);
                    },
                    cssClass: 'hidden-xs'
                });
                return filters;
            };
            PurchaseInvoiceGrid.prototype.onViewSubmit = function () {
                if (!_super.prototype.onViewSubmit.call(this)) {
                    return false;
                }
                var request = this.view.params;
                request.Criteria = Serenity.Criteria.and(request.Criteria, [["TransactionType" /* TransactionType */], '=', SereneInventory.TransactionType.PurchaseInvoice]);
                return true;
            };
            PurchaseInvoiceGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], PurchaseInvoiceGrid);
            return PurchaseInvoiceGrid;
        }(_Ext.GridBase));
        Inventory.PurchaseInvoiceGrid = PurchaseInvoiceGrid;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var SalesInvoiceDialog = /** @class */ (function (_super) {
            __extends(SalesInvoiceDialog, _super);
            function SalesInvoiceDialog() {
                var _this = _super.call(this) || this;
                _this.form = new Inventory.TransactionForm(_this.idPrefix);
                q.initDetailEditor(_this, _this.form.TransactionDetailRows);
                return _this;
            }
            SalesInvoiceDialog.prototype.getFormKey = function () { return Inventory.SalesInvoiceForm.formKey; };
            SalesInvoiceDialog.prototype.getIdProperty = function () { return Inventory.TransactionRow.idProperty; };
            SalesInvoiceDialog.prototype.getLocalTextPrefix = function () { return Inventory.TransactionRow.localTextPrefix; };
            SalesInvoiceDialog.prototype.getNameProperty = function () { return Inventory.TransactionRow.nameProperty; };
            SalesInvoiceDialog.prototype.getService = function () { return Inventory.TransactionService.baseUrl; };
            SalesInvoiceDialog.prototype.getEntityTitle = function () { return SereneInventory.getTrasactionTypeName(SereneInventory.TransactionType.SalesInvoice); };
            SalesInvoiceDialog.prototype.getToolbarButtons = function () {
                var _this = this;
                var buttons = _super.prototype.getToolbarButtons.call(this);
                buttons.push({
                    title: 'Print',
                    icon: 'fa fa-print',
                    cssClass: 'btn-custom',
                    onClick: function () {
                        SereneInventory.Common.ReportHelper.execute({ reportKey: 'Inventory.SalesInvoice', params: { ID: _this.entityId }, extension: 'html' });
                    }
                });
                return buttons;
            };
            SalesInvoiceDialog.prototype.getSaveEntity = function () {
                var entity = _super.prototype.getSaveEntity.call(this);
                entity.TransactionType = SereneInventory.TransactionType.SalesInvoice;
                return entity;
            };
            SalesInvoiceDialog.prototype.afterLoadEntity = function () {
                _super.prototype.afterLoadEntity.call(this);
                // fill next number in new record mode
                if (this.isNew())
                    this.getNextNumber();
            };
            SalesInvoiceDialog.prototype.getNextNumber = function () {
                var _this = this;
                var val = Q.trimToNull(this.form.TransactionNumber.value);
                if (!val || val.length <= 1) {
                    var prefix = (val || SereneInventory.getTrasactionNumberPrefix(SereneInventory.TransactionType.SalesInvoice)).toUpperCase();
                    Inventory.TransactionService.GetNextNumber({
                        Prefix: prefix,
                        Length: prefix.length + 5 // we want service to search for and return serials of 5 in length
                    }, function (response) {
                        _this.form.TransactionNumber.value = response.Serial;
                        // this is to mark numerical part after prefix
                        _this.form.TransactionNumber.element[0].setSelectionRange(prefix.length, response.Serial.length);
                    });
                }
            };
            SalesInvoiceDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], SalesInvoiceDialog);
            return SalesInvoiceDialog;
        }(_Ext.DialogBase));
        Inventory.SalesInvoiceDialog = SalesInvoiceDialog;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var SalesInvoiceGrid = /** @class */ (function (_super) {
            __extends(SalesInvoiceGrid, _super);
            function SalesInvoiceGrid(container) {
                return _super.call(this, container) || this;
            }
            SalesInvoiceGrid.prototype.getColumnsKey = function () { return 'Inventory.SalesInvoice'; };
            SalesInvoiceGrid.prototype.getDialogType = function () { return Inventory.SalesInvoiceDialog; };
            SalesInvoiceGrid.prototype.getIdProperty = function () { return Inventory.TransactionRow.idProperty; };
            SalesInvoiceGrid.prototype.getLocalTextPrefix = function () { return Inventory.TransactionRow.localTextPrefix; };
            SalesInvoiceGrid.prototype.getService = function () { return Inventory.TransactionService.baseUrl; };
            SalesInvoiceGrid.prototype.getDisplayName = function () { return SereneInventory.getTrasactionTypeName(SereneInventory.TransactionType.SalesInvoice); };
            SalesInvoiceGrid.prototype.getItemName = function () { return this.getDisplayName(); };
            SalesInvoiceGrid.prototype.getQuickFilters = function () {
                var _this = this;
                var filters = _super.prototype.getQuickFilters.call(this);
                filters.push({
                    type: Serenity.LookupEditor,
                    options: {
                        lookupKey: SereneInventory.Setup.ProductRow.lookupKey
                    },
                    field: 'ProductId',
                    title: 'Contains Product in Details',
                    handler: function (w) {
                        _this.view.params.ProductId = Q.toId(w.value);
                    },
                    cssClass: 'hidden-xs'
                });
                return filters;
            };
            SalesInvoiceGrid.prototype.onViewSubmit = function () {
                if (!_super.prototype.onViewSubmit.call(this)) {
                    return false;
                }
                var request = this.view.params;
                request.Criteria = Serenity.Criteria.and(request.Criteria, [["TransactionType" /* TransactionType */], '=', SereneInventory.TransactionType.SalesInvoice]);
                return true;
            };
            SalesInvoiceGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], SalesInvoiceGrid);
            return SalesInvoiceGrid;
        }(_Ext.GridBase));
        Inventory.SalesInvoiceGrid = SalesInvoiceGrid;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
/// <reference path="../../_Ext/_q/_q.ts" />
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionDetailEditorDialog = /** @class */ (function (_super) {
            __extends(TransactionDetailEditorDialog, _super);
            function TransactionDetailEditorDialog() {
                var _this = _super.call(this) || this;
                _this.form = new Inventory.TransactionDetailForm(_this.idPrefix);
                _this.form.Quantity.change(function (e) {
                    _this.calculateAmount();
                });
                _this.form.UnitPrice.change(function (e) {
                    _this.calculateAmount();
                });
                return _this;
            }
            TransactionDetailEditorDialog.prototype.getFormKey = function () { return Inventory.TransactionDetailForm.formKey; };
            TransactionDetailEditorDialog.prototype.getLocalTextPrefix = function () { return Inventory.TransactionDetailRow.localTextPrefix; };
            TransactionDetailEditorDialog.prototype.calculateAmount = function () {
                this.form.Amount.value = this.form.Quantity.value * this.form.UnitPrice.value;
            };
            TransactionDetailEditorDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], TransactionDetailEditorDialog);
            return TransactionDetailEditorDialog;
        }(_Ext.EditorDialogBase));
        Inventory.TransactionDetailEditorDialog = TransactionDetailEditorDialog;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
/// <reference path="../../_Ext/_q/_q.ts" />
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionDetailGridEditor = /** @class */ (function (_super) {
            __extends(TransactionDetailGridEditor, _super);
            function TransactionDetailGridEditor(container) {
                return _super.call(this, container) || this;
            }
            TransactionDetailGridEditor.prototype.getColumnsKey = function () { return 'Inventory.TransactionDetail'; };
            TransactionDetailGridEditor.prototype.getDialogType = function () { return Inventory.TransactionDetailEditorDialog; };
            TransactionDetailGridEditor.prototype.getLocalTextPrefix = function () { return Inventory.TransactionDetailRow.localTextPrefix; };
            TransactionDetailGridEditor.prototype.validateEntity = function (row, id) {
                row.ProductId = Q.toId(row.ProductId);
                var sameProduct = Q.tryFirst(this.view.getItems(), function (x) { return x.ProductId === row.ProductId; });
                if (sameProduct && this.id(sameProduct) !== id) {
                    Q.alert('This product is already in transaction details!');
                    return false;
                }
                return true;
            };
            TransactionDetailGridEditor = __decorate([
                Serenity.Decorators.registerClass()
            ], TransactionDetailGridEditor);
            return TransactionDetailGridEditor;
        }(_Ext.GridEditorBase));
        Inventory.TransactionDetailGridEditor = TransactionDetailGridEditor;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionExpenseDialog = /** @class */ (function (_super) {
            __extends(TransactionExpenseDialog, _super);
            function TransactionExpenseDialog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.form = new Inventory.TransactionExpenseForm(_this.idPrefix);
                return _this;
            }
            TransactionExpenseDialog.prototype.getFormKey = function () { return Inventory.TransactionExpenseForm.formKey; };
            TransactionExpenseDialog.prototype.getIdProperty = function () { return Inventory.TransactionExpenseRow.idProperty; };
            TransactionExpenseDialog.prototype.getLocalTextPrefix = function () { return Inventory.TransactionExpenseRow.localTextPrefix; };
            TransactionExpenseDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], TransactionExpenseDialog);
            return TransactionExpenseDialog;
        }(_Ext.EditorDialogBase));
        Inventory.TransactionExpenseDialog = TransactionExpenseDialog;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Inventory;
    (function (Inventory) {
        var TransactionExpenseGridEditor = /** @class */ (function (_super) {
            __extends(TransactionExpenseGridEditor, _super);
            function TransactionExpenseGridEditor(container) {
                return _super.call(this, container) || this;
            }
            TransactionExpenseGridEditor.prototype.getColumnsKey = function () { return 'Inventory.TransactionExpense'; };
            TransactionExpenseGridEditor.prototype.getDialogType = function () { return Inventory.TransactionExpenseDialog; };
            TransactionExpenseGridEditor.prototype.getLocalTextPrefix = function () { return Inventory.TransactionExpenseRow.localTextPrefix; };
            TransactionExpenseGridEditor = __decorate([
                Serenity.Decorators.registerClass()
            ], TransactionExpenseGridEditor);
            return TransactionExpenseGridEditor;
        }(_Ext.GridEditorBase));
        Inventory.TransactionExpenseGridEditor = TransactionExpenseGridEditor;
    })(Inventory = SereneInventory.Inventory || (SereneInventory.Inventory = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Membership;
    (function (Membership) {
        var ChangePasswordPanel = /** @class */ (function (_super) {
            __extends(ChangePasswordPanel, _super);
            function ChangePasswordPanel(container) {
                var _this = _super.call(this, container) || this;
                _this.form = new Membership.ChangePasswordForm(_this.idPrefix);
                _this.form.NewPassword.addValidationRule(_this.uniqueName, function (e) {
                    if (_this.form.w('ConfirmPassword', Serenity.PasswordEditor).value.length < 7) {
                        return Q.format(Q.text('Validation.MinRequiredPasswordLength'), 7);
                    }
                });
                _this.form.ConfirmPassword.addValidationRule(_this.uniqueName, function (e) {
                    if (_this.form.ConfirmPassword.value !== _this.form.NewPassword.value) {
                        return Q.text('Validation.PasswordConfirm');
                    }
                });
                _this.byId('SubmitButton').click(function (e) {
                    e.preventDefault();
                    if (!_this.validateForm()) {
                        return;
                    }
                    var request = _this.getSaveEntity();
                    Q.serviceCall({
                        url: Q.resolveUrl('~/Account/ChangePassword'),
                        request: request,
                        onSuccess: function (response) {
                            Q.information(Q.text('Forms.Membership.ChangePassword.Success'), function () {
                                window.location.href = Q.resolveUrl('~/');
                            });
                        }
                    });
                });
                return _this;
            }
            ChangePasswordPanel.prototype.getFormKey = function () { return Membership.ChangePasswordForm.formKey; };
            ChangePasswordPanel = __decorate([
                Serenity.Decorators.registerClass()
            ], ChangePasswordPanel);
            return ChangePasswordPanel;
        }(Serenity.PropertyPanel));
        Membership.ChangePasswordPanel = ChangePasswordPanel;
    })(Membership = SereneInventory.Membership || (SereneInventory.Membership = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Membership;
    (function (Membership) {
        var ForgotPasswordPanel = /** @class */ (function (_super) {
            __extends(ForgotPasswordPanel, _super);
            function ForgotPasswordPanel(container) {
                var _this = _super.call(this, container) || this;
                _this.form = new Membership.ForgotPasswordForm(_this.idPrefix);
                _this.byId('SubmitButton').click(function (e) {
                    e.preventDefault();
                    if (!_this.validateForm()) {
                        return;
                    }
                    var request = _this.getSaveEntity();
                    Q.serviceCall({
                        url: Q.resolveUrl('~/Account/ForgotPassword'),
                        request: request,
                        onSuccess: function (response) {
                            Q.information(Q.text('Forms.Membership.ForgotPassword.Success'), function () {
                                window.location.href = Q.resolveUrl('~/');
                            });
                        }
                    });
                });
                return _this;
            }
            ForgotPasswordPanel.prototype.getFormKey = function () { return Membership.ForgotPasswordForm.formKey; };
            ForgotPasswordPanel = __decorate([
                Serenity.Decorators.registerClass()
            ], ForgotPasswordPanel);
            return ForgotPasswordPanel;
        }(Serenity.PropertyPanel));
        Membership.ForgotPasswordPanel = ForgotPasswordPanel;
    })(Membership = SereneInventory.Membership || (SereneInventory.Membership = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Membership;
    (function (Membership) {
        var ResetPasswordPanel = /** @class */ (function (_super) {
            __extends(ResetPasswordPanel, _super);
            function ResetPasswordPanel(container) {
                var _this = _super.call(this, container) || this;
                _this.form = new Membership.ResetPasswordForm(_this.idPrefix);
                _this.form.NewPassword.addValidationRule(_this.uniqueName, function (e) {
                    if (_this.form.ConfirmPassword.value.length < 7) {
                        return Q.format(Q.text('Validation.MinRequiredPasswordLength'), 7);
                    }
                });
                _this.form.ConfirmPassword.addValidationRule(_this.uniqueName, function (e) {
                    if (_this.form.ConfirmPassword.value !== _this.form.NewPassword.value) {
                        return Q.text('Validation.PasswordConfirm');
                    }
                });
                _this.byId('SubmitButton').click(function (e) {
                    e.preventDefault();
                    if (!_this.validateForm()) {
                        return;
                    }
                    var request = _this.getSaveEntity();
                    request.Token = _this.byId('Token').val();
                    Q.serviceCall({
                        url: Q.resolveUrl('~/Account/ResetPassword'),
                        request: request,
                        onSuccess: function (response) {
                            Q.information(Q.text('Forms.Membership.ResetPassword.Success'), function () {
                                window.location.href = Q.resolveUrl('~/Account/Login');
                            });
                        }
                    });
                });
                return _this;
            }
            ResetPasswordPanel.prototype.getFormKey = function () { return Membership.ResetPasswordForm.formKey; };
            ResetPasswordPanel = __decorate([
                Serenity.Decorators.registerClass()
            ], ResetPasswordPanel);
            return ResetPasswordPanel;
        }(Serenity.PropertyPanel));
        Membership.ResetPasswordPanel = ResetPasswordPanel;
    })(Membership = SereneInventory.Membership || (SereneInventory.Membership = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Membership;
    (function (Membership) {
        var SignUpPanel = /** @class */ (function (_super) {
            __extends(SignUpPanel, _super);
            function SignUpPanel(container) {
                var _this = _super.call(this, container) || this;
                _this.form = new Membership.SignUpForm(_this.idPrefix);
                _this.form.ConfirmEmail.addValidationRule(_this.uniqueName, function (e) {
                    if (_this.form.ConfirmEmail.value !== _this.form.Email.value) {
                        return Q.text('Validation.EmailConfirm');
                    }
                });
                _this.form.ConfirmPassword.addValidationRule(_this.uniqueName, function (e) {
                    if (_this.form.ConfirmPassword.value !== _this.form.Password.value) {
                        return Q.text('Validation.PasswordConfirm');
                    }
                });
                _this.byId('SubmitButton').click(function (e) {
                    e.preventDefault();
                    if (!_this.validateForm()) {
                        return;
                    }
                    Q.serviceCall({
                        url: Q.resolveUrl('~/Account/SignUp'),
                        request: {
                            DisplayName: _this.form.DisplayName.value,
                            Email: _this.form.Email.value,
                            Password: _this.form.Password.value
                        },
                        onSuccess: function (response) {
                            Q.information(Q.text('Forms.Membership.SignUp.Success'), function () {
                                window.location.href = Q.resolveUrl('~/');
                            });
                        }
                    });
                });
                return _this;
            }
            SignUpPanel.prototype.getFormKey = function () { return Membership.SignUpForm.formKey; };
            SignUpPanel = __decorate([
                Serenity.Decorators.registerClass()
            ], SignUpPanel);
            return SignUpPanel;
        }(Serenity.PropertyPanel));
        Membership.SignUpPanel = SignUpPanel;
    })(Membership = SereneInventory.Membership || (SereneInventory.Membership = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var PartyDialog = /** @class */ (function (_super) {
            __extends(PartyDialog, _super);
            function PartyDialog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.form = new Setup.PartyForm(_this.idPrefix);
                return _this;
            }
            PartyDialog.prototype.getFormKey = function () { return Setup.PartyForm.formKey; };
            PartyDialog.prototype.getIdProperty = function () { return Setup.PartyRow.idProperty; };
            PartyDialog.prototype.getLocalTextPrefix = function () { return Setup.PartyRow.localTextPrefix; };
            PartyDialog.prototype.getNameProperty = function () { return Setup.PartyRow.nameProperty; };
            PartyDialog.prototype.getService = function () { return Setup.PartyService.baseUrl; };
            PartyDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], PartyDialog);
            return PartyDialog;
        }(_Ext.DialogBase));
        Setup.PartyDialog = PartyDialog;
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var PartyGrid = /** @class */ (function (_super) {
            __extends(PartyGrid, _super);
            function PartyGrid(container) {
                return _super.call(this, container) || this;
            }
            PartyGrid.prototype.getColumnsKey = function () { return 'Setup.Party'; };
            PartyGrid.prototype.getDialogType = function () { return Setup.PartyDialog; };
            PartyGrid.prototype.getIdProperty = function () { return Setup.PartyRow.idProperty; };
            PartyGrid.prototype.getLocalTextPrefix = function () { return Setup.PartyRow.localTextPrefix; };
            PartyGrid.prototype.getService = function () { return Setup.PartyService.baseUrl; };
            PartyGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], PartyGrid);
            return PartyGrid;
        }(_Ext.GridBase));
        Setup.PartyGrid = PartyGrid;
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var ProductDialog = /** @class */ (function (_super) {
            __extends(ProductDialog, _super);
            function ProductDialog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.form = new Setup.ProductForm(_this.idPrefix);
                return _this;
            }
            ProductDialog.prototype.getFormKey = function () { return Setup.ProductForm.formKey; };
            ProductDialog.prototype.getIdProperty = function () { return Setup.ProductRow.idProperty; };
            ProductDialog.prototype.getLocalTextPrefix = function () { return Setup.ProductRow.localTextPrefix; };
            ProductDialog.prototype.getNameProperty = function () { return Setup.ProductRow.nameProperty; };
            ProductDialog.prototype.getService = function () { return Setup.ProductService.baseUrl; };
            ProductDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], ProductDialog);
            return ProductDialog;
        }(_Ext.DialogBase));
        Setup.ProductDialog = ProductDialog;
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var ProductGrid = /** @class */ (function (_super) {
            __extends(ProductGrid, _super);
            function ProductGrid(container) {
                return _super.call(this, container) || this;
            }
            ProductGrid.prototype.getColumnsKey = function () { return 'Setup.Product'; };
            ProductGrid.prototype.getDialogType = function () { return Setup.ProductDialog; };
            ProductGrid.prototype.getIdProperty = function () { return Setup.ProductRow.idProperty; };
            ProductGrid.prototype.getLocalTextPrefix = function () { return Setup.ProductRow.localTextPrefix; };
            ProductGrid.prototype.getService = function () { return Setup.ProductService.baseUrl; };
            ProductGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], ProductGrid);
            return ProductGrid;
        }(_Ext.GridBase));
        Setup.ProductGrid = ProductGrid;
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var ProductCategoryDialog = /** @class */ (function (_super) {
            __extends(ProductCategoryDialog, _super);
            function ProductCategoryDialog() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.form = new Setup.ProductCategoryForm(_this.idPrefix);
                return _this;
            }
            ProductCategoryDialog.prototype.getFormKey = function () { return Setup.ProductCategoryForm.formKey; };
            ProductCategoryDialog.prototype.getIdProperty = function () { return Setup.ProductCategoryRow.idProperty; };
            ProductCategoryDialog.prototype.getLocalTextPrefix = function () { return Setup.ProductCategoryRow.localTextPrefix; };
            ProductCategoryDialog.prototype.getNameProperty = function () { return Setup.ProductCategoryRow.nameProperty; };
            ProductCategoryDialog.prototype.getService = function () { return Setup.ProductCategoryService.baseUrl; };
            ProductCategoryDialog = __decorate([
                Serenity.Decorators.registerClass()
            ], ProductCategoryDialog);
            return ProductCategoryDialog;
        }(_Ext.DialogBase));
        Setup.ProductCategoryDialog = ProductCategoryDialog;
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var SereneInventory;
(function (SereneInventory) {
    var Setup;
    (function (Setup) {
        var ProductCategoryGrid = /** @class */ (function (_super) {
            __extends(ProductCategoryGrid, _super);
            function ProductCategoryGrid(container) {
                return _super.call(this, container) || this;
            }
            ProductCategoryGrid.prototype.getColumnsKey = function () { return 'Setup.ProductCategory'; };
            ProductCategoryGrid.prototype.getDialogType = function () { return Setup.ProductCategoryDialog; };
            ProductCategoryGrid.prototype.getIdProperty = function () { return Setup.ProductCategoryRow.idProperty; };
            ProductCategoryGrid.prototype.getLocalTextPrefix = function () { return Setup.ProductCategoryRow.localTextPrefix; };
            ProductCategoryGrid.prototype.getService = function () { return Setup.ProductCategoryService.baseUrl; };
            ProductCategoryGrid = __decorate([
                Serenity.Decorators.registerClass()
            ], ProductCategoryGrid);
            return ProductCategoryGrid;
        }(_Ext.GridBase));
        Setup.ProductCategoryGrid = ProductCategoryGrid;
    })(Setup = SereneInventory.Setup || (SereneInventory.Setup = {}));
})(SereneInventory || (SereneInventory = {}));
var _Ext;
(function (_Ext) {
    var AuditLogActionTypeFormatter = /** @class */ (function () {
        function AuditLogActionTypeFormatter() {
        }
        AuditLogActionTypeFormatter_1 = AuditLogActionTypeFormatter;
        AuditLogActionTypeFormatter.format = function (ctx) {
            var item = ctx.item;
            var klass = '';
            if (item.ActionType == _Ext.AuditActionType.Update) {
                klass = 'warning';
            }
            else if (item.ActionType == _Ext.AuditActionType.Delete) {
                klass = 'danger';
            }
            else {
                klass = 'default';
            }
            return "<span class=\"label label-" + klass + "\">" + _Ext.AuditActionType[item.ActionType] + "</span>";
        };
        AuditLogActionTypeFormatter.prototype.format = function (ctx) {
            return AuditLogActionTypeFormatter_1.format(ctx);
        };
        var AuditLogActionTypeFormatter_1;
        AuditLogActionTypeFormatter = AuditLogActionTypeFormatter_1 = __decorate([
            Serenity.Decorators.registerFormatter([Serenity.ISlickFormatter])
        ], AuditLogActionTypeFormatter);
        return AuditLogActionTypeFormatter;
    }());
    _Ext.AuditLogActionTypeFormatter = AuditLogActionTypeFormatter;
})(_Ext || (_Ext = {}));
/// <reference path="../Bases/DialogBase.ts" />
var _Ext;
(function (_Ext) {
    var AuditLogDialog = /** @class */ (function (_super) {
        __extends(AuditLogDialog, _super);
        function AuditLogDialog() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new _Ext.AuditLogForm(_this.idPrefix);
            return _this;
        }
        AuditLogDialog.prototype.getFormKey = function () { return _Ext.AuditLogForm.formKey; };
        AuditLogDialog.prototype.getIdProperty = function () { return _Ext.AuditLogRow.idProperty; };
        AuditLogDialog.prototype.getLocalTextPrefix = function () { return _Ext.AuditLogRow.localTextPrefix; };
        AuditLogDialog.prototype.getNameProperty = function () { return _Ext.AuditLogRow.nameProperty; };
        AuditLogDialog.prototype.getService = function () { return _Ext.AuditLogService.baseUrl; };
        AuditLogDialog.prototype.afterLoadEntity = function () {
            _super.prototype.afterLoadEntity.call(this);
            usingJsonDiffPatch();
            //showing diff visually
            var left = JSON.parse(this.entity.OldEntity);
            if (left) {
                if (left.PlantJson) {
                    left.PlantInfo = JSON.parse(left.PlantJson);
                    delete (left.PlantJson);
                }
                delete (left.Id);
                delete (left.IDate);
                delete (left.IUser);
                delete (left.EDate);
                delete (left.EUser);
            }
            var right = JSON.parse(this.entity.NewEntity);
            if (right) {
                if (right.PlantJson) {
                    right.PlantInfo = JSON.parse(right.PlantJson);
                    delete (right.PlantJson);
                }
            }
            var delta = jsondiffpatch.diff(left, right);
            // beautiful html diff
            this.form.Differences.value = jsondiffpatch.formatters.html.format(delta);
        };
        AuditLogDialog = __decorate([
            Serenity.Decorators.registerClass(),
            Serenity.Decorators.responsive()
        ], AuditLogDialog);
        return AuditLogDialog;
    }(_Ext.DialogBase));
    _Ext.AuditLogDialog = AuditLogDialog;
})(_Ext || (_Ext = {}));
/// <reference path="../Bases/GridBase.ts" />
var _Ext;
(function (_Ext) {
    var AuditLogGrid = /** @class */ (function (_super) {
        __extends(AuditLogGrid, _super);
        function AuditLogGrid(container) {
            return _super.call(this, container) || this;
        }
        AuditLogGrid.prototype.getColumnsKey = function () { return '_Ext.AuditLog'; };
        AuditLogGrid.prototype.getDialogType = function () { return _Ext.AuditLogDialog; };
        AuditLogGrid.prototype.getIdProperty = function () { return _Ext.AuditLogRow.idProperty; };
        AuditLogGrid.prototype.getLocalTextPrefix = function () { return _Ext.AuditLogRow.localTextPrefix; };
        AuditLogGrid.prototype.getService = function () { return _Ext.AuditLogService.baseUrl; };
        AuditLogGrid.prototype.getButtons = function () {
            var buttons = _super.prototype.getButtons.call(this);
            buttons.splice(0, 1);
            return buttons;
        };
        AuditLogGrid = __decorate([
            Serenity.Decorators.registerClass()
        ], AuditLogGrid);
        return AuditLogGrid;
    }(_Ext.GridBase));
    _Ext.AuditLogGrid = AuditLogGrid;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var AuditLogViewer = /** @class */ (function () {
        function AuditLogViewer(el, entityVersions) {
            this.el = '.content-wrapper';
            this.data = {
                entityVersions: []
            };
            this.mounted = function () {
            };
            this.computed = {
                test: function () {
                    return 'test computed';
                }
            };
            this.filters = {
                filterByYardId: function () {
                    return [];
                }
            };
            this.methods = {
                showDiff: function (versionInfo) {
                    //showing diff visually
                    var left = versionInfo.OldEntity;
                    var right = versionInfo.NewEntity;
                    var delta = jsondiffpatch.diff(left, right);
                    // beautiful html diff
                    document.getElementById('visualizeDiff').innerHTML = jsondiffpatch.formatters.html.format(delta, left);
                },
                getDiff: function (versionInfo) {
                    //showing diff visually
                    var left = versionInfo.OldEntity;
                    var right = versionInfo.NewEntity;
                    var delta = jsondiffpatch.diff(left, right);
                    // beautiful html diff
                    return jsondiffpatch.formatters.html.format(delta);
                    //var delta = jsondiffpatch.diff(left, right);
                    //// left is optional, if specified unchanged values will be visible too
                    //document.getElementBy('the-diff').innerHTML = jsondiffpatch.formatters.html.format(delta, left);
                    //// Also you can dinamically show/hide unchanged values
                    //jsondiffpatch.formatters.html.showUnchanged();
                    //jsondiffpatch.formatters.html.hideUnchanged();
                    //// these will also adjust array move arrows (SVG), which is useful if something alters the html layout
                }
            };
            this.el = el || this.el;
            this.data.entityVersions = entityVersions;
        }
        AuditLogViewer.prototype.destroyed = function () {
        };
        return AuditLogViewer;
    }());
    _Ext.AuditLogViewer = AuditLogViewer;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var AuditLogViewerDialog = /** @class */ (function (_super) {
        __extends(AuditLogViewerDialog, _super);
        function AuditLogViewerDialog(request) {
            var _this = _super.call(this) || this;
            _this.request = request;
            _this.dialogTitle = 'Audit Log Viewer';
            _this.onDialogOpen = function () {
                _Ext.AuditLogViewerService.List(_this.request, function (response) {
                    response.EntityVersions.forEach(function (e) {
                        delete (e.Id);
                        e.OldEntity = JSON.parse(e.OldEntity);
                        e.NewEntity = JSON.parse(e.NewEntity);
                        delete (e.OldEntity.Id);
                        delete (e.OldEntity.IDate);
                        delete (e.OldEntity.IUser);
                        delete (e.OldEntity.EDate);
                        delete (e.OldEntity.EUser);
                        e.ActionType = _Ext.AuditActionType[e.ActionType];
                        e.isShowed = false;
                    });
                    new Vue(new _Ext.AuditLogViewer('#' + _this.idPrefix + 'dialogContent', response.EntityVersions));
                });
            };
            return _this;
        }
        AuditLogViewerDialog.prototype.getTemplateName = function () {
            usingVuejs();
            usingJsonDiffPatch();
            return '_Ext.AuditLogViewer';
        };
        AuditLogViewerDialog = __decorate([
            Serenity.Decorators.registerClass(),
            Serenity.Decorators.maximizable()
        ], AuditLogViewerDialog);
        return AuditLogViewerDialog;
    }(Serenity.TemplatedDialog));
    _Ext.AuditLogViewerDialog = AuditLogViewerDialog;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var DialogSnippets = /** @class */ (function (_super) {
        __extends(DialogSnippets, _super);
        function DialogSnippets() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new _Ext.AuditLogForm(_this.idPrefix);
            return _this;
            //dialogClose(): void;
            //set_dialogTitle(value: string): void;
        }
        DialogSnippets.prototype.getFormKey = function () { return _Ext.AuditLogForm.formKey; };
        DialogSnippets.prototype.getIdProperty = function () { return _Ext.AuditLogRow.idProperty; };
        DialogSnippets.prototype.getLocalTextPrefix = function () { return _Ext.AuditLogRow.localTextPrefix; };
        DialogSnippets.prototype.getNameProperty = function () { return _Ext.AuditLogRow.nameProperty; };
        DialogSnippets.prototype.getService = function () { return _Ext.AuditLogService.baseUrl; };
        DialogSnippets.prototype.addCssClass = function () { _super.prototype.addCssClass.call(this); };
        DialogSnippets.prototype.getTemplate = function () { return _super.prototype.getTemplate.call(this); };
        DialogSnippets.prototype.getTemplateName = function () { return _super.prototype.getTemplateName.call(this); };
        DialogSnippets.prototype.getFallbackTemplate = function () { return _super.prototype.getFallbackTemplate.call(this); };
        DialogSnippets.prototype.initValidator = function () { _super.prototype.initValidator.call(this); };
        DialogSnippets.prototype.getValidatorOptions = function () { return _super.prototype.getValidatorOptions.call(this); };
        DialogSnippets.prototype.initTabs = function () { _super.prototype.initTabs.call(this); };
        DialogSnippets.prototype.initToolbar = function () { _super.prototype.initToolbar.call(this); };
        DialogSnippets.prototype.getToolbarButtons = function () { return _super.prototype.getToolbarButtons.call(this); };
        DialogSnippets.prototype.initPropertyGrid = function () { _super.prototype.initPropertyGrid.call(this); };
        DialogSnippets.prototype.initPropertyGridAsync = function () { return _super.prototype.initPropertyGridAsync.call(this); };
        DialogSnippets.prototype.getPropertyGridOptions = function () { return _super.prototype.getPropertyGridOptions.call(this); };
        DialogSnippets.prototype.getPropertyGridOptionsAsync = function () { return _super.prototype.getPropertyGridOptionsAsync.call(this); };
        DialogSnippets.prototype.initLocalizationGrid = function () { _super.prototype.initLocalizationGrid.call(this); };
        DialogSnippets.prototype.initLocalizationGridAsync = function () { return _super.prototype.initLocalizationGridAsync.call(this); };
        DialogSnippets.prototype.initLocalizationGridCommon = function (pgOptions) { _super.prototype.initLocalizationGridCommon.call(this, pgOptions); };
        DialogSnippets.prototype.load = function (entityOrId, done, fail) { _super.prototype.load.call(this, entityOrId, done, fail); };
        DialogSnippets.prototype.loadResponse = function (data) { _super.prototype.loadResponse.call(this, data); };
        DialogSnippets.prototype.onLoadingData = function (data) { _super.prototype.onLoadingData.call(this, data); };
        DialogSnippets.prototype.beforeLoadEntity = function (entity) { _super.prototype.beforeLoadEntity.call(this, entity); };
        DialogSnippets.prototype.loadEntity = function (entity) { _super.prototype.loadEntity.call(this, entity); };
        DialogSnippets.prototype.set_entityId = function (value) { _super.prototype.set_entityId.call(this, value); };
        DialogSnippets.prototype.set_entity = function (entity) { _super.prototype.set_entity.call(this, entity); };
        DialogSnippets.prototype.isEditMode = function () { return _super.prototype.isEditMode.call(this); };
        DialogSnippets.prototype.get_entityId = function () { return _super.prototype.get_entityId.call(this); };
        DialogSnippets.prototype.get_entity = function () { return _super.prototype.get_entity.call(this); };
        DialogSnippets.prototype.afterLoadEntity = function () { _super.prototype.afterLoadEntity.call(this); };
        DialogSnippets.prototype.updateInterface = function () { _super.prototype.updateInterface.call(this); };
        DialogSnippets.prototype.isDeleted = function () { return _super.prototype.isDeleted.call(this); };
        DialogSnippets.prototype.isLocalizationMode = function () { return _super.prototype.isLocalizationMode.call(this); };
        DialogSnippets.prototype.isNew = function () { return _super.prototype.isNew.call(this); };
        DialogSnippets.prototype.updateTitle = function () { _super.prototype.updateTitle.call(this); };
        DialogSnippets.prototype.getEntityTitle = function () { return _super.prototype.getEntityTitle.call(this); };
        DialogSnippets.prototype.getEntitySingular = function () { return _super.prototype.getEntitySingular.call(this); };
        DialogSnippets.prototype.getSaveEntity = function () { return _super.prototype.getSaveEntity.call(this); };
        DialogSnippets.prototype.initDialog = function () { _super.prototype.initDialog.call(this); };
        DialogSnippets.prototype.getDialogOptions = function () { return _super.prototype.getDialogOptions.call(this); };
        DialogSnippets.prototype.getDialogTitle = function () { return _super.prototype.getDialogTitle.call(this); };
        DialogSnippets.prototype.handleResponsive = function () { _super.prototype.handleResponsive.call(this); };
        DialogSnippets.prototype.onDialogOpen = function () { _super.prototype.onDialogOpen.call(this); };
        DialogSnippets.prototype.arrange = function () { _super.prototype.arrange.call(this); };
        //save cycle
        DialogSnippets.prototype.save = function (callback) { return _super.prototype.save.call(this, callback); };
        DialogSnippets.prototype.validateBeforeSave = function () { return _super.prototype.validateBeforeSave.call(this); };
        DialogSnippets.prototype.save_submitHandler = function (callback) { _super.prototype.save_submitHandler.call(this, callback); };
        DialogSnippets.prototype.getSaveOptions = function (callback) { return _super.prototype.getSaveOptions.call(this, callback); };
        //isEditMode
        //get_entityId
        //isCloneMode
        DialogSnippets.prototype.getSaveRequest = function () { return _super.prototype.getSaveRequest.call(this); };
        //protected getSaveEntity(): AuditLogRow { return super.getSaveEntity(); }
        DialogSnippets.prototype.saveHandler = function (options, callback) { _super.prototype.saveHandler.call(this, options, callback); };
        DialogSnippets.prototype.onSaveSuccess = function (response) { _super.prototype.onSaveSuccess.call(this, response); };
        DialogSnippets.prototype.loadById = function (id, callback, fail) { _super.prototype.loadById.call(this, id, callback); };
        DialogSnippets.prototype.getLoadByIdRequest = function (id) { return _super.prototype.getLoadByIdRequest.call(this, id); };
        DialogSnippets.prototype.getLoadByIdOptions = function (id, callback) { return _super.prototype.getLoadByIdOptions.call(this, id, callback); };
        DialogSnippets.prototype.loadByIdHandler = function (options, callback, fail) { _super.prototype.loadByIdHandler.call(this, options, callback, fail); };
        DialogSnippets.prototype.showSaveSuccessMessage = function (response) { _super.prototype.showSaveSuccessMessage.call(this, response); };
        //loadResponse(data: any): void { super.loadResponse(data); }
        DialogSnippets.prototype.initializeAsync = function () { return _super.prototype.initializeAsync.call(this); };
        DialogSnippets.prototype.getEntityNameFieldValue = function () { return _super.prototype.getEntityNameFieldValue.call(this); };
        DialogSnippets.prototype.isCloneMode = function () { return _super.prototype.isCloneMode.call(this); };
        DialogSnippets.prototype.isNewOrDeleted = function () { return _super.prototype.isNewOrDeleted.call(this); };
        DialogSnippets.prototype.getDeleteOptions = function (callback) { return _super.prototype.getDeleteOptions.call(this, callback); };
        DialogSnippets.prototype.deleteHandler = function (options, callback) { _super.prototype.deleteHandler.call(this, options, callback); };
        DialogSnippets.prototype.doDelete = function (callback) { _super.prototype.doDelete.call(this, callback); };
        DialogSnippets.prototype.onDeleteSuccess = function (response) { _super.prototype.onDeleteSuccess.call(this, response); };
        //protected attrs<TAttr>(attrType: {
        //    new (...args: any[]): TAttr;
        //}): TAttr[];
        DialogSnippets.prototype.getEntityType = function () { return _super.prototype.getEntityType.call(this); };
        //protected getFormKey(): string { return super.getFormKey();}
        DialogSnippets.prototype.getLocalTextDbPrefix = function () { return _super.prototype.getLocalTextDbPrefix.call(this); };
        //protected getLocalTextPrefix(): string { return super.getLocalTextPrefix();}
        //protected getNameProperty(): string { return super.getNameProperty();}
        //protected getIdProperty(): string { return super.getIdProperty();}
        DialogSnippets.prototype.getIsActiveProperty = function () { return _super.prototype.getIsActiveProperty.call(this); };
        DialogSnippets.prototype.getIsDeletedProperty = function () { return _super.prototype.getIsDeletedProperty.call(this); };
        //protected getService(): string { return super.getService();}
        DialogSnippets.prototype.loadNewAndOpenDialog = function (asPanel) { _super.prototype.loadNewAndOpenDialog.call(this, asPanel); };
        DialogSnippets.prototype.loadEntityAndOpenDialog = function (entity, asPanel) { _super.prototype.loadNewAndOpenDialog.call(this, asPanel); };
        DialogSnippets.prototype.loadByIdAndOpenDialog = function (entityId, asPanel) { _super.prototype.loadByIdAndOpenDialog.call(this, entityId, asPanel); };
        DialogSnippets.prototype.reloadById = function () { _super.prototype.reloadById.call(this); };
        DialogSnippets.prototype.isLocalizationModeAndChanged = function () { return _super.prototype.isLocalizationModeAndChanged.call(this); };
        DialogSnippets.prototype.localizationButtonClick = function () { _super.prototype.localizationButtonClick.call(this); };
        DialogSnippets.prototype.getLanguages = function () { return _super.prototype.getLanguages.call(this); };
        DialogSnippets.prototype.loadLocalization = function () { _super.prototype.loadLocalization.call(this); };
        DialogSnippets.prototype.setLocalizationGridCurrentValues = function () { _super.prototype.setLocalizationGridCurrentValues.call(this); };
        DialogSnippets.prototype.getLocalizationGridValue = function () { return _super.prototype.getLocalizationGridValue.call(this); };
        DialogSnippets.prototype.getPendingLocalizations = function () { return _super.prototype.getPendingLocalizations.call(this); };
        DialogSnippets.prototype.getPropertyItems = function () { return _super.prototype.getPropertyItems.call(this); };
        DialogSnippets.prototype.getPropertyItemsAsync = function () { return _super.prototype.getPropertyItemsAsync.call(this); };
        DialogSnippets.prototype.getCloningEntity = function () { return _super.prototype.getCloningEntity.call(this); };
        DialogSnippets.prototype.getUndeleteOptions = function (callback) { return _super.prototype.getUndeleteOptions.call(this, callback); };
        DialogSnippets.prototype.undeleteHandler = function (options, callback) { _super.prototype.undeleteHandler.call(this, options, callback); };
        DialogSnippets.prototype.undelete = function (callback) { _super.prototype.undelete.call(this, callback); };
        //destroy(): void;
        //protected initToolbar(): void { super.initToolbar();}
        //protected getToolbarButtons(): Serenity.ToolButton[] { return super.getToolbarButtons();}
        DialogSnippets.prototype.resetValidation = function () { _super.prototype.resetValidation.call(this); };
        DialogSnippets.prototype.validateForm = function () { return _super.prototype.validateForm.call(this); };
        //dialogOpen(asPanel?: boolean): void;
        //static openPanel(element: JQuery, uniqueName: string): void;
        //static closePanel(element: JQuery, e?: JQueryEventObject): void;
        DialogSnippets.prototype.onDialogClose = function () { _super.prototype.onDialogClose.call(this); };
        DialogSnippets.prototype.destroy = function () { _super.prototype.destroy.call(this); };
        return DialogSnippets;
    }(_Ext.DialogBase));
    _Ext.DialogSnippets = DialogSnippets;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var DialogWithAllOverridableMethods = /** @class */ (function (_super) {
        __extends(DialogWithAllOverridableMethods, _super);
        function DialogWithAllOverridableMethods() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.form = new _Ext.AuditLogForm(_this.idPrefix);
            return _this;
            //dialogClose(): void;
            //set_dialogTitle(value: string): void;
        }
        DialogWithAllOverridableMethods.prototype.getFormKey = function () { return _Ext.AuditLogForm.formKey; };
        DialogWithAllOverridableMethods.prototype.getIdProperty = function () { return _Ext.AuditLogRow.idProperty; };
        DialogWithAllOverridableMethods.prototype.getLocalTextPrefix = function () { return _Ext.AuditLogRow.localTextPrefix; };
        DialogWithAllOverridableMethods.prototype.getNameProperty = function () { return _Ext.AuditLogRow.nameProperty; };
        DialogWithAllOverridableMethods.prototype.getService = function () { return _Ext.AuditLogService.baseUrl; };
        DialogWithAllOverridableMethods.prototype.addCssClass = function () { console.log('addCssClass'); _super.prototype.addCssClass.call(this); };
        DialogWithAllOverridableMethods.prototype.getTemplate = function () { console.log('getTemplate'); return _super.prototype.getTemplate.call(this); };
        DialogWithAllOverridableMethods.prototype.getTemplateName = function () { console.log('getTemplateName'); return _super.prototype.getTemplateName.call(this); };
        DialogWithAllOverridableMethods.prototype.getFallbackTemplate = function () { console.log('getFallbackTemplate'); return _super.prototype.getFallbackTemplate.call(this); };
        DialogWithAllOverridableMethods.prototype.initValidator = function () { console.log('initValidator'); _super.prototype.initValidator.call(this); };
        DialogWithAllOverridableMethods.prototype.getValidatorOptions = function () { console.log('getValidatorOptions'); return _super.prototype.getValidatorOptions.call(this); };
        DialogWithAllOverridableMethods.prototype.initTabs = function () { console.log('initTabs'); _super.prototype.initTabs.call(this); };
        DialogWithAllOverridableMethods.prototype.initToolbar = function () { console.log('initToolbar'); _super.prototype.initToolbar.call(this); };
        DialogWithAllOverridableMethods.prototype.getToolbarButtons = function () { console.log('getToolbarButtons'); return _super.prototype.getToolbarButtons.call(this); };
        DialogWithAllOverridableMethods.prototype.initPropertyGrid = function () { console.log('initPropertyGrid'); _super.prototype.initPropertyGrid.call(this); };
        DialogWithAllOverridableMethods.prototype.initPropertyGridAsync = function () { console.log('initPropertyGridAsync'); return _super.prototype.initPropertyGridAsync.call(this); };
        DialogWithAllOverridableMethods.prototype.getPropertyGridOptions = function () { console.log('getPropertyGridOptions'); return _super.prototype.getPropertyGridOptions.call(this); };
        DialogWithAllOverridableMethods.prototype.getPropertyGridOptionsAsync = function () { console.log('getPropertyGridOptionsAsync'); return _super.prototype.getPropertyGridOptionsAsync.call(this); };
        DialogWithAllOverridableMethods.prototype.initLocalizationGrid = function () { console.log('initLocalizationGrid'); _super.prototype.initLocalizationGrid.call(this); };
        DialogWithAllOverridableMethods.prototype.initLocalizationGridAsync = function () { console.log('initLocalizationGridAsync'); return _super.prototype.initLocalizationGridAsync.call(this); };
        DialogWithAllOverridableMethods.prototype.initLocalizationGridCommon = function (pgOptions) { console.log('initLocalizationGridCommon(pgOptions: PropertyGridOptions'); _super.prototype.initLocalizationGridCommon.call(this, pgOptions); };
        DialogWithAllOverridableMethods.prototype.load = function (entityOrId, done, fail) { console.log('load'); _super.prototype.load.call(this, entityOrId, done, fail); };
        DialogWithAllOverridableMethods.prototype.loadResponse = function (data) { console.log('loadResponse(data: any'); _super.prototype.loadResponse.call(this, data); };
        DialogWithAllOverridableMethods.prototype.onLoadingData = function (data) { console.log('onLoadingData(data: RetrieveResponse<AuditLogRow>'); _super.prototype.onLoadingData.call(this, data); };
        DialogWithAllOverridableMethods.prototype.beforeLoadEntity = function (entity) { console.log('beforeLoadEntity(entity: AuditLogRow'); _super.prototype.beforeLoadEntity.call(this, entity); };
        DialogWithAllOverridableMethods.prototype.loadEntity = function (entity) { console.log('loadEntity(entity: AuditLogRow'); _super.prototype.loadEntity.call(this, entity); };
        DialogWithAllOverridableMethods.prototype.set_entityId = function (value) { console.log('set_entityId(value: any'); _super.prototype.set_entityId.call(this, value); };
        DialogWithAllOverridableMethods.prototype.set_entity = function (entity) { console.log('set_entity(entity: any'); _super.prototype.set_entity.call(this, entity); };
        DialogWithAllOverridableMethods.prototype.isEditMode = function () { console.log('isEditMode'); return _super.prototype.isEditMode.call(this); };
        DialogWithAllOverridableMethods.prototype.get_entityId = function () { console.log('get_entityId'); return _super.prototype.get_entityId.call(this); };
        DialogWithAllOverridableMethods.prototype.get_entity = function () { console.log('get_entity'); return _super.prototype.get_entity.call(this); };
        DialogWithAllOverridableMethods.prototype.afterLoadEntity = function () { console.log('afterLoadEntity'); _super.prototype.afterLoadEntity.call(this); };
        DialogWithAllOverridableMethods.prototype.updateInterface = function () { console.log('updateInterface'); _super.prototype.updateInterface.call(this); };
        DialogWithAllOverridableMethods.prototype.isDeleted = function () { console.log('isDeleted'); return _super.prototype.isDeleted.call(this); };
        DialogWithAllOverridableMethods.prototype.isLocalizationMode = function () { console.log('isLocalizationMode'); return _super.prototype.isLocalizationMode.call(this); };
        DialogWithAllOverridableMethods.prototype.isNew = function () { console.log('isNew'); return _super.prototype.isNew.call(this); };
        DialogWithAllOverridableMethods.prototype.updateTitle = function () { console.log('updateTitle'); _super.prototype.updateTitle.call(this); };
        DialogWithAllOverridableMethods.prototype.getEntityTitle = function () { console.log('getEntityTitle'); return _super.prototype.getEntityTitle.call(this); };
        DialogWithAllOverridableMethods.prototype.getEntitySingular = function () { console.log('getEntitySingular'); return _super.prototype.getEntitySingular.call(this); };
        DialogWithAllOverridableMethods.prototype.getSaveEntity = function () { console.log('getSaveEntity'); return _super.prototype.getSaveEntity.call(this); };
        DialogWithAllOverridableMethods.prototype.initDialog = function () { console.log('initDialog'); _super.prototype.initDialog.call(this); };
        DialogWithAllOverridableMethods.prototype.getDialogOptions = function () { console.log('getDialogOptions'); return _super.prototype.getDialogOptions.call(this); };
        DialogWithAllOverridableMethods.prototype.getDialogTitle = function () { console.log('getDialogTitle'); return _super.prototype.getDialogTitle.call(this); };
        DialogWithAllOverridableMethods.prototype.handleResponsive = function () { console.log('handleResponsive'); _super.prototype.handleResponsive.call(this); };
        DialogWithAllOverridableMethods.prototype.onDialogOpen = function () { console.log('onDialogOpen'); _super.prototype.onDialogOpen.call(this); };
        DialogWithAllOverridableMethods.prototype.arrange = function () { console.log('arrange'); _super.prototype.arrange.call(this); };
        //save cycle
        DialogWithAllOverridableMethods.prototype.save = function (callback) { console.log('save(callback?: (response: SaveResponse) => void'); return _super.prototype.save.call(this, callback); };
        DialogWithAllOverridableMethods.prototype.validateBeforeSave = function () { console.log('validateBeforeSave'); return _super.prototype.validateBeforeSave.call(this); };
        DialogWithAllOverridableMethods.prototype.save_submitHandler = function (callback) { console.log('save_submitHandler(callback: (response: SaveResponse) => void'); _super.prototype.save_submitHandler.call(this, callback); };
        DialogWithAllOverridableMethods.prototype.getSaveOptions = function (callback) { console.log('getSaveOptions(callback: (response: SaveResponse) => void'); return _super.prototype.getSaveOptions.call(this, callback); };
        //isEditMode
        //get_entityId
        //isCloneMode
        DialogWithAllOverridableMethods.prototype.getSaveRequest = function () { console.log('getSaveRequest'); return _super.prototype.getSaveRequest.call(this); };
        //protected getSaveEntity(): AuditLogRow { console.log('getSaveEntity'); return super.getSaveEntity(); }
        DialogWithAllOverridableMethods.prototype.saveHandler = function (options, callback) { console.log('saveHandler(options: ServiceOptions<SaveResponse>, callback: (response: SaveResponse) => void'); _super.prototype.saveHandler.call(this, options, callback); };
        DialogWithAllOverridableMethods.prototype.onSaveSuccess = function (response) { console.log('onSaveSuccess(response: SaveResponse'); _super.prototype.onSaveSuccess.call(this, response); };
        DialogWithAllOverridableMethods.prototype.loadById = function (id, callback, fail) { console.log('loadById'); _super.prototype.loadById.call(this, id, callback); };
        DialogWithAllOverridableMethods.prototype.getLoadByIdRequest = function (id) { console.log('getLoadByIdRequest(id: any'); return _super.prototype.getLoadByIdRequest.call(this, id); };
        DialogWithAllOverridableMethods.prototype.getLoadByIdOptions = function (id, callback) { console.log('getLoadByIdOptions(id: any, callback: (response: RetrieveResponse<AuditLogRow>) => void'); return _super.prototype.getLoadByIdOptions.call(this, id, callback); };
        DialogWithAllOverridableMethods.prototype.loadByIdHandler = function (options, callback, fail) { console.log('loadByIdHandler(options: ServiceOptions<RetrieveResponse<AuditLogRow>>, callback: (response: RetrieveResponse<AuditLogRow>) => void, fail: () => void'); _super.prototype.loadByIdHandler.call(this, options, callback, fail); };
        DialogWithAllOverridableMethods.prototype.showSaveSuccessMessage = function (response) { console.log('showSaveSuccessMessage(response: SaveResponse'); _super.prototype.showSaveSuccessMessage.call(this, response); };
        //loadResponse(data: any): void { console.log('loadResponse(data: any'); super.loadResponse(data); }
        DialogWithAllOverridableMethods.prototype.initializeAsync = function () { console.log('initializeAsync'); return _super.prototype.initializeAsync.call(this); };
        DialogWithAllOverridableMethods.prototype.getEntityNameFieldValue = function () { console.log('getEntityNameFieldValue'); return _super.prototype.getEntityNameFieldValue.call(this); };
        DialogWithAllOverridableMethods.prototype.isCloneMode = function () { console.log('isCloneMode'); return _super.prototype.isCloneMode.call(this); };
        DialogWithAllOverridableMethods.prototype.isNewOrDeleted = function () { console.log('isNewOrDeleted'); return _super.prototype.isNewOrDeleted.call(this); };
        DialogWithAllOverridableMethods.prototype.getDeleteOptions = function (callback) { console.log('getDeleteOptions(callback: (response: DeleteResponse) => void'); return _super.prototype.getDeleteOptions.call(this, callback); };
        DialogWithAllOverridableMethods.prototype.deleteHandler = function (options, callback) { console.log('deleteHandler(options: ServiceOptions<DeleteResponse>, callback: (response: DeleteResponse) => void'); _super.prototype.deleteHandler.call(this, options, callback); };
        DialogWithAllOverridableMethods.prototype.doDelete = function (callback) { console.log('doDelete(callback: (response: DeleteResponse) => void'); _super.prototype.doDelete.call(this, callback); };
        DialogWithAllOverridableMethods.prototype.onDeleteSuccess = function (response) { console.log('onDeleteSuccess(response: DeleteResponse'); _super.prototype.onDeleteSuccess.call(this, response); };
        //protected attrs<TAttr>(attrType: {
        //    new (...args: any[]): TAttr;
        //}): TAttr[];
        DialogWithAllOverridableMethods.prototype.getEntityType = function () { console.log('getEntityType'); return _super.prototype.getEntityType.call(this); };
        //protected getFormKey(): string { console.log('getFormKey'); return super.getFormKey();}
        DialogWithAllOverridableMethods.prototype.getLocalTextDbPrefix = function () { console.log('getLocalTextDbPrefix'); return _super.prototype.getLocalTextDbPrefix.call(this); };
        //protected getLocalTextPrefix(): string { console.log('getLocalTextPrefix'); return super.getLocalTextPrefix();}
        //protected getNameProperty(): string { console.log('getNameProperty'); return super.getNameProperty();}
        //protected getIdProperty(): string { console.log('getIdProperty'); return super.getIdProperty();}
        DialogWithAllOverridableMethods.prototype.getIsActiveProperty = function () { console.log('getIsActiveProperty'); return _super.prototype.getIsActiveProperty.call(this); };
        DialogWithAllOverridableMethods.prototype.getIsDeletedProperty = function () { console.log('getIsDeletedProperty'); return _super.prototype.getIsDeletedProperty.call(this); };
        //protected getService(): string { console.log('getService'); return super.getService();}
        DialogWithAllOverridableMethods.prototype.loadNewAndOpenDialog = function (asPanel) { console.log('loadNewAndOpenDialog'); _super.prototype.loadNewAndOpenDialog.call(this, asPanel); };
        DialogWithAllOverridableMethods.prototype.loadEntityAndOpenDialog = function (entity, asPanel) { console.log('loadNewAndOpenDialog'); _super.prototype.loadNewAndOpenDialog.call(this, asPanel); };
        DialogWithAllOverridableMethods.prototype.loadByIdAndOpenDialog = function (entityId, asPanel) { console.log('loadNewAndOpenDialog'); _super.prototype.loadByIdAndOpenDialog.call(this, entityId, asPanel); };
        DialogWithAllOverridableMethods.prototype.reloadById = function () { console.log('reloadById'); _super.prototype.reloadById.call(this); };
        DialogWithAllOverridableMethods.prototype.isLocalizationModeAndChanged = function () { console.log('isLocalizationModeAndChanged'); return _super.prototype.isLocalizationModeAndChanged.call(this); };
        DialogWithAllOverridableMethods.prototype.localizationButtonClick = function () { console.log('localizationButtonClick'); _super.prototype.localizationButtonClick.call(this); };
        DialogWithAllOverridableMethods.prototype.getLanguages = function () { console.log('getLanguages'); return _super.prototype.getLanguages.call(this); };
        DialogWithAllOverridableMethods.prototype.loadLocalization = function () { console.log('loadLocalization'); _super.prototype.loadLocalization.call(this); };
        DialogWithAllOverridableMethods.prototype.setLocalizationGridCurrentValues = function () { console.log('setLocalizationGridCurrentValues'); _super.prototype.setLocalizationGridCurrentValues.call(this); };
        DialogWithAllOverridableMethods.prototype.getLocalizationGridValue = function () { console.log('getLocalizationGridValue'); return _super.prototype.getLocalizationGridValue.call(this); };
        DialogWithAllOverridableMethods.prototype.getPendingLocalizations = function () { console.log('getPendingLocalizations'); return _super.prototype.getPendingLocalizations.call(this); };
        DialogWithAllOverridableMethods.prototype.getPropertyItems = function () { console.log('getPropertyItems'); return _super.prototype.getPropertyItems.call(this); };
        DialogWithAllOverridableMethods.prototype.getPropertyItemsAsync = function () { console.log('getPropertyItemsAsync'); return _super.prototype.getPropertyItemsAsync.call(this); };
        DialogWithAllOverridableMethods.prototype.getCloningEntity = function () { console.log('getCloningEntity'); return _super.prototype.getCloningEntity.call(this); };
        DialogWithAllOverridableMethods.prototype.getUndeleteOptions = function (callback) { console.log('getUndeleteOptions(callback?: (response: UndeleteResponse) => void'); return _super.prototype.getUndeleteOptions.call(this, callback); };
        DialogWithAllOverridableMethods.prototype.undeleteHandler = function (options, callback) { console.log('undeleteHandler(options: ServiceOptions<UndeleteResponse>, callback: (response: UndeleteResponse) => void'); _super.prototype.undeleteHandler.call(this, options, callback); };
        DialogWithAllOverridableMethods.prototype.undelete = function (callback) { console.log('undelete(callback?: (response: UndeleteResponse) => void'); _super.prototype.undelete.call(this, callback); };
        //destroy(): void;
        //protected initToolbar(): void { console.log('initToolbar'); super.initToolbar();}
        //protected getToolbarButtons(): Serenity.ToolButton[] { console.log('getToolbarButtons'); return super.getToolbarButtons();}
        DialogWithAllOverridableMethods.prototype.resetValidation = function () { console.log('resetValidation'); _super.prototype.resetValidation.call(this); };
        DialogWithAllOverridableMethods.prototype.validateForm = function () { console.log('validateForm'); return _super.prototype.validateForm.call(this); };
        //dialogOpen(asPanel?: boolean): void;
        //static openPanel(element: JQuery, uniqueName: string): void;
        //static closePanel(element: JQuery, e?: JQueryEventObject): void;
        DialogWithAllOverridableMethods.prototype.onDialogClose = function () { console.log('onDialogClose'); _super.prototype.onDialogClose.call(this); };
        DialogWithAllOverridableMethods.prototype.destroy = function () { console.log('destroy'); _super.prototype.destroy.call(this); };
        return DialogWithAllOverridableMethods;
    }(_Ext.DialogBase));
    _Ext.DialogWithAllOverridableMethods = DialogWithAllOverridableMethods;
})(_Ext || (_Ext = {}));
//open a new dialog cycle-------------
//addCssClass
// getTemplate
// getTemplateName
//initValidator
//getValidatorOptions
// initTabs
//initToolbar
//getToolbarButtons
//initPropertyGrid
//getPropertyGridOptions
//getPropertyItems
//initLocalizationGrid
//getPropertyGridOptions
//getPropertyItems
//initLocalizationGridCommon(pgOptions: PropertyGridOptions
//load
//loadResponse(data: any
//onLoadingData(data: RetrieveResponse<AuditLogRow>
//beforeLoadEntity(entity: AuditLogRow
//loadEntity(entity: AuditLogRow
//set_entityId(value: any
//set_entity(entity: any
//isEditMode
//get_entityId
//set_entity(entity: any
//afterLoadEntity
//updateInterface
//isDeleted
//isLocalizationMode
//isNew
//updateTitle
//getEntityTitle
//getEntitySingular
//getLocalTextDbPrefix
//getSaveEntity
//initDialog
// getDialogOptions
// getDialogTitle
// handleResponsive
// onDialogOpen
// arrange
//dialog closing cycle-----------------
//getSaveEntity
//isEditMode
//get_entityId
// onDialogClose
//destroy
//save cycle---------------------------
//save(callback?: (response: SaveResponse) => void
//validateBeforeSave
//save_submitHandler(callback: (response: SaveResponse) => void
//getSaveOptions(callback: (response: SaveResponse) => void
//isEditMode
//get_entityId
//isCloneMode
//getSaveRequest
//getSaveEntity
//saveHandler(options: ServiceOptions<SaveResponse>, callback: (response: SaveResponse) => void
//onSaveSuccess(response: SaveResponse
//loadById
//getLoadByIdRequest(id: any
//getLoadByIdOptions(id: any, callback: (response: RetrieveResponse<AuditLogRow>) => void
//loadByIdHandler(options: ServiceOptions<RetrieveResponse<AuditLogRow>>, callback: (response: RetrieveResponse<AuditLogRow>) => void, fail: () => void
//showSaveSuccessMessage(response: SaveResponse
//loadResponse(data: any
//onLoadingData(data: RetrieveResponse<AuditLogRow>
//beforeLoadEntity(entity: AuditLogRow
//loadEntity(entity: AuditLogRow
//set_entityId(value: any
//set_entity(entity: any
//set_entity(entity: any
//afterLoadEntity
//updateInterface
//isDeleted
//getIsDeletedProperty
//get_entity
//getIsActiveProperty
//isLocalizationMode
//isLocalizationMode
//isNew
//updateTitle
//getEntityTitle
//getEntityNameFieldValue
//get_entity
//getEntitySingular
//getSaveEntity
//delete entity ------------------------
//doDelete(callback: (response: DeleteResponse) => void
//get_entityId
//getDeleteOptions(callback: (response: DeleteResponse) => void
//deleteHandler(options: ServiceOptions<DeleteResponse>, callback: (response: DeleteResponse) => void
//onDeleteSuccess(response: DeleteResponse
// onDialogClose
//destroy
var _Ext;
(function (_Ext) {
    var GridSnippets = /** @class */ (function (_super) {
        __extends(GridSnippets, _super);
        function GridSnippets(container, options) {
            return _super.call(this, container, options) || this;
        }
        GridSnippets.prototype.getColumnsKey = function () { return '_Ext.AuditLog'; };
        GridSnippets.prototype.getDialogType = function () { return _Ext.DialogSnippets; };
        GridSnippets.prototype.getIdProperty = function () { return _Ext.AuditLogRow.idProperty; };
        GridSnippets.prototype.getLocalTextPrefix = function () { return _Ext.AuditLogRow.localTextPrefix; };
        GridSnippets.prototype.getService = function () { return _Ext.AuditLogService.baseUrl; };
        GridSnippets.prototype.get_ExtGridOptions = function () {
            var opt = Q.deepClone(_super.prototype.get_ExtGridOptions.call(this));
            //make some changes here
            return opt;
        };
        GridSnippets.prototype.getInitialTitle = function () { return _super.prototype.getInitialTitle.call(this); };
        GridSnippets.prototype.getDisplayName = function () { return _super.prototype.getDisplayName.call(this); };
        GridSnippets.prototype.setTitle = function (value) { _super.prototype.setTitle.call(this, value); };
        GridSnippets.prototype.getTitle = function () { return _super.prototype.getTitle.call(this); };
        //called on resizing the grid canvas
        GridSnippets.prototype.layout = function () { _super.prototype.layout.call(this); };
        GridSnippets.prototype.getButtons = function () {
            var buttons = _super.prototype.getButtons.call(this);
            //To remove Add button
            //buttons = buttons.filter(f => f.cssClass != 'add-button');
            //To create a new button
            buttons.push({
                title: 'Sample Button',
                icon: 'fa fa-bell',
                onClick: function (e) {
                    Q.alert('Sample Button is clicked!');
                }
            });
            return buttons;
        };
        GridSnippets.prototype.getAddButtonCaption = function () { return _super.prototype.getAddButtonCaption.call(this); };
        GridSnippets.prototype.getItemName = function () { return _super.prototype.getItemName.call(this); };
        GridSnippets.prototype.newRefreshButton = function (noText) { return _super.prototype.newRefreshButton.call(this); };
        GridSnippets.prototype.getView = function () { return _super.prototype.getView.call(this); };
        GridSnippets.prototype.createToolbar = function (buttons) { _super.prototype.createToolbar.call(this, buttons); };
        GridSnippets.prototype.createSlickContainer = function () { return _super.prototype.createSlickContainer.call(this); };
        GridSnippets.prototype.createView = function () { return _super.prototype.createView.call(this); };
        GridSnippets.prototype.getViewOptions = function () { return _super.prototype.getViewOptions.call(this); };
        GridSnippets.prototype.getDefaultSortBy = function () { return _super.prototype.getDefaultSortBy.call(this); };
        GridSnippets.prototype.usePager = function () { return true; };
        GridSnippets.prototype.createSlickGrid = function () { return _super.prototype.createSlickGrid.call(this); };
        GridSnippets.prototype.getColumns = function () { return _super.prototype.getColumns.call(this); };
        GridSnippets.prototype.getPropertyItems = function () { return _super.prototype.getPropertyItems.call(this); };
        GridSnippets.prototype.propertyItemsToSlickColumns = function (propertyItems) { return _super.prototype.propertyItemsToSlickColumns.call(this, propertyItems); };
        GridSnippets.prototype.itemLink = function (itemType, idField, text, cssClass, encode) { return _super.prototype.itemLink.call(this); };
        GridSnippets.prototype.getItemType = function () { return _super.prototype.getItemType.call(this); };
        GridSnippets.prototype.getEntityType = function () { return _super.prototype.getEntityType.call(this); };
        //getIdProperty
        GridSnippets.prototype.getSlickOptions = function () { return _super.prototype.getSlickOptions.call(this); };
        GridSnippets.prototype.postProcessColumns = function (columns) { return _super.prototype.postProcessColumns.call(this, columns); };
        GridSnippets.prototype.setInitialSortOrder = function () { _super.prototype.setInitialSortOrder.call(this); };
        GridSnippets.prototype.enableFiltering = function () { return _super.prototype.enableFiltering.call(this); };
        GridSnippets.prototype.createFilterBar = function () { _super.prototype.createFilterBar.call(this); };
        GridSnippets.prototype.initializeFilterBar = function () { _super.prototype.initializeFilterBar.call(this); };
        //call for each quick Column
        GridSnippets.prototype.canFilterColumn = function (column) { return _super.prototype.canFilterColumn.call(this, column); };
        //usePager
        GridSnippets.prototype.createPager = function () { _super.prototype.createPager.call(this); };
        GridSnippets.prototype.getPagerOptions = function () { return _super.prototype.getPagerOptions.call(this); };
        GridSnippets.prototype.bindToSlickEvents = function () { _super.prototype.bindToSlickEvents.call(this); };
        GridSnippets.prototype.bindToViewEvents = function () { _super.prototype.bindToViewEvents.call(this); };
        GridSnippets.prototype.createToolbarExtensions = function () { _super.prototype.createToolbarExtensions.call(this); };
        GridSnippets.prototype.createIncludeDeletedButton = function () { _super.prototype.createIncludeDeletedButton.call(this); };
        GridSnippets.prototype.createQuickSearchInput = function () { _super.prototype.createQuickSearchInput.call(this); };
        GridSnippets.prototype.getQuickSearchFields = function () { return _super.prototype.getQuickSearchFields.call(this); };
        GridSnippets.prototype.createQuickFilters = function () { _super.prototype.createQuickFilters.call(this); };
        GridSnippets.prototype.getQuickFilters = function () { return _super.prototype.getQuickFilters.call(this); };
        GridSnippets.prototype.dateTimeRangeQuickFilter = function (field, title) { return _super.prototype.dateTimeRangeQuickFilter.call(this, field, title); };
        //call for each quick filter
        GridSnippets.prototype.addQuickFilter = function (opt) { return _super.prototype.addQuickFilter.call(this, opt); };
        GridSnippets.prototype.add_submitHandlers = function (action) { _super.prototype.add_submitHandlers.call(this, action); };
        GridSnippets.prototype.updateDisabledState = function () { _super.prototype.updateDisabledState.call(this); };
        GridSnippets.prototype.getCurrentSettings = function (flags) { return _super.prototype.getCurrentSettings.call(this); };
        GridSnippets.prototype.gridPersistanceFlags = function () { return _super.prototype.gridPersistanceFlags.call(this); };
        GridSnippets.prototype.restoreSettings = function (settings, flags) { _super.prototype.restoreSettings.call(this); };
        GridSnippets.prototype.getPersistedSettings = function () { return _super.prototype.getPersistedSettings.call(this); };
        GridSnippets.prototype.getPersistanceStorage = function () { return _super.prototype.getPersistanceStorage.call(this); };
        //getView
        GridSnippets.prototype.getGrid = function () { return _super.prototype.getGrid.call(this); };
        //getView
        //getGrid
        GridSnippets.prototype.initialPopulate = function () { _super.prototype.initialPopulate.call(this); };
        //called for each refresh request
        GridSnippets.prototype.populateWhenVisible = function () { return _super.prototype.populateWhenVisible.call(this); };
        //called for each refresh request
        GridSnippets.prototype.onViewSubmit = function () { return _super.prototype.onViewSubmit.call(this); };
        //called for each refresh request
        GridSnippets.prototype.getGridCanLoad = function () { return _super.prototype.getGridCanLoad.call(this); };
        //called for each refresh request
        GridSnippets.prototype.setCriteriaParameter = function () { _super.prototype.setCriteriaParameter.call(this); };
        //called for each refresh request
        GridSnippets.prototype.setIncludeColumnsParameter = function () { _super.prototype.setIncludeColumnsParameter.call(this); };
        //called for each refresh request
        GridSnippets.prototype.getIncludeColumns = function (include) { _super.prototype.getIncludeColumns.call(this, include); };
        //called for each refresh request
        GridSnippets.prototype.invokeSubmitHandlers = function () { _super.prototype.invokeSubmitHandlers.call(this); };
        //called for each refresh request
        GridSnippets.prototype.onViewProcessData = function (response) { return _super.prototype.onViewProcessData.call(this, response); };
        //called for each row on every Refresh OR Layout change
        GridSnippets.prototype.getItemMetadata = function (item, index) { return _super.prototype.getItemMetadata.call(this, item, index); };
        //called for each row on every Refresh OR Layout change
        GridSnippets.prototype.getItemCssClass = function (item, index) { return _super.prototype.getItemCssClass.call(this, item, index); };
        //called for each row on every Refresh OR Layout change
        GridSnippets.prototype.getIsActiveProperty = function () { return _super.prototype.getIsActiveProperty.call(this); };
        //called for each row on every Refresh OR Layout change
        GridSnippets.prototype.getIsDeletedProperty = function () { return _super.prototype.getIsDeletedProperty.call(this); };
        //called for each row on every refresh request
        GridSnippets.prototype.onViewFilter = function (item) { return _super.prototype.onViewFilter.call(this, item); };
        GridSnippets.prototype.getElement = function () { return _super.prototype.getElement.call(this); };
        //called for each refresh request
        GridSnippets.prototype.viewDataChanged = function (e, rows) { _super.prototype.viewDataChanged.call(this, e, rows); };
        //called for each refresh request
        GridSnippets.prototype.markupReady = function () { _super.prototype.markupReady.call(this); };
        //called for each refresh request
        GridSnippets.prototype.getItems = function () { return _super.prototype.getItems.call(this); };
        //called for each refresh request
        GridSnippets.prototype.setItems = function (value) { _super.prototype.setItems.call(this, value); };
        GridSnippets.prototype.addButtonClick = function () { _super.prototype.addButtonClick.call(this); };
        GridSnippets.prototype.editItem = function (entityOrId) { _super.prototype.editItem.call(this, entityOrId); };
        GridSnippets.prototype.editItemOfType = function (itemType, entityOrId) { _super.prototype.editItemOfType.call(this, itemType, entityOrId); };
        //protected getService(): string {  return super.getButtons() }
        GridSnippets.prototype.routeDialog = function (itemType, dialog) { _super.prototype.routeDialog.call(this, itemType, dialog); };
        //protected initDialog(dialog): void {  super.initDialog(dialog) }
        GridSnippets.prototype.initEntityDialog = function (itemType, dialog) { _super.prototype.initEntityDialog.call(this, itemType, dialog); };
        GridSnippets.prototype.createEntityDialog = function (itemType, callback) { return _super.prototype.createEntityDialog.call(this, itemType, callback); };
        GridSnippets.prototype.getDialogOptions = function () { return _super.prototype.getDialogOptions.call(this); };
        GridSnippets.prototype.getDialogOptionsFor = function (itemType) { return _super.prototype.getDialogOptionsFor.call(this, itemType); };
        //protected getDialogTypeFor(itemType: string): { 
        //    new(...args: any[]): Serenity.Widget<any>;
        //};
        //protected getDialogType(): { 
        //    new(...args: any[]): Serenity.Widget<any>;
        //};
        //Inherited from Serenity.DataGrid ______________________________________________________________________
        GridSnippets.prototype.remove_submitHandlers = function (action) { _super.prototype.remove_submitHandlers.call(this, action); };
        //protected getInitialTitle(): string;
        //protected createToolbarExtensions(): void;
        //protected findQuickFilter<TWidget>(type: { 
        //    new (...args: any[]): TWidget;
        //}, field: string): TWidget;
        //protected tryFindQuickFilter<TWidget>(type: { 
        //    new(...args: any[]): TWidget;
        //}, field: string): TWidget;
        GridSnippets.prototype.destroy = function () { _super.prototype.destroy.call(this); };
        GridSnippets.prototype.initializeAsync = function () { return _super.prototype.initializeAsync.call(this); };
        //itemAt(row: number): any;
        //rowCount(): number;
        //protected getAddButtonCaption(): string;
        //protected getButtons(): ToolButton[];
        //protected editItem(entityOrId: any): void;
        //protected editItemOfType(itemType: string, entityOrId: any): void;
        GridSnippets.prototype.onClick = function (e, row, cell) { _super.prototype.onClick.call(this, e, row, cell); };
        GridSnippets.prototype.setEquality = function (field, value) { _super.prototype.setEquality.call(this, field, value); };
        //protected usePager(): boolean;
        //protected getViewOptions(): Slick.RemoteViewOptions;
        //protected getItemType(): string;
        //protected getColumnsKey(): string;
        GridSnippets.prototype.getPropertyItemsAsync = function () { return _super.prototype.getPropertyItemsAsync.call(this); };
        GridSnippets.prototype.getColumnsAsync = function () { return _super.prototype.getColumnsAsync.call(this); };
        GridSnippets.prototype.populateLock = function () { _super.prototype.populateLock.call(this); };
        GridSnippets.prototype.populateUnlock = function () { _super.prototype.populateUnlock.call(this); };
        GridSnippets.prototype.refresh = function () { _super.prototype.refresh.call(this); };
        GridSnippets.prototype.refreshIfNeeded = function () { _super.prototype.refreshIfNeeded.call(this); };
        //called for each refresh request
        GridSnippets.prototype.internalRefresh = function () { _super.prototype.internalRefresh.call(this); };
        GridSnippets.prototype.setIsDisabled = function (value) { _super.prototype.setIsDisabled.call(this, value); };
        //protected getLocalTextDbPrefix(): string;
        //protected getLocalTextPrefix(): string;
        //protected getIdProperty(): string;
        GridSnippets.prototype.resizeCanvas = function () { _super.prototype.resizeCanvas.call(this); };
        GridSnippets.prototype.subDialogDataChange = function () { _super.prototype.subDialogDataChange.call(this); };
        GridSnippets.prototype.addFilterSeparator = function () { _super.prototype.addFilterSeparator.call(this); };
        GridSnippets.prototype.determineText = function (getKey) { return _super.prototype.determineText.call(this, getKey); };
        GridSnippets.prototype.addDateRangeFilter = function (field, title) { return _super.prototype.addDateRangeFilter.call(this, field, title); };
        GridSnippets.prototype.dateRangeQuickFilter = function (field, title) { return _super.prototype.dateRangeQuickFilter.call(this, field, title); };
        GridSnippets.prototype.addDateTimeRangeFilter = function (field, title) { return _super.prototype.addDateTimeRangeFilter.call(this, field, title); };
        GridSnippets.prototype.addBooleanFilter = function (field, title, yes, no) { return _super.prototype.addBooleanFilter.call(this, field, title, yes, no); };
        GridSnippets.prototype.booleanQuickFilter = function (field, title, yes, no) { return _super.prototype.booleanQuickFilter.call(this, field, title, yes, no); };
        GridSnippets.prototype.quickFilterChange = function (e) { _super.prototype.quickFilterChange.call(this, e); };
        GridSnippets.prototype.getPersistanceKey = function () { return _super.prototype.getPersistanceKey.call(this); };
        GridSnippets.prototype.canShowColumn = function (column) { return _super.prototype.canShowColumn.call(this, column); };
        GridSnippets.prototype.persistSettings = function (flags) { _super.prototype.persistSettings.call(this); };
        GridSnippets.prototype.getFilterStore = function () { return _super.prototype.getFilterStore.call(this); };
        GridSnippets = __decorate([
            Serenity.Decorators.filterable()
        ], GridSnippets);
        return GridSnippets;
    }(_Ext.GridBase));
    _Ext.GridSnippets = GridSnippets;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var GridWithAllOverridableMethods = /** @class */ (function (_super) {
        __extends(GridWithAllOverridableMethods, _super);
        function GridWithAllOverridableMethods(container, options) {
            var _this = this;
            console.log('constructor');
            _this = _super.call(this, container, options) || this;
            return _this;
        }
        GridWithAllOverridableMethods.prototype.getDialogType = function () { console.log('getDialogType'); return _Ext.DialogWithAllOverridableMethods; };
        GridWithAllOverridableMethods.prototype.getInitialTitle = function () { console.log('getInitialTitle'); return _super.prototype.getInitialTitle.call(this); };
        GridWithAllOverridableMethods.prototype.getDisplayName = function () { console.log('getDisplayName'); return _super.prototype.getDisplayName.call(this); };
        GridWithAllOverridableMethods.prototype.getLocalTextPrefix = function () { console.log('getLocalTextPrefix'); return _Ext.AuditLogRow.localTextPrefix; };
        GridWithAllOverridableMethods.prototype.setTitle = function (value) { console.log('setTitle'); _super.prototype.setTitle.call(this, value); };
        GridWithAllOverridableMethods.prototype.getTitle = function () { console.log('getTitle'); return _super.prototype.getTitle.call(this); };
        //called on resizing the grid canvas
        GridWithAllOverridableMethods.prototype.layout = function () { console.log('layout'); _super.prototype.layout.call(this); };
        GridWithAllOverridableMethods.prototype.getButtons = function () { console.log('getButtons'); return _super.prototype.getButtons.call(this); };
        GridWithAllOverridableMethods.prototype.getAddButtonCaption = function () { console.log('getAddButtonCaption'); return _super.prototype.getAddButtonCaption.call(this); };
        GridWithAllOverridableMethods.prototype.getItemName = function () { console.log('getItemName'); return _super.prototype.getItemName.call(this); };
        GridWithAllOverridableMethods.prototype.newRefreshButton = function (noText) { console.log('newRefreshButton'); return _super.prototype.newRefreshButton.call(this); };
        GridWithAllOverridableMethods.prototype.getView = function () { console.log('getView'); return _super.prototype.getView.call(this); };
        GridWithAllOverridableMethods.prototype.createToolbar = function (buttons) { console.log('createToolbar'); _super.prototype.createToolbar.call(this, buttons); };
        GridWithAllOverridableMethods.prototype.createSlickContainer = function () { console.log('createSlickContainer'); return _super.prototype.createSlickContainer.call(this); };
        GridWithAllOverridableMethods.prototype.createView = function () { console.log('createView'); return _super.prototype.createView.call(this); };
        GridWithAllOverridableMethods.prototype.getViewOptions = function () { console.log('getViewOptions'); return _super.prototype.getViewOptions.call(this); };
        GridWithAllOverridableMethods.prototype.getIdProperty = function () { console.log('getIdProperty'); return _Ext.AuditLogRow.idProperty; };
        GridWithAllOverridableMethods.prototype.getDefaultSortBy = function () { console.log('getDefaultSortBy'); return _super.prototype.getDefaultSortBy.call(this); };
        GridWithAllOverridableMethods.prototype.usePager = function () { console.log('usePager'); return true; };
        GridWithAllOverridableMethods.prototype.getService = function () { console.log('getService'); return _Ext.AuditLogService.baseUrl; };
        GridWithAllOverridableMethods.prototype.createSlickGrid = function () { console.log('createSlickGrid'); return _super.prototype.createSlickGrid.call(this); };
        GridWithAllOverridableMethods.prototype.getColumns = function () { console.log('getColumns'); return _super.prototype.getColumns.call(this); };
        GridWithAllOverridableMethods.prototype.getPropertyItems = function () { console.log('getPropertyItems'); return _super.prototype.getPropertyItems.call(this); };
        GridWithAllOverridableMethods.prototype.getColumnsKey = function () { console.log('getColumnsKey'); return '_Ext.AuditLog'; };
        GridWithAllOverridableMethods.prototype.propertyItemsToSlickColumns = function (propertyItems) { console.log('propertyItemsToSlickColumns'); return _super.prototype.propertyItemsToSlickColumns.call(this, propertyItems); };
        GridWithAllOverridableMethods.prototype.itemLink = function (itemType, idField, text, cssClass, encode) { console.log('itemLink(itemType?: string, idField?: string, text?: (ctx: Slick.FormatterContext) => string, cssClass?: '); return _super.prototype.itemLink.call(this); };
        GridWithAllOverridableMethods.prototype.getItemType = function () { console.log('getItemType'); return _super.prototype.getItemType.call(this); };
        GridWithAllOverridableMethods.prototype.getEntityType = function () { console.log('getEntityType'); return _super.prototype.getEntityType.call(this); };
        //getIdProperty
        GridWithAllOverridableMethods.prototype.getSlickOptions = function () { console.log('getSlickOptions'); return _super.prototype.getSlickOptions.call(this); };
        GridWithAllOverridableMethods.prototype.get_ExtGridOptions = function () {
            console.log('get_ExtGridOptions');
            var opt = Q.deepClone(_super.prototype.get_ExtGridOptions.call(this));
            //change some options here
            opt.ShowRowSelectionCheckboxColumn = true;
            return opt;
        };
        GridWithAllOverridableMethods.prototype.postProcessColumns = function (columns) { console.log('postProcessColumns'); return _super.prototype.postProcessColumns.call(this, columns); };
        GridWithAllOverridableMethods.prototype.setInitialSortOrder = function () { console.log('setInitialSortOrder'); _super.prototype.setInitialSortOrder.call(this); };
        GridWithAllOverridableMethods.prototype.enableFiltering = function () { console.log('enableFiltering'); return _super.prototype.enableFiltering.call(this); };
        GridWithAllOverridableMethods.prototype.createFilterBar = function () { console.log('createFilterBar'); _super.prototype.createFilterBar.call(this); };
        GridWithAllOverridableMethods.prototype.initializeFilterBar = function () { console.log('initializeFilterBar'); _super.prototype.initializeFilterBar.call(this); };
        //call for each quick Column
        GridWithAllOverridableMethods.prototype.canFilterColumn = function (column) { console.log('canFilterColumn'); return _super.prototype.canFilterColumn.call(this, column); };
        //usePager
        GridWithAllOverridableMethods.prototype.createPager = function () { console.log('createPager'); _super.prototype.createPager.call(this); };
        GridWithAllOverridableMethods.prototype.getPagerOptions = function () { console.log('getPagerOptions'); return _super.prototype.getPagerOptions.call(this); };
        GridWithAllOverridableMethods.prototype.bindToSlickEvents = function () { console.log('bindToSlickEvents'); _super.prototype.bindToSlickEvents.call(this); };
        GridWithAllOverridableMethods.prototype.bindToViewEvents = function () { console.log('bindToViewEvents'); _super.prototype.bindToViewEvents.call(this); };
        GridWithAllOverridableMethods.prototype.createToolbarExtensions = function () { console.log('createToolbarExtensions'); _super.prototype.createToolbarExtensions.call(this); };
        GridWithAllOverridableMethods.prototype.createIncludeDeletedButton = function () { console.log('createIncludeDeletedButton'); _super.prototype.createIncludeDeletedButton.call(this); };
        GridWithAllOverridableMethods.prototype.createQuickSearchInput = function () { console.log('createQuickSearchInput'); _super.prototype.createQuickSearchInput.call(this); };
        GridWithAllOverridableMethods.prototype.getQuickSearchFields = function () { console.log('getQuickSearchFields'); return _super.prototype.getQuickSearchFields.call(this); };
        GridWithAllOverridableMethods.prototype.createQuickFilters = function () { console.log('createQuickFilters'); _super.prototype.createQuickFilters.call(this); };
        GridWithAllOverridableMethods.prototype.getQuickFilters = function () { console.log('getQuickFilters'); return _super.prototype.getQuickFilters.call(this); };
        GridWithAllOverridableMethods.prototype.dateTimeRangeQuickFilter = function (field, title) { console.log('dateTimeRangeQuickFilter'); return _super.prototype.dateTimeRangeQuickFilter.call(this, field, title); };
        //call for each quick filter
        GridWithAllOverridableMethods.prototype.addQuickFilter = function (opt) { console.log('addQuickFilter<TWidget extends Serenity.Widget<any>, TOptions>'); return _super.prototype.addQuickFilter.call(this, opt); };
        GridWithAllOverridableMethods.prototype.add_submitHandlers = function (action) { console.log('add_submitHandlers(action: '); _super.prototype.add_submitHandlers.call(this, action); };
        GridWithAllOverridableMethods.prototype.updateDisabledState = function () { console.log('updateDisabledState'); _super.prototype.updateDisabledState.call(this); };
        GridWithAllOverridableMethods.prototype.getCurrentSettings = function (flags) { console.log('getCurrentSettings'); return _super.prototype.getCurrentSettings.call(this); };
        GridWithAllOverridableMethods.prototype.gridPersistanceFlags = function () { console.log('gridPersistanceFlags'); return _super.prototype.gridPersistanceFlags.call(this); };
        GridWithAllOverridableMethods.prototype.restoreSettings = function (settings, flags) { console.log('restoreSettings'); _super.prototype.restoreSettings.call(this); };
        GridWithAllOverridableMethods.prototype.getPersistedSettings = function () { console.log('getPersistedSettings'); return _super.prototype.getPersistedSettings.call(this); };
        GridWithAllOverridableMethods.prototype.getPersistanceStorage = function () { console.log('getPersistanceStorage'); return _super.prototype.getPersistanceStorage.call(this); };
        //getView
        GridWithAllOverridableMethods.prototype.getGrid = function () { console.log('getGrid'); return _super.prototype.getGrid.call(this); };
        //getView
        //getGrid
        GridWithAllOverridableMethods.prototype.initialPopulate = function () { console.log('initialPopulate'); _super.prototype.initialPopulate.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.populateWhenVisible = function () { console.log('populateWhenVisible'); return _super.prototype.populateWhenVisible.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.onViewSubmit = function () { console.log('onViewSubmit'); return _super.prototype.onViewSubmit.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.getGridCanLoad = function () { console.log('getGridCanLoad'); return _super.prototype.getGridCanLoad.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.setCriteriaParameter = function () { console.log('setCriteriaParameter'); _super.prototype.setCriteriaParameter.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.setIncludeColumnsParameter = function () { console.log('setIncludeColumnsParameter'); _super.prototype.setIncludeColumnsParameter.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.getIncludeColumns = function (include) { console.log('getIncludeColumns'); _super.prototype.getIncludeColumns.call(this, include); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.invokeSubmitHandlers = function () { console.log('invokeSubmitHandlers'); _super.prototype.invokeSubmitHandlers.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.onViewProcessData = function (response) { console.log('onViewProcessData'); return _super.prototype.onViewProcessData.call(this, response); };
        //called for each row on every Refresh OR Layout change
        GridWithAllOverridableMethods.prototype.getItemMetadata = function (item, index) { console.log('getItemMetadata'); return _super.prototype.getItemMetadata.call(this, item, index); };
        //called for each row on every Refresh OR Layout change
        GridWithAllOverridableMethods.prototype.getItemCssClass = function (item, index) { console.log('getItemCssClass'); return _super.prototype.getItemCssClass.call(this, item, index); };
        //called for each row on every Refresh OR Layout change
        GridWithAllOverridableMethods.prototype.getIsActiveProperty = function () { console.log('getIsActiveProperty'); return _super.prototype.getIsActiveProperty.call(this); };
        //called for each row on every Refresh OR Layout change
        GridWithAllOverridableMethods.prototype.getIsDeletedProperty = function () { console.log('getIsDeletedProperty'); return _super.prototype.getIsDeletedProperty.call(this); };
        //called for each row on every refresh request
        GridWithAllOverridableMethods.prototype.onViewFilter = function (item) { console.log('onViewFilter'); return _super.prototype.onViewFilter.call(this, item); };
        GridWithAllOverridableMethods.prototype.getElement = function () { console.log('getElement'); return _super.prototype.getElement.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.viewDataChanged = function (e, rows) { console.log('viewDataChanged'); _super.prototype.viewDataChanged.call(this, e, rows); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.markupReady = function () { console.log('markupReady'); _super.prototype.markupReady.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.getItems = function () { console.log('getItems'); return _super.prototype.getItems.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.setItems = function (value) { console.log('setItems'); _super.prototype.setItems.call(this, value); };
        GridWithAllOverridableMethods.prototype.addButtonClick = function () { console.log('addButtonClick'); _super.prototype.addButtonClick.call(this); };
        GridWithAllOverridableMethods.prototype.editItem = function (entityOrId) { console.log('editItem'); _super.prototype.editItem.call(this, entityOrId); };
        GridWithAllOverridableMethods.prototype.editItemOfType = function (itemType, entityOrId) { console.log('editItemOfType'); _super.prototype.editItemOfType.call(this, itemType, entityOrId); };
        //protected getService(): string { console.log('getService'); return super.getButtons() }
        GridWithAllOverridableMethods.prototype.routeDialog = function (itemType, dialog) { console.log('routeDialog'); _super.prototype.routeDialog.call(this, itemType, dialog); };
        //protected initDialog(dialog): void { console.log('initDialog'); super.initDialog(dialog) }
        GridWithAllOverridableMethods.prototype.initEntityDialog = function (itemType, dialog) { console.log('initEntityDialog'); _super.prototype.initEntityDialog.call(this, itemType, dialog); };
        GridWithAllOverridableMethods.prototype.createEntityDialog = function (itemType, callback) { console.log('createEntityDialog(itemType: string, callback?: '); return _super.prototype.createEntityDialog.call(this, itemType, callback); };
        GridWithAllOverridableMethods.prototype.getDialogOptions = function () { console.log('getDialogOptions'); return _super.prototype.getDialogOptions.call(this); };
        GridWithAllOverridableMethods.prototype.getDialogOptionsFor = function (itemType) { console.log('getDialogOptionsFor'); return _super.prototype.getDialogOptionsFor.call(this, itemType); };
        //protected getDialogTypeFor(itemType: string): { console.log('getDialogTypeFor');
        //    new(...args: any[]): Serenity.Widget<any>;
        //};
        //protected getDialogType(): { console.log('getDialogType');
        //    new(...args: any[]): Serenity.Widget<any>;
        //};
        //Inherited from Serenity.DataGrid ______________________________________________________________________
        GridWithAllOverridableMethods.prototype.remove_submitHandlers = function (action) { console.log('remove_submitHandlers(action: '); _super.prototype.remove_submitHandlers.call(this, action); };
        //protected getInitialTitle(): string;
        //protected createToolbarExtensions(): void;
        //protected findQuickFilter<TWidget>(type: { console.log('findQuickFilter<TWidget>');
        //    new (...args: any[]): TWidget;
        //}, field: string): TWidget;
        //protected tryFindQuickFilter<TWidget>(type: { console.log('tryFindQuickFilter<TWidget>');
        //    new(...args: any[]): TWidget;
        //}, field: string): TWidget;
        GridWithAllOverridableMethods.prototype.destroy = function () { console.log('destroy'); _super.prototype.destroy.call(this); };
        GridWithAllOverridableMethods.prototype.initializeAsync = function () { console.log('initializeAsync'); return _super.prototype.initializeAsync.call(this); };
        //itemAt(row: number): any;
        //rowCount(): number;
        //protected getAddButtonCaption(): string;
        //protected getButtons(): ToolButton[];
        //protected editItem(entityOrId: any): void;
        //protected editItemOfType(itemType: string, entityOrId: any): void;
        GridWithAllOverridableMethods.prototype.onClick = function (e, row, cell) { console.log('onClick'); _super.prototype.onClick.call(this, e, row, cell); };
        GridWithAllOverridableMethods.prototype.setEquality = function (field, value) { console.log('setEquality'); _super.prototype.setEquality.call(this, field, value); };
        //protected usePager(): boolean;
        //protected getViewOptions(): Slick.RemoteViewOptions;
        //protected getItemType(): string;
        //protected getColumnsKey(): string;
        GridWithAllOverridableMethods.prototype.getPropertyItemsAsync = function () { console.log('getPropertyItemsAsync'); return _super.prototype.getPropertyItemsAsync.call(this); };
        GridWithAllOverridableMethods.prototype.getColumnsAsync = function () { console.log('getColumnsAsync'); return _super.prototype.getColumnsAsync.call(this); };
        GridWithAllOverridableMethods.prototype.populateLock = function () { console.log('populateLock'); _super.prototype.populateLock.call(this); };
        GridWithAllOverridableMethods.prototype.populateUnlock = function () { console.log('populateUnlock'); _super.prototype.populateUnlock.call(this); };
        GridWithAllOverridableMethods.prototype.refresh = function () { console.log('refresh'); _super.prototype.refresh.call(this); };
        GridWithAllOverridableMethods.prototype.refreshIfNeeded = function () { console.log('refreshIfNeeded'); _super.prototype.refreshIfNeeded.call(this); };
        //called for each refresh request
        GridWithAllOverridableMethods.prototype.internalRefresh = function () { console.log('internalRefresh'); _super.prototype.internalRefresh.call(this); };
        GridWithAllOverridableMethods.prototype.setIsDisabled = function (value) { console.log('setIsDisabled'); _super.prototype.setIsDisabled.call(this, value); };
        //protected getLocalTextDbPrefix(): string;
        //protected getLocalTextPrefix(): string;
        //protected getIdProperty(): string;
        GridWithAllOverridableMethods.prototype.resizeCanvas = function () { console.log('resizeCanvas'); _super.prototype.resizeCanvas.call(this); };
        GridWithAllOverridableMethods.prototype.subDialogDataChange = function () { console.log('subDialogDataChange'); _super.prototype.subDialogDataChange.call(this); };
        GridWithAllOverridableMethods.prototype.addFilterSeparator = function () { console.log('addFilterSeparator'); _super.prototype.addFilterSeparator.call(this); };
        GridWithAllOverridableMethods.prototype.determineText = function (getKey) { console.log('determineText'); return _super.prototype.determineText.call(this, getKey); };
        GridWithAllOverridableMethods.prototype.addDateRangeFilter = function (field, title) { console.log('addDateRangeFilter'); return _super.prototype.addDateRangeFilter.call(this, field, title); };
        GridWithAllOverridableMethods.prototype.dateRangeQuickFilter = function (field, title) { console.log('dateRangeQuickFilter'); return _super.prototype.dateRangeQuickFilter.call(this, field, title); };
        GridWithAllOverridableMethods.prototype.addDateTimeRangeFilter = function (field, title) { console.log('addDateTimeRangeFilter'); return _super.prototype.addDateTimeRangeFilter.call(this, field, title); };
        GridWithAllOverridableMethods.prototype.addBooleanFilter = function (field, title, yes, no) { console.log('addBooleanFilter'); return _super.prototype.addBooleanFilter.call(this, field, title, yes, no); };
        GridWithAllOverridableMethods.prototype.booleanQuickFilter = function (field, title, yes, no) { console.log('booleanQuickFilter'); return _super.prototype.booleanQuickFilter.call(this, field, title, yes, no); };
        GridWithAllOverridableMethods.prototype.quickFilterChange = function (e) { console.log('quickFilterChange'); _super.prototype.quickFilterChange.call(this, e); };
        GridWithAllOverridableMethods.prototype.getPersistanceKey = function () { console.log('getPersistanceKey'); return _super.prototype.getPersistanceKey.call(this); };
        GridWithAllOverridableMethods.prototype.canShowColumn = function (column) { console.log('canShowColumn'); return _super.prototype.canShowColumn.call(this, column); };
        GridWithAllOverridableMethods.prototype.persistSettings = function (flags) { console.log('persistSettings'); _super.prototype.persistSettings.call(this); };
        GridWithAllOverridableMethods.prototype.getFilterStore = function () { console.log('getFilterStore'); return _super.prototype.getFilterStore.call(this); };
        GridWithAllOverridableMethods = __decorate([
            Serenity.Decorators.filterable()
        ], GridWithAllOverridableMethods);
        return GridWithAllOverridableMethods;
    }(_Ext.GridBase));
    _Ext.GridWithAllOverridableMethods = GridWithAllOverridableMethods;
})(_Ext || (_Ext = {}));
// * represnts the frequency
//------------------------------------------
//GRID Refresh CYCLE 
//------------------------------------------
//  refresh
//  populateWhenVisible
//  internalRefresh
//  onViewSubmit ***
//  getGridCanLoad
//  setCriteriaParameter
//  setIncludeColumnsParameter
//  getIncludeColumns
//  invokeSubmitHandlers
//  onViewProcessData **
//  get_ExtGridOptions
//for each row {
//  onViewFilter
//  getItemMetadata
//  getItemCssClass
//  getIsActiveProperty
//  getIsDeletedProperty
//  }
//  viewDataChanged
//  markupReady *
//the following should not be called. now it is called because of _Ext row number generation.
//  getItems
//  setItems
//  onViewFilter
//  viewDataChanged
//  markupReady
//------------------------------------------
//GRID onClick CYCLE 
//------------------------------------------
//  onClick
//  getIdProperty
//the following are called twice ?? {
//  getItemMetadata
//  getItemCssClass
//  getIsActiveProperty
//  getIsDeletedProperty 
//  }
//------------------------------------------
//GRID edit link onClick CYCLE 
//------------------------------------------
//  onClick
//  getIdProperty
//  editItem
//  getItemType
//  getEntityType
//  createEntityDialog(itemType: string, callback?: 
//  getItemType
//  getEntityType
//  getDialogType
//  getDialogOptionsFor
//  getItemType
//  getEntityType
//  getDialogOptions
//  initEntityDialog
//  getItemType
//  getEntityType
//  getItemType
//  getEntityType
//  routeDialog
//the following are called twice ?? {
//  getItemMetadata
//  getItemCssClass
//  getIsActiveProperty
//  getIsDeletedProperty
//  }
//  getItemType
//  getEntityType
//------------------------------------------
//GRID quickFilterChange CYCLE 
//------------------------------------------
//  quickFilterChange
//  persistSettings
//  getPersistanceStorage
//  refresh CYCLE
var _Ext;
(function (_Ext) {
    var ReplaceRowDialog = /** @class */ (function (_super) {
        __extends(ReplaceRowDialog, _super);
        function ReplaceRowDialog(request, entityList) {
            var _this = _super.call(this) || this;
            _this.request = request;
            _this.entityList = entityList;
            _this.form = new _Ext.ReplaceRowForm(_this.idPrefix);
            _this.dialogTitle = 'Replace Row';
            _this.form.DeletedEntityName.value = request.DeletedEntityName;
            _this.form.ReplaceWithEntityId.items = entityList.map(function (m) { return { id: String(m[request.IdProperty]), text: m[request.NameProperty], source: m }; });
            return _this;
        }
        ReplaceRowDialog.prototype.getFormKey = function () { return _Ext.ReplaceRowForm.formKey; };
        ReplaceRowDialog.prototype.getToolbarButtons = function () {
            var _this = this;
            var buttons = [];
            _super.prototype.getToolbarButtons.call(this);
            buttons.push({
                title: 'Replace',
                icon: 'fa fa fa-trash-o',
                onClick: function () {
                    if (_this.validateForm() == false)
                        return;
                    Q.confirm("Are you sure? \n\n" + _this.request.EntityTypeTitle + ": \"" + _this.request.DeletedEntityName + "\" will be deleted \nand all references will be replaced with \"" + _this.form.ReplaceWithEntityId.text + "\". \n\nThis action cannot be undone!\n\n", function () {
                        _this.request.ReplaceWithEntityId = Q.toId(_this.form.ReplaceWithEntityId.value);
                        Q.serviceRequest(Q.resolveUrl('~/Services/ReplaceRow/Replace'), _this.request, function (response) {
                            _this.dialogClose();
                            if (window['lastGrid']) //for single paged apps
                                window['lastGrid'].refresh();
                        });
                    });
                }
            });
            return buttons;
        };
        ReplaceRowDialog = __decorate([
            Serenity.Decorators.registerClass(),
            Serenity.Decorators.maximizable()
        ], ReplaceRowDialog);
        return ReplaceRowDialog;
    }(_Ext.DialogBase));
    _Ext.ReplaceRowDialog = ReplaceRowDialog;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var DevTools;
    (function (DevTools) {
        var SergenPanel = /** @class */ (function (_super) {
            __extends(SergenPanel, _super);
            function SergenPanel(container) {
                var _this = _super.call(this, container) || this;
                var vm = new Vue({
                    el: $('<div/>').appendTo(_this.element)[0],
                    data: {
                        connection: "",
                        connections: [],
                        tables: [],
                        generate: {
                            Row: true,
                            Service: true,
                            UI: true
                        }
                    },
                    methods: {
                        generateCode: function (table) {
                            if (!table.Identifier) {
                                Q.notifyError("Identifier cannot be empty!");
                                return;
                            }
                            if (!table.Module) {
                                Q.notifyError("Module cannot be empty!");
                                return;
                            }
                            DevTools.SergenService.Generate({
                                ConnectionKey: this.connection,
                                Table: table,
                                GenerateOptions: this.generate
                            }, function (r) {
                                Q.notifySuccess("Code for selected table is generated. You'll need to rebuild your project.");
                            });
                        }
                    },
                    watch: {
                        connection: function (val) {
                            if (!val || !val.length)
                                vm.tables = [];
                            else
                                DevTools.SergenService.ListTables({
                                    ConnectionKey: val
                                }, function (response) { return vm.tables = response.Entities; });
                        }
                    },
                    template: Q.getTemplate('_Ext.SergenPanel')
                });
                DevTools.SergenService.ListConnections({}, function (response) { return vm.connections = response.Entities; });
                return _this;
            }
            return SergenPanel;
        }(Serenity.Widget));
        DevTools.SergenPanel = SergenPanel;
    })(DevTools = _Ext.DevTools || (_Ext.DevTools = {}));
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var AutoCompleteEditor = /** @class */ (function (_super) {
        __extends(AutoCompleteEditor, _super);
        function AutoCompleteEditor(input, options) {
            var _this = _super.call(this, input) || this;
            _this.options = options;
            input.bind('change', function (e) {
                if (!Serenity.WX.hasOriginalEvent(e)) {
                    return;
                }
            });
            setTimeout(function () {
                _this.bindAutoComplete(input);
            }, 1000);
            return _this;
        }
        AutoCompleteEditor.prototype.bindAutoComplete = function (input) {
            var opt = this.options;
            var source = opt.sourceArray;
            if (opt.sourceCSV) {
                source = opt.sourceCSV.split(',');
            }
            else if (this.options.lookupKey) {
                var lookup_1 = Q.getLookup(opt.lookupKey);
                source = lookup_1.items.map(function (m) { return m[lookup_1.textField]; });
            }
            input.autocomplete({
                minLength: opt.minSearchLength || 0,
                autoFocus: true,
                source: source,
                focus: function (event, ui) {
                    //$(".ui-helper-hidden-accessible").hide();  //fix issue with the selected data showing up on webpage
                    //event.preventDefault();
                    //return false;
                },
            });
            input.data("ui-autocomplete")._renderItem = function (ul, item) {
                return $("<li>")
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };
            input.bind('click', function (e) {
                var wasOpen = input.autocomplete("widget").is(":visible");
                // Close if already visible
                if (wasOpen) {
                    return;
                }
                // Pass empty string as value to search for, displaying all results
                input.autocomplete("search", "");
            });
        };
        AutoCompleteEditor = __decorate([
            Serenity.Decorators.registerEditor()
        ], AutoCompleteEditor);
        return AutoCompleteEditor;
    }(Serenity.StringEditor));
    _Ext.AutoCompleteEditor = AutoCompleteEditor;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var ColorEditor = /** @class */ (function (_super) {
        __extends(ColorEditor, _super);
        function ColorEditor(container) {
            var _this = _super.call(this, container) || this;
            try {
                _this.element.colorpicker({ format: "hex" });
            }
            catch (e) { }
            return _this;
        }
        ColorEditor.prototype.getTemplate = function () {
            usingBootstrapColorPicker();
            return "<div class=\"input-group colorpicker-component\">\n                        <input type=\"text\" value=\"#00AABB\" class=\"form-control\" />\n                        <span class=\"input-group-addon\"><i></i></span>\n                    </div>";
        };
        ;
        ColorEditor.prototype.getEditValue = function (property, target) {
            try {
                var editVal = this.element.colorpicker().data().color;
                target[property.name] = editVal;
            }
            catch (e) { }
        };
        ColorEditor.prototype.setEditValue = function (source, property) {
            var val = source[property.name];
            //this.element.children('input').val(val);
            try {
                this.element.data('colorpicker').setValue(val);
            }
            catch (e) { }
        };
        ColorEditor = __decorate([
            Serenity.Decorators.registerClass([Serenity.IGetEditValue, Serenity.ISetEditValue]),
            Serenity.Decorators.editor(),
            Serenity.Decorators.element("<div/>")
        ], ColorEditor);
        return ColorEditor;
    }(Serenity.TemplatedWidget));
    _Ext.ColorEditor = ColorEditor;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var DateTimePickerEditor = /** @class */ (function (_super) {
        __extends(DateTimePickerEditor, _super);
        function DateTimePickerEditor(container) {
            var _this = _super.call(this, container) || this;
            usingJqueryUITimepickerAddon();
            _this.element.datetimepicker({
                timeInput: true,
                controlType: 'select',
                oneLine: true,
                timeFormat: "HH:mm",
                showOn: "button"
            });
            return _this;
        }
        DateTimePickerEditor.prototype.getEditValue = function (property, target) { target[property.name] = this.value; };
        DateTimePickerEditor.prototype.setEditValue = function (source, property) { this.value = source[property.name]; };
        Object.defineProperty(DateTimePickerEditor.prototype, "value", {
            //http://trentrichardson.com/examples/timepicker
            get: function () {
                return Q.formatDate(this.valueAsDate, 'yyyy-MM-ddTHH:mm');
            },
            set: function (val) {
                this.valueAsDate = Q.parseISODateTime(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTimePickerEditor.prototype, "valueAsDate", {
            get: function () {
                var val = this.element.datetimepicker('getDate');
                return val;
            },
            set: function (val) {
                this.element.datetimepicker('setDate', val);
            },
            enumerable: true,
            configurable: true
        });
        DateTimePickerEditor.prototype.get_readOnly = function () {
            return this.element.hasClass('readonly');
        };
        DateTimePickerEditor.prototype.set_readOnly = function (value) {
            if (value == true) {
                this.element.datetimepicker("option", "disabled", true);
                this.element.addClass('readonly');
                this.element.attr("disabled");
            }
            else {
                this.element.datetimepicker("option", "disabled", false);
                this.element.removeClass('readonly');
                this.element.removeAttr("disabled");
            }
        };
        DateTimePickerEditor.prototype.set_minDate = function (date) {
            this.element.datetimepicker('option', 'minDate', date);
        };
        DateTimePickerEditor.prototype.set_maxDate = function (date) {
            this.element.datetimepicker('option', 'maxDate', date);
        };
        DateTimePickerEditor.prototype.set_minDateTime = function (date) {
            this.element.datetimepicker('option', 'minDateTime', date);
        };
        DateTimePickerEditor.prototype.set_maxDateTime = function (date) {
            this.element.datetimepicker('option', 'maxDateTime', date);
        };
        DateTimePickerEditor = __decorate([
            Serenity.Decorators.registerClass([Serenity.IGetEditValue, Serenity.ISetEditValue, Serenity.IReadOnly]),
            Serenity.Decorators.editor(),
            Serenity.Decorators.element("<input/>")
        ], DateTimePickerEditor);
        return DateTimePickerEditor;
    }(Serenity.Widget));
    _Ext.DateTimePickerEditor = DateTimePickerEditor;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var EmptyLookupEditor = /** @class */ (function (_super) {
        __extends(EmptyLookupEditor, _super);
        function EmptyLookupEditor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EmptyLookupEditor.prototype.setSelect2Items = function (items) {
            var _this = this;
            this.clearItems();
            items.forEach(function (item) { _this.addItem(item); });
        };
        EmptyLookupEditor.prototype.setLookupItems = function (lookup) {
            var items = lookup.items.map(function (m) {
                return {
                    id: m[lookup.idField],
                    text: m[lookup.textField],
                    source: m
                };
            });
            this.setSelect2Items(items);
        };
        EmptyLookupEditor = __decorate([
            Serenity.Decorators.registerEditor()
        ], EmptyLookupEditor);
        return EmptyLookupEditor;
    }(Serenity.LookupEditorBase));
    _Ext.EmptyLookupEditor = EmptyLookupEditor;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var HardCodedLookupEditor = /** @class */ (function (_super) {
        __extends(HardCodedLookupEditor, _super);
        function HardCodedLookupEditor(container, options) {
            var _this = _super.call(this, container, options) || this;
            var source = options.sourceArray;
            if (options.sourceCSV) {
                source = options.sourceCSV.split(',');
            }
            source.forEach(function (i) { return _this.addOption(i, i); });
            return _this;
        }
        HardCodedLookupEditor.prototype.getSelect2Options = function () {
            var opt = _super.prototype.getSelect2Options.call(this);
            return opt;
        };
        HardCodedLookupEditor = __decorate([
            Serenity.Decorators.registerEditor()
        ], HardCodedLookupEditor);
        return HardCodedLookupEditor;
    }(Serenity.Select2Editor));
    _Ext.HardCodedLookupEditor = HardCodedLookupEditor;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var HtmlTemplateEditor = /** @class */ (function (_super) {
        __extends(HtmlTemplateEditor, _super);
        function HtmlTemplateEditor(textArea, opt) {
            return _super.call(this, textArea, opt) || this;
        }
        HtmlTemplateEditor.prototype.getConfig = function () {
            var config = _super.prototype.getConfig.call(this);
            var placehorders = this.options.placeholders;
            if (placehorders) {
                config.placeholder_select = {
                    placeholders: placehorders.split(',')
                };
                config.extraPlugins += ',richcombo,placeholder_select';
            }
            config.allowedContent = true;
            config.enterMode = window['CKEDITOR'].ENTER_BR;
            config.extraPlugins += ',showborders';
            config.removePlugins += ',uploadimage';
            //config.forcePasteAsPlainText = true;
            //config.toolbar = [['placeholder_select']];
            config.removeButtons += ',Cut,Copy,Paste,PasteText,PasteFromWord' +
                ',SpecialChar,Subscript,Superscript,Styles,' +
                'Link,Unlink,CreatePlaceholder,' +
                'Image,Anchor,Blockquote,BGColor,' +
                'Superscript,RemoveFormat';
            return config;
        };
        HtmlTemplateEditor = __decorate([
            Serenity.Decorators.editor(),
            Serenity.Decorators.element("<div/>")
        ], HtmlTemplateEditor);
        return HtmlTemplateEditor;
    }(Serenity.HtmlContentEditor));
    _Ext.HtmlTemplateEditor = HtmlTemplateEditor;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var MonthYearEditor = /** @class */ (function (_super) {
        __extends(MonthYearEditor, _super);
        function MonthYearEditor(container) {
            return _super.call(this, container) || this;
        }
        MonthYearEditor.prototype.getEditValue = function (property, target) { target[property.name] = this.value; };
        MonthYearEditor.prototype.setEditValue = function (source, property) { this.value = source[property.name]; };
        Object.defineProperty(MonthYearEditor.prototype, "value", {
            get: function () {
                return this.element.val();
            },
            set: function (val) {
                this.element.val(Q.formatDate(val, 'yyyy-MM'));
            },
            enumerable: true,
            configurable: true
        });
        MonthYearEditor.prototype.get_readOnly = function () {
            return this.element.hasClass('readonly');
        };
        MonthYearEditor.prototype.set_readOnly = function (value) {
            if (value == true) {
                this.element.addClass('readonly');
                this.element.attr("disabled");
            }
            else {
                this.element.removeClass('readonly');
                this.element.removeAttr("readonly");
                this.element.removeAttr("disabled");
            }
        };
        MonthYearEditor = __decorate([
            Serenity.Decorators.registerClass([Serenity.IGetEditValue, Serenity.ISetEditValue, Serenity.IReadOnly]),
            Serenity.Decorators.editor(),
            Serenity.Decorators.element('<input type="month"/>')
        ], MonthYearEditor);
        return MonthYearEditor;
    }(Serenity.Widget));
    _Ext.MonthYearEditor = MonthYearEditor;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var PrefixedStringEditor = /** @class */ (function (_super) {
        __extends(PrefixedStringEditor, _super);
        function PrefixedStringEditor(container, options) {
            var _this = _super.call(this, container, options) || this;
            _this.options = options;
            var fontSize = parseFloat(window.getComputedStyle(_this.element[0]).fontSize);
            var prefixInputWidth = options.prefixLength * fontSize;
            _this.prefixInput = $('<input type="text"/>')
                .addClass('readonly')
                .attr('style', "width:" + prefixInputWidth + "px;")
                .attr('disabled', 'disabled')
                .insertBefore(_this.element);
            _this.element.addClass('has-inplace-button');
            if (options.inputMaxLength) {
                setTimeout(function () { _this.element.attr('maxlength', options.inputMaxLength); }, 1000);
            }
            return _this;
        }
        PrefixedStringEditor.prototype.getEditValue = function (property, target) { target[property.name] = this.value; };
        PrefixedStringEditor.prototype.setEditValue = function (source, property) { this.value = source[property.name]; };
        Object.defineProperty(PrefixedStringEditor.prototype, "value", {
            get: function () {
                var inputVal = this.element.val();
                return this.prefix + inputVal;
            },
            set: function (val) {
                if (val) {
                    val = val.replace(' ', '');
                    var prefix = val.substr(0, this.options.prefixLength);
                    var inputVal = val.substr(this.options.prefixLength);
                    this.prefix = prefix;
                    this.element.val(inputVal);
                }
                else {
                    this.element.val(val);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PrefixedStringEditor.prototype, "prefix", {
            get: function () {
                return this._prefix;
            },
            set: function (val) {
                this._prefix = val;
                if (this.options.prefixFormatterType) {
                    var formatterType = Q.typeByFullName(this.options.prefixFormatterType);
                    if (formatterType)
                        this.prefixInput.val(formatterType.format(val));
                    else
                        this.prefixInput.val(val);
                }
                else {
                    this.prefixInput.val(val);
                }
            },
            enumerable: true,
            configurable: true
        });
        PrefixedStringEditor.prototype.get_readOnly = function () {
            return this.element.hasClass('readonly');
        };
        PrefixedStringEditor.prototype.set_readOnly = function (value) {
            if (value == true) {
                this.element.addClass('readonly');
                this.element.attr("readonly", "readonly");
            }
            else {
                this.element.removeClass('readonly');
                this.element.removeAttr("readonly");
            }
        };
        PrefixedStringEditor = __decorate([
            Serenity.Decorators.registerClass([Serenity.IGetEditValue, Serenity.ISetEditValue, Serenity.IReadOnly]),
            Serenity.Decorators.editor(),
            Serenity.Decorators.element('<input type="text"/>')
        ], PrefixedStringEditor);
        return PrefixedStringEditor;
    }(Serenity.Widget));
    _Ext.PrefixedStringEditor = PrefixedStringEditor;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var StaticTextBlock = /** @class */ (function (_super) {
        __extends(StaticTextBlock, _super);
        function StaticTextBlock(container, options) {
            var _this = _super.call(this, container, options) || this;
            // hide the caption label for this editor if in a form. ugly hack
            if (_this.options.hideLabel)
                _this.element.closest('.field').find('.caption').hide();
            // remove required asterisk (*)
            _this.element.closest('.field').find('sup').hide();
            _this.updateElementContent();
            return _this;
        }
        StaticTextBlock.prototype.updateElementContent = function () {
            var text = Q.coalesce(this.options.text, this._value);
            if (this.options.isDate)
                text = Q.formatDate(text);
            if (this.options.isDateTime)
                text = Q.formatDate(text, Q.Culture.dateTimeFormat);
            // if isLocalText is set, text is actually a local text key
            if (this.options.isLocalText)
                text = Q.text(text);
            // don't html encode if isHtml option is true
            if (this.options.isHtml)
                this.element.html(text);
            else
                this.element.text(text);
        };
        /**
         * By implementing ISetEditValue interface, we allow this editor to display its field value.
         * But only do this when our text content is not explicitly set in options
         */
        StaticTextBlock.prototype.setEditValue = function (source, property) {
            if (this.options.text == null) {
                this._value = Q.coalesce(this.options.text, source[property.name]);
                this.updateElementContent();
            }
        };
        Object.defineProperty(StaticTextBlock.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
                this.updateElementContent();
            },
            enumerable: true,
            configurable: true
        });
        StaticTextBlock = __decorate([
            Serenity.Decorators.element("<div/>"),
            Serenity.Decorators.registerEditor([Serenity.ISetEditValue])
        ], StaticTextBlock);
        return StaticTextBlock;
    }(Serenity.Widget));
    _Ext.StaticTextBlock = StaticTextBlock;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var GridItemPickerEditor = /** @class */ (function (_super) {
        __extends(GridItemPickerEditor, _super);
        function GridItemPickerEditor(container, options) {
            var _this = _super.call(this, container, options) || this;
            _this.options = options;
            _this.selectedItemIncludeColumns = [];
            _this.addInplaceButtons();
            _this.setCascadeFrom(_this.options.cascadeFrom);
            return _this;
        }
        GridItemPickerEditor.prototype.getTemplate = function () {
            return "<input type=\"text\" class=\"value select2-offscreen\" />\n                    <span class=\"select2-choice\">\n                        <span class=\"display-text\" style=\"user-select: text; padding-right: 20px;\"></span>\n                        <a class=\"select2-search-choice-close btn-clear-selection\" style=\"margin-top: 2px; cursor: pointer\"></a>\n                    </span>\n                    ";
        };
        ;
        GridItemPickerEditor.prototype.addInplaceButtons = function () {
            var _this = this;
            var self = this;
            this.element.addClass('select2-container has-inplace-button');
            this.inplaceSearchButton = $('<a style="padding-top: 2px;"><i class="fa fa-search"></i></a>')
                .addClass('inplace-button inplace-search align-center').attr('title', 'search')
                .insertAfter(this.element)
                .click(function (e) {
                self.inplaceSearchClick(e);
            });
            this.inplaceViewButton = $('<a style="padding-top: 2px;"><i class="fa fa-eye"></i></a>')
                .addClass('inplace-button inplace-view align-center').attr('title', 'view')
                .click(function (e) {
                self.inplaceViewClick(e);
            })
                .hide();
            if (this.options.inplaceView != false && !this.options.multiple) {
                this.inplaceViewButton.insertAfter(this.element);
            }
            this.clearSelectionButton = this.element.find('.select2-search-choice-close')
                .click(function (e) {
                _this.value = null;
                _this.text = '';
                _this._selectedItem = null;
                _this.selectedItems = [];
                $(e.target).hide();
                _this.element.trigger('change');
                //this.element.triggerHandler('change');
            })
                .hide();
        };
        GridItemPickerEditor.prototype.inplaceSearchClick = function (e) {
            var _this = this;
            var pickerDialog = new _Ext.GridItemPickerDialog(this.options);
            pickerDialog.onSuccess = function (selectedItems) {
                _this.value = pickerDialog.checkGrid.rowSelection.getSelectedKeys().join(',');
                _this.text = selectedItems.map(function (m) { return m[_this.options.nameFieldInGridRow]; }).join(', ');
                if (Q.isEmptyOrNull(_this.text)) {
                    console.warn('nameFieldInGridRow might be wrong in ' + _this.widgetName);
                }
                _this._selectedItem = selectedItems[0];
                _this.selectedItems = selectedItems;
                _this.element.trigger('change');
                //this.element.triggerHandler('change');
            };
            pickerDialog.dialogOpen();
        };
        GridItemPickerEditor.prototype.inplaceViewClick = function (e) {
            var val = this.value;
            if (!Q.isEmptyOrNull(val)) {
                var dlg = this.getDialogInstance();
                dlg.isReadOnly = true;
                dlg.loadByIdAndOpenDialog(val, false);
            }
        };
        GridItemPickerEditor.prototype.getDialogInstance = function () {
            var dialogType = this.options.dialogType;
            if (!dialogType.prototype)
                dialogType = Q.typeByFullName(this.options.dialogType);
            try {
                var dlg = new dialogType();
                return dlg;
            }
            catch (ex) {
                console.warn('Could not intialize ' + this.options.dialogType);
            }
        };
        Object.defineProperty(GridItemPickerEditor.prototype, "value", {
            get: function () {
                var editVal = this.element.find('input.value').val();
                return editVal;
            },
            set: function (val) {
                this.element.find('input.value').val(val);
                if (Q.isEmptyOrNull(val)) {
                    this.text = '';
                    this.inplaceViewButton.hide();
                    this.clearSelectionButton.hide();
                }
                else {
                    this.inplaceViewButton.show();
                    if (this.get_readOnly() == false)
                        this.clearSelectionButton.show();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridItemPickerEditor.prototype, "text", {
            get: function () {
                var editVal = this.element.find('span.display-text').text();
                return editVal;
            },
            set: function (val) {
                this.element.find('span.display-text').text(val);
            },
            enumerable: true,
            configurable: true
        });
        GridItemPickerEditor.prototype.getEditValue = function (property, target) { target[property.name] = this.value; };
        GridItemPickerEditor.prototype.setEditValue = function (source, property) {
            this.value = source[property.name];
            this.text = source[this.options.nameFieldInThisRow];
            if (source[property.name] && source[this.options.nameFieldInThisRow]) {
                this._selectedItem = {};
                this._selectedItem[this.options.idFieldInGridRow] = source[property.name];
                this._selectedItem[this.options.nameFieldInGridRow] = source[this.options.nameFieldInThisRow];
            }
        };
        GridItemPickerEditor.prototype.get_value = function () {
            return this.value;
        };
        GridItemPickerEditor.prototype.set_value = function (value) {
            this.value = value;
        };
        GridItemPickerEditor.prototype.get_readOnly = function () {
            return this.element.hasClass('readonly');
        };
        GridItemPickerEditor.prototype.set_readOnly = function (value) {
            if (value) {
                this.element.addClass('select2-container-disabled readonly');
                this.inplaceSearchButton.addClass('disabled').hide();
                this.clearSelectionButton.addClass('disabled').hide();
            }
            else {
                this.element.removeClass('select2-container-disabled readonly');
                this.inplaceSearchButton.removeClass('disabled').show();
                this.clearSelectionButton.removeClass('disabled').show();
            }
        };
        GridItemPickerEditor.prototype.get_required = function () {
            return this.element.find('input.value').hasClass('required');
        };
        GridItemPickerEditor.prototype.set_required = function (value) {
            if (value) {
                this.element.find('input.value, .select2-choice, span.display-text').addClass('required');
            }
            ;
        };
        Object.defineProperty(GridItemPickerEditor.prototype, "selectedItem", {
            get: function () {
                var _this = this;
                if (this._selectedItem
                    && this._selectedItem[this.options.nameFieldInGridRow]
                    && this.selectedItemIncludeColumns.every(function (e) { return _this._selectedItem[e]; }))
                    return this._selectedItem;
                else if (!Q.isEmptyOrNull(this.value)) {
                    Q.serviceCall({
                        service: this.serviceUrl + '/Retrieve',
                        request: {
                            EntityId: this.value,
                            ColumnSelection: 2 /* list */,
                            IncludeColumns: this.selectedItemIncludeColumns
                        },
                        async: false,
                        onSuccess: function (response) {
                            _this._selectedItem = response.Entity;
                        }
                    });
                    return this._selectedItem;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridItemPickerEditor.prototype, "serviceUrl", {
            get: function () {
                if (Q.isEmptyOrNull(this._serviceUrl)) {
                    var dlg = this.getDialogInstance();
                    this._serviceUrl = dlg['getService']();
                }
                return this._serviceUrl;
            },
            enumerable: true,
            configurable: true
        });
        GridItemPickerEditor.prototype.setValueAndText = function (value, text) {
            this.value = value;
            this.text = text;
        };
        //-------------------------------cascading and filtering -----------------------------------
        GridItemPickerEditor.prototype.getCascadeFromValue = function (parent) {
            return Serenity.EditorUtils.getValue(parent);
        };
        GridItemPickerEditor.prototype.setCascadeFrom = function (value) {
            var _this = this;
            if (Q.isEmptyOrNull(value)) {
                if (this.cascadeLink != null) {
                    this.cascadeLink.set_parentID(null);
                    this.cascadeLink = null;
                }
                this.options.cascadeFrom = null;
                return;
            }
            this.cascadeLink = new Serenity.CascadedWidgetLink(Serenity.Widget, this, function (p) {
                _this.set_cascadeValue(_this.getCascadeFromValue(p));
            });
            this.cascadeLink.set_parentID(value);
            this.options.cascadeFrom = value;
        };
        GridItemPickerEditor.prototype.get_cascadeFrom = function () {
            return this.options.cascadeFrom;
        };
        Object.defineProperty(GridItemPickerEditor.prototype, "cascadeFrom", {
            get: function () {
                return this.get_cascadeFrom();
            },
            set: function (value) {
                this.set_cascadeFrom(value);
            },
            enumerable: true,
            configurable: true
        });
        GridItemPickerEditor.prototype.set_cascadeFrom = function (value) {
            if (value !== this.options.cascadeFrom) {
                this.setCascadeFrom(value);
                this.updateItems();
            }
        };
        GridItemPickerEditor.prototype.get_cascadeField = function () {
            return Q.coalesce(this.options.cascadeField, this.options.cascadeFrom);
        };
        Object.defineProperty(GridItemPickerEditor.prototype, "cascadeField", {
            get: function () {
                return this.get_cascadeField();
            },
            set: function (value) {
                this.set_cascadeField(value);
            },
            enumerable: true,
            configurable: true
        });
        GridItemPickerEditor.prototype.set_cascadeField = function (value) {
            this.options.cascadeField = value;
        };
        GridItemPickerEditor.prototype.get_cascadeValue = function () {
            return this.options.cascadeValue;
        };
        Object.defineProperty(GridItemPickerEditor.prototype, "cascadeValue", {
            get: function () {
                return this.get_cascadeValue();
            },
            set: function (value) {
                this.set_cascadeValue(value);
            },
            enumerable: true,
            configurable: true
        });
        GridItemPickerEditor.prototype.set_cascadeValue = function (value) {
            if (this.options.cascadeValue !== value) {
                this.options.cascadeValue = value;
                this.set_value(null);
                this.updateItems();
                this.options.filteringCriteria = [[this.cascadeField], '=', value];
            }
        };
        GridItemPickerEditor.prototype.get_filterField = function () {
            return this.options.filterField;
        };
        Object.defineProperty(GridItemPickerEditor.prototype, "filterField", {
            get: function () {
                return this.get_filterField();
            },
            set: function (value) {
                this.set_filterField(value);
            },
            enumerable: true,
            configurable: true
        });
        GridItemPickerEditor.prototype.set_filterField = function (value) {
            this.options.filterField = value;
        };
        GridItemPickerEditor.prototype.get_filterValue = function () {
            return this.options.filterValue;
        };
        Object.defineProperty(GridItemPickerEditor.prototype, "filterValue", {
            get: function () {
                return this.get_filterValue();
            },
            set: function (value) {
                this.set_filterValue(value);
            },
            enumerable: true,
            configurable: true
        });
        GridItemPickerEditor.prototype.set_filterValue = function (value) {
            if (this.options.filterValue !== value) {
                this.options.filterValue = value;
                this.set_value(null);
                this.updateItems();
                this.options.filteringCriteria = [[this.cascadeField], '=', value];
            }
        };
        GridItemPickerEditor.prototype.updateItems = function () {
        };
        GridItemPickerEditor = __decorate([
            Serenity.Decorators.registerClass([Serenity.ISetEditValue, Serenity.IGetEditValue, Serenity.IStringValue, Serenity.IReadOnly, Serenity.IValidateRequired]),
            Serenity.Decorators.editor(),
            Serenity.Decorators.element('<div/>')
        ], GridItemPickerEditor);
        return GridItemPickerEditor;
    }(Serenity.TemplatedWidget));
    _Ext.GridItemPickerEditor = GridItemPickerEditor;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var MonthYearFormatter = /** @class */ (function () {
        function MonthYearFormatter() {
        }
        MonthYearFormatter_1 = MonthYearFormatter;
        MonthYearFormatter.format = function (val) {
            if (val) {
                if (val.length == 7)
                    val += '-01';
                var valDate = Q.parseISODateTime(val);
                return q.getEnumText('Months', valDate.getMonth()) + '-' + valDate.getFullYear();
            }
            else
                return '';
        };
        MonthYearFormatter.prototype.format = function (ctx) {
            return MonthYearFormatter_1.format(ctx.value);
        };
        var MonthYearFormatter_1;
        MonthYearFormatter = MonthYearFormatter_1 = __decorate([
            Serenity.Decorators.registerFormatter([Serenity.ISlickFormatter])
        ], MonthYearFormatter);
        return MonthYearFormatter;
    }());
    _Ext.MonthYearFormatter = MonthYearFormatter;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var CardViewMixin = /** @class */ (function () {
        function CardViewMixin(options) {
            var _this = this;
            this.options = options;
            var u, f;
            var dg = this.dataGrid = options.grid;
            var idProperty = dg.getIdProperty();
            var getId = this.getId = function (item) { return item[idProperty]; };
            options.defaultViewType = options.defaultViewType || 'list';
            this.viewType = options.defaultViewType;
            var divViewSwitch = $('\n<div class="btn-group view-switch" data-toggle="buttons" style="float: right">\n    <label class="btn btn-default active" title="List View">\n        <i class="fa fa-th-list text-purple"><\/i>\n        <input type="radio" name="' + dg.element.attr("id") + '_ViewType" value="list" checked />\n    <\/label>\n    <label class="btn btn-default" title="Card View">\n        <i class="fa fa-th-large text-purple"><\/i>\n        <input type="radio" name="' + dg.element.attr("id") + '_ViewType" value="card" />    \n    <\/label>\n<\/div>')
                .prependTo(dg.element.find(".grid-title"));
            this.cardContainer = $('<div class="card-container" style="display: none;"><div class="card-items"><\/div><\/div>').insertAfter(dg.element.children(".grid-container"));
            divViewSwitch.find("input").change(function (e) {
                return _this.switchView($(e.target).val());
            });
            this.resizeCardView();
            dg.element.bind("layout", function () {
                return _this.resizeCardView();
            });
            dg.view.onDataChanged.subscribe(function () {
                _this.vm && _this.updateCardItems();
            });
            u = dg.getCurrentSettings;
            dg.getCurrentSettings = function (n) {
                var i = u.apply(dg, [n]);
                return i.viewType = divViewSwitch.find("input:checked").val(), i;
            };
            f = dg.restoreSettings;
            dg.restoreSettings = function (n, i) {
                var u, e, o, s;
                if (f.apply(dg, [n, i]),
                    n == null) {
                    if (u = this.getPersistanceStorage(),
                        u == null)
                        return;
                    if (e = Q.trimToNull(u.getItem(this.getPersistanceKey())),
                        !e)
                        return;
                    n = JSON.parse(e);
                }
                o = n.viewType || options.defaultViewType;
                s = divViewSwitch.find("input:checked").val() || options.defaultViewType;
                o != s && divViewSwitch.find("input").eq(o == "card" ? 1 : 0).click();
            };
        }
        CardViewMixin.prototype.switchView = function (viewType) {
            this.resizeCardView();
            var isCardView = viewType == "card";
            this.dataGrid.element.children(".card-container").toggle(isCardView);
            this.dataGrid.element.children(".grid-container").toggle(!isCardView);
            isCardView && this.updateCardItems();
            this.dataGrid.persistSettings();
        };
        CardViewMixin.prototype.updateCardItems = function () {
            if (this.vm)
                this.vm.items = this.dataGrid.getItems();
            else {
                usingVuejs();
                this.vm = new Vue({
                    el: this.cardContainer.children()[0],
                    template: this.options.containerTemplate ? "<div> " + this.options.containerTemplate + " </div>"
                        : "<div class=\"card-items\">\n    <div v-for=\"(item, index) in items\" class=\"" + (this.options.itemCssClass || 'col-sm-12 col-md-6 col-lg-4') + "\">\n        <div class=\"card-item\" style=\"" + this.options.itemCssStyle + "\">\n        " + this.options.itemTemplate + "\n        </div>\n    </div>\n</div>",
                    data: {
                        items: this.dataGrid.getItems()
                    },
                    methods: this.options.methods
                });
            }
        };
        CardViewMixin.prototype.resizeCardView = function () {
            var gridContainer = this.dataGrid.element.children(".grid-container"), width = this.dataGrid.element.width(), height = gridContainer.height();
            this.dataGrid.element.children(".card-container").css({
                width: width + "px",
                height: height + "px"
            });
        };
        return CardViewMixin;
    }());
    _Ext.CardViewMixin = CardViewMixin;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    /**
     * A mixin that can be applied to a DataGrid for excel style filtering functionality
     */
    var HeaderFiltersMixin = /** @class */ (function () {
        function HeaderFiltersMixin(options) {
            this.options = options;
            var dg = this.dataGrid = options.grid;
            var currentColumn = null;
            var cachedValues = {};
            usingSlickHeaderFilters();
            var headerFilters = new Slick['Plugins'].HeaderFilters({
                getFilterValues: function (column, setFilterableValues) {
                    if (!dg.view.url || !dg.view["getPagingInfo"]().rowsPerPage || dg.view.getLength() == 0
                        && !Q.any(dg.slickGrid.getColumns(), function (x) { return x.filterValues && x.filterValues.length > 0; })) {
                        return null;
                    }
                    currentColumn = column;
                    try {
                        if (!dg.onViewSubmit()) {
                            setFilterableValues([]);
                            return;
                        }
                    }
                    finally {
                        currentColumn = null;
                    }
                    var request = Q.deepClone(dg.view.params);
                    request.DistinctFields = [column.field];
                    request.Skip = 0;
                    request.Take = 0;
                    var cacheKey = $.toJSON(request);
                    var cachedValue = cachedValues[cacheKey];
                    if (cachedValue && cachedValue.expires > (new Date).getTime())
                        setFilterableValues(cachedValue.value);
                    else {
                        Q.serviceCall({
                            request: request,
                            url: dg.view.url,
                            onSuccess: function (response) {
                                cachedValues[cacheKey] = {
                                    value: response.Values,
                                    expires: (new Date).getTime() + 1e3 * 30
                                };
                                setFilterableValues(response.Values);
                            }
                        });
                    }
                },
                isFilterable: function (column) {
                    return column.sourceItem != null && column.sortable && (column.sourceItem.notFilterable == null || !column.sourceItem.notFilterable);
                }
            });
            headerFilters.onFilterApplied.subscribe(function () {
                dg.refresh();
            });
            dg.slickGrid.registerPlugin(headerFilters);
            var oldOnViewSubmit = dg.onViewSubmit;
            dg.onViewSubmit = function () {
                if (!oldOnViewSubmit.call(dg))
                    return false;
                var columns = dg.slickGrid.getColumns();
                var request = dg.view.params;
                for (var n = 0; n < columns.length; n++) {
                    var column = columns[n];
                    if (column === currentColumn)
                        continue;
                    var filterValues = column.filterValues;
                    if (filterValues && filterValues.length) {
                        var u = filterValues.filter(function (f) { return f != null; });
                        var d = [[column.field], "in", [u]];
                        if (u.length !== filterValues.length) {
                            if (u.length > 0)
                                d = Serenity.Criteria.or(["is null", [column.field]], d);
                            else
                                d = ["is null", [column.field]];
                        }
                        request.Criteria = Serenity.Criteria.and(request.Criteria, d);
                    }
                }
                return true;
            };
        }
        return HeaderFiltersMixin;
    }());
    _Ext.HeaderFiltersMixin = HeaderFiltersMixin;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    /**
     * A mixin that can be applied to a DataGrid for tree functionality
     */
    var TreeGridMixin = /** @class */ (function () {
        function TreeGridMixin(options) {
            this.options = options;
            var dg = this.dataGrid = options.grid;
            var idProperty = options.idField || dg.getIdProperty();
            var getId = this.getId = function (item) { return item[idProperty]; };
            dg.element.find('.grid-container').on('click', function (e) {
                if ($(e.target).hasClass('s-TreeToggle')) {
                    var src = dg.slickGrid.getCellFromEvent(e);
                    if (src.cell >= 0 &&
                        src.row >= 0) {
                        TreeGridMixin.toggleClick(e, src.row, src.row, dg.view, getId);
                    }
                }
            });
            var oldViewFilter = dg.onViewFilter;
            dg.onViewFilter = function (item) {
                if (!oldViewFilter.apply(this, [item]))
                    return false;
                return TreeGridMixin.filterById(item, dg.view, idProperty, options.getParentId);
            };
            var oldProcessData = dg.onViewProcessData;
            dg.onViewProcessData = function (response) {
                response = oldProcessData.apply(this, [response]);
                response.Entities = TreeGridMixin.applyTreeOrdering(response.Entities, getId, options.getParentId);
                Serenity.SlickTreeHelper.setIndents(response.Entities, getId, options.getParentId, (options.initialCollapse && options.initialCollapse()) || false);
                return response;
            };
            if (options.toggleField) {
                var col = Q.first(dg.getGrid().getColumns(), function (x) { return x.field == options.toggleField; });
                col.format = TreeGridMixin.treeToggle(function () { return dg.view; }, getId, col.format || (function (ctx) { return Q.htmlEncode(ctx.value); }));
                col.formatter = Serenity.SlickHelper.convertToFormatter(col.format);
            }
        }
        /**
         * Expands / collapses all rows in a grid automatically
         */
        TreeGridMixin.prototype.toggleAll = function () {
            Serenity.SlickTreeHelper.setCollapsed(this.dataGrid.view.getItems(), !this.dataGrid.view.getItems().every(function (x) { return x._collapsed == true; }));
            this.dataGrid.view.setItems(this.dataGrid.view.getItems(), true);
        };
        TreeGridMixin.prototype.expandAll = function () {
            Serenity.SlickTreeHelper.setCollapsed(this.dataGrid.view.getItems(), false);
            this.dataGrid.view.setItems(this.dataGrid.view.getItems(), true);
        };
        TreeGridMixin.prototype.collapsedAll = function () {
            Serenity.SlickTreeHelper.setCollapsed(this.dataGrid.view.getItems(), true);
            this.dataGrid.view.setItems(this.dataGrid.view.getItems(), true);
        };
        /**
         * Reorders a set of items so that parents comes before their children.
         * This method is required for proper tree ordering, as it is not so easy to perform with SQL.
         * @param items list of items to be ordered
         * @param getId a delegate to get ID of a record (must return same ID with grid identity field)
         * @param getParentId a delegate to get parent ID of a record
         */
        TreeGridMixin.applyTreeOrdering = function (items, getId, getParentId) {
            var result = [];
            var byId = Q.toGrouping(items, getId);
            var byParentId = Q.toGrouping(items, getParentId);
            var visited = {};
            function takeChildren(theParentId) {
                if (visited[theParentId])
                    return;
                visited[theParentId] = true;
                for (var _i = 0, _a = (byParentId[theParentId] || []); _i < _a.length; _i++) {
                    var child = _a[_i];
                    result.push(child);
                    takeChildren(getId(child));
                }
            }
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                var parentId = getParentId(item);
                var hasParent = parentId != null;
                var parent_1 = byId[parentId];
                var isRootItem = !hasParent || !(parent_1 || []).length;
                if (isRootItem) {
                    result.push(item);
                    takeChildren(getId(item));
                }
            }
            return result;
        };
        TreeGridMixin.filterById = function (item, view, idProperty, getParentId) {
            return Serenity.SlickTreeHelper.filterCustom(item, function (x) {
                var parentId = getParentId(x);
                if (parentId == null) {
                    return null;
                }
                var items = view.getItems();
                var parentItem = items.filter(function (f) { return f[idProperty] == parentId; })[0];
                return parentItem;
            });
        };
        TreeGridMixin.treeToggle = function (getView, getId, formatter) {
            return function (ctx) {
                var text = formatter(ctx);
                var view = getView();
                var indent = Q.coalesce(ctx.item._indent, 0);
                var spacer = '<span class="s-TreeIndent" style="width:' + 15 * indent + 'px"></span>';
                var id = getId(ctx.item);
                var idx = view.getIdxById(ctx.item.__id || id);
                var next = view.getItemByIdx(idx + 1);
                if (next != null) {
                    var nextIndent = Q.coalesce(next._indent, 0);
                    if (nextIndent > indent) {
                        if (!!!!ctx.item._collapsed) {
                            return spacer + '<span class="s-TreeToggle s-TreeExpand"></span>' + text;
                        }
                        else {
                            return spacer + '<span class="s-TreeToggle s-TreeCollapse"></span>' + text;
                        }
                    }
                }
                return spacer + '<span class="s-TreeToggle"></span>' + text;
            };
        };
        TreeGridMixin.toggleClick = function (e, row, cell, view, getId) {
            var target = $(e.target);
            if (!target.hasClass('s-TreeToggle')) {
                return;
            }
            if (target.hasClass('s-TreeCollapse') || target.hasClass('s-TreeExpand')) {
                var item = view.getItem(row);
                if (item != null) {
                    if (!!!item._collapsed) {
                        item._collapsed = true;
                    }
                    else {
                        item._collapsed = false;
                    }
                    var id = getId(item);
                    view.updateItem(item.__id || id, item); //to support in-memory grid we check fake item.__id
                }
                if (e.shiftKey) {
                    view.beginUpdate();
                    try {
                        Serenity.SlickTreeHelper.setCollapsed(view.getItems(), !!item._collapsed);
                        view.setItems(view.getItems(), true);
                    }
                    finally {
                        view.endUpdate();
                    }
                }
            }
        };
        return TreeGridMixin;
    }());
    _Ext.TreeGridMixin = TreeGridMixin;
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var ExcelExportHelper;
    (function (ExcelExportHelper) {
        function createToolButton(options) {
            return {
                hint: Q.coalesce(options.title, 'Excel'),
                title: Q.coalesce(options.hint, ''),
                cssClass: 'export-xlsx-button',
                onClick: function () {
                    if (!options.onViewSubmit()) {
                        return;
                    }
                    var grid = options.grid;
                    var request = Q.deepClone(grid.getView().params);
                    request.Take = 0;
                    request.Skip = 0;
                    var sortBy = grid.getView().sortBy;
                    if (sortBy) {
                        request.Sort = sortBy;
                    }
                    request.IncludeColumns = [];
                    var columns = grid.getGrid().getColumns();
                    for (var _i = 0, columns_2 = columns; _i < columns_2.length; _i++) {
                        var column = columns_2[_i];
                        request.IncludeColumns.push(column.id || column.field);
                    }
                    Q.postToService({ service: options.service, request: request, target: '_blank' });
                },
                separator: options.separator
            };
        }
        ExcelExportHelper.createToolButton = createToolButton;
    })(ExcelExportHelper = _Ext.ExcelExportHelper || (_Ext.ExcelExportHelper = {}));
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var PdfExportHelper;
    (function (PdfExportHelper) {
        function toAutoTableColumns(srcColumns, columnStyles, columnTitles) {
            return srcColumns.map(function (src) {
                var col = {
                    dataKey: src.id || src.field,
                    title: src.name || ''
                };
                if (columnTitles && columnTitles[col.dataKey] != null)
                    col.title = columnTitles[col.dataKey];
                var style = {};
                if ((src.cssClass || '').indexOf("align-right") >= 0)
                    style.halign = 'right';
                else if ((src.cssClass || '').indexOf("align-center") >= 0)
                    style.halign = 'center';
                columnStyles[col.dataKey] = style;
                return col;
            });
        }
        function toAutoTableData(entities, keys, srcColumns) {
            var el = document.createElement('span');
            var row = 0;
            return entities.map(function (item) {
                var dst = {};
                for (var cell = 0; cell < srcColumns.length; cell++) {
                    var src = srcColumns[cell];
                    var fld = src.field || '';
                    var key = keys[cell];
                    var txt = void 0;
                    var html = void 0;
                    if (src.formatter) {
                        html = src.formatter(row, cell, item[fld], src, item);
                    }
                    else if (src.format) {
                        html = src.format({ row: row, cell: cell, item: item, value: item[fld] });
                    }
                    else {
                        dst[key] = item[fld];
                        continue;
                    }
                    if (!html || (html.indexOf('<') < 0 && html.indexOf('&') < 0))
                        dst[key] = html;
                    else {
                        el.innerHTML = html;
                        if (el.children.length == 1 &&
                            $(el.children[0]).is(":input")) {
                            dst[key] = $(el.children[0]).val();
                        }
                        else if (el.children.length == 1 &&
                            $(el.children).is('.check-box')) {
                            dst[key] = $(el.children).hasClass("checked") ? "Yes" : "No";
                        }
                        else
                            dst[key] = el.textContent || '';
                    }
                }
                row++;
                return dst;
            });
        }
        function exportToPdf(options) {
            var g = options.grid;
            if (!options.onViewSubmit())
                return;
            includeAutoTable();
            var request = Q.deepClone(g.view.params);
            request.Take = 0;
            request.Skip = 0;
            var sortBy = g.view.sortBy;
            if (sortBy != null)
                request.Sort = sortBy;
            var gridColumns = g.slickGrid.getColumns();
            gridColumns = gridColumns.filter(function (x) { return x.id !== "__select__" && x.cssClass !== "not-exportable" && x.name.length > 0; });
            request.IncludeColumns = [];
            for (var _i = 0, gridColumns_2 = gridColumns; _i < gridColumns_2.length; _i++) {
                var column = gridColumns_2[_i];
                request.IncludeColumns.push(column.id || column.field);
            }
            Q.serviceCall({
                url: g.view.url,
                request: request,
                onSuccess: function (response) {
                    var doc = new jsPDF('l', 'pt');
                    var groupings = g.view.getGrouping(); //group fields
                    var groupingColumns = gridColumns.filter(function (f) { return groupings.some(function (s) { return s.getter == f.field; }) == true; });
                    var srcColumns = gridColumns.filter(function (f) { return groupings.some(function (s) { return s.getter == f.field; }) == false; });
                    var columnStyles = {};
                    var columns = toAutoTableColumns(srcColumns, columnStyles, options.columnTitles);
                    var keys = columns.filter(function (f) { return groupings.some(function (s) { return s.getter == f; }) == false; }).map(function (x) { return x.dataKey; });
                    var totalPagesExp = "{{T}}";
                    var pageNumbers = options.pageNumbers == null || options.pageNumbers;
                    var autoOptions = $.extend({
                        margin: { top: 40, left: 40, right: 40, bottom: pageNumbers ? 110 : 100 },
                        startY: 90,
                        styles: {
                            fontSize: 8,
                            overflow: 'linebreak',
                            cellPadding: 5,
                            valign: 'middle',
                            lineColor: 0
                        },
                        headerStyles: { fillColor: 255, textColor: 0, lineWidth: 1, fillStyle: 'S', halign: 'center', valign: 'middle' },
                        columnStyles: columnStyles
                    }, options.tableOptions);
                    ///region Title
                    {
                        if (q.jsPDFHeaderImageData) {
                            doc.addImage(q.jsPDFHeaderImageData, 'PNG', 40, 40, 60, 60);
                        }
                        doc.autoTable([q.jsPDFHeaderTitle], [], {
                            margin: { bottom: 10, left: 110 },
                            startY: options.titleTop || 45,
                            headerStyles: { fillColor: 255, textColor: 0 },
                            styles: { halign: 'left', fontSize: 18 }
                        });
                        var reportTitle = '';
                        if (groupingColumns[0])
                            reportTitle = groupingColumns.map(function (m) { return m.name; }).join(', ') + ' wise ';
                        reportTitle += options.reportTitle || g.getTitle();
                        reportTitle += " Report";
                        doc.autoTable([reportTitle], [], {
                            margin: { top: 10, bottom: 10, left: 110 },
                            startY: doc.autoTableEndPosY(),
                            headerStyles: { fillColor: 255, textColor: 0 },
                            styles: { halign: 'left', fontSize: 14 }
                        });
                    }
                    ///region Header
                    {
                        var header = function (data) {
                        };
                        autoOptions.beforePageContent = header;
                    }
                    ///region Footer
                    {
                        if (pageNumbers) {
                            var footer = function (data) {
                                var str = data.pageCount;
                                // Total page number plugin only available in jspdf v1.0+
                                if (typeof doc.putTotalPages === 'function') {
                                    str = str + " / " + totalPagesExp;
                                }
                                doc.autoTableText(str, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - autoOptions.margin.bottom, {
                                    halign: 'center'
                                });
                            };
                            autoOptions.afterPageContent = footer;
                        }
                    }
                    ///region Content
                    {
                        //extra space after title
                        doc.autoTable([''], [], {
                            startY: doc.autoTableEndPosY() + 20,
                            headerStyles: { fillColor: 255, textColor: 0 }
                        });
                        var headerHeight = 125;
                        var headerFontSizeBase = 11;
                        var entities = response.Entities || [];
                        g.setItems(entities);
                        var groups = g.view.getGroups(); //grouped data
                        if (groups.length > 0) {
                            var ggg = function (grps, parentGroupIndex) {
                                var endPosY = doc.autoTableEndPosY();
                                for (var i = 0; i < grps.length; i++) {
                                    var group = grps[i];
                                    var level = group.level + 1;
                                    doc.autoTable([group.title], [], {
                                        margin: { left: 30 + level * 10, top: 2 },
                                        startY: doc.autoTableEndPosY(),
                                        headerStyles: { fillColor: 255, textColor: 0, fontSize: 10 - group.level, cellPadding: 0 }
                                    });
                                    if (group.groups) {
                                        ggg(group.groups, i);
                                    }
                                    else {
                                        var data = toAutoTableData(group.rows, keys, srcColumns);
                                        autoOptions.startY = doc.autoTableEndPosY();
                                        autoOptions.margin.left = 30 + level * 10;
                                        autoOptions.margin.bottom = 10;
                                        doc.autoTable(columns, data, autoOptions);
                                        //for extra space
                                        doc.autoTable([''], [], {
                                            margin: { left: 30 + level * 10, top: 2 },
                                            startY: doc.autoTableEndPosY() + 10,
                                            headerStyles: { fillColor: 255, textColor: 0 }
                                        });
                                    }
                                }
                            };
                            ggg(groups, -1);
                        }
                        else {
                            var data = toAutoTableData(g.getItems(), keys, srcColumns);
                            autoOptions.startY = headerHeight;
                            doc.autoTable(columns, data, autoOptions);
                        }
                    }
                    if (typeof doc.putTotalPages === 'function') {
                        doc.putTotalPages(totalPagesExp);
                    }
                    if (!options.output || options.output == "file") {
                        var fileName = options.reportTitle || "{0}_{1}.pdf";
                        fileName = Q.format(fileName, g.getTitle() || "report", Q.formatDate(new Date(), "yyyyMMdd_HHmm"));
                        doc.save(fileName);
                        return;
                    }
                    if (options.autoPrint)
                        doc.autoPrint();
                    var output = options.output;
                    if (output == 'newwindow' || '_blank')
                        output = 'dataurlnewwindow';
                    else if (output == 'window')
                        output = 'datauri';
                    doc.output(output);
                }
            });
        }
        PdfExportHelper.exportToPdf = exportToPdf;
        function createToolButton(options) {
            return {
                title: options.title || '',
                hint: options.hint || 'PDF',
                cssClass: 'export-pdf-button',
                onClick: function () { return exportToPdf(options); },
                separator: options.separator
            };
        }
        PdfExportHelper.createToolButton = createToolButton;
        function includeJsPDF() {
            if (typeof jsPDF !== "undefined")
                return;
            var script = $("jsPDFScript");
            if (script.length > 0)
                return;
            $("<script/>")
                .attr("type", "text/javascript")
                .attr("id", "jsPDFScript")
                .attr("src", Q.resolveUrl("~/Scripts/jspdf.min.js"))
                .appendTo(document.head);
        }
        function includeAutoTable() {
            includeJsPDF();
            if (typeof jsPDF === "undefined" ||
                typeof jsPDF.API == "undefined" ||
                typeof jsPDF.API.autoTable !== "undefined")
                return;
            var script = $("jsPDFAutoTableScript");
            if (script.length > 0)
                return;
            $("<script/>")
                .attr("type", "text/javascript")
                .attr("id", "jsPDFAutoTableScript")
                .attr("src", Q.resolveUrl("~/Scripts/jspdf.plugin.autotable.min.js"))
                .appendTo(document.head);
        }
    })(PdfExportHelper = _Ext.PdfExportHelper || (_Ext.PdfExportHelper = {}));
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var ReportHelper;
    (function (ReportHelper) {
        function createToolButton(options) {
            return {
                title: Q.coalesce(options.title, 'Report'),
                cssClass: Q.coalesce(options.cssClass, 'print-button'),
                icon: options.icon,
                onClick: function () {
                    ReportHelper.execute(options);
                }
            };
        }
        ReportHelper.createToolButton = createToolButton;
        function execute(options) {
            var opt = options.getParams ? options.getParams() : options.params;
            Q.postToUrl({
                url: '~/Report/' + (options.download ? 'Download' : 'Render'),
                params: {
                    key: options.reportKey,
                    ext: Q.coalesce(options.extension, 'pdf'),
                    opt: opt ? $.toJSON(opt) : ''
                },
                target: Q.coalesce(options.target, '_blank')
            });
        }
        ReportHelper.execute = execute;
    })(ReportHelper = _Ext.ReportHelper || (_Ext.ReportHelper = {}));
})(_Ext || (_Ext = {}));
var _Ext;
(function (_Ext) {
    var DialogUtils;
    (function (DialogUtils) {
        function pendingChangesConfirmation(element, hasPendingChanges) {
            element.on('dialogbeforeclose panelbeforeclose', function (e) {
                if (!Serenity.WX.hasOriginalEvent(e) || !hasPendingChanges()) {
                    return;
                }
                e.preventDefault();
                Q.confirm(q.text('Controls.EntityDialog.PendingChangesConfirmation', 'You have pending changes. Save them?'), function () { return element.find('div.save-and-close-button').click(); }, {
                    onNo: function () {
                        if (element.hasClass('ui-dialog-content'))
                            element.dialog('close');
                        else if (element.hasClass('s-Panel'))
                            Serenity.TemplatedDialog.closePanel(element);
                    }
                });
            });
        }
        DialogUtils.pendingChangesConfirmation = pendingChangesConfirmation;
    })(DialogUtils = _Ext.DialogUtils || (_Ext.DialogUtils = {}));
})(_Ext || (_Ext = {}));
function loadScriptAsync(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onload = callback;
    // Fire the loading
    head.appendChild(script);
}
function loadScript(url) {
    $.ajax({
        url: url,
        dataType: "script",
        async: false,
        cache: true,
        success: function () {
            // all good...
        },
        error: function () {
            throw new Error("Could not load script " + url);
        }
    });
}
function usingVuejs() {
    if (window['Vue']) {
        return;
    }
    else {
        loadScript(Q.resolveUrl("~/Scripts/vue.js"));
        //filters
        window['Vue'].filter('formatDate', function (value, format) {
            if (value) {
                return Q.formatDate(value, format);
            }
        });
        window['Vue'].filter('formatDateReadable', function (value) {
            if (value) {
                var date = Q.parseISODateTime(value);
                return date.getDate() + ' ' + _Ext.Months[date.getMonth()].substr(0, 3) + ' ' + date.getFullYear();
            }
        });
        window['Vue'].filter('dayOnly', function (value) {
            if (value) {
                return Q.formatDate(value, 'dd');
            }
        });
        window['Vue'].filter('monthOnly', function (value) {
            if (value) {
                var date = Q.parseISODateTime(value);
                return _Ext.Months[date.getMonth()];
            }
        });
        window['Vue'].filter('monthOnly3', function (value) {
            if (value) {
                var date = Q.parseISODateTime(value);
                return _Ext.Months[date.getMonth()].substr(0, 3);
            }
        });
        window['Vue'].filter('yearOnly', function (value) {
            if (value) {
                var date = Q.parseISODateTime(value);
                return date.getFullYear();
            }
        });
        window['Vue'].filter('timeOnlyHHmm', function (value) {
            if (value) {
                return Q.formatDate(value, 'HH:mm');
            }
        });
        window['Vue'].filter('formatDateTimeReadable', function (value) {
            if (value) {
                var date = Q.parseISODateTime(value);
                return date.getDate() + ' ' + _Ext.Months[date.getMonth()] + ' ' + date.getFullYear()
                    + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            }
        });
        window['Vue'].filter('enumText', function (value, enumKey) {
            if (value) {
                return Serenity.EnumFormatter.format(Serenity.EnumTypeRegistry.get(enumKey), value);
            }
        });
        window['Vue'].filter('truncate', function (text, length, clamp) {
            clamp = clamp || '...';
            length = length || 30;
            if (text.length <= length)
                return text;
            var tcText = text.slice(0, length - clamp.length);
            var last = tcText.length - 1;
            while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0])
                last -= 1;
            // Fix for case when text dont have any `space`
            last = last || length - clamp.length;
            tcText = tcText.slice(0, last);
            return tcText + clamp;
        });
        window['Vue'].filter('capitalize', function (value) {
            if (!value)
                return '';
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.toLowerCase().slice(1);
        });
    }
}
function includeBootstrapColorPickerCss() {
    var style = $("#colorpicker");
    if (style.length > 0) {
        return;
    }
    $("<link/>")
        .attr("type", "text/css")
        .attr("id", "colorpicker")
        .attr("rel", "stylesheet")
        .attr("href", Q.resolveUrl("~/Scripts/colorpicker/bootstrap-colorpicker.min.css"))
        .appendTo(document.head);
}
function usingBootstrapColorPicker() {
    if (window['colorpicker']) {
        return;
    }
    else {
        includeBootstrapColorPickerCss();
        loadScript(Q.resolveUrl("~/Scripts/colorpicker/bootstrap-colorpicker.min.js"));
    }
}
function includeJqueryUITimepickerAddonCss() {
    var style = $("#datetimepicker");
    if (style.length > 0) {
        return;
    }
    $("<link/>")
        .attr("type", "text/css")
        .attr("id", "datetimepicker")
        .attr("rel", "stylesheet")
        .attr("href", Q.resolveUrl("~/Content/jquery-ui-timepicker-addon.css"))
        .appendTo(document.head);
}
function usingJqueryUITimepickerAddon() {
    if (window['datetimepicker']) {
        return;
    }
    else {
        includeJqueryUITimepickerAddonCss();
        loadScript(Q.resolveUrl("~/Scripts/jquery-ui-timepicker-addon.js"));
    }
}
function usingBabylonjs() {
    if (window['BABYLON'] && window['BABYLON']['Engine']) {
        return;
    }
    else {
        loadScript(Q.resolveUrl("~/Scripts/babylonjs/babylon.js"));
    }
}
function usingChartjs() {
    if (window['Chart']) {
        return;
    }
    else {
        loadScript(Q.resolveUrl('~/Scripts/chartjs/Chart.min.js'));
    }
    window['Chart'].defaults.global.defaultFontFamily = $('body').css('font-family');
    window['Chart'].defaults.global.maintainAspectRatio = false;
}
function includeCustomMarkerCss() {
    var style = $("#customMarker");
    if (style.length > 0) {
        return;
    }
    $("<link/>")
        .attr("type", "text/css")
        .attr("id", "customMarker")
        .attr("rel", "stylesheet")
        .attr("href", Q.resolveUrl("~/Scripts/googlemap/CustomMarker.css"))
        .appendTo(document.head);
}
function usingCustomMarker() {
    if (window['CustomMarker']) {
        return;
    }
    else {
        includeCustomMarkerCss();
        loadScript(Q.resolveUrl("~/Scripts/googlemap/CustomMarker.js"));
    }
}
function includeGoogleMap(callback, callbackFullName) {
    if (window['google']) {
        if (callback)
            callback();
        return;
    }
    var script = $("#googleScript");
    if (script.length > 0) {
        if (callback)
            callback();
        return;
    }
    $("<script/>")
        .attr("type", "text/javascript")
        .attr("id", "googleScript")
        .attr("src", 'http://maps.google.com/maps/api/js?v=3.31&key=AIzaSyCRiY7aFA2cI6STbl3YQ3r6m1IpUFmBM98&callback=' + callbackFullName || 'includeGoogleMap')
        .appendTo(document.head);
}
function includeMarkerWithLabel() {
    if (window['MarkerWithLabel']) {
        return;
    }
    var script = $("#MarkerWithLabelScript");
    if (script.length > 0) {
        return;
    }
    $("<script/>")
        .attr("type", "text/javascript")
        .attr("id", "MarkerWithLabelScript")
        .attr("src", Q.resolveUrl("~/Scripts/googlemap/markerwithlabel.js"))
        .appendTo(document.head);
}
function includeVisCss() {
    var style = $("#Vis");
    if (style.length > 0) {
        return;
    }
    $("<link/>")
        .attr("type", "text/css")
        .attr("id", "Vis")
        .attr("rel", "stylesheet")
        .attr("href", Q.resolveUrl("~/Scripts/visjs/vis.min.css"))
        .appendTo(document.head);
}
function usingVisjs() {
    if (window['vis']) {
        return;
    }
    else {
        includeVisCss();
        loadScript(Q.resolveUrl("~/Scripts/visjs/vis.min.js"));
    }
}
function usingJsonDiffPatch() {
    if (window['jsondiffpatch']) {
        return;
    }
    else {
        $("<link/>").attr("type", "text/css").attr("id", "JsonDiffPatch").attr("rel", "stylesheet")
            .attr("href", Q.resolveUrl("~/Modules/_Ext/AuditLogViewer/jsondiffpatch/formatters-styles/html.css"))
            .appendTo(document.head);
        loadScript(Q.resolveUrl("~/Modules/_Ext/AuditLogViewer/jsondiffpatch/jsondiffpatch.min.js"));
        loadScript(Q.resolveUrl("~/Modules/_Ext/AuditLogViewer/jsondiffpatch/jsondiffpatch-formatters.min.js"));
    }
}
function usingSlickGridEditors() {
    if (window['Slick'] && window['Slick']['Editors'] && window['Slick']['Editors']['Text']) {
        return;
    }
    else {
        loadScript(Q.resolveUrl("~/Modules/_Ext/Editors/slick.editors.js"));
    }
}
function usingSlickAutoColumnSize() {
    if (window['Slick'] && window['Slick']['AutoColumnSize']) {
        return;
    }
    else {
        loadScript(Q.resolveUrl("~/Modules/_Ext/CustomSlickGridPlugin/slick.autocolumnsize.js"));
    }
}
function usingSlickHeaderFilters() {
    if (window['Slick'] && window['Slick']['HeaderFilters']) {
        return;
    }
    else {
        $("<link/>")
            .attr("type", "text/css")
            .attr("id", "CustomSlickGridPlugin")
            .attr("rel", "stylesheet")
            .attr("href", Q.resolveUrl("~/Modules/_Ext/CustomSlickGridPlugin/slick-headerfilters.css"))
            .appendTo(document.head);
        loadScript(Q.resolveUrl("~/Modules/_Ext/CustomSlickGridPlugin/slick.headerfilters.js"));
    }
}
var q;
(function (q) {
    function sum(xs, key) {
        var initObj = {};
        initObj[key] = 0;
        var sumObj = xs.reduce(function (rv, x) {
            (rv[key] += x[key] || 0);
            return rv;
        }, initObj);
        return sumObj[key];
    }
    q.sum = sum;
    function groupBy(xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }
    q.groupBy = groupBy;
    function sortBy(xs, key) {
        return xs.sort(function (a, b) {
            if (a[key] < b[key]) {
                return -1;
            }
            if (a[key] > b[key]) {
                return 1;
            }
            return 0;
        });
    }
    q.sortBy = sortBy;
    function sortByDesc(xs, key) {
        return xs.sort(function (a, b) {
            if (a[key] > b[key]) {
                return -1;
            }
            if (a[key] < b[key]) {
                return 1;
            }
            return 0;
        });
    }
    q.sortByDesc = sortByDesc;
})(q || (q = {}));
var q;
(function (q) {
    function nextTick(date) {
        return new Date(date.getTime() + 1);
    }
    q.nextTick = nextTick;
    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }
    q.addMinutes = addMinutes;
    function addHours(date, hours) {
        return new Date(date.getTime() + hours * 3600000);
    }
    q.addHours = addHours;
    function getHours(fromDate, toDate) {
        var hours = 0;
        if (fromDate && toDate) {
            var totalMiliSeconds = toDate.valueOf() - fromDate.valueOf();
            hours = totalMiliSeconds / (1000 * 60 * 60);
        }
        return hours;
    }
    q.getHours = getHours;
    function getDays24HourPulse(fromDate, toDate) {
        var days = q.getHours(fromDate, toDate) / 24;
        return Math.ceil(days);
    }
    q.getDays24HourPulse = getDays24HourPulse;
    function getDays(pFromDate, pToDate) {
        var fromDate = new Date(pFromDate.getFullYear(), pFromDate.getMonth(), pFromDate.getDate());
        var toDate = new Date(pToDate.getFullYear(), pToDate.getMonth(), pToDate.getDate(), 23, 59, 59);
        var days = q.getHours(fromDate, toDate) / 24;
        //days = days <= 0 ? 1 : days;
        return Math.ceil(days);
    }
    q.getDays = getDays;
    function getMonths(fromDate, toDate) {
        var months = q.getDays24HourPulse(fromDate, toDate) / 30;
        return Math.ceil(months);
    }
    q.getMonths = getMonths;
    function getCalenderMonths(fromDate, toDate) {
        var months;
        months = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
        months -= fromDate.getMonth();
        months += toDate.getMonth();
        return months <= 0 ? 0 : months;
    }
    q.getCalenderMonths = getCalenderMonths;
    function getCalenderMonthsCeil(fromDate, toDate) {
        var months = q.getCalenderMonths(fromDate, toDate);
        return months == 0 ? 1 : months;
    }
    q.getCalenderMonthsCeil = getCalenderMonthsCeil;
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    q.addDays = addDays;
    function addMonths(date, months) {
        var result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }
    q.addMonths = addMonths;
    function addYear(date, years) {
        var result = new Date(date);
        result.setFullYear(result.getFullYear() + years);
        return result;
    }
    q.addYear = addYear;
    function getPeriods(fromDate, toDate, periodUnit) {
        if (periodUnit == _Ext.TimeUoM.Day) {
            var days = q.getDays(fromDate, toDate);
            return days;
        }
        else if (periodUnit == _Ext.TimeUoM.Month) {
            var months = q.getMonths(fromDate, toDate);
            return months == 0 ? 1 : months;
        }
        else if (periodUnit == _Ext.TimeUoM.CalenderMonth) {
            var calenderMonths = q.getCalenderMonths(fromDate, toDate);
            return calenderMonths + 1;
        }
    }
    q.getPeriods = getPeriods;
    function addPeriod(date, period, periodUnit) {
        var result = new Date(date);
        if (periodUnit == _Ext.TimeUoM.Day)
            result.setDate(result.getDate() + period);
        else if (periodUnit == _Ext.TimeUoM.Month)
            result.setMonth(result.getMonth() + period);
        else if (periodUnit == _Ext.TimeUoM.CalenderMonth) {
            result.setDate(1);
            result.setMonth(result.getMonth() + period);
        }
        return result;
    }
    q.addPeriod = addPeriod;
    function formatISODate(date) {
        if (date) {
            var offset = date.getTimezoneOffset();
            var result = new Date(date.getTime() - offset * 60 * 1000);
            return result.toISOString();
        }
        else
            return null;
    }
    q.formatISODate = formatISODate;
    //editor utils
    function bindDateTimeEditorChange(editor, handler) {
        editor.change(handler);
        editor.element.closest('.field').find('.time').change(handler);
        editor.element.closest('.field').find('.inplace-now').click(handler);
    }
    q.bindDateTimeEditorChange = bindDateTimeEditorChange;
    function initDateRangeEditor(fromDateEditor, toDateEditor, onChangeHandler) {
        var startDateTextBox = fromDateEditor.element;
        var endDateTextBox = toDateEditor.element;
        startDateTextBox.datepicker('option', 'onClose', function (dateText, inst) {
            if (endDateTextBox.val() != '') {
                var testStartDate = startDateTextBox.datepicker('getDate');
                var testEndDate = endDateTextBox.datepicker('getDate');
                if (testStartDate > testEndDate)
                    endDateTextBox.datepicker('setDate', testStartDate);
            }
            else {
                endDateTextBox.val(dateText);
            }
        });
        endDateTextBox.datepicker('option', 'minDate', startDateTextBox.datepicker('getDate'));
        startDateTextBox.datepicker('option', 'onSelect', function (selectedDateTime) {
            endDateTextBox.datepicker('option', 'minDate', startDateTextBox.datepicker('getDate'));
        });
        endDateTextBox.datepicker('option', 'onClose', function (dateText, inst) {
            if (startDateTextBox.val() != '') {
                var testStartDate = startDateTextBox.datepicker('getDate');
                var testEndDate = endDateTextBox.datepicker('getDate');
                if (testStartDate > testEndDate)
                    startDateTextBox.datepicker('setDate', testEndDate);
            }
            else {
                startDateTextBox.val(dateText);
            }
        });
        startDateTextBox.datepicker('option', 'maxDate', endDateTextBox.datepicker('getDate'));
        endDateTextBox.datepicker('option', 'onSelect', function (selectedDateTime) {
            startDateTextBox.datepicker('option', 'maxDate', endDateTextBox.datepicker('getDate'));
        });
        setTimeout(function () {
            fromDateEditor.change(onChangeHandler);
            toDateEditor.change(onChangeHandler);
        }, 500);
    }
    q.initDateRangeEditor = initDateRangeEditor;
    function initDateTimeRangeEditor(fromDateTimeEditor, toDateTimeEditor, onChangeHandler) {
        //fromDateTimeEditor.destroy();
        //toDateTimeEditor.destroy();
        var startDateTextBox = fromDateTimeEditor.element;
        var endDateTextBox = toDateTimeEditor.element;
        //startDateTextBox.datetimepicker('option', 'timeFormat', 'HH:mm z')
        startDateTextBox.datetimepicker('option', 'onClose', function (dateText, inst) {
            if (endDateTextBox.val() != '') {
                var testStartDate = startDateTextBox.datetimepicker('getDate');
                var testEndDate = endDateTextBox.datetimepicker('getDate');
                if (testStartDate > testEndDate)
                    endDateTextBox.datetimepicker('setDate', testStartDate);
            }
            else {
                endDateTextBox.val(dateText);
            }
        });
        endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate'));
        startDateTextBox.datetimepicker('option', 'onSelect', function (selectedDateTime) {
            endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate'));
            onChangeHandler(selectedDateTime);
        });
        //endDateTextBox.datetimepicker('option', 'timeFormat', 'HH:mm z')
        endDateTextBox.datetimepicker('option', 'onClose', function (dateText, inst) {
            if (startDateTextBox.val() != '') {
                var testStartDate = startDateTextBox.datetimepicker('getDate');
                var testEndDate = endDateTextBox.datetimepicker('getDate');
                if (testStartDate > testEndDate)
                    startDateTextBox.datetimepicker('setDate', testEndDate);
            }
            else {
                startDateTextBox.val(dateText);
            }
        });
        startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate'));
        endDateTextBox.datetimepicker('option', 'onSelect', function (selectedDateTime) {
            startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate'));
            onChangeHandler(selectedDateTime);
        });
        //setTimeout(() => {
        //    fromDateTimeEditor.change(onChangeHandler);
        //    toDateTimeEditor.change(onChangeHandler);
        //}, 500);
    }
    q.initDateTimeRangeEditor = initDateTimeRangeEditor;
    function formatDate(d, format) {
        if (!d) {
            return '';
        }
        var date;
        if (typeof d == "string") {
            var res = Q.parseDate(d);
            if (!res)
                return d;
            date = res;
        }
        else
            date = d;
        if (format == null || format == "d") {
            format = Q.Culture.dateFormat;
        }
        else {
            switch (format) {
                case "g":
                    format = Q.Culture.dateTimeFormat.replace(":ss", "");
                    break;
                case "G":
                    format = Q.Culture.dateTimeFormat;
                    break;
                case "s":
                    format = "yyyy-MM-ddTHH:mm:ss";
                    break;
                case "u": return Q.formatISODateTimeUTC(date);
            }
        }
        var pad = function (i) {
            return Q.zeroPad(i, 2);
        };
        return format.replace(new RegExp('dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|fff|zz?z?|\\/', 'g'), function (fmt) {
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            switch (fmt) {
                case '/': return Q.Culture.dateSeparator;
                case 'hh': return pad(((date.getHours() < 13) ? date.getHours() : (date.getHours() - 12)));
                case 'h': return ((date.getHours() < 13) ? date.getHours() : (date.getHours() - 12));
                case 'HH': return pad(date.getHours());
                case 'H': return date.getHours();
                case 'mm': return pad(date.getMinutes());
                case 'm': return date.getMinutes();
                case 'ss': return pad(date.getSeconds());
                case 's': return date.getSeconds();
                case 'yyyy': return date.getFullYear();
                case 'yy': return date.getFullYear().toString().substr(2, 4);
                case 'dddd': return days[date.getDay()];
                case 'ddd': return days[date.getDay()].substr(0, 3);
                case 'dd': return pad(date.getDate());
                case 'd': return date.getDate().toString();
                case 'MMMM': return months[date.getMonth()];
                case 'MMM': return months[date.getMonth()].substr(0, 3);
                case 'MM': return pad(date.getMonth() + 1);
                case 'M': return date.getMonth() + 1;
                case 't': return ((date.getHours() < 12) ? 'A' : 'P');
                case 'tt': return ((date.getHours() < 12) ? 'AM' : 'PM');
                case 'fff': return Q.zeroPad(date.getMilliseconds(), 3);
                case 'zzz':
                case 'zz':
                case 'z': return '';
                default: return fmt;
            }
        });
    }
    q.formatDate = formatDate;
})(q || (q = {}));
var q;
(function (q) {
    function initDetailEditor(dialog, editor, options) {
        if (options === void 0) { options = {}; }
        if (options.showCaption != true) {
            editor.element.siblings('.caption').hide();
        }
        if (options.hideToolbar == true) {
            editor.element.find('.grid-toolbar').hide();
        }
        if (options.isReadOnly == true) {
            editor.set_readOnly(options.isReadOnly);
        }
        editor.parentDialog = dialog;
        dialog.onAfterSetDialogSize = function () {
            var $gridContainer = editor.element.find('.grid-container');
            if (options.height) {
                editor.slickGrid.setOptions({ autoHeight: false });
                $gridContainer.height(options.height);
            }
            else {
                var top_1 = $gridContainer.position().top;
                var height = dialog.element.innerHeight() - top_1 - 40;
                if (height > 200)
                    $gridContainer.height(height);
            }
            if (options.width) {
                $gridContainer.width(options.width);
            }
            editor.slickGrid.resizeCanvas();
        };
    }
    q.initDetailEditor = initDetailEditor;
    function setGridEditorHeight(editor, heightInPx) {
        editor.css('height', heightInPx + 'px');
        editor.find('.grid-container')
            .css('height', (heightInPx - 25) + 'px')
            .height(heightInPx);
    }
    q.setGridEditorHeight = setGridEditorHeight;
    function addNotificationIcon(editor, isSuccess) {
        var isAddOnInitialized = editor.element.data('isAddOnInitialized');
        if (isAddOnInitialized != true) {
            editor.element.after('<span class="text text-danger" style="padding:3px"><i class="fa fa-times"></i></span>');
            editor.element.data('isAddOnInitialized', true);
        }
        if (isSuccess == true) {
            editor.element.switchClass('bg-danger', 'bg-success')
                .siblings('.text').switchClass('text-danger', 'text-success')
                .children().switchClass('fa-times', 'fa-check');
        }
        else {
            editor.element.switchClass('bg-success', 'bg-danger')
                .siblings('.text').switchClass('text-success', 'text-danger')
                .children().switchClass('fa-check', 'fa-times');
        }
    }
    q.addNotificationIcon = addNotificationIcon;
    function addPopoverIcon(editor, isSuccess, popoverOptions) {
        addNotificationIcon(editor, isSuccess);
        //(editor.element as any).popover('destroy');
        editor.element.siblings('.text').popover('destroy');
        setTimeout(function (h) {
            //(editor.element as any).popover(popoverOptions);
            editor.element.siblings('.text')
                .popover(popoverOptions)
                .on("show.bs.popover", function () { $(this).data("bs.popover").tip().css("width", "600px"); });
            ;
        }, 100);
    }
    q.addPopoverIcon = addPopoverIcon;
    function setEditorLabel(editor, value) {
        editor.element.siblings('label').text(value);
    }
    q.setEditorLabel = setEditorLabel;
    function hideEditorLabel(editor) {
        editor.element.siblings('label').hide();
    }
    q.hideEditorLabel = hideEditorLabel;
    function setEditorCategoryLabel(editor, value) {
        var categoryAnchor = editor.element.closest('.category').find('.category-anchor');
        categoryAnchor.text(value);
        var categoryAnchorName = categoryAnchor.attr('name');
        categoryAnchor.closest('.s-PropertyGrid').find("a[href='#" + categoryAnchorName + "']").text(value);
    }
    q.setEditorCategoryLabel = setEditorCategoryLabel;
    function hideEditorCategory(editor, value) {
        if (value === void 0) { value = true; }
        if (value == true)
            editor.element.closest('.category').hide();
        else
            editor.element.closest('.category').show();
        var categoryAnchor = editor.element.closest('.category').find('.category-anchor');
        var categoryAnchorName = categoryAnchor.attr('name');
        if (value == true)
            categoryAnchor.closest('.s-PropertyGrid').find("a[href='#" + categoryAnchorName + "']").hide();
        else
            categoryAnchor.closest('.s-PropertyGrid').find("a[href='#" + categoryAnchorName + "']").show();
    }
    q.hideEditorCategory = hideEditorCategory;
    function hideCategories(containerElement, value) {
        if (value === void 0) { value = true; }
        if (value == true)
            containerElement.find('.category').hide();
        else
            containerElement.find('.category').show();
        var categoryAnchor = containerElement.find('.category').find('.category-anchor');
        var categoryAnchorName = categoryAnchor.attr('name');
        if (value == true)
            categoryAnchor.closest('.s-PropertyGrid').find("a[href='#" + categoryAnchorName + "']").hide();
        else
            categoryAnchor.closest('.s-PropertyGrid').find("a[href='#" + categoryAnchorName + "']").show();
    }
    q.hideCategories = hideCategories;
    function hideFields(containerElement, value) {
        if (value === void 0) { value = true; }
        if (value == true)
            containerElement.find('.field').hide();
        else
            containerElement.find('.field').show();
    }
    q.hideFields = hideFields;
    function hideFieldsAndCategories(containerElement, value) {
        if (value === void 0) { value = true; }
        hideFields(containerElement);
        hideCategories(containerElement);
    }
    q.hideFieldsAndCategories = hideFieldsAndCategories;
    function hideField(editor, value) {
        if (value === void 0) { value = true; }
        if (editor) {
            if (value == true)
                editor.element.closest('.field').hide();
            else
                editor.element.closest('.field').show();
        }
    }
    q.hideField = hideField;
    function showField(editor, value) {
        if (value === void 0) { value = true; }
        if (editor) {
            if (value == true)
                editor.element.closest('.field').show();
            else
                editor.element.closest('.field').hide();
        }
    }
    q.showField = showField;
    function showAndEnableField(editor) {
        q.showField(editor);
        Serenity.EditorUtils.setReadOnly(editor, false);
    }
    q.showAndEnableField = showAndEnableField;
    function showFieldAndCategory(editor, value) {
        if (value === void 0) { value = true; }
        showField(editor, value);
        if (value == true)
            hideEditorCategory(editor, false);
    }
    q.showFieldAndCategory = showFieldAndCategory;
    function hideEditorTab(editor, value) {
        if (value === void 0) { value = true; }
        if (value) {
            var tabId = editor.element.closest('.tab-pane').hide().attr('id');
            var tabAnchor = editor.element.closest('.s-PropertyGrid').find("a[href='#" + tabId + "']");
            tabAnchor.closest('li').hide();
        }
        else {
            var tabId = editor.element.closest('.tab-pane').show().attr('id');
            var tabAnchor = editor.element.closest('.s-PropertyGrid').find("a[href='#" + tabId + "']");
            tabAnchor.closest('li').show();
        }
    }
    q.hideEditorTab = hideEditorTab;
    function disableEditorTab(editor, value) {
        if (value === void 0) { value = true; }
        var tabId = editor.element.closest('.tab-pane').attr('id');
        var tabAnchor = editor.element.closest('.s-PropertyGrid').find("a[href='#" + tabId + "']");
        var tabLi = tabAnchor.closest('li');
        if (value == true) {
            tabAnchor.hide();
            tabLi.closest('li').addClass('disabled').prepend("<a class=\"disabled\">" + tabAnchor.text() + "</label>");
        }
        else {
            tabAnchor.show();
            tabLi.closest('li').removeClass('disabled').find('.disabled').remove();
        }
    }
    q.disableEditorTab = disableEditorTab;
    function readOnlyEditorTab(editor, value) {
        if (value === void 0) { value = true; }
        var $editors = editor.element.closest('.tab-pane').find('.editor');
        Serenity.EditorUtils.setReadonly($editors, value);
    }
    q.readOnlyEditorTab = readOnlyEditorTab;
    function readOnlyEditorCategory(editor, value) {
        if (value === void 0) { value = true; }
        var $editors = editor.element.closest('.category').find('.editor');
        Serenity.EditorUtils.setReadonly($editors, value);
    }
    q.readOnlyEditorCategory = readOnlyEditorCategory;
    function readonlyEditorCategory($editor, value) {
        if (value === void 0) { value = true; }
        var $editors = $editor.closest('.category').find('.editor');
        Serenity.EditorUtils.setReadonly($editors, value);
    }
    q.readonlyEditorCategory = readonlyEditorCategory;
    function readOnlyEditorPropertyGrid(editor, value) {
        if (value === void 0) { value = true; }
        var $editors = editor.element.closest('.s-PropertyGrid').find('.editor');
        Serenity.EditorUtils.setReadonly($editors, value);
    }
    q.readOnlyEditorPropertyGrid = readOnlyEditorPropertyGrid;
    function readonlyEditorPropertyGrid($editor, value) {
        if (value === void 0) { value = true; }
        var $editors = $editor.closest('.s-PropertyGrid').find('.editor');
        Serenity.EditorUtils.setReadonly($editors, value);
    }
    q.readonlyEditorPropertyGrid = readonlyEditorPropertyGrid;
    function readOnlyEditor(editor, value) {
        if (value === void 0) { value = true; }
        Serenity.EditorUtils.setReadOnly(editor, value);
    }
    q.readOnlyEditor = readOnlyEditor;
    function readonlyEditor($editor, value) {
        if (value === void 0) { value = true; }
        Serenity.EditorUtils.setReadonly($editor, value);
    }
    q.readonlyEditor = readonlyEditor;
    function moveEditorFromTab(editor, toElement, isPrepend) {
        if (isPrepend === void 0) { isPrepend = false; }
        var fieldDiv = editor.element.closest('.field');
        if (isPrepend == true)
            fieldDiv.prependTo(toElement);
        else
            fieldDiv.appendTo(toElement);
    }
    q.moveEditorFromTab = moveEditorFromTab;
    function moveEditorCategoryFromTab(editor, toElement, isPrepend) {
        if (isPrepend === void 0) { isPrepend = false; }
        var fieldDiv = editor.element.closest('.field');
        var categoryDiv = editor.element.closest('.category');
        if (isPrepend == true)
            categoryDiv.prependTo(toElement);
        else
            categoryDiv.appendTo(toElement);
        //hide category navigation link
        var categoryAnchor = categoryDiv.find('.category-anchor');
        var categoryAnchorName = categoryAnchor.attr('name');
        categoryAnchor.closest('.s-PropertyGrid').find("a[href='#" + categoryAnchorName + "']").hide();
    }
    q.moveEditorCategoryFromTab = moveEditorCategoryFromTab;
    function selectEditorTab(editor) {
        var tabId = editor.element.closest('.tab-pane').attr('id');
        var tabAnchor = editor.element.closest('.s-PropertyGrid').find("a[href='#" + tabId + "']");
        tabAnchor.tab('show');
    }
    q.selectEditorTab = selectEditorTab;
    // for select2 lookup editor
    function getSelectedRow(e) {
        var selectedItem = e.added;
        var selectedRow = selectedItem.source;
        return selectedRow;
    }
    q.getSelectedRow = getSelectedRow;
})(q || (q = {}));
var q;
(function (q) {
    function getEnumText(enumTypeOrKey, value) {
        var enumKey = enumTypeOrKey.__typeName ? enumTypeOrKey.__typeName : enumTypeOrKey;
        var title = Serenity.EnumFormatter.format(Serenity.EnumTypeRegistry.get(enumKey), value);
        return title;
    }
    q.getEnumText = getEnumText;
    function isNumber(value) {
        return !isNaN(Number(value));
    }
    q.isNumber = isNumber;
    function getEnumValues(enumType) {
        var items = [];
        for (var item in enumType) {
            if (q.isNumber(item)) {
                items.push(Number(item));
            }
        }
        return items;
    }
    q.getEnumValues = getEnumValues;
    function getEnumKeys(enumType) {
        return q.getEnumValues(enumType).map(function (m) { return enumType[m]; });
    }
    q.getEnumKeys = getEnumKeys;
})(q || (q = {}));
/// <reference path="../_ext/_q/_q.ts" />
var SereneInventory;
(function (SereneInventory) {
    function getTrasactionTypeFromUrl() {
        if (location.href.indexOf('PurchaseInvoice') > 0)
            return SereneInventory.TransactionType.PurchaseInvoice;
        if (location.href.indexOf('SalesInvoice') > 0)
            return SereneInventory.TransactionType.SalesInvoice;
    }
    SereneInventory.getTrasactionTypeFromUrl = getTrasactionTypeFromUrl;
    function getTrasactionTypeName(transactionType) {
        return q.getEnumText('SereneInventory.TransactionType', transactionType);
    }
    SereneInventory.getTrasactionTypeName = getTrasactionTypeName;
    function getTrasactionNumberCaption(transactionType) {
        return 'Invoice Number';
    }
    SereneInventory.getTrasactionNumberCaption = getTrasactionNumberCaption;
    function getTrasactionNumberPrefix(transactionType) {
        if (transactionType == SereneInventory.TransactionType.PurchaseInvoice)
            return 'PI-';
        else if (transactionType == SereneInventory.TransactionType.SalesInvoice)
            return 'SI-';
        else
            return 'Invoice-';
    }
    SereneInventory.getTrasactionNumberPrefix = getTrasactionNumberPrefix;
})(SereneInventory || (SereneInventory = {}));
//# sourceMappingURL=SereneInventory.Web.js.map