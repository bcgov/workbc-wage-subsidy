/* Selecting curent items to display to provider. # is the catchment number (1-45) */
SELECT * FROM wage_subsidy_applications WHERE CatchmentNo = #

/* Sorting ORDER BY */
SELECT * FROM wage_subsidy_claim_form 
WHERE CatchmentNo = #
ORDER BY Created DESC

/* Remove completed items */
DELETE FROM wage_subsidy_applications WHERE (ApplicationStatus = 'Completed')