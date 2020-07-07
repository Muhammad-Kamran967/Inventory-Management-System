﻿







using System;

namespace MVC
{
    public static class Views
    {

        public static class _Ext
        {

            public static class AuditLog
            {

                public const string AuditLogIndex = "~/Modules/_Ext/AuditLog/AuditLogIndex.cshtml";
            }


            public static class DevTools
            {

                public static class CodeSnippets
                {

                    public const string CodeSnippetsIndex = "~/Modules/_Ext/DevTools/CodeSnippets/CodeSnippetsIndex.cshtml";
                }


                public static class CompareEntityToDB
                {

                    public const string CompareEntityToDBIndex = "~/Modules/_Ext/DevTools/CompareEntityToDB/CompareEntityToDBIndex.cshtml";
                }


                public static class GenerateMigrationFromEntity
                {

                    public const string GenerateMigrationFromEntityIndex = "~/Modules/_Ext/DevTools/GenerateMigrationFromEntity/GenerateMigrationFromEntityIndex.cshtml";

                    public const string GenerateMigrationFromEntityMigrationViewer = "~/Modules/_Ext/DevTools/GenerateMigrationFromEntity/GenerateMigrationFromEntityMigrationViewer.cshtml";

                    public const string GenerateMigrationFromEntitySuccessMsg = "~/Modules/_Ext/DevTools/GenerateMigrationFromEntity/GenerateMigrationFromEntitySuccessMsg.cshtml";
                }


                public static class Sergen
                {

                    public const string SergenError = "~/Modules/_Ext/DevTools/Sergen/SergenError.cshtml";

                    public const string SergenIndex = "~/Modules/_Ext/DevTools/Sergen/SergenIndex.cshtml";
                }
            }

        }


        public static class Administration
        {

            public static class Language
            {

                public const string LanguageIndex = "~/Modules/Administration/Language/LanguageIndex.cshtml";
            }


            public static class Role
            {

                public const string RoleIndex = "~/Modules/Administration/Role/RoleIndex.cshtml";
            }


            public static class Tenant
            {

                public const string TenantIndex = "~/Modules/Administration/Tenant/TenantIndex.cshtml";
            }


            public static class Translation
            {

                public const string TranslationIndex = "~/Modules/Administration/Translation/TranslationIndex.cshtml";
            }


            public static class User
            {

                public const string UserIndex = "~/Modules/Administration/User/UserIndex.cshtml";
            }

        }


        public static class Common
        {

            public static class Dashboard
            {

                public const string DashboardIndex = "~/Modules/Common/Dashboard/DashboardIndex.cshtml";
            }


            public static class Reporting
            {

                public const string ReportPage = "~/Modules/Common/Reporting/ReportPage.cshtml";
            }
        }


        public static class Errors
        {

            public const string AccessDenied = "~/Views/Errors/AccessDenied.cshtml";

            public const string ValidationError = "~/Views/Errors/ValidationError.cshtml";
        }


        public static class Inventory
        {

            public static class Report
            {

                public static class ProfitLoss
                {

                    public const string ProfitLossIndex = "~/Modules/Inventory/Report/ProfitLoss/ProfitLossIndex.cshtml";

                    public const string ProfitLossReport = "~/Modules/Inventory/Report/ProfitLoss/ProfitLossReport.cshtml";
                }

            }


            public static class Transaction
            {

                public static class PurchaseInvoice
                {

                    public const string PurchaseInvoiceIndex = "~/Modules/Inventory/Transaction/PurchaseInvoice/PurchaseInvoiceIndex.cshtml";
                }


                public static class SalesInvoice
                {

                    public const string SalesInvoiceIndex = "~/Modules/Inventory/Transaction/SalesInvoice/SalesInvoiceIndex.cshtml";

                    public const string SalesInvoicePrint = "~/Modules/Inventory/Transaction/SalesInvoice/SalesInvoicePrint.cshtml";
                }

                public const string TransactionIndex = "~/Modules/Inventory/Transaction/TransactionIndex.cshtml";
            }


            public static class TransactionDetail
            {

                public const string TransactionDetailIndex = "~/Modules/Inventory/TransactionDetail/TransactionDetailIndex.cshtml";
            }

        }


        public static class Membership
        {

            public static class Account
            {

                public const string AccountLogin = "~/Modules/Membership/Account/AccountLogin.cshtml";

                public const string AccountLogin_AdminLTE = "~/Modules/Membership/Account/AccountLogin.AdminLTE.cshtml";

                public static class ChangePassword
                {

                    public const string AccountChangePassword = "~/Modules/Membership/Account/ChangePassword/AccountChangePassword.cshtml";
                }


                public static class ForgotPassword
                {

                    public const string AccountForgotPassword = "~/Modules/Membership/Account/ForgotPassword/AccountForgotPassword.cshtml";

                    public const string AccountForgotPassword_AdminLTE = "~/Modules/Membership/Account/ForgotPassword/AccountForgotPassword.AdminLTE.cshtml";
                }


                public static class ResetPassword
                {

                    public const string AccountResetPassword = "~/Modules/Membership/Account/ResetPassword/AccountResetPassword.cshtml";

                    public const string AccountResetPassword_AdminLTE = "~/Modules/Membership/Account/ResetPassword/AccountResetPassword.AdminLTE.cshtml";

                    public const string AccountResetPasswordEmail = "~/Modules/Membership/Account/ResetPassword/AccountResetPasswordEmail.cshtml";
                }


                public static class SignUp
                {

                    public const string AccountActivateEmail = "~/Modules/Membership/Account/SignUp/AccountActivateEmail.cshtml";

                    public const string AccountSignUp = "~/Modules/Membership/Account/SignUp/AccountSignUp.cshtml";

                    public const string AccountSignUp_AdminLTE = "~/Modules/Membership/Account/SignUp/AccountSignUp.AdminLTE.cshtml";
                }
            }

        }


        public static class Setup
        {

            public static class Party
            {

                public const string PartyIndex = "~/Modules/Setup/Party/PartyIndex.cshtml";
            }


            public static class Product
            {

                public const string ProductIndex = "~/Modules/Setup/Product/ProductIndex.cshtml";
            }


            public static class ProductCategory
            {

                public const string ProductCategoryIndex = "~/Modules/Setup/ProductCategory/ProductCategoryIndex.cshtml";
            }
        }


        public static class Shared
        {

            public const string _Layout = "~/Views/Shared/_Layout.cshtml";

            public const string _LayoutHead = "~/Views/Shared/_LayoutHead.cshtml";

            public const string _LayoutNoNavigation = "~/Views/Shared/_LayoutNoNavigation.cshtml";

            public const string _LayoutReport = "~/Views/Shared/_LayoutReport.cshtml";

            public const string _LayoutSlim = "~/Views/Shared/_LayoutSlim.cshtml";

            public const string _LayoutSlimHead = "~/Views/Shared/_LayoutSlimHead.cshtml";

            public const string Error = "~/Views/Shared/Error.cshtml";

            public const string LeftNavigation = "~/Views/Shared/LeftNavigation.cshtml";
        }

    }
}

