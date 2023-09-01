CREATE TABLE IF NOT EXISTS public.applications
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    position_title character varying(255) COLLATE pg_catalog."default",
    status character varying(255) COLLATE pg_catalog."default",
    form_type character varying(255) COLLATE pg_catalog."default",
    catchmentno integer,
    num_positions integer,
    shared_with text[] COLLATE pg_catalog."default",
    form_confirmation_id character varying(255) COLLATE pg_catalog."default",
    form_submission_id character varying(255) COLLATE pg_catalog."default",
    form_submitted_date date,
    created_by character varying(255) COLLATE pg_catalog."default",
    created_by_guid character varying(255) COLLATE pg_catalog."default",
    created_date date,
    updated_by character varying(255) COLLATE pg_catalog."default",
    updated_date date,
    CONSTRAINT applications_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.applications
    OWNER to postgres;



CREATE TABLE IF NOT EXISTS public.claims
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    position_title character varying(255) COLLATE pg_catalog."default",
	status character varying(255) COLLATE pg_catalog."default",
	form_type character varying(255) COLLATE pg_catalog."default",
    catchmentno integer,
    employee_first_name character varying(255) COLLATE pg_catalog."default",
    employee_last_name character varying(255) COLLATE pg_catalog."default",
    associated_application_id character varying(10) COLLATE pg_catalog."default",
	shared_with text[] COLLATE pg_catalog."default",
    form_confirmation_id character varying(255) COLLATE pg_catalog."default",
    form_submission_id character varying(255) COLLATE pg_catalog."default",
    form_submitted_date date,
    created_by character varying(255) COLLATE pg_catalog."default",
    created_by_guid character varying(255) COLLATE pg_catalog."default",
    created_date date,
    updated_by character varying(255) COLLATE pg_catalog."default",
    updated_date date,
    CONSTRAINT claims_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.claims
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.employers
(
    -- 'id': bceid guid
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    bceid_business_guid character varying(255) COLLATE pg_catalog."default",
    bceid_business_name character varying(255) COLLATE pg_catalog."default",
    contact_name character varying(255) COLLATE pg_catalog."default",
    contact_email character varying(255) COLLATE pg_catalog."default",
    phone_number character(12) COLLATE pg_catalog."default",
    fax_number character(12) COLLATE pg_catalog."default",
    cra_business_number character varying(255) COLLATE pg_catalog."default",
    street_address character varying(255) COLLATE pg_catalog."default",
    city character varying(255) COLLATE pg_catalog."default",
    province character varying(255) COLLATE pg_catalog."default",
    postal_code character varying(255) COLLATE pg_catalog."default",
    workplace_street_address character varying(255) COLLATE pg_catalog."default",
    workplace_city character varying(255) COLLATE pg_catalog."default",
    workplace_province character varying(255) COLLATE pg_catalog."default",
    workplace_postal_code character varying(255) COLLATE pg_catalog."default",
    workbc_center character varying(255) COLLATE pg_catalog."default",
    created_by character varying(255) COLLATE pg_catalog."default",
    created_date date,
    updated_by character varying(255) COLLATE pg_catalog."default",
    updated_date date,
    CONSTRAINT employers_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.employers
    OWNER to postgres;
