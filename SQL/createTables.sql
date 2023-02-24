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
        CEWSAndOrCRHP VARCHAR(255),
        EmployeeDisplacement BOOLEAN,
        LabourDispute BOOLEAN,
        UnionConcurrence VARCHAR(255),
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
        Hours0 int, 
        Wage0 int, 
        Duties0 text,
        Skills0 text,
        WorkExperience0 text, 
        NumberofPositions1 int,
        SignatoryTitle VARCHAR(255),
        Signatory1 VARCHAR(255),
        OrganizationConsent BOOLEAN,
        history jsonb,
        SF int,
        centreName varchar(255),
        markedForDeletion boolean,
        Modified date,
        Created date
        sharedwith varchar(255)
        );
    
    CREATE TABLE Wage_Subsidy_Claim_Form (
        ID SERIAL NOT NULL PRIMARY KEY,
        Title varchar(255),
        CatchmentNo int, 
        FormType varchar(255),
        ApplicationID varchar(10),
        ApplicationStatus varchar(255),
        PeriodStart1 timestamp,
        PeriodStart2 timestamp,
        IsFinalClaim boolean,
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
        HoursWorked1 int,
        HoursWorked2 int,
        HoursWorked3 int,
        HoursWorked4 int,
        HoursWorked5 int,
        HourlyWage1 int,
        HourlyWage2 int,
        HourlyWage3 int,
        HourlyWage4 int,
        HourlyWage5 int,
        WorkActivitiesAndIssues text,
        TotalWage1 int,
        TotalWage2 int,
        TotalWage3 int,
        TotalWage4 int,
        TotalWage5 int,
        EligibleWages int,
        EligibleWages2 int,
        TotalMERCs1 int,
        TotalMERCs2 int,
        SubsidyRatePercent1 int,
        SubsidyRatePercent2 int,
        SubsidyRateDateFrom1 date,
        SubsidyRateDateTo1 date,
        TotalAmountReimbursed1 int,
        ClaimApprovedBy1 varchar(255),
        SubsidyRateDateFrom2 date, 
        SubsidyRateDateTo2 date, 
        TotalAmountReimbursed2 int,
        ClaimApprovedBy2 varchar(255),
        ClaimVerifiedDate date,
        TotalSubsidyClaimed int,
        TotalWeeks1 int,
        TotalWeeks2 int,
        WagesReimbursed1 int,
        WagesReimbursed2 int,
        MercsReimbursed1 int,
        MercsReimbursed2 int,
        claimEmployeeInfo jsonb,
        originalApplicationID varchar(10),
        history jsonb,
        SF int,
        centreName varchar(255),
        markedForDeletion boolean,
        CONSTRAINT fk_applicationID FOREIGN KEY (ApplicationID) REFERENCES WAGE_SUBSIDY_APPLICATIONS(ApplicationID),
        Modified date,
        Created date
        sharedwith varchar(255)
        files jsonb
        );