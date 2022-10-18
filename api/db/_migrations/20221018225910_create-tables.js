/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function up(knex) {
    return knex.raw(`
    CREATE TABLE WAGE_SUBSIDY_APPLICATIONS (
        ID SERIAL NOT NULL PRIMARY KEY,
        Title VARCHAR(255),
        CatchmentNo int,
        FormType VARCHAR(255),
        ApplicationID VARCHAR(10),
        ApplicationStatus VARCHAR(255),
        OperatingName VARCHAR(255),
        BusinessNumber VARCHAR(255),
        BusinessAddress1 VARCHAR(255),
        BusinessCity VARCHAR(255),
        BusinessProvince VARCHAR(2),
        BusinessPostal VARCHAR(6),
        BusinessPhone VARCHAR(12),
        BusinessEmail VARCHAR(255),
        OtherWorkAddress BOOLEAN,
        SectorType VARCHAR(255),
        TypeOfIndustry VARCHAR(255),
        OrganizationSize VARCHAR(255),
        CEWSAndOrCRHP BOOLEAN,
        EmployeeDisplacement BOOLEAN,
        LabourDispute int,
        UnionConcurrence BOOLEAN,
        LiabilityCoverage BOOLEAN,
        WageSubsidy BOOLEAN,
        WSBCCoverage BOOLEAN,
        LawComplianceConsent BOOLEAN,
        OrgEligibilityConsent BOOLEAN,
        WSBCNumber VARCHAR(255), 
        ProvinceAlt VARCHAR(2),
        ParticipantEmail0 VARCHAR(255),
        PositionTitle0 VARCHAR(255),
        NumberOfPositions0 int,
        StartDate0 date,
        Hours0 decimal (5, 2), 
        Wage0 decimal (65, 0), 
        Duties0 text,
        Skills0 text,
        WorkExperience0 text, 
        NumberofPositions1 int,
        SignatoryTitle VARCHAR(255),
        Signatory1 VARCHAR(255),
        OrganizationConsent BOOLEAN,
        Modified date,
        Created date
        );
    
    CREATE TABLE Wage_Subsidy_Claim_Form (
        ID int NOT NULL PRIMARY KEY,
        Title varchar(255),
        CatchmentNo int, 
        FormType varchar(255),
        ApplicationID varchar(10),
        ApplicationStatus varchar(255),
        PeriodStart1 timestamp,
        PeriodStart2 timestamp,
        IsFinalClaim bool,
        OperatingName varchar(255),
        BusinessAddress1 varchar(255),
        BusinessCity varchar(255),
        BusinessPostal varchar(6),
        BusinessPhone varchar(12),
        EmployeeFirstName varchar(255),
        EmployeeLastName varchar(255),
        DateFrom1 date,
        DateFrom2 date,
        DateFrom3 date,
        DateFrom4 date,
        DateFrom5 date,
        DateTo1 date,
        DateTo2 date,
        DateTo3 date,
        DateTo4 date,
        DateTo5 date,
        HoursWorked1 decimal(5, 2),
        HoursWorked2 decimal(5, 2),
        HoursWorked3 decimal(5, 2),
        HoursWorked4 decimal(5, 2),
        HoursWorked5 decimal(5, 2),
        HourlyWage1 decimal(65, 0),
        HourlyWage2 decimal(65, 0),
        HourlyWage3 decimal(65, 0),
        HourlyWage4 decimal(65, 0),
        HourlyWage5 decimal(65, 0),
        WorkActivitiesAndIssues text,
        TotalWage1 decimal(65, 0),
        TotalWage2 decimal(65, 0),
        TotalWage3 decimal(65, 0),
        TotalWage4 decimal(65, 0),
        TotalWage5 decimal(65, 0),
        EligibleWages decimal(65, 0),
        EligibleWages2 decimal(65, 0),
        TotalMERCs1 decimal(65, 0),
        TotalMERCs2 decimal(65, 0),
        SubsidyRatePercent1 int,
        SubsidyRatePercent2 int,
        SubsidyRateDateFrom1 date,
        SubsidyRateDateTo1 date,
        TotalAmountReimbursed1 decimal(65, 0),
        ClaimApprovedBy1 varchar(255),
        SubsidyRateDateFrom2 date, 
        SubsidyRateDateTo2 date, 
        TotalAmountReimbursement2 decimal(65, 0),
        ClaimApprovedBy2 varchar(255),
        ClaimVerifiedDate date,
        TotalSubsidyClaimed decimal(65, 0),
        TotalWeeks1 int,
        TotalWeeks2 int,
        WagesReimbursed1 decimal(65, 0),
        WagesReimbursed2 decimal(65, 0),
        MercsReimbursed1 decimal(65, 0),
        MercsReimbursed2 decimal(65, 0),
        claimEmployeeInfo jsonb,
        CONSTRAINT WageSubsidyID FOREIGN KEY (ID) 
        REFERENCES WAGE_SUBSIDY_APPLICATIONS(ID),
        Modified date,
        Created date
    );
    
    `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function down(knex) {
    return knex.raw(`
    DROP TABLE WAGE_SUBSIDY_CLAIM_FORM;
    DROP TABLE WAGE_SUBSIDY_APPLICATIONS;
    `)
};
